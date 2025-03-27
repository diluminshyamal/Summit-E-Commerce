import app from "./main/app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`BFF Server is running on http://localhost:${PORT}`);
});
