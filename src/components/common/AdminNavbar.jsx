import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/user/authSlice";
import Dropdown from 'react-bootstrap/Dropdown';

function AdminNavbar({ toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check initial theme from system or local storage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-bs-theme', newTheme);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  // Custom toggle for react-bootstrap Dropdown to remove the default caret and use our custom button styling
  const CustomToggle = React.forwardRef(({ children, onClick, className }, ref) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className={className}
    >
      {children}
    </button>
  ));

  return (
    <div className="top-header w-100 justify-content-between">
      <div className="d-flex align-items-center">
        <button 
          className="btn btn-sm btn-light me-3 d-lg-none" 
          onClick={toggleSidebar}
        >
          <i className="bi bi-list fs-5"></i>
        </button>
        
        <div className="search-box d-none d-md-block position-relative">
          <input 
            type="text" 
            className="form-control border-0 bg-light rounded-pill ps-4" 
            placeholder="Search for..." 
            style={{ width: '250px' }}
          />
          <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"></i>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Theme Toggle Button */}
        <button 
          className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle border-0 bg-transparent"
          onClick={toggleTheme}
        >
          <i className={`bi bi-${theme === 'light' ? 'moon' : 'sun'} fs-5 text-body`}></i>
        </button>
        
        {/* Notifications Dropdown */}
        <Dropdown>
          <Dropdown.Toggle as={CustomToggle} className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle position-relative border-0 bg-transparent">
            <i className="bi bi-bell fs-5 text-body"></i>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
          </Dropdown.Toggle>

          <Dropdown.Menu align="end" className="p-0 shadow border-0" style={{ width: '320px' }}>
            <div className="p-3 bg-primary text-white rounded-top">
              <h6 className="m-0 text-white">Notifications <span className="badge bg-danger ms-2">4 New</span></h6>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Dropdown.Item href="#/action-1" className="p-3 border-bottom text-wrap">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <div className="avatar-xs bg-info-subtle text-info rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                      <i className="bi bi-check2-circle fs-5"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">Project successfully updated</h6>
                    <p className="text-muted mb-0 fs-13">A new version of the CRM has been deployed.</p>
                  </div>
                </div>
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2" className="p-3 border-bottom text-wrap">
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <div className="avatar-xs bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                      <i className="bi bi-exclamation-triangle fs-5"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">Server storage almost full</h6>
                    <p className="text-muted mb-0 fs-13">Please clean up unnecessary files.</p>
                  </div>
                </div>
              </Dropdown.Item>
            </div>
            <div className="p-2 border-top text-center">
              <a href="#!" className="btn btn-sm btn-link">View All Notifications <i className="bi bi-arrow-right"></i></a>
            </div>
          </Dropdown.Menu>
        </Dropdown>
        
        {/* Profile Dropdown */}
        <Dropdown className="ms-sm-3 header-item topbar-user">
          <Dropdown.Toggle as={CustomToggle} className="btn border-0 d-flex align-items-center px-0">
            <span className="d-flex align-items-center">
              <img className="rounded-circle header-profile-user" src={`https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=4F46E5&color=fff`} alt="Header Avatar" height="32" width="32" />
              <span className="text-start ms-xl-2">
                <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{user?.username || 'Admin User'}</span>
                <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">Founder</span>
              </span>
            </span>
          </Dropdown.Toggle>
          
          <Dropdown.Menu align="end" className="shadow border-0">
            <h6 className="dropdown-header">Welcome {user?.username || 'Admin'}!</h6>
            <Dropdown.Item href="/admin/profile"><i className="bi bi-person text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Profile</span></Dropdown.Item>
            <Dropdown.Item href="#!"><i className="bi bi-envelope text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Messages</span></Dropdown.Item>
            <Dropdown.Item href="#!"><i className="bi bi-gear text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Settings</span></Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}><i className="bi bi-box-arrow-right text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Logout</span></Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default AdminNavbar;
