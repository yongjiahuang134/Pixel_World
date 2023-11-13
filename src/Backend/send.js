//file for mongodb to store the username and password information
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const collection = require('./mongo')
const app = express();
const CryptoJS = require('crypto-js');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/", cors(), (req,res)=>{
})

app.post("/login", async(req,res)=>{
    const{username, pass}=req.body;

    try{
        const user=await collection.findOne({username:username})
        //password decryption
        const key = '12345';
        const decrypted = CryptoJS.AES.decrypt(user.pass, key).toString(CryptoJS.enc.Utf8);
        
        //if username is already exist
        if(user){
            if (decrypted === pass){
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
    //password encryption
    const key = '12345';
    const encrypted = CryptoJS.AES.encrypt(pass, key).toString();
    const data = {
        username:username,
        pass:encrypted
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