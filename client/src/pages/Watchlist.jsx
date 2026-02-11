import React, { useEffect, useState } from "react";
import { getWatchlist, removeFromWatchlist } from "../services/watchlistApi";

const Watchlist = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    getWatchlist().then((res) => setStocks(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Watchlist</h2>

      <ul className="list-group">
        {stocks.map((s) => (
          <li key={s.symbol} className="list-group-item d-flex justify-content-between">
            {s.name} ({s.symbol})
            <button
              className="btn btn-danger btn-sm"
              onClick={() => removeFromWatchlist(s.symbol)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
