const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const linkedInService = {
  redirectToLinkedIn: (role: "candidate" | "recruiter") => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    
    window.location.href = `${API_BASE_URL}/api/auth/linkedin?role=${role}`;
  },
  getLinkedInAuthUrl: (role: "candidate" | "recruiter") => {
    return `${API_BASE_URL}/api/auth/linkedin?role=${role}`;
  }
};