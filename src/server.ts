import app from "./app";
import config from "./config";
import { initDb } from "./db";

const main = async () => {
  initDb();
  app.listen(config.port, () => {
    console.log(`server running on port : ${config.port}`);
  });
};

main();
