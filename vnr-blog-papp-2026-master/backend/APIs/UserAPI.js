import express from "express";
import { User } from "../models/UserTypeModel.js";
import {Article} from '../models/ArticleModel.js'
import { getAuth,clerkClient } from "@clerk/express";
export const userRouter = express.Router();

//Routes

// Read User
userRouter.get("/me", async (req, res) => {
  //get user's userId
  const { userId } = getAuth(req);
  console.log("userId", userId);
  // return 401 if not authenticated
  if (!userId) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  //if userId existed,read user from DB
  let user = await User.findOne({ clerkUserId: userId });
  console.log("user :", user);
  //if user not found
  if (user === null) {
    res.json({ firstLogin: true });
  } else {
    res.status(200).json({ firstLogin: false, payload: user });
  }
});

//Create User in DB during first login
userRouter.post("/create-user", async (req, res, next) => {
  // 1️⃣ Authentication (API-style)
  const { userId } = getAuth(req);

  if (!userId) {
    return next({
      status: 401,
      message: "Authentication required",
    });
  }

  // 2️⃣ Validate request body
  const { role } = req.body;

  if (!role || !["USER", "AUTHOR"].includes(role)) {
    return next({
      status: 400,
      message: "Invalid role value",
    });
  }

  // 3️⃣ Prevent re-creation (idempotency guard)
  const existingUser = await User.findOne({ clerkUserId: userId });
  if (existingUser) {
    return next({
      status: 400,
      message: "Profile already exists",
    });
  }

  // 4️⃣ Fetch trusted profile data from Clerk
  const clerkUser = await clerkClient.users.getUser(userId);

  // 5️⃣ Create user (schema-aligned, strict-safe)
  const user = await User.create({
    clerkUserId: userId,
    role,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    email: clerkUser.primaryEmailAddress.emailAddress,
    profileImageUrl: clerkUser.imageUrl,
    isActive: true,
  });

  // 6️⃣ Success response
  res.status(201).json({
    message: "Profile created successfully",
    payload:user,
  });
});


//Read all articles
userRouter.get('/articles',async(req,res)=>{

  // 1️⃣ Authentication (API-style)
  const { userId } = getAuth(req);

  if (!userId) {
    return res.json({
      status: 401,
      message: "Authentication required",
    });
  }

  //read all articles
  const articles=await Article.find({isArticleActive:true}).populate("author","firstName lastName")
  //send res
  res.status(200).json({
    message:"articles",
    payload:articles
  })
})

//Add comment to an article
userRouter.put("/comment/:articleId", async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const { articleId } = req.params;

  if (!req.body.comment || !req.body.comment.trim()) {
    return res.status(400).json({ message: "Comment is required" });
  }

  const user = await User.findOne({ clerkUserId: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const commentObj = {
    user: user._id,
    comment: req.body.comment,
  };

  const article = await Article.findByIdAndUpdate(
    articleId,
    { $push: { comments: commentObj } }, // ✅ FIXED
    { new: true }
  ).populate("comments.user", "firstName");

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  res.status(200).json({
    message: "comment added",
    payload: article,
  });
});