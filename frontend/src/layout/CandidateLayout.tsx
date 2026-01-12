import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const CandidateLayout = () => {
  const token = localStorage.getItem("authToken");
  const [isChecking, setIsChecking] = useState(true);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    checkProfileStatus();
  }, [token, navigate]);

  const checkProfileStatus = async () => {
    try {
  
      const storedStatus = localStorage.getItem("profileCompleted");
      
      if (storedStatus === "true") {
        setIsProfileCompleted(true);
        setIsChecking(false);
        return;
      }

  
      const res = await api.get("/candidate/profile");
      const profile = res.data.data;
      
      if (profile?.profileCompleted) {
        localStorage.setItem("profileCompleted", "true");
        setIsProfileCompleted(true);
      } else {
        setIsProfileCompleted(false);
      }
    } catch (error) {
      console.error("Error checking profile:", error);
      setIsProfileCompleted(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default CandidateLayout;