'use strict'
var User=require('./users.model');
var bcrypt=require('bcrypt-nodejs');
var jwt=require('./jwt');
var fs=require('fs');
var path=require('path');

function saveUser(req,res){
    var user=new User();
    var params=req.body;
    user.name=params.name;
    user.surname=params.surname;
    user.email=params.email;
    user.password=params.password;
    user.image=params.image;
    if(params.email && params.password){
        User.findOne({email: params.email.toLowerCase()},function(err,User){
            if(err){
                res.status(404).send({message:'Error'});
            }else{
                if(User){
                    res.status(404).send({message:'El email ya existe'});
                }else{
                        bcrypt.hash(params.password,null,null,function(err,hash){
                        user.password=hash;
                        if(user.name !=null && user.surname!=null && user.email!=null){
                            //Guardar el usuario
                            user.save((err,userStored)=>{
                                if(err){
                                    res.status(500).send({message:'Error al guardar el usuario'});
                                }else{
                                    if(!userStored){
                                        res.status(404).send({message:'No se ha registrado el usuario'});
                                    }else{
                                        res.status(200).send({ user:userStored });
                                    }
                                }
                            });
                        }else{
                            res.status(200).send({message:'Rellena todos los campos'});
                        }
                    });
                }
               
            }
        });
        
      
    }else{
        res.status(403).send('Los campos email y contraseña son obligatorios');
    }
}
function loginUser(req,res){   
    var params=req.body;
    var email=params.email;
    var password=params.password;
    
    User.findOne({email:email.toLowerCase()},(err,user)=>{
       if(err){
        res.status(404).send({message:'Error al hacer el login'});
       }else{
           if(!user){
                res.status(500).send({message:'No existe el usuario'});
           }else{
                bcrypt.compare(password,user.password,function(err,check){
                    if(check){
                        if(params.gethash){
                            //devolver un token con jwt
                            res.status(200).send({
                                token:jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message:'No se ha podido identificar'});
                    }
                });
           }
       }
    });
}
function updateUser(req,res){
    var userId=req.params.id;
    //var password=req.body.password;
    //bcrypt.hash(password,null,null,function(err,hash){
    //req.body.password=hash;
    var update=req.body;
            User.findByIdAndUpdate(userId,update,{new:true},(err,userUpdated)=>{
            if(err){
                res.status(500).send({mesage:'Error al actualizar el usuario'});
            }else{
                if(!userUpdated){
                    res.status(404).send({mesage:'No se ha podido actualizar el usuario'});
                }else{
                    res.status(200).send({user:userUpdated});
                }
            }
            
        });
    //});
}
function deleteUser(req,res){
    var user_id=req.params.id;
    User.findByIdAndRemove(user_id,function(err,User){
        if(err){
            res.status(404).send({message:'Error'});
        }else{
            if(User){
                res.status(200).send({User:User});
            }else{
                res.status(404).send({message:'No existe el usuario'});
            }
        }
    });
}

function uploadImage(req,res){
    var userId=req.params.id;
    var file_name="No subido...";
    console.log(req.files.image);
    if(req.files.image){
        var file_path=req.files.image.path;
        var file_split=file_path.split('\\');
        var file_name=file_split[3];
        var ext_split=file_name.split('\.');
        var file_ext=ext_split[1];
        if(file_ext=='png' || file_ext=='jpg' || file_ext=='gif'){
            User.findByIdAndUpdate(userId,{image:file_name},(err,userUpdated)=>{
                if(!userUpdated){
                    res.status(404).send({message:'No se ha podido actualizar el usuario'});
                }else{
                    res.status(200).send({image:file_name,user:userUpdated});
                }
    
            });
        }else{
            res.status(200).send({message:'Extension del archivo no valida'});
        }
    }else{
        res.status(200).send({message:'No has subido ninguna imagen'});
    }
}
function getImageFile(req,res){
    var imageFile=req.params.imageFile;
    var path_file='./app/res/images/'+imageFile;
    fs.exists(path_file,function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(200).send({message:'No existe la imagen'});
        }
    });
}
module.exports={
    saveUser,
    deleteUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};