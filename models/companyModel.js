import mongoose, { mongo } from "mongoose";

const companySchema = mongoose.Schema({

     name : {
        type :String,
        required :true,
        unique :true
     },
     description :{
        type :String,
     },
     website : {
        type :String,
     },
      location :{
        type :String,
     },
     logo :{
        type : String    //URL OF COMPANY LOGO
     },
     userId :{
       type : mongoose.Schema.Types.ObjectId,
       ref :'User',
       require :true
     }
} , {timestamps :true});

export const Company = mongoose.model('Company' ,companySchema);