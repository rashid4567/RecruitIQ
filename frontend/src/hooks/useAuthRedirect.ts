// src/hooks/useAuthRedirect.ts
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setIsChecking(false);
        return;
      }

      // Simple check: if we're on an auth page and have a token, redirect
      const currentPath = window.location.pathname;
      const authPages = ['/signin', '/signup', '/verify-otp', '/role-selection'];
      
      if (authPages.includes(currentPath)) {
        const userRole = localStorage.getItem('userRole');
        
        if (userRole === 'candidate') {
          const profileCompleted = localStorage.getItem('profileCompleted') === 'true';
          if (profileCompleted) {
            window.location.href = '/candidate/home';
          } else {
            window.location.href = '/candidate/profile';
          }
        } else if (userRole === 'recruiter') {
          window.location.href = '/recruiter/dashboard';
        }
      } else {
        setIsChecking(false);
      }
    };

    // Add a small delay to prevent race conditions
    const timer = setTimeout(checkAuthAndRedirect, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return { isChecking };
};