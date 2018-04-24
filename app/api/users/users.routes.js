'use strict'

var express=require('express');
var UserController=require('./users.controller');
var md_auth=require('./authenticated');
var api=express.Router();

var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./app/res/images'});

api.post('/save-user',UserController.saveUser);
api.post('/login-user',UserController.loginUser);
api.post('/image-user/:id',md_upload,UserController.uploadImage);

api.delete('/delete-user/:id',UserController.deleteUser);

api.put('/update-user/:id',UserController.updateUser);
api.get('/get-image-user/:imageFile',UserController.getImageFile);
module.exports=api;