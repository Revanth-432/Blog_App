import {  useAuth } from "@clerk/clerk-react";

import { Link, Outlet } from "react-router-dom";

function UserDashboard() {

  
  return (
    <div>
     
      <ul className="d-flex justify-content-around list-unstyled fs-1">
        <li className="nav-item">
          <Link to ='all-articles' className="nav-link">Articles</Link>
        </li>
       
      </ul>
      <div className="mt-5">
        <Outlet />
      </div>
    </div>
  );
}

export default UserDashboard