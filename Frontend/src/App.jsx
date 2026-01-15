import Navbar from "./components/Navbar.jsx";
import {Loader} from "lucide-react"
import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

import { Routes, Route, UNSAFE_shouldHydrateRouteLoader } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";

const App = () => {
   const {authUser , checkAuth , isCheckingAuth} = useAuthStore();
   useEffect(() => {
     checkAuth();
   }, [checkAuth]);

   console.log("Authenticated User:", authUser);
   if(isCheckingAuth && !authUser){
    return (<span className="loading loading-dots loading-xs"></span>
    )
   }
  return (
    <div>
      <Navbar />
      <h1>Welcome to the App</h1>
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <LoginPage/>} />
        <Route path="/signup" element={!authUser?<SignupPage />:<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
