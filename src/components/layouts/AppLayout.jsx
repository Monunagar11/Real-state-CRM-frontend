import React from "react";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    // <div
    //   className="container"
    //   style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    // >
    //   <header>header</header>
    <div className="container my-2 d-flex justify-content-center align-items-center" >
      <div>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      </div>
    </div>
    //   <footer>footer</footer>
    // </div>
  );
}

export default AppLayout;
