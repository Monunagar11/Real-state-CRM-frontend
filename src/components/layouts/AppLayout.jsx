import React from 'react'
import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <>
    <header>
      header
    </header>
    <Outlet />
    <footer>
      footer
    </footer>
    </>
  )
}

export default AppLayout;
