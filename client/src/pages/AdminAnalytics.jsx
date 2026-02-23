import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Mon", trades: 20 },
  { name: "Tue", trades: 35 },
  { name: "Wed", trades: 50 },
  { name: "Thu", trades: 40 },
  { name: "Fri", trades: 70 },
];

const AdminAnalytics = () => {
  return (
    <div>
      <h2 style={{ marginBottom: "20px" }}>Trade Analytics</h2>

      <LineChart width={600} height={300} data={data}>
        <CartesianGrid stroke="#444" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="trades" stroke="#22c55e" />
      </LineChart>
    </div>
  );
};

export default AdminAnalytics;