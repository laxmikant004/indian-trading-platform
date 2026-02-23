import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

const AdminLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0f172a",
      }}
    >
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AdminHeader />

        <div
          style={{
            padding: "30px",
            color: "white",
            flex: 1,
          }}
        >
          <Outlet />   {/* 🔥 THIS FIXES EVERYTHING */}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;