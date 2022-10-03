const express = require("express")
const cors = require("cors")
const app = express();
require("dotenv").config();
const db = require("./connection")
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
const collections = require("./models")
const session = require("express-session")
const detect = require('detect-port');
const joi = require ("joi")
const multer = require('multer')
const cookieparse = require("cookie-parser")
const bcrypt = require("bcrypt");
const AWS = require("aws-sdk")
const moment = require('moment');
const fs =require('fs');
const jwt = require("jsonwebtoken");
var textract = require('textract');
var axios = require('axios');
const res = require("express/lib/response"); 
var ip = require("ip");
const { isFuture } = require("date-fns");
var useragent = require('express-useragent');
const userpath = collections.userpathA
const breaks = collections.breaks
const mytime = collections.mytime
const elogs = collections.elogs
const logs= collections.logs
const files = collections.files
const location = collections.location
const profile = collections.profile

db();
app.post("/savebreak", async(req, res)=> {
console.log(req.body)
thedata=req.body
let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
const today=moment(indian_date).format("YYYY-MM-DD")
var myuser=await elogs.findOne({_id:req.body.userid})
console.log(myuser)
breaks.findOne({userid:req.body.userid,itime:req.body.itime},(err,data)=>{
if(!err){
if(data){
res.send("notsaved")
}
else{
console.log("Here")
mybreak = new breaks({
userid:thedata.userid,
itime:thedata.itime,
atime:thedata.atime,
date:thedata.date,
qdate:today,
itime1:thedata.date1,
timespent:thedata.timespent,
location:myuser.location
})
console.log(mybreak)
mybreak.save(err=>{
if(err){
console.log(err)
}
else{
console.log("sent")
res.send({message:"done",status:1})
}
})

}
}
else{
res.send(err)
}
})
})

app.get("/timedetail", async(req, res)=> {
mytime.findOne({},(err,data)=>{
if(data){
res.send({data:data,message:"done"})
}
})
})

            app.post("/edittime",(req, res)=> {
            mytime.findOneAndUpdate({_id:req.body.eid},{time:req.body.time},(err,data)=>{
            if(!err){
            if(data){
            res.send({message:"done",status:1})
            }
            }
            })


 
})

app.post("/getfiles", async(req, res)=> {
console.log("getfiles",req.body)
files.find({userid:req.body.userid}).then(data=>{
if(data){
res.send({data:data,message:"done",status:1})
}
else{
res.send({data:[],message:"no data found",status:0})
}
})
.catch(err=>{
res.send({message:err})
})
})

