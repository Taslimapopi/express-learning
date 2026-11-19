import type { Request, Response } from "express";
import { userController } from "../users/user.controller";
import { userService } from "../users/user.service";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const user = await authService.loginIntoDb(req.body);
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

export const authController = {
  loginUser,
};
