import jwt from "jsonwebtoken";
import { jwtPayload } from "../interfaces/jwt.interface"

// Export the secrets so they can be imported elsewhere
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret_key_123";
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key_456";

const ACCESS_TOKEN_EXPIRE = "24h";
const REFRESH_TOKEN_EXPIRE = "7d";

export const signAccessToken = (payload: jwtPayload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRE
    })
}

export const signRefreshToken = (payload: jwtPayload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRE
    })
}

export const verifyRefreshToken = (token: string): jwtPayload => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as jwtPayload
    } catch (err) {
        throw new Error("Invalid Refresh token")
    }
}

export const verifyAccessToken = (token: string): jwtPayload => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as jwtPayload
    } catch (err) {
        throw new Error("Invalid Access token")
    }
}