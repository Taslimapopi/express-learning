import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import { Result } from "pg";

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
  };

  const accessToken = jwt.sign(jwtPayload, "qerwtretyr124353", {
    expiresIn: "7d",
  });

  delete user.rows[0].password

  return {accessToken,user: user.rows[0]}
};

export const authService = {
  loginIntoDb,
};