app.post({"/indexedfile",(req,res)=>{
console.log(req.body)

})
app.post("/savelocation",(req,res)=>{
let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
const today=moment(indian_date).format("DD-MM-YYYY")
location.findOne({userid:req.body.userid,lat:req.body.lat,long:req.body.long,date:today},(err,data)=>{
if(!err){
    if(data){
        res.send({message:"passed",status:1})
    }
    else{
        myloc = new location({
            userid:req.body.userid,
            lat:req.body.lat,
            long:req.body.long,
            date:today,
            mapurl:req.body.mapurl,
            city:req.body.city
        })
        myloc.save(err=>{
            if(!err){
                res.send({message:"location saved",status:1})
            }
        })
    }
}
})
})
app.post("/locationread",(req,res)=>{
let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
const today=moment(indian_date).format("DD-MM-YYYY")
location.find({date:today},(err,data)=>{
if(!err){
if(data){
res.send({status:1,data})
}
}
})
})
app.post("/applog", async(req, res)=> {
console.log(req.body)

let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
const today=moment(indian_date).format("DD-MM-YYYY")
if(JSON.stringify(req.body) != '{}'){

if(req.body.userid!=""||req.body.location!=""||(req.body.fdate!=""&&req.body.tdate!="")){
console.log("#1")
if(req.body.userid!=""){
querry={userid:req.body.userid}
}
else{
querry={}
}
if(req.body.location!=""){
querry1={location:req.body.location}
}
else{
querry1={}
}
if(req.body.fdate!=""){
querry2={date:req.body.fdate}
}
else{
querry2={date:today}
}
logs.find({$and:[querry,querry1,querry2]},(err,data)=>{
if(!err){
if(data){
res.send({status:1,data:data})
}
}
})
}
}

else{
console.log("#2")
logs.find({date:today},(err,data)=>{
if(!err){
if(data){
res.send({status:1,data:data})
}
}
})
}
})

app.post("/apptracker", async(req, res)=> {

let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
const today=moment(indian_date).format("DD-MM-YYYY")
if(JSON.stringify(req.body) != '{}'){
elogs.find({$or:[{_id:req.body.userid},{cm:req.body.userid},{dl:req.body.userid},{scm:req.body.userid}]},(err,data)=>{
if(!err){
if(data){
res.send({status:1,data:data,fdate:req.body.fdate,tdate:req.body.tdate})
}
}
})
}
else{
res.send({status:1,data:[],fdate:today,tdate:today})
}
})
app.post("/breakdetails", async(req, res)=> {
console.log(req.body)
console.log("breakdetails")
if((req.body.fdate==""||req.body.fdate=="Invalid Date")&&(req.body.tdate!=""||req.body.tdate=="Invalid Date")){
breaks.find({},async(err,data)=>{
if(data){
data1=await User.find({})
res.send({data:data,message:"done",status:1,data1:data1})
}
})
}
else{
if((req.body.userid)&&(req.body.userid!=""||req.body.userid!="null")){
querry={userid:req.body.userid}
}
else{

querry={}
}
if(req.body.fdate!=""&&req.body.fdate!="Invalid Date"){
console.log("here")
querry1={date:req.body.fdate}
}
else{
console.log("NOhere")
let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
const today=moment(indian_date).format("DD-MM-YYYY")
querry1={date:{$gte:today,$lte:today}}
}
if(req.body.location!=""){
querry2={location:req.body.location}
}
else{
querry2={}
}
console.log(querry)
console.log(querry1)
console.log(querry2)
breaks.find({$and:[querry,querry1,querry2]},(err,data)=>{
if(!err){
if(data){
res.send({status:1,data:data})
}
}
else{
console.log(err)
}
})
}
})
app.post("/appfiles",async(req, res)=> {
    console.log(req.body)
    

    if((req.body.userid!=""&&req.body.userid!="NULL")){
   
    querry={userid:req.body.userid}
  
    
    if(req.body.fdate==""&&req.body.tdate==""){
    let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
    const today=moment(indian_date).format("DD-MM-YYYY")
    querry1={date:{$gte:today,$lte:today}}
    fdate=today
    tdate=today
    }
    else{
    querry1={date:{$gte:req.body.fdate,$lte:req.body.tdate}}
    fdate=req.body.fdate
    tdate=req.body.tdate
    }
    console.log(querry)
    console.log(querry1)
    condition={$and:[querry,querry1,{time:{$gte:"09:30",$lte:"18:30"}}]}
    data0=await files.find({$and:[querry,querry1,{time:{$gte:"09:30",$lte:"18:30"}}]})
     data1=await files.find({$and:[querry,querry1,{time:{$gte:"09:30",$lte:"10:30"}}]})
     data2=await files.find({$and:[querry,querry1,{time:{$gte:"10:30",$lte:"11:30"}}]})
     data3=await files.find({$and:[querry,querry1,{time:{$gte:"11:30",$lte:"12:30"}}]})
     data4=await files.find({$and:[querry,querry1,{time:{$gte:"12:30",$lte:"13:30"}}]})
     data5=await files.find({$and:[querry,querry1,{time:{$gte:"13:30",$lte:"14:30"}}]})
     data6=await files.find({$and:[querry,querry1,{time:{$gte:"14:30",$lte:"15:30"}}]})
     data7=await files.find({$and:[querry,querry1,{time:{$gte:"15:30",$lte:"16:30"}}]})
     data8=await files.find({$and:[querry,querry1,{time:{$gte:"16:30",$lte:"17:30"}}]})
     data9=await files.find({$and:[querry,querry1,{time:{$gte:"17:30",$lte:"18:30"}}]})
     data10=await files.find({$and:[querry,querry1,{$or:[{time:{$gte:"18:30"}},{time:{$lte:"09:30"}}]}]})
     res.send({data0:data0,data1:data1,data2:data2,data3:data3,data4:data4,data5:data5,data6:data6,data7:data7,data8:data8,data9:data9,data10:data10,status:1,fdate:fdate,tdate:tdate,scm:req.body.scm,cm:req.body.cm})
    }
    else{
    res.send({data:[],data1:[],data2:[],data3:[],data4:[],data5:[],data6:[],data7:[],data8:[],data9:[],data10:[]})
    }
    
     })
app.post("/appview",async(req, res)=> {
console.log(req.body)
if(req.body.userid==""&&req.body.location==""){
elogs.find({},(err,data)=>{
if(data){
res.send({data:data,status:1})
}
else{
res.send({status:0,message:"someerror occured"})
}
})
}
else{
if(req.body.userid&&req.body.userid!=""){
querry={_id:req.body.userid}
}
else{

querry={}
}
if(req.body.location&&req.body.location==""){
querry1={}
}
else{
querry1={location:req.body.location}
}
console.log(querry)
console.log(querry1)
elogs.find({$and:[querry,querry1]},(err,data)=>{
if(!err){
if(data){
res.send({data:data,status:1})
}
}
})
}

})
app.put("/appedit",async(req, res)=> {
console.log("appedit")
console.log(req.body)
elogs.findOneAndUpdate({_id:req.body.eid},req.body,(err,data)=>{
if(data){
res.send({data:data,status:1})
}
else{
res.send({status:0,message:"someerror occured"})
}
})
})

app.put("/appapassedit",async(req, res)=> {
console.log("passedit")
console.log(req.body)
const salt = await bcrypt.genSalt(Number(process.env.SALT));
const hash = await bcrypt.hash(req.body.password,salt);
elogs.findOneAndUpdate({_id:req.body.eid},{password:hash},(err,data)=>{
if(data){
res.send({data:data,status:1})
}
else{
res.send({status:0,message:"someerror occured"})
}
})
}) 
 
 
           app.post("/appuploads",async(req, res)=> {
       
        
           let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
const today=moment(indian_date).format("DD-MM-YYYY")
const time=moment(indian_date).format("HH:mm:ss")


files.findOne({userid:req.body.userid,file:req.body.file},(err,data)=>{
if(!err){
if(!data){
filessave = new files ({
file:req.body.file,
userid:req.body.userid,
date:today
})
filessave.save(err=>{
if(!err){
res.send({message:"success",status:1,data:data});
}
})
}
else{
res.send({message:"already exist",status:0});
}

}
})


})
app.post("/elogins",  async(req, res)=> {
   let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
const today=moment(indian_date).format("DD-MM-YYYY")
const time=moment(indian_date).format("HH:mm:ss")
console.log(req.body);
const {username, password} = req.body 
if(username!=''&&password!=''){
elogs.findOne({username:username}, async (err, user) => {
    if(user){
    const getpass = await bcrypt.compare(
        req.body.password,
        user.password
    );
        if(getpass) {
        
      console.log("matched")
       
            
            user.save();
            user.login=1
            console.log("done");
            
          
            
            
            console.log("manuallogg");
                   res.send({message: "Login Successfull",status:1,data:user})              
               
                }
               
                else{
                res.send({message:"password missmatch",status:0})
                }
            }
            
            else{
               res.send({message:"user not registered",status:0})
            }
            }) 
            }
              else{
res.send({status:0,message:"Please enter username and password!!!"})
}
    })
           app.post("/myuserid",async(req, res)=> {
            let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
const today=moment(indian_date).format("DD-MM-YYYY")
const time=moment(indian_date).format("HH:mm:ss")
        
          elogs.findOne({_id:req.body.userid},(err,data)=>{
          if(data){
          res.send({status:1,data:data})
          }
          else{
          res.send({status:0,data:""})
          }
          })
        })
        app.post("/getpaths",(req, res)=> {
console.log(req.body)
elogs.findOne({_id:req.body.userid},(err,data)=>{
if(data){
console.log(data)
res.send({message:"done",status:1,data:data})
}
else{
if(err)
{
res.send(err)
}
else{
res.send({message:"no data found",status:0})
}
}


})



})
      
        app.post("/appactivity",async(req, res)=> {
      
        let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
         
  myuser=await elogs.findOne({_id:req.body.userid})
  
const today=moment(indian_date).format("DD-MM-YYYY")
    logdata=new logs({
            userid:req.body.userid,
            date:today,
            atime:req.body.atime.toString(),
            btime:req.body.btime.toString()
            })
            logdata.save(err=>{
            res.send({status:1,message:"done"})
            })
         
})
app.post ("/appusers" ,async(req, res)=> {
console.log(req.body)
let indian_date = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
const today=moment(indian_date).format("DD-MM-YYYY HH:mm:ss")
const todaydate=moment(indian_date).format("DD-MM-YYYY")
const mydatee=new Date()
const localm = mydatee.getMonth() 
const year = mydatee.getFullYear() 
const month = localm+1
const fmonth = "0"+month
const salt = await bcrypt.genSalt(Number(process.env.SALT));
const hash = await bcrypt.hash(req.body.password, salt);
req.body.password=hash
req.body.path=""
req.body.ip=""
myappuser= new elogs(req.body)
myappuser.save(err=>{
if(err){
res.send({message:err,status:0})
}
else{
res.send({message:"done",status:1})
}
})

})
app.post ("/appdata" ,async(req, res)=> {

data=await elogs.find({})
data1=await elogs.find({role:"scm"})
data2=await elogs.find({role:"cm"})
data3=await elogs.find({role:"dl"})

res.send({data:data,status:1,data1:data1,data2:data2,data3:data3})
})
app.post("/savepaths",(req, res)=> {
console.log("savepath")
console.log(req.body);
mypaths=req.body.path.replace(/[^a-zA-Z0-9:-_ ]/g, '//');
console.log(mypaths)

elogs.findOne({_id:req.body.userid},(err,data)=>{
if(data){
data.path=mypaths
data.save(err=>{
if(!err){
res.send({message:"done",status:1,data:data})
}
})
}
else{
res.send({status:0,message:"usernotfound"})
}
})



})
    
    app.listen(8000,() => {
    console.log("Started at port 8000")
})