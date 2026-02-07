import React, { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [market, setMarket] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
	const res = await API.get("/market");
	console.log("Full response:", res.data);
	console.log("Market array:", res.data.market);

        console.log("Market API response:", res.data);

        setMarket(res.data.market);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching market data", error);
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  if (loading) {
    return <h3 className="text-center mt-4">Loading market data...</h3>;
  }

  return (
    <div className="container mt-4">
      <h2>Market Dashboard</h2>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change</th>
            <th>% Change</th>
          </tr>
        </thead>

        <tbody>
  {market.map((item, index) => (
    <tr key={index}>
      {/* Symbol */}
      <td>{item.shortName || item.symbol}</td>

      {/* Price */}
      <td>{item.regularMarketPrice}</td>

      {/* Change */}
      <td
        style={{
          color: item.regularMarketChange >= 0 ? "green" : "red",
        }}
      >
        {item.regularMarketChange.toFixed(2)}
      </td>

      {/* % Change */}
      <td
        style={{
          color: item.regularMarketChangePercent >= 0 ? "green" : "red",
        }}
      >
        {item.regularMarketChangePercent.toFixed(2)}%
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
};

export default Dashboard;
