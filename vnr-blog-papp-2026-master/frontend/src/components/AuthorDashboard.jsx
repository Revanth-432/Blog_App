import React from "react";
import {useAuth } from "@clerk/clerk-react";

import { NavLink, Outlet } from "react-router-dom";

function AuthorDashboard() {
  //get token after signup
  const { getToken } = useAuth();

  return (
    <div className="author-profile">
      <ul className="d-flex justify-content-around list-unstyled fs-3">
        <li className="nav-item">
          <NavLink to="articles" className="nav-link">
            Articles
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="article" className="nav-link">
            Add new Article
          </NavLink>
        </li>
      </ul>
      <div className="mt-5">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthorDashboard;
