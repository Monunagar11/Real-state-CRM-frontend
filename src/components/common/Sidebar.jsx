import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ isOpen }) {
  return (
    <div className={`sidebar ${isOpen ? 'show' : ''}`}>
      <a href="/admin" className="sidebar-logo">
        <i className="bi bi-boxes me-2 text-primary"></i>
        STEEX
      </a>
      <ul className="sidebar-menu">
        <li className="menu-title">Menu</li>
        
        <li>
          <NavLink to="/admin" className="menu-item" end>
            <i className="bi bi-speedometer2"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/real-estate" className="menu-item">
            <i className="bi bi-building"></i> Real Estate
          </NavLink>
        </li>
        
        <li className="menu-title">CRM</li>
        
        <li>
          <NavLink to="/admin/clients" className="menu-item">
            <i className="bi bi-people"></i> Clients
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/leads" className="menu-item">
            <i className="bi bi-funnel"></i> Leads
          </NavLink>
        </li>
        <li>
          <NavLink to="#properties" className="menu-item">
            <i className="bi bi-house-door"></i> Properties
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/add-property" className="menu-item ms-3">
            <i className="bi bi-plus-circle"></i> Add Property
          </NavLink>
        </li>
        
        <li className="menu-title">Apps</li>
        
        <li>
          <NavLink to="#calendar" className="menu-item">
            <i className="bi bi-calendar3"></i> Calendar
          </NavLink>
        </li>
        <li>
          <NavLink to="#chat" className="menu-item">
            <i className="bi bi-chat-dots"></i> Chat
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
