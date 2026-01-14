import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";

export class AuthController {
  constructor(
    private readonly sendOtpUC: {
      execute(email: string, role: "candidate" | "recruiter"): Promise<void>;
    },
    private readonly verifyUC: {
      execute(input: any): Promise<any>;
    },
    private readonly loginUC: {
      execute(email: string, password: string): Promise<any>;
    },
    private readonly adminLoginUC: {
      execute(email: string, password: string): Promise<any>;
    },
    private readonly refreshUC: {
      execute(refreshToken: string): Promise<string>;
    }
  ) {}

  sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.sendOtpUC.execute(req.body.email, req.body.role);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error) {
      return next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.verifyUC.execute(req.body);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
      });

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "User created successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.loginUC.execute(
        req.body.email,
        req.body.password
      );

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  };

  adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adminLoginUC.execute(
        req.body.email,
        req.body.password
      );

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Admin logged in successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refreshToken;
      const accessToken = await this.refreshUC.execute(token);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: { accessToken },
      });
    } catch (error) {
      return next(error);
    }
  };

  logout = async (_req: Request, res: Response) => {
    res.clearCookie("refreshToken");

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Logout successful",
    });
  };
}
