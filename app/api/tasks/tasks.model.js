'use strict'

var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var moment=require('moment');
var TaskSchema=Schema({
    title: {
        type: String,
		required: true
    },
    description:String,
    start:Date,
    end:Date,
    duration: String,
    type:{
       type: String,
       enum:['solida','liquida']
    },
    user:{type:Schema.ObjectId,ref:'User'}
});

module.exports=mongoose.model('Task',TaskSchema);