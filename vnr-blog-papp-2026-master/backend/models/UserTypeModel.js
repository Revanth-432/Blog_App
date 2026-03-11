import mongoose from "mongoose";

//define user achema
const userSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
   
  },
  email: {
    type: String,
    required: true,
  },
  profileImageUrl: {
    type: String,
  },
  role: {
    type: String,
    enum: ["USER", "AUTHOR"],
    required: true,
  },
  isActive:{
    type:Boolean,
    default:true
  }
},{
    timestamps:true,
    strict:"throw"
});


//create UserModel
export const User=mongoose.model("User",userSchema)