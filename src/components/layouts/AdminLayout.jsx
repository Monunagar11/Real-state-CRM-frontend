import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../features/user/authSlice";
import AdminNavbar from "../common/AdminNavbar";
import Sidebar from "../common/Sidebar";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className="main-wrapper">
        <AdminNavbar toggleSidebar={toggleSidebar} />
        
        <div className="main-content">
          <Outlet />
        </div>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="modal-backdrop fade show d-lg-none" 
          onClick={() => setSidebarOpen(false)}
          style={{ zIndex: 999 }}
        ></div>
      )}
    </div>
  );
}

export default AdminLayout;
