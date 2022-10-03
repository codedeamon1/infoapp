
const mongoose = require("mongoose")

const appSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    dl:String,
    cm:String,
    role:String,
    scm:String,
    path:String,
    location:String,
    ip:String
})
const uploadschema = new mongoose.Schema({
    userid: String,
    date:String,
    file: String,
    time:String
   
})  
const timeschema = new mongoose.Schema({
    userid: String,   
    date:String,
    atime:String,
    itime:String,
    itime1:String,
    timespent:String,
    qdate:String,
    location:String
   
}) 

const detailschema = new mongoose.Schema({
    
    time:Number
   
}) 
const apploginschema = new mongoose.Schema({
    userid:String,
    date:String,
    atime:String,
    btime:String,
    errss:String
   
}) 
const locschema = new mongoose.Schema({
    userid:String,
    location:String,
    lat:String,
    long:String,
    date:String,
    mapurl:String,
    city:String

})

const profileschema = new mongoose.Schema({
    filename: String,
    designation:Array,
    role:Array,
    secondary_skills:Array,
    primary_skills:Array,
    industry:String,
    viewed:Number
   
}) 




const breaks =  new mongoose.model("userbreak", timeschema)
const mytime =  new mongoose.model("timedetails", detailschema)
const elogs =  new mongoose.model("elogs", appSchema)
const files =  new mongoose.model("upload", uploadschema)
const logs =  new mongoose.model("logs", apploginschema)
const location =new mongoose.model("locations", locschema)
const profile =new mongoose.model("profile", profileschema)

module.exports = { files,breaks,mytime,elogs,logs,location,profile}