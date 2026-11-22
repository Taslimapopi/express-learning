import type { Request, Response } from "express";
import { userController } from "../users/user.controller";
import { userService } from "../users/user.service";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    console.log(req.cookies.refreshToken);
    const user = await authService.loginIntoDb(req.body);
    const { refreshToken } = user;
    res.cookie("refreshToken", refreshToken, {
      secure: false, // http -> false , https -> true / In Production -> true
      httpOnly: true, // Prevent XSS attack
      sameSite: "lax", // "none" , "strict", "lax" -> CSRF
      // maxAge
      path: "/",
      domain: "localhost", // .example.com
    });
    res.status(201).json({
      success: true,
      mesaage: "login successfull",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const generateToken = async (req: Request, res: Response) => {
  try {
    // console.log(req.cookies.refreshToken);
    const result = await authService.generateToken(
      req.cookies.refreshToken as string,
    );
    res.status(201).json({
      success: true,
      message: "token generated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

export const authController = {
  loginUser,
  generateToken,
};
