'use strict'

var express=require('express');
var TaskController=require('./tasks.controller');
var api=express.Router();

var multipart=require('connect-multiparty');
//Operaciones post
api.post('/save-task',TaskController.saveTask);

//Operaciones get
api.get('/get-task/:id',TaskController.getTask);
api.get('/get-tasks/:user',TaskController.getTasks);

//Operaciones put
api.put('/update-task/:id',TaskController.updateTask);
api.put('/update-event/:id',TaskController.updateEvent);

//Operaciones delete
api.delete('/delete-task/:id',TaskController.deleteTask);

module.exports=api;