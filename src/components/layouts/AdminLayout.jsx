import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../common/AdminNavbar";

function AdminLayout() {
  return (
    <div
      className="container"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header>
        <AdminNavbar />
      </header>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer>footer</footer>
    </div>
  );
}

export default AdminLayout;
