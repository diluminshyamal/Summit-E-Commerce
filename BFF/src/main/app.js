import express from "express";
import cors from "cors";
import productRoutes from "../api/routes/v1/productRoutes.js";
import orderRoutes from "../api/routes/v1/orderRoutes.js";
import cartRoutes from "../api/routes/v1/cartRoute.js";
import authRouter from "../api/routes/v1/authRoute.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.send("BFF Server is healthy...");
});

app.use("/api/v1/auth", authRouter);
app.use("/bff/api/v1", productRoutes.router);
app.use("/bff/api/v1", orderRoutes.router);
app.use("/bff/api/v1", cartRoutes.router);

export default app;
