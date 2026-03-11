import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { userContextObj } from "../contexts/AuthorContext";

import { FcClock, FcCalendar, FcComments, FcPortraitMode } from "react-icons/fc";
import { BiCommentAdd } from "react-icons/bi";

function ArticleById() {
  const { state } = useLocation();
  const { getToken } = useAuth();
  const { currentUser } = useContext(userContextObj);

  const [currentArticle, setCurrentArticle] = useState(state);
  const [commentStatus, setCommentStatus] = useState("");

  const { register, handleSubmit, reset } = useForm();

  /* ---------------- ADD COMMENT ---------------- */
  const addCommentByUser = async (data) => {
    if (!data.comment?.trim()) return;

    try {
      const token = await getToken();

      const res = await axios.put(
        `http://localhost:4000/user-api/comment/${currentArticle._id}`,
        { comment: data.comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message === "comment added") {
        // 🔥 Update article with latest comments from backend
        setCurrentArticle(res.data.payload);
        setCommentStatus("Comment added successfully");
        reset();
      }
    } catch (err) {
      console.error("Add comment error:", err);
      setCommentStatus("Failed to add comment");
    }
  };

  return (
    <div>
      <h1>{currentArticle.title}</h1>

      <small className="text-secondary me-3">
        <FcCalendar /> Created on: {currentArticle.createdAt}
      </small>
      <small className="text-secondary">
        <FcClock /> Modified on: {currentArticle.updatedAt}
      </small>

      <p className="lead mt-4" style={{ whiteSpace: "pre-line" }}>
        {currentArticle.content}
      </p>

      {/* COMMENTS */}
      <div className="mt-5">
        <h4>Comments</h4>

        {currentArticle.comments?.length === 0 ? (
          <p>No comments yet...</p>
        ) : (
          currentArticle.comments.map((c, i) => (
            <div key={i} className="p-3 border rounded mb-2">
              <p className="mb-1">
                <FcPortraitMode />{" "}
                <strong>{c.user?.firstName || "User"}</strong>
              </p>
              <p className="mb-0">
                <FcComments /> {c.comment}
              </p>
            </div>
          ))
        )}

        {commentStatus && (
          <p className="text-success mt-2">{commentStatus}</p>
        )}

        {/* ADD COMMENT (ONLY USER) */}
        {currentUser.role === "USER" && (
          <form onSubmit={handleSubmit(addCommentByUser)} className="mt-3">
            <input
              {...register("comment", { required: true })}
              className="form-control mb-3"
              placeholder="Write comment..."
            />
            <button className="btn btn-success">
              Add Comment <BiCommentAdd />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ArticleById;