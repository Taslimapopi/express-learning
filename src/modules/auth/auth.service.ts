import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginIntoDb = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );
  if (user.rowCount === 0) {
    throw new Error("User not found");
  }

  const matchPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassword) {
    throw new Error("Invalid credentials!!");
  }

  if (!user.rows[0].is_active) {
    throw new Error("user blocked!!");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1hr",
  });

  const refreshToken = jwt.sign(jwtPayload, config.refresh_token, {
    expiresIn: "7d",
  });

  delete user.rows[0].password;

  return { accessToken, refreshToken, user: user.rows[0] };
};

const generateToken = async (token: string) => {
  if (!token) {
    throw new Error("Unathorized user ! no token");
  }
  const decode = (await jwt.verify(token, config.refresh_token)) as JwtPayload;
  // console.log(decode);
  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [decode.email],
  );

  if (user.rowCount === 0) {
    throw new Error("no user found with this token");
  }

  if (!user.rows[0].is_active) {
    throw new Error("Forbidden!!");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1d",
  });

  return { accessToken };
};

export const authService = {
  loginIntoDb,
  generateToken,
};
