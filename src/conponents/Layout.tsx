import React from "react";
import MenuList from "./MenuList";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      {children}
      <MenuList></MenuList>
    </div>
  );
};

export default Layout;
