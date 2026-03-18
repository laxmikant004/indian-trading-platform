const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/analytics", async (req, res) => {
  try {
    const range = req.query.range === "30" ? 30 : 7;

    /* ================= CURRENT PERIOD ================= */

    const currentResult = await pool.query(
      `
      SELECT 
        TO_CHAR(DATE(created_at), 'DD Mon') as label,
        COUNT(*)::int as trades,
        COALESCE(SUM(total),0)::float as revenue,
        MIN(created_at) as sort_date
      FROM trades
      WHERE created_at >= CURRENT_DATE - INTERVAL '${range} days'
      GROUP BY DATE(created_at)
      ORDER BY sort_date
      `
    );

    const chartData = currentResult.rows.map(row => ({
      label: row.label,
      trades: row.trades,
      revenue: row.revenue
    }));

    const totalTrades = chartData.reduce(
      (sum, row) => sum + row.trades,
      0
    );

    const totalRevenue = chartData.reduce(
      (sum, row) => sum + row.revenue,
      0
    );

    const avgTrades =
      chartData.length > 0
        ? Math.round(totalTrades / chartData.length)
        : 0;

    /* ================= PREVIOUS PERIOD ================= */

    const previousResult = await pool.query(
      `
      SELECT 
        COUNT(*)::int as trades,
        COALESCE(SUM(total),0)::float as revenue
      FROM trades
      WHERE created_at >= CURRENT_DATE - INTERVAL '${range * 2} days'
      AND created_at < CURRENT_DATE - INTERVAL '${range} days'
      `
    );

    const previousTrades = previousResult.rows[0]?.trades || 0;
    const previousRevenue = previousResult.rows[0]?.revenue || 0;

    /* ================= GROWTH CALCULATION ================= */

    let growth = 0;
    let revenueGrowth = 0;

    // Trades growth
    if (previousTrades === 0) {
      growth = totalTrades > 0 ? 100 : 0;
    } else {
      growth = Math.round(
        ((totalTrades - previousTrades) / previousTrades) * 100
      );
    }

    // Revenue growth (optional)
    if (previousRevenue === 0) {
      revenueGrowth = totalRevenue > 0 ? 100 : 0;
    } else {
      revenueGrowth = Math.round(
        ((totalRevenue - previousRevenue) / previousRevenue) * 100
      );
    }

    /* ================= RESPONSE ================= */

    res.json({
      summary: {
        totalTrades,
        totalRevenue,
        growth,
        revenueGrowth,
        avgTrades,
      },
      chartData,
    });

  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Analytics error" });
  }
});

module.exports = router;