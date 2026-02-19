const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist
} = require("../controllers/watchlistController");

router.post("/", auth, addToWatchlist);
router.delete("/:symbol", auth, removeFromWatchlist);
router.get("/", auth, getWatchlist);

module.exports = router;
