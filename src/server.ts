import "reflect-metadata";
import { AppDataSource } from "./config/db";
import app from "./app";

const PORT = 5000;

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to database!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("Error connecting to database:", error));