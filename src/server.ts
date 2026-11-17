import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { Pool } from "pg";

const app: Application = express();
const port = 5000;
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_GU6rYgpjAXQ5@ep-divine-bird-aobruyda-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require",
});

// console.log(pool);

const initDb = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        age INT,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        
        `);
    console.log("database connected!");
  } catch (error) {
    console.log(error);
  }
};

initDb();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "taslima",
  });
});

app.post("/api/v1/users", async (req: Request, res: Response) => {
  //   const body = req.body;
  //   console.log(body);
  //   res.send(body);
  const { name, email, age, password } = req.body;
  try {
    const result = await pool.query(
      `
    INSERT INTO users(name,email, age,password) 
    VALUES ($1,$2,$3,$4) RETURNING *
    `,
      [name, email, age, password],
    );
    //   console.log(result)
    res.status(201).json({
      success: true,
      message: "thie is test api",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
        SELECT * FROM users
            `);
    // console.log(result);
    res.status(201).json({
      success: true,
      message: "users retrive successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
     SELECT * FROM users WHERE id=$1
      `,
      [id],
    );

    res.status(200).json({
      success: true,
      message: "product retrive successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.put("/api/v1/users/:id", (req: Request, res: Response) => {});

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});
