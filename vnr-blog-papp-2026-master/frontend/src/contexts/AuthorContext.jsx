import { createContext, useState, useEffect } from "react";

export const userContextObj = createContext(null);

const initialUser = {
  firstName: "",
  lastName: "",
  email: "",
  profileImageUrl: "",
  role: "",
};

function AuthorContext({ children }) {
  const [currentUser, setCurrentUser] = useState(initialUser);

  // 🔹 Load user from localStorage (on refresh)
  useEffect(() => {
    const storedData = localStorage.getItem("currentUser");
    if (storedData) {
      setCurrentUser(JSON.parse(storedData));
    }
  }, []);

  // 🔹 Save user to localStorage (on change)
  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return <userContextObj.Provider value={{ currentUser, setCurrentUser }}>{children}</userContextObj.Provider>;
}

export default AuthorContext;
