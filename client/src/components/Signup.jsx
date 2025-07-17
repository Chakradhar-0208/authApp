import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "./mode-toggle";

const API_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Signup | Authenticator App";
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      const msg = document.getElementById("msg");

      if (res.status === 200) {
        msg.innerText = "Redirecting to Login Page...";
        setIsLoading(false);
        navigate("/login");
      } else {
        msg.innerText = data.message;
      }
    } catch (err) {
      console.error("SignUp Error", err);
      const msg = document.getElementById("msg");
      msg.innerText = "Something went wrong.";
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100dvh] min-h-[500px]">
      <div className="absolute top-6 right-8">
        <ModeToggle />
      </div>
      <Card className="w-[90dvw] min-w-[20rem] sm:w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Fill in the form below to sign up.</CardDescription>
          <CardAction>
            <Link to="/login">
              <Button variant="link" className="px-0">
                Log in
              </Button>
            </Link>
          </CardAction>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 mt-4">
            <p
              id="msg"
              className="text-center text-sm text-red-600 min-h-[1.25rem]"
            ></p>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Please wait..." : "Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
