import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "./ui/skeleton";
const API_URL = import.meta.env.VITE_API_URL;

const Home = ({ setIsLogged }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Home | Authenticator App";
    checkLogin();
  }, []);

  const getUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/getUserData`, {
        credentials: "include",
        method: "GET",
      });
      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const data = await response.json();
      setUserData(data.user);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const checkLogin = () => {
    fetch(`${API_URL}/check-login`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "User Logged in false") {
          console.log("User logged out, redirecting to /login");

          setIsLogged(false);

          navigate("/login");
        } else {
          setIsLogged(true);

          console.log("User logged in");
          getUserData();
        }
      })
      .catch((err) => {
        console.error("Login check failed:", err);

        setIsLogged(false);

        navigate("/login");
      });
  };

  const handleLogout = async () => {
    try {
      const loggedRes = await fetch(`${API_URL}/logout`, {
        method: "GET",
        credentials: "include",
      });
      const data = await loggedRes.json();

      setIsLogged(false);

      checkLogin();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  if (isLoading) {
      return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="flex absolute top-6 right-8 space-x-5">
        <ModeToggle />
        <Button>Logout</Button>
      </div>
      <Skeleton className="w-40 h-4 mb-2" />
      <Skeleton className="w-30 h-4 mb-2" />
    </div>
  );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10 h-[100dvh]">
      <div className="max-w-md mx-auto mt-20 space-y-4"></div>
      <div className=" absolute top-6 right-8 flex space-x-5">
        <ModeToggle />
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button>Logout</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Are You Sure?</DialogTitle>
                <DialogDescription>
                  You are about to be logged out. Click "Logout" to confirm.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={handleLogout}>
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
      <div className="absolute flex flex-col min-w-[22rem] w-[90dvw] max-w-xl h-fit space-y-5 justify-around min-h-[25rem]">
        <div className="text-center">
          <p>{`Welcome ${userData?.name},`}</p>
          <h1 className="">You're Logged In.</h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
