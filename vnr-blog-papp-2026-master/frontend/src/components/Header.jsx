import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userContextObj } from "../contexts/AuthorContext";

function Header() {
  const { isSignedIn, getToken } = useAuth();
  const { isLoaded } = useUser();
  const navigate = useNavigate();

  const { setCurrentUser } = useContext(userContextObj);
  const [checked, setChecked] = useState(false); // prevents reruns

  useEffect(() => {
    if (!isSignedIn || !isLoaded || checked) return;

    const checkUserAndNavigate = async () => {
      try {
        const token = await getToken();

        const res = await fetch("http://localhost:4000/user-api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await res.json();

        // First-time login
        if (data.firstLogin === true) {
          navigate("/role-selection");
          return;
        }

        const role = data.payload.role;

        setCurrentUser(data.payload);

        if (role === "USER") {
          navigate("/user-dashboard");
        } else {
          navigate("/author-dashboard");
        }

        setChecked(true);
      } catch (err) {
        console.error("Header auth check error:", err);
      }
    };

    checkUserAndNavigate();
  }, [isSignedIn, isLoaded, getToken, navigate, setCurrentUser, checked]);

  return (
    <nav className="navbar navbar-light bg-light px-4">
      {/* Left: Logo */}
      <a className="navbar-brand fw-bold" href="/">
        BlogApp
      </a>

      {/* Right: Auth buttons */}
      <div className="ms-auto">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="btn btn-primary">Sign In</button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

export default Header;