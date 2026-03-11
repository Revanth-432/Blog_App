import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { userContextObj } from "../contexts/AuthorContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

function PostArticle() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { currentUser } = useContext(userContextObj);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [err, setErr] = useState("");

  const postNewArticle = async (formData) => {
    try {
      setErr("");

      const token = await getToken();

      const res = await axios.post(
        "http://localhost:4000/author-api/article",
        {
          title: formData.title,
          category: formData.category,
          content: formData.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        navigate("/author-dashboard"); // or /author/articles
      }
    } catch (error) {
      console.error("Post article error:", error);
      setErr(
        error.response?.data?.message || "Failed to publish article"
      );
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-8 col-md-8 col-sm-10">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3" style={{ color: "goldenrod" }}>
                Write an Article
              </h2>
            </div>

            <div className="card-body bg-light">
              {err && <p className="text-danger fs-5">{err}</p>}

              <form onSubmit={handleSubmit(postNewArticle)}>
                {/* Title */}
                <div className="mb-4">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    {...register("title", { required: true })}
                  />
                  {errors.title && (
                    <p className="text-danger">Title is required</p>
                  )}
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    defaultValue=""
                    {...register("category", { required: true })}
                  >
                    <option value="" disabled>
                      --categories--
                    </option>
                    <option value="programming">Programming</option>
                    <option value="AI&ML">AI & ML</option>
                    <option value="database">Database</option>
                  </select>
                  {errors.category && (
                    <p className="text-danger">Please select a category</p>
                  )}
                </div>

                {/* Content */}
                <div className="mb-4">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    rows="10"
                    {...register("content", { required: true })}
                  />
                  {errors.content && (
                    <p className="text-danger">Content is required</p>
                  )}
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="add-article-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostArticle;