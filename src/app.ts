import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { pool } from "./db";
import { userRoute } from "./modules/users/user.route";

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "taslima",
  });
});

app.use("/api/v1/users", userRoute);

// app.post("/api/v1/users", async (req: Request, res: Response) => {
//   //   const body = req.body;
//   //   console.log(body);
//   //   res.send(body);
//   const { name, email, age, password } = req.body;
//   try {
//     const result = await pool.query(
//       `
//     INSERT INTO users(name,email, age,password)
//     VALUES ($1,$2,$3,$4) RETURNING *
//     `,
//       [name, email, age, password],
//     );
//     //   console.log(result)
//     res.status(201).json({
//       success: true,
//       message: "thie is test api",
//       data: result.rows[0],
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//       error: error,
//     });
//   }
// });

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

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "product not found",
      });
    }

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

app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, age, password } = req.body;
    const result = await pool.query(
      `
      UPDATE users 
      SET
      name=COALESCE($1,name),
      email = COALESCE($2, email),
      age=COALESCE($3,age),
      password=COALESCE($4,password),
      updated_at = NOW()
      WHERE id=$5 RETURNING *

      `,
      [name ?? null, email ?? null, age ?? null, password ?? null, id],
    );

    res.status(200).json({
      success: true,
      message: "product update successfully",
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

app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      DELETE FROM users WHERE id=$1
      `,
      [id],
    );

    console.log(result);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

export default app;
