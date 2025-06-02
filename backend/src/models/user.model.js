import mongoose from "mongoose";

const UserSchema  =  new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullname:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,

    },
    profilePic:{
        type:String,
        default:"",
    }
},
{ timestamps:true}
);

const users = mongoose.model("users",UserSchema);

export default users;