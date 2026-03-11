import express from "express";
import { Article } from "../models/ArticleModel.js";
import { User } from "../models/UserTypeModel.js";
import { getAuth } from "@clerk/express";
export const authorRouter = express.Router();

//API routes

//Create new Article
authorRouter.post("/article", async (req, res) => {
  //Auth
  const { userId } = getAuth(req);
  if (!userId) {
    return res.json({
      status: 401,
      message: "Authentication required",
    });
  }

  //fetch author from db
  let author = await User.findOne({ clerkUserId: userId });

  //check author
  if (!author) {
    return res.status(404).json({
      error: "AUTHOR_NOT_FOUND",
      message: "Author profile not found",
    });
  }

  //check role
  if (author.role !== "AUTHOR") {
    return res.status(403).json({
      error: "FORBIDDEN",
      message: "Only authors can create articles",
    });
  }

  //Create atricle document
  const newArticle = new Article({
    author: author._id,
    title: req.body.title,
    category: req.body.category,
    content: req.body.content,
  });
  //save document
  await newArticle.save();

  //send res
  res.status(201).json({
    message: "Article created",
    payload: newArticle,
  });
});

//Read all articles
authorRouter.get("/articles", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: "Authentication reqiored" });
  }
  let user = await User.findOne({ clerkUserId: userId });

  let role = user.role;
  if (role !== "AUTHOR") {
    return res.status(401).json({
      error: "Forbidden",
      message: "Only authors can update article",
    });
  }

  //read atricles of author
  let articles = await Article.find({ author: user._id });

  //res
  res.status(200).json({ message: "author articles", payload: articles });
});

//delete artcile(softwa delete)
authorRouter.put("/articles/:articleId", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: "Authentication reqiored" });
  }
  let user = await User.findOne({ clerkUserId: userId });

  console.log("user:", user);
  let role = user.role;
  if (role !== "AUTHOR") {
    return res.status(401).json({
      error: "Forbidden",
      message: "Only authors can update article",
    });
  }

  let { articleId } = req.params;
  let article = await Article.findOne({ _id: articleId });

  article.isArticleActive = false;
  await article.save();

  res.status(200).json({ message: "article deleted" });
});

//update atricle by id
authorRouter.put("/articles/:articleId/edit", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: "Authentication reqiored" });
  }
  let user = await User.findOne({ clerkUserId: userId });

  console.log("user:", user);
  let role = user.role;
  if (role !== "AUTHOR") {
    return res.status(401).json({
      error: "Forbidden",
      message: "Only authors can update article",
    });
  }

  let { articleId } = req.params;
  let article = await Article.findOne({ _id: articleId });

  let { title, content } = req.body;
  let updatedArticle = await Article.findByIdAndUpdate(
    articleId,
    {
      $set: {
        ...(title && { title }),
        ...(content && { content }),
      },
    },
    { new: true },
  );

  res.status(200).json({ message: "article updated", payload: updatedArticle });
});
