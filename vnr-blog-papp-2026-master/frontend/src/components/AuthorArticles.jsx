import { useContext, useState, useEffect } from "react";
import { userContextObj } from "../contexts/AuthorContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsArrowRightCircle } from "react-icons/bs";
import { FcClock } from "react-icons/fc";
import { useAuth } from "@clerk/clerk-react";

function AuthorArticles() {
  const { currentUser } = useContext(userContextObj);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [articles, setArticles] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const gotoArticleView = (articleObj) => {
    navigate(`../${articleObj.articleId}`, { state: articleObj });
  };

  const getAuthorArticles = async () => {
    try {
      setLoading(true);
      setErr("");

      const token = await getToken();

      const res = await axios.get(
        "http://localhost:4000/author-api/articles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message === "author articles") {
        setArticles(res.data.payload);
      } else {
        setErr(res.data.message || "No articles found");
      }
    } catch (error) {
      console.error("Author articles error:", error);
      setErr("Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // refresh-safe guard
    if (!currentUser?.email) return;

    getAuthorArticles();
  }, [currentUser?.email, getToken]);

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 mt-5">
      {err && <p className="text-danger">{err}</p>}

      {loading && (
        <div className="d-flex justify-content-center">
          <span className="spinner-border text-warning"></span>
        </div>
      )}

      {!loading && !err && articles.length === 0 && (
        <p className="text-danger">No articles yet</p>
      )}

      {!loading &&
        !err &&
        articles.map((article) => (
          <div className="col" key={article.articleId}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title heading">{article.title}</h5>
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

export default AuthorArticles;