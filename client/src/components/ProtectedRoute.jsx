import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(undefined); // undefined means loading

  useEffect(() => {
    fetch("http://localhost:3000/check-login", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "User Logged in false") {
          console.log("User Logged out, redirecting to prot /login");
          setIsLoggedIn(false);
        } else {
          console.log("User logged in from Prot");
          setIsLoggedIn(true);
        }
      })
      .catch((err) => {
        console.error("Login check failed:", err);
        setIsLoggedIn(false); // fallback
      });
  }, []);

  if (isLoggedIn === undefined) {
    return <div>Loading...</div>; // or spinner
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
