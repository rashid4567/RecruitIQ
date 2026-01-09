const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const linkedInService = {
  // Redirect to LinkedIn OAuth for sign up
  redirectToLinkedIn: (role: "candidate" | "recruiter") => {
    // Clean up any existing tokens first
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    
    // Redirect to backend LinkedIn endpoint
    window.location.href = `${API_BASE_URL}/api/auth/linkedin?role=${role}`;
  },
  
  // Helper to get LinkedIn auth URL for button clicks
  getLinkedInAuthUrl: (role: "candidate" | "recruiter") => {
    return `${API_BASE_URL}/api/auth/linkedin?role=${role}`;
  }
};