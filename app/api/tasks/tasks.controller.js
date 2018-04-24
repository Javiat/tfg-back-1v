'use strict'

var mongoosePaginate=require('mongoose-pagination');
var path=require('path');
var fs=require('fs');
var User=require('../users/users.model');
var Task=require('./tasks.model');
var moment=require('moment');

function saveTask(req,res){
    var task=new Task();
    var params=req.body;
    var id=params.user;
    var fecha_inicio=moment(params.start,moment.ISO_8601);
    var fecha_fin=moment(params.end,moment.ISO_8601);
    task.title=params.title;
    task.description=params.description;
    task.start=fecha_inicio
    task.end=fecha_fin;
    var totalHours = (fecha_fin.diff(fecha_inicio, 'hours'));
    var totalMinutes = fecha_fin.diff(fecha_inicio, 'minutes');
    var clearMinutes = totalMinutes % 60;
    console.log(totalHours + " hours and " + clearMinutes + " minutes");
    task.duration=totalHours+":"+clearMinutes;
    task.type=params.type;
    task.user=params.user;
    User.findById(id,(err,user)=>{
        if(err){
            res.status(500).send({message:'No existe un usuario con ese id al que asociar la tarea'});
        }else{
            if(!user){
                res.status(500).send({message:'No existe el usuario'});
            }else{
                if(task.fecha_inicio=="Invalid date" || task.fecha_fin=="Invalid date"){
                    res.status(500).send({message:'Introduce una fecha valida'});
                }else{
                    task.save((err,taskStored)=>{
                        if(err){
                            res.status(500).send({message:'Error al crear la tarea'});
                        }else{
                            if(!taskStored){
                                res.status(404).send({message:'No se ha podido crear la tarea'});
                            }else{
                                res.status(200).send({task:taskStored});
                            }
                        }
                    });
                }
                
            }
           
        }
      
    });
}

function getTask(req,res){
    var taskId=req.params.id;
    Task.findById(taskId).populate('user').exec((err,task)=>{
        if(err){
            res.status(500).send({message:'Error en la peticion'});
        }else{
            if(!task){
                res.status(404).send({message:'No existe la tarea'});
            }else{
                res.status(200).send({task});
            }
        }
    });
}
function getTasks(req,res){
    var userId=req.params.user;
    var find=Task.find({user:userId}).sort('type');
    find.populate('user').exec((err,tasks)=>{
        if(err){
            res.status(500).send({message:'Error al hacer la consulta'});
        }else{
            if(!tasks){
                res.status(404).send({message:'No existen tareas para este usuario'});
            }else{
                res.status(200).send({tasks});
            }
        }
    });
}
function updateTask(req,res){
    var taskId=req.params.id;
    var update=req.body;
    var fecha_inicio=moment(update.start,moment.ISO_8601);
    var fecha_fin=moment(update.end,moment.ISO_8601);
    update.start=fecha_inicio
    update.end=fecha_fin;
    var totalHours = fecha_fin.diff(fecha_inicio, 'hours');
    var totalMinutes = fecha_fin.diff(fecha_inicio, 'minutes');
    var clearMinutes = totalMinutes % 60;
    console.log(totalHours + " hours and " + clearMinutes + " minutes");
    update.duration=totalHours+":"+clearMinutes;
    console.log(update);
    Task.findById(taskId,(err,task)=>{
             if(task.type=="solida"){
                res.status(500).send({message:'Una tarea solida no puede ser actualizada'});
             }else {
               
                Task.findByIdAndUpdate(task.id,update,{new:true},(err,taskUpdated)=>{
                    
                    if(err){
                        res.status(500).send({message:'Error en el servidor'});
                    }else{
                        if(!taskUpdated){
                            res.status(404).send({message:'No se ha actualizado la tarea'});
                        }else{
                            console.log(taskUpdated);
                            res.status(200).send({task:taskUpdated});
                        }
                    }
                });
            }  
    });
    
}
function updateEvent(req,res){
    var taskId=req.params.id;
    var update=req.body;
    var fecha_inicio=moment(update.start,moment.ISO_8601);
    var fecha_fin=moment(update.end,moment.ISO_8601);
    update.start=fecha_inicio
    update.end=fecha_fin;
    console.log(update);
    // var totalHours = fecha_fin.diff(fecha_inicio, 'hours');
    // var totalMinutes = fecha_fin.diff(fecha_inicio, 'minutes');
    // var clearMinutes = totalMinutes % 60;
    // console.log(totalHours + " hours and " + clearMinutes + " minutes");
    // update.duration=totalHours+":"+clearMinutes;
    Task.findByIdAndUpdate(taskId,update,{new:true},(err,taskUpdated)=>{  
        if(err){
            res.status(500).send({message:'Error en el servidor'});
       }else{
            if(!taskUpdated){
                res.status(404).send({message:'No se ha actualizado la tarea'});
            }else{
                console.log(taskUpdated);
                res.status(200).send({task:taskUpdated});
            }
         }
    });
            
}
function deleteTask(req,res){
    var task_id=req.params.id;
    Task.findByIdAndRemove(task_id,function(err,Task){
        if(err){
            res.status(404).send({message:'Error'});
        }else{
            if(!Task){   
                res.status(404).send({message:'No existe la tarea'});
            }else{
                res.status(200).send({Task:Task});
            }
        }
    });
}

module.exports={
    saveTask,
    getTask,
    getTasks,
    updateTask,
    deleteTask,
    updateEvent
};