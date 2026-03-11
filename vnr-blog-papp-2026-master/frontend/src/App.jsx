import { createBrowserRouter, RouterProvider,Navigate } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import RoleSelection from "./components/RoleSelection";
import UserDashboard from "./components/UserDashboard";
import AuthorDashboard from "./components/AuthorDashboard";
import Home from "./components/Home";
import AllArticles from "./components/AllArticles";
import ArticleById from "./components/ArticleById";
import PostArticle from "./components/PostArticle";
import AuthorArticles from "./components/AuthorArticles";

function App() {
  const browserRouterObj = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "role-selection",
          element: <RoleSelection />,
        },

        {
          path: "user-dashboard",
          element: <UserDashboard />,
          children: [
            {
              path: "all-articles",
              element: <AllArticles />,
            },
            {
              path: ":artilceId",
              element: <ArticleById />,
            },
            {
              path: "",
              element: <Navigate to="all-articles" />,
            },
          ],
        },
        {
          path: "author-dashboard",
          element: <AuthorDashboard />,
          children: [
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: ":artilceId",
              element: <ArticleById />,
            },
            {
              path: "article",
              element: <PostArticle />,
            },
            {
              path: "",
              element: <Navigate to="articles" />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={browserRouterObj} />;
}

export default App;
