const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); 

app.get("/", (req, res) => {
  res.send("BFF Server is running...");
});

app.listen(PORT, () => {
  console.log(`BFF Server is running on http://localhost:${PORT}`);
});

export default app;