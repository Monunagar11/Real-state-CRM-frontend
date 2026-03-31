import React from "react";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div
      className="container"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <header>header</header>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer>footer</footer>
    </div>
  );
}

export default AdminLayout;
