import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.database_string,
});

export const initDb = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        age INT,
        password VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        role VARCHAR(25) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

    pool.query(`
            CREATE TABLE IF NOT EXISTS profiles(
            id SERIAL PRIMARY KEY,
            user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            
            bio TEXT,
            address TEXT,
            phone VARCHAR(15),
            gender VARCHAR(12),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
    console.log("database connected!");
  } catch (error) {
    console.log(error);
  }
};
