import { useContext, useState, useEffect } from "react";
import { userContextObj } from "../contexts/AuthorContext";
import { useNavigate } from "react-router-dom";
import { BsArrowRightCircle } from "react-icons/bs";
import { FcClock } from "react-icons/fc";
import { useAuth } from "@clerk/clerk-react";

function AllArticles() {
  const { currentUser } = useContext(userContextObj);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [articles, setArticles] = useState([]);
  const [err, setErr] = useState("");

  const gotoArticleView = (articleObj) => {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  };

  const getAllArticlesOfAllAuthors = async () => {
    try {
      const token = await getToken();

      const res = await fetch("http://localhost:4000/user-api/articles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data = await res.json();

      if (data.message === "articles") {
        setArticles(data.payload);
        setErr("");
      } else {
        setErr(data.message || "No articles found");
      }
    } catch (error) {
      console.error("Fetch articles error:", error);
      setErr("Unable to load articles");
    }
  };

  useEffect(() => {
    // prevent API call before user is ready (refresh-safe)
    if (!currentUser?.email) return;

    getAllArticlesOfAllAuthors();
  }, [currentUser?.email, getToken]);

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
      {err && <p className="text-danger">{err}</p>}

      {!err && articles.length === 0 && (
        <p className="text-danger">No articles yet</p>
      )}

      {!err &&
        articles.map((article) => (
          <div className="col" key={article.articleId}>
            <div className="card h-100">
              <div className="card-body">
                {/* Author details */}
                <div className="author-details text-end">
                  <img
                    src={article.authorData?.profileImageUrl}
                    width="40"
                    className="rounded-circle"
                    alt="author"
                  />
                  <p>
                    <small className="text-secondary">
                      {article.authorData?.name}
                    </small>
                  </p>
                </div>

                <h5 className="card-title">{article.title}</h5>
                <p className="card-text">
                  {article.content.substring(0, 80)}...
                </p>

                <button
                  className="custom-btn btn-4"
                  onClick={() => gotoArticleView(article)}
                >
                  <span>
                    Read More <BsArrowRightCircle />
                  </span>
                </button>
              </div>

              <div className="card-footer">
                <small className="text-body-secondary">
                  <FcClock className="fs-4 me-2" />
                  Last updated on {article.dateOfModification}
                </small>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default AllArticles;