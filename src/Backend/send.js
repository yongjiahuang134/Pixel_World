//file for mongodb to store the username and password information
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const collection = require('./mongo')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/", cors(), (req,res)=>{
})

app.post("/login", async(req,res)=>{
    const{username, pass}=req.body;

    try{
        const user=await collection.findOne({username:username})
        
        
        //if username is already exist
        if(user){
            if (user.pass === pass){
                res.json("Success");
            }
            else {
                res.json("Password not match");
            }
        }
        else{
            res.json("not exist");
        }
    }
    catch(e){
        res.json("not exists");
    }
})

app.post("/signup", async(req,res)=>{
    const{username, pass}=req.body;

    const data = {
        username:username,
        pass:pass
    }

    try{
        const user=await collection.findOne({username:username})
        
        //if username is already exist
        if(user){
            res.json("exist")
        }
        else{
            res.json("not exist");
            //insert data into mongodb
            await collection.insertMany([data]);
        }
    }
    catch(e){
        res.json("not exist")
    }
})

app.listen(8001, ()=>{
    console.log("port connected");
})