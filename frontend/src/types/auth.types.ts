import type React from "react"
export type UserRole = "candidate" | "recruiter" | "admin"

export interface RoleOption {
  id: UserRole
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
}

export interface SignInFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface SignUpFormData {
  fullName: string
  email: string
  phone?: string
  countryCode?: string
  password: string
  confirmPassword: string
  termsAccepted: boolean
}

export interface PasswordRequirement {
  label: string
  met: boolean
}
