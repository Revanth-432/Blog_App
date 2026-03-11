import mongoose from 'mongoose'


//user comment schema
const userCommentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},{
    timestamps:true,
    strict:"throw"
})

//Create article SChema
const articleSchema=new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    comments:[userCommentSchema],
    isArticleActive:{
        type:Boolean,
        default:true
    }
})

//Create model
export const Article=mongoose.model("Article",articleSchema)