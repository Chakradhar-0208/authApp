import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Navigate } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
function App() {
  const [isLogged, setIsLogged] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:3000/check-login", {
          credentials: "include",
        });
        setIsLogged(res.status === 201);
      } catch (err) {
        console.error("Check-login failed:", err);
        setIsLogged(false);
      }
    };
    checkLogin();
  }, []);
  if (isLogged === null) {
    return <div>Loading App...</div>;
  }
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                isLogged ? (
                  <Home setIsLogged={setIsLogged} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/signup"
              element={
                isLogged === null ? (
                  <div>Loading...</div>
                ) : isLogged ? (
                  <Navigate to="/home" />
                ) : (
                  <Signup />
                )
              }
            />
            <Route
              path="/login"
              element={
                isLogged === null ? (
                  <div>Loading...</div>
                ) : isLogged ? (
                  <Navigate to="/home" />
                ) : (
                  <Login setIsLogged={setIsLogged} />
                )
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
