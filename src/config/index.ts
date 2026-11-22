import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  database_string: process.env.DATABASE_STRING as string,
  jwt_secret: process.env.JWT_SECRET as string,
  refresh_token: process.env.REFRESH_TOKEN as string,
};

export default config;
