"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/auth.service";

import { Eye, EyeOff, Lock, User, Mail,  ArrowRight, AlertCircle } from "lucide-react"
import type { SignUpFormData, PasswordRequirement } from "../../types/auth.types"




const SignUp = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const role = location.state?.role as "candidate" | "recruiter" | undefined;
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  })

  // Password requirements validation
  const passwordRequirements: PasswordRequirement[] = useMemo(() => {
    const password = formData.password
    return [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "One uppercase letter", met: /[A-Z]/.test(password) },
      { label: "One lowercase letter", met: /[a-z]/.test(password) },
      { label: "One number", met: /\d/.test(password) },
      {
        label: "One special character",
        met: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      },
    ]
  }, [formData.password])

  const allRequirementsMet = passwordRequirements.every((req) => req.met)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  // const handleSubmit = async (e : React.FormEvent) =>{
  //   e.preventDefault();
  //   setError("");

  //   if(!allRequirementsMet){
  //     setError("please mell all requirements")
  //     return;
  //   }
  //   if(formData.password !== formData.confirmPassword){
  //     setError("Password do not match")
  //     return;
  //   }
  //   if(!formData.termsAccepted){
  //     setError("please accept the Terms & conditions")
  //     return
  //   }

  //   if(!role){
  //     setError("role is not selected");
  //     return;
  //   }

  //   try{
  //     setIsLoading(true);

  //     const response = await authService.register({
  //       email : formData.email,
  //       password : formData.password,
  //       fullName : formData.fullName,
  //     },
  //     role
  //   );


  //   const {token, user} = response.data;

  //   localStorage.setItem("authToken",token);
  //   localStorage.setItem("userRole",user.role);
  //   localStorage.setItem("userId",user.id);

  //   if(user.role === "candidate"){
  //     navigate("/candidate/dashborad")
  //   }else if(user.role === "recruiter"){
  //     navigate("/recruiter/dashborad")
  //   }
    
  //   }catch(error : any){
      
  //     setError(error.response?.data?.message || "Registration failed")
  //   }finally{
  //     setIsLoading(false)
  //   }
  // }


  const handleSubmit = async (e: React.FormEvent) =>{
    e.preventDefault();
    setError("");

    if(!allRequirementsMet){
      setError("please meet all password requirment")
      return;
    }
    if(formData.password !== formData.confirmPassword){
      setError("password do not match");
      return;
    }
    if(!formData.termsAccepted){
      setError("please accept the terms and conditions");
      return;
    }
    if(role !== "candidate"){
      setError("invalid role");
      return
    }

    try{
      setIsLoading(true);

      sessionStorage.setItem(
        "candidateRegData",
        JSON.stringify({
          fullName : formData.fullName,
          email : formData.email,
          password : formData.password,
        })
      )
      await authService.sendCandidateOtp(formData.email);
      navigate("/verify-otp",{
        state : {email : formData.email},
      })
    }catch(error : any){
    setError(error.response?.data?.message || "Failed to send OTP")
  }finally{
    setIsLoading(false)
  }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-100/25 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-slate-100/25 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-lg">
        {/* Logo and Progress */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-6 p-3 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/40">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <h2 className="text-lg font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              RecruitFlow AI
            </h2>
          </div>

          <p className="text-xs font-semibold text-slate-600 mb-3">Step 2 of 5</p>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2 shadow-sm">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-700 rounded-full"
              style={{ width: "40%" }}
            ></div>
          </div>
          <p className="text-xs font-medium text-slate-500">40% Complete</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl shadow-slate-100/50 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Create Your Account</h1>
          <p className="text-slate-600 text-center text-sm mb-8 leading-relaxed">
            Fill in your information to get started with RecruitFlow AI.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white hover:border-slate-400"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white hover:border-slate-400"
                  required
                />
              </div>
            </div>

            {/* Phone
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Phone Number</label>
              <div className="flex gap-3">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="w-28 px-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm bg-white hover:border-slate-400 font-medium"
                >
                  <option>+1 (US)</option>
                  <option>+44 (UK)</option>
                  <option>+91 (IN)</option>
                  <option>+61 (AU)</option>
                  <option>+1 (CA)</option>
                </select>
                <div className="flex-1 relative">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="123 456 7890"
                    className="w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white hover:border-slate-400"
                    required
                  />
                </div>
              </div>
            </div> */}

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white hover:border-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-3 font-medium">Password requirements:</p>
              <ul className="mt-3 space-y-2">
                {passwordRequirements.map((req) => (
                  <li
                    key={req.label}
                    className={`text-xs flex items-center gap-3 transition-all duration-300 ${
                      req.met ? "text-green-600" : "text-slate-500"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        req.met ? "bg-linear-to-br from-green-400 to-green-500" : "bg-slate-300"
                      }`}
                    >
                      {req.met && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 bg-white hover:border-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && formData.confirmPassword && (
                <p
                  className={`text-xs mt-3 font-medium transition-all ${
                    formData.password === formData.confirmPassword ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="w-5 h-5 cursor-pointer appearance-none border border-slate-300 rounded-lg checked:bg-linear-to-br checked:from-blue-500 checked:to-blue-600 checked:border-blue-600 transition-all"
                  />
                  {formData.termsAccepted && (
                    <svg
                      className="absolute inset-0 m-auto w-3 h-3 text-white pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-700 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/role-selection")}
                disabled={isLoading}
                className="flex-1 border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-900 font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!formData.termsAccepted || !allRequirementsMet || isLoading}
                className={`flex-1 font-bold py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  formData.termsAccepted && allRequirementsMet && !isLoading
                    ? "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-500 font-medium">or sign up with</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isLoading}
              className="border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-900 font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              disabled={isLoading}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-700/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
              </svg>
              LinkedIn
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp