const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const watchlistController = require("../controllers/watchlistController");

router.post("/", authMiddleware, watchlistController.addToWatchlist);
router.get("/", authMiddleware, watchlistController.getWatchlist);
router.delete("/:symbol", authMiddleware, watchlistController.removeFromWatchlist);

module.exports = router;
