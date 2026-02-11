const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const watchlistRoutes = require("./routes/watchlistRoutes");


// ✅ MIDDLEWARE FIRST
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());

// ✅ ROUTES AFTER
app.use("/api/market", require("./routes/marketRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/trade", require("./routes/tradeRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
