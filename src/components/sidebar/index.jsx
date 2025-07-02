import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import vmslogo from "../../assets/images/web-logo.png";
import ForumIcon from '@mui/icons-material/Forum';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ListIcon from '@mui/icons-material/List';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';

const navItemsAdmin = [
  { name: 'Dashboard', icon: <HomeOutlinedIcon />, path: '/' },
  { name: 'Visitors', icon: <PeopleOutlinedIcon />, path: '/visitor' },
  { name: 'Users', icon: <ListIcon />, path: '/user' },
  { name: 'Passes', icon: <CreditCardIcon />, path: '/pass' },
  { name: 'Reports', icon: <ReceiptIcon />, path: '/report' },
  { name: 'FAQ', icon: <ForumIcon />, path: '/faq' },
  { name: 'Configure', icon: <SettingsIcon />, path: '/configure' },
];

const navItemsReceptionist = [
  { name: 'Dashboard', icon: <HomeOutlinedIcon />, path: '/' },
  { name: 'Visitors', icon: <PeopleOutlinedIcon />, path: '/visitor' },
  { name: 'Passes', icon: <CreditCardIcon />, path: '/pass' },
  { name: 'Reports', icon: <ReceiptIcon />, path: '/report' },
  { name: 'FAQ', icon: <ForumIcon />, path: '/faq' },
];

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useState('');
  const location = useLocation();

  useEffect(() => {
    const storedRole = localStorage.getItem("user_type");
    setRole(storedRole);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (role === "Guard") {
    return null;
  }

  const navItems = role === 'Admin' ? navItemsAdmin : navItemsReceptionist;

  return (
    <aside className={`bg-[#1e1e2f] transition-all duration-300 shadow-lg ${isCollapsed ? 'w-16' : 'w-56'} h-screen`} aria-label="Sidebar">
      <div className="overflow-y-auto py-3 px-3 rounded">
        <div className="flex justify-between items-center mb-6 h-14">
          <img
            src={vmslogo}
            alt="VMS Logo"
            className={`h-12 pl-1 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}
          />
          <MenuIcon
            className="text-white cursor-pointer h-14 transition-transform duration-300 hover:scale-110"
            style={{ fontSize: '2rem' }}
            onClick={toggleSidebar}
          />
        </div>
        <nav>
          {navItems.map((item) => (
            <Link
              to={item.path}
              key={item.name}
              className={`
                flex items-center p-2 text-base font-medium text-white rounded-lg
                transition-all duration-200 ease-in-out 
                hover:bg-blue-500 hover:text-white group 
                ${location.pathname === item.path ? 'bg-blue-700' : ''}
              `}
            >
              <span className="inline-block w-6 text-center mr-3 text-lg group-hover:scale-125 transition-transform duration-200">
                {item.icon}
              </span>
              <span
                className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SideBar;
