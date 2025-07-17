import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import { Skeleton } from "./components/ui/skeleton";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "./components/ui/button";
function LoadingSkeleton({ path }) {
  const isAuthPage = path === "/login" || path === "/signup";

  if (isAuthPage) {
    // Auth page skeleton
    return (
      <div className="flex flex-col justify-center h-[100dvh] items-center min-h-[500px]">
        <div className="absolute top-6 right-8">
          <ModeToggle />
        </div>
        <Card className="w-[90dvw] min-w-[22rem] sm:w-full max-w-sm">
          <CardHeader>
            <Skeleton className="border-4 h-[20px] w-[180px]" />
            <CardDescription className="flex flex-col space-y-1 mt-2">
              <Skeleton className="border-4 h-[20px] w-[225px]" />
              <Skeleton className="border-4 h-[20px] w-[100px]" />
            </CardDescription>
            <CardAction>
              <Skeleton className="border-4 h-[20px] w-[80px]" />
            </CardAction>
          </CardHeader>
          <form>
            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Skeleton className="border-4 h-[20px] w-[60px]" />
                <Skeleton className="border-4 h-[2.5rem] w-full" />
              </div>
              <div className="grid gap-2">
                <Skeleton className="border-4 h-[20px] w-[80px]" />
                <Skeleton className="border-4 h-[2.5rem] w-full" />
              </div>
            </CardContent>
            <CardFooter className="flex-col mt-4 gap-1">
              <Skeleton className="border-4 h-[2.5rem] w-full flex justify-center items-center">
                <Skeleton className="border-8 h-[6px] w-[80px]" />
              </Skeleton>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }


}

function AppRouter({ isLogged, setIsLogged }) {
  const location = useLocation();

  if (isLogged === null) {
    return <LoadingSkeleton path={location.pathname} />;
  }

  return (
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
        element={isLogged ? <Navigate to="/" /> : <Signup />}
      />
      <Route
        path="/login"
        element={
          isLogged ? <Navigate to="/" /> : <Login setIsLogged={setIsLogged} />
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  const [isLogged, setIsLogged] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        // const res = await fetch(`${import.meta.env.VITE_API_URL}/check-login`, {
        //   credentials: "include",
        // });

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
let options = {
  method: "GET",
  credentials: "include",
};

if (isIOS) {
  const token = localStorage.getItem("authToken");
  if (token) {
    options.headers = {
      Authorization: `Bearer ${token}`,
    };
    options.credentials = undefined;
  }
}

const res = await fetch(`${import.meta.env.VITE_API_URL}/check-login`, options);


        const data = await res.json();
        setTimeout(() => {
          setIsLogged(res.status === 200 && data?.message?.includes("true"));
        }, 500);
      } catch (err) {
        console.error("Check-login failed:", err);
        setIsLogged(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Router>
        <AppRouter isLogged={isLogged} setIsLogged={setIsLogged} />
      </Router>
    </ThemeProvider>
  );
}

export default App;

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
// import { Navigate } from "react-router-dom";
// import Home from "./components/Home";
// import Signup from "./components/Signup";
// import Login from "./components/Login";
// import { useEffect, useState } from "react";
// import { Skeleton } from "./components/ui/skeleton";
// import { ThemeProvider } from "./components/theme-provider";
// import { ModeToggle } from "./components/mode-toggle";
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// function App() {
//   const [isLogged, setIsLogged] = useState(null);

//   useEffect(() => {
//     const checkLogin = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_API_URL}/check-login`, {
//           credentials: "include",
//         });

//         const data = await res.json();

//         // setTimeout(()=>{
//           setIsLogged(res.status === 201 && data?.message?.includes("true"));
//         // },1000000)
//       } catch (err) {
//         console.error("Check-login failed:", err);
//         setIsLogged(false);
//       }
//     };

//     checkLogin();
//   }, []);

//   if (isLogged === null) {
//     return (
//       <>
//         <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
//           <div className="flex flex-col justify-center h-[100dvh] items-center min-h-[500px]">
//             <div className="absolute top-6 right-8">
//               <ModeToggle />
//             </div>
//             <div className="flex flex-col justify-center items-center">
//               {" "}
//               <Card className="w-[90dvw] min-w-[22rem] sm:w-full max-w-sm">
//                 <CardHeader>
//                   <Skeleton className="border-4 h-[20px]  w-[180px]" />
//                   <CardDescription className="flex flex-col space-y-1 mt-2">
//                     <Skeleton className="border-4 h-[20px] w-[225px] " />

//                     <Skeleton className="border-4 h-[20px] w-[100px] " />
//                   </CardDescription>
//                   <CardAction>
//                     <Skeleton className="border-4 h-[20px] w-[80px] " />
//                   </CardAction>
//                 </CardHeader>

//                 <form>
//                   <CardContent className="flex flex-col gap-6">
//                     <div className="grid gap-2">
//                       <Skeleton className="border-4 h-[20px] w-[60px] " />

//                       <Skeleton className="border-4 h-[2.5rem] w-full " />
//                     </div>
//                     <div className="grid gap-2">
//                       <Skeleton className="border-4 h-[20px] w-[80px] " />

//                       <Skeleton className="border-4 h-[2.5rem] w-full " />
//                     </div>
//                   </CardContent>

//                   <CardFooter className="flex-col mt-4 gap-1">
//                     <p className="text-red-700 min-h-[1.5rem] text-sm"></p>

//                     <Skeleton className="border-4 h-[2.5rem] w-full flex justify-center items-center">
//                       <Skeleton className="border-8 h-[6px] w-[80px] " />
//                     </Skeleton>
//                   </CardFooter>
//                 </form>
//               </Card>
//             </div>
//           </div>
//         </ThemeProvider>
//       </>
//     );
//   }
//   return (
//     <>
//       <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
//         <Router>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 isLogged ? (
//                   <Home setIsLogged={setIsLogged} />
//                 ) : (
//                   <Navigate to="/login" />
//                 )
//               }
//             />
//             <Route
//               path="/signup"
//               element={
//                 isLogged === null ? (
//                   <div>Loading...</div>
//                 ) : isLogged ? (
//                   <Navigate to="/home" />
//                 ) : (
//                   <Signup />
//                 )
//               }
//             />
//             <Route
//               path="/login"
//               element={
//                 isLogged === null ? (
//                   <div>Loading...</div>
//                 ) : isLogged ? (
//                   <Navigate to="/home" />
//                 ) : (
//                   <Login setIsLogged={setIsLogged} />
//                 )
//               }
//             />

//             <Route path="*" element={<Navigate to="/" />} />
//           </Routes>
//         </Router>
//       </ThemeProvider>
//     </>
//   );
// }

// export default App;
