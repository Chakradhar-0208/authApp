import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import axios from 'axios'
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

const Home = ({ setIsLogged }) => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Home Page";
  }, []);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileUpload,setFileUpload] = useState(null);
  const [uploadedPath, setUploadedPath] = useState('');

  
  const getUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/getUserData", {
        credentials: "include",
        method: "GET",
      });
      if (!response.ok) throw new Error(`Status: ${response.status}`);

      const data = await response.json();
      console.log("Current user data: ", data.user);
      setUserData(data.user);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };
  const checkLogin = () => {
    fetch("http://localhost:3000/check-login", { credentials: "include" })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message === "User Logged in false") {
          console.log("User Loggedout, redirecting to /login");
          setIsLogged(false);

          navigate("/login");
        } else {
          setIsLogged(true);
          console.log("user logged in");
          getUserData();
        }
      });
  };

  const handleChange = (e) =>{
    setFileUpload(e.target.files[0]);
  }
  const handleUpload= async (e)=>{
    e.preventDefault();
    if(!fileUpload) return alert('No file selected')
    const formData = new FormData();
    formData.append('file',fileUpload);
    
    try{
      const res = await axios.post('http://localhost:3000/upload',formData,{
        headers:{
          'Content-Type':"multipart/form-data"
        }
      })
      const path = res.data.path;
const fullPath = 'http://localhost:3000' + path;
setUploadedPath(fullPath);
console.log("Uploaded path:", fullPath);
    }
    catch(err){
      console.error(err)
      alert('upload failed')
    }

 }

  const handleLogout = async () => {
    const loggedRes = await fetch("http://localhost:3000/logout", {
      method: "GET",
      credentials: "include",
    });
    const data = await loggedRes.json();
    setIsLogged(false);
    checkLogin();
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (isLoading) {
    return <h1>Loading....</h1>;
  }
  return (
    <div className="flex flex-col justify-center items-center gap-10 h-[100dvh]">
      <div className="max-w-md mx-auto mt-20 space-y-4"></div>
      <div className="absolute top-6 right-8 flex space-x-5">
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
     <div className=" flex flex-col min-w-[22rem] w-[90dvw] max-w-xl  h-fit space-y-5 justify-around min-h-[25rem]">
       <div className=" text-center">
        <p>{`Welcome ${userData?.name},`}</p>
        <h1 className="">You're Logged In.</h1>
      </div>

{/* <div className="grid w-full max-w-sm items-center gap-3">
     <Label htmlFor="picture">Picture</Label>
       <div className="flex w-full max-w-sm items-center gap-2">
      <Input id="picture" type="file" accept="image/" onChange={handleChange}/>
      <Button type="submit" onClick={handleUpload} >
        Upload
      </Button>
    </div>
    </div> */}
    {/* {uploadedPath && (
      <div className="flex flex-col  space-y-2">
          <p>Uploaded File:</p>
          <img src={uploadedPath} alt="Uploaded" className="w-[500px] rounded-md" />
        </div>
      )} */}
     </div>
     
    </div>
  );
};
export default Home;
