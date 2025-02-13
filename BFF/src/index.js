
const app = require("./main/app");
require("dotenv").config();


const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
  console.log(`BFF Server is running on http://localhost:${PORT}`);
});