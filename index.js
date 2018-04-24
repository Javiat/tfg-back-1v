'use strict'
var mongoose= require('mongoose');
var app=require('./app/app');
var port=process.env.port || 3977;
mongoose.connect('mongodb://localhost:27017/tfg-back',(err,res)=>{
    if(err){
        throw err;
    }else{
        console.log('La base de datos esta corriendo ');
        app.listen(port,function(){
            console.log('Servidor escuchando');
        });
    }
});


