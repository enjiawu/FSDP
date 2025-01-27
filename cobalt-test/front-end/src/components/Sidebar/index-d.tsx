import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import OCBCLogo from '../../images/logo/ocbc-logo.png';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo.png';

interface SidebarProps {
  sidebarOpen: boolean; // Sidebar open state passed down from parent
  setSidebarOpen: (arg: boolean) => void; // Function to set sidebar state
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  // Store sidebar expanded state in local storage
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // State to store assigned applications
  const [assignedApps, setAssignedApps] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Close sidebar on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen]);

  // Close sidebar on 'esc' key press
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen]);

  // Sync sidebar expanded state with local storage
  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  // Fetch assigned applications
  useEffect(() => {
    const fetchAssignedApps = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const decodedToken = token
          ? JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
          : null;
        const username = decodedToken?.username;
        const role = decodedToken?.role;
        setUserRole(role);

        const response = await fetch(`http://localhost:3000/assignedApps/${username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching assigned apps: ${response.statusText}`);
        }

        const data = await response.json(); // Assuming the response is an array of application names
        setAssignedApps(data);
      } catch (error) {
        console.error('Error fetching assigned apps:', error);
      }
    };

    fetchAssignedApps();
  }, []);

  const dashboardRoutes = [
    { path: '/dashboards/Dashboard 1', label: 'Dashboard 1' },
    { path: '/dashboards/XYZ Bank', label:'XYZ Bank'}
    //TODO: Change to actual dashboard routes
  ];

  const filteredRoutes =
    userRole === 'admin' ? dashboardRoutes : dashboardRoutes.filter((route) => assignedApps.includes(route.label));

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-7.5">
        <NavLink to="/dashboards" className="flex-grow-0 mr-18">
          <img src={Logo} alt="Logo"/>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="py-4 px-4 lg:mt-0 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-3">
            {/* <!-- Menu Item Dashboard --> */}
            <SidebarLinkGroup activeCondition={pathname.includes('/dashboards')}>
                {(handleClick, open) => (
                  <React.Fragment>
                    <NavLink
                      to="/dashboards"
                      className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium 
                        ${pathname.includes('/dashboards') ? 'bg-primary text-white' : 'text-black hover:bg-primary hover:text-white'} 
                        duration-300 ease-in-out dark:text-white dark:hover:bg-primary`}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default link behavior
                        if ((e.target as Element).closest('.arrow')) {
                          handleClick(); // Only handle click for dropdown if the arrow is clicked
                        } else {
                          navigate('/dashboards');
                          setSidebarExpanded(true); // Open sidebar if it was closed
                        }
                      }}
                    >
                        <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z" />
                        <path d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z" />
                        <path d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z" />
                        <path d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z" />
                      </svg>
                      Dashboards
                      <span className={`ml-auto arrow cursor-pointer transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </NavLink>
                    <div className={`translate transform overflow-hidden ${!open ? 'hidden' : ''}`}>
                      <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                        {filteredRoutes.map((route) => (
                          <li key={route.path}>
                            <NavLink
                              to={route.path}
                              className={({ isActive }) =>
                                `group relative flex items-center duration-300 ease-in-out gap-2.5 rounded-md dark:text-white  py-2 px-4 ${
                                  isActive ? 'bg-secondary text-white': 'text-black hover:bg-primary hover:text-white'
                                }`
                              }
                            >
                              {route.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </React.Fragment>
                )}
              </SidebarLinkGroup>
              {/* <!-- End Menu Item Dashboard --> */}

              {/* <!-- Menu Item Test Cases --> */}
              <li>
                <NavLink
                  to="/all-test-cases"
                  className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-black duration-300 ease-in-out 
                    ${pathname.includes('/all-test-cases') ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'} 
                    dark:text-white dark:hover:bg-primary`}        
                >
                   <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 2h-3.2C12.6 1.4 12 1 11.5 1h-3C8 1 7.4 1.4 7.2 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-3.2zM8.5 3h3c.3 0 .5.2.5.5s-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5zm10.5 18H4V4h3v1c0 .6.4 1 1 1h8c.6 0 1-.4 1-1V4h3v16z"
                      fill=""
                    />
                    <path
                      d="M10 14.5l-2-2-1.4 1.4L10 17l6-6-1.4-1.4-4.6 4.6z"
                      fill=""
                    />
                  </svg>
                  All Test Cases
                </NavLink>
              </li>
              {/* <!-- Menu Item Test Cases --> */}

                            {/* <!-- Menu Item Applications --> */}
                            <li>
                <NavLink
                  to="/all-applications"
                  className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-black duration-300 ease-in-out 
                    ${pathname.includes('/all-applications') ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'} 
                    dark:text-white dark:hover:bg-primary`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                      fill=""
                    />
                  </svg>
                  All Applications
                </NavLink>
              </li>
              {/* <!-- Menu Item Applications --> */}

              {/* <!-- Menu Item History --> */}
              <li>
                <NavLink
                  to="/all-history"
                  className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-black duration-300 ease-in-out 
                    ${pathname.includes('/all-history') ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'} 
                    dark:text-white dark:hover:bg-primary`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8V12L15 15L16.5 13.5L14 11V8H12ZM12 2C6.48 2 2 6.48 2 12H0L4 16L8 12H6C6 7.58 9.58 4 14 4C18.42 4 22 7.58 22 12C22 16.42 18.42 20 14 20C10.69 20 7.83 18.36 6.35 15.9L4.9 17.35C6.73 20.08 9.97 22 14 22C19.52 22 24 17.52 24 12C24 6.48 19.52 2 14 2H12Z"
                      fill=""
                    />
                  </svg>
                  All History
                </NavLink>
              </li>
              {/* <!-- Menu Item History --> */}

              {/* <!-- No-Code Test Case Creation --> */}
              <li>
                <NavLink
                  to="/no-code"
                  className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-black duration-300 ease-in-out 
                    ${pathname.includes('no-code') || pathname === '/no-code' ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'} 
                    dark:text-white dark:hover:bg-primary`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    width="18"
                    height="24"
                    className="stroke-current"
                    stroke-width="10"
                    fill="none"
                  >
                    <circle cx="50" cy="50" r="45" />
                    <line x1="20" y1="80" x2="80" y2="20" />
                  </svg>
                  No-Code TC Creation
                </NavLink>
              </li>
              {/* <!-- No-Code Test Case Creation --> */}

              {/* <!-- Menu Item Help --> */}
              <li>
              <NavLink
              to="/help"
              className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-black duration-300 ease-in-out 
                ${pathname.includes('/help') ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'} 
                dark:text-white dark:hover:bg-primary`}        
              >
              <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor" fontFamily="Arial, sans-serif">?</text>
              </svg>
              Help
              </NavLink>
              </li>
              {/* <!-- Menu Item Help --> */}

                            {/* <!-- Menu Item Settings --> */}
                            <li>
                <NavLink
                  to="/settings"
                  className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-black duration-300 ease-in-out 
                    ${pathname.includes('settings') || pathname === '/settings' ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'} 
                    dark:text-white dark:hover:bg-primary`}        
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_130_9763)">
                      <path
                        d="M17.0721 7.30835C16.7909 6.99897 16.3971 6.83022 15.9752 6.83022H15.8909C15.7502 6.83022 15.6377 6.74585 15.6096 6.63335C15.5815 6.52085 15.5252 6.43647 15.4971 6.32397C15.4409 6.21147 15.4971 6.09897 15.5815 6.0146L15.6377 5.95835C15.9471 5.6771 16.1159 5.28335 16.1159 4.86147C16.1159 4.4396 15.9752 4.04585 15.6659 3.73647L14.569 2.61147C13.9784 1.99272 12.9659 1.9646 12.3471 2.58335L12.2627 2.6396C12.1784 2.72397 12.0377 2.7521 11.8971 2.69585C11.7846 2.6396 11.6721 2.58335 11.5315 2.55522C11.3909 2.49897 11.3065 2.38647 11.3065 2.27397V2.13335C11.3065 1.26147 10.6034 0.55835 9.73148 0.55835H8.15648C7.7346 0.55835 7.34085 0.7271 7.0596 1.00835C6.75023 1.31772 6.6096 1.71147 6.6096 2.10522V2.21772C6.6096 2.33022 6.52523 2.44272 6.41273 2.49897C6.35648 2.5271 6.32835 2.5271 6.2721 2.55522C6.1596 2.61147 6.01898 2.58335 5.9346 2.49897L5.87835 2.4146C5.5971 2.10522 5.20335 1.93647 4.78148 1.93647C4.3596 1.93647 3.96585 2.0771 3.65648 2.38647L2.53148 3.48335C1.91273 4.07397 1.8846 5.08647 2.50335 5.70522L2.5596 5.7896C2.64398 5.87397 2.6721 6.0146 2.61585 6.09897C2.5596 6.21147 2.53148 6.29585 2.47523 6.40835C2.41898 6.52085 2.3346 6.5771 2.19398 6.5771H2.1096C1.68773 6.5771 1.29398 6.71772 0.984604 7.0271C0.675229 7.30835 0.506479 7.7021 0.506479 8.12397L0.478354 9.69897C0.450229 10.5708 1.15335 11.274 2.02523 11.3021H2.1096C2.25023 11.3021 2.36273 11.3865 2.39085 11.499C2.4471 11.5833 2.50335 11.6677 2.53148 11.7802C2.5596 11.8927 2.53148 12.0052 2.4471 12.0896L2.39085 12.1458C2.08148 12.4271 1.91273 12.8208 1.91273 13.2427C1.91273 13.6646 2.05335 14.0583 2.36273 14.3677L3.4596 15.4927C4.05023 16.1115 5.06273 16.1396 5.68148 15.5208L5.76585 15.4646C5.85023 15.3802 5.99085 15.3521 6.13148 15.4083C6.24398 15.4646 6.35648 15.5208 6.4971 15.549C6.63773 15.6052 6.7221 15.7177 6.7221 15.8302V15.9427C6.7221 16.8146 7.42523 17.5177 8.2971 17.5177H9.8721C10.744 17.5177 11.4471 16.8146 11.4471 15.9427V15.8302C11.4471 15.7177 11.5315 15.6052 11.644 15.549C11.7002 15.5208 11.7284 15.5208 11.7846 15.4927C11.9252 15.4365 12.0377 15.4646 12.1221 15.549L12.1784 15.6333C12.4596 15.9427 12.8534 16.1115 13.2752 16.1115C13.6971 16.1115 14.0909 15.9708 14.4002 15.6615L15.5252 14.5646C16.144 13.974 16.1721 12.9615 15.5534 12.3427L15.4971 12.2583C15.4127 12.174 15.3846 12.0333 15.4409 11.949C15.4971 11.8365 15.5252 11.7521 15.5815 11.6396C15.6377 11.5271 15.7502 11.4708 15.8627 11.4708H15.9471H15.9752C16.819 11.4708 17.5221 10.7958 17.5502 9.92397L17.5784 8.34897C17.5221 8.01147 17.3534 7.5896 17.0721 7.30835ZM16.2284 9.9521C16.2284 10.1208 16.0877 10.2615 15.919 10.2615H15.8346H15.8065C15.1596 10.2615 14.569 10.6552 14.344 11.2177C14.3159 11.3021 14.2596 11.3865 14.2315 11.4708C13.9784 12.0333 14.0909 12.7365 14.5409 13.1865L14.5971 13.2708C14.7096 13.3833 14.7096 13.5802 14.5971 13.6927L13.4721 14.7896C13.3877 14.874 13.3034 14.874 13.2471 14.874C13.1909 14.874 13.1065 14.874 13.0221 14.7896L12.9659 14.7052C12.5159 14.2271 11.8409 14.0865 11.2221 14.3677L11.1096 14.424C10.4909 14.6771 10.0971 15.2396 10.0971 15.8865V15.999C10.0971 16.1677 9.95648 16.3083 9.78773 16.3083H8.21273C8.04398 16.3083 7.90335 16.1677 7.90335 15.999V15.8865C7.90335 15.2396 7.5096 14.649 6.89085 14.424C6.80648 14.3958 6.69398 14.3396 6.6096 14.3115C6.3846 14.199 6.1596 14.1708 5.9346 14.1708C5.54085 14.1708 5.1471 14.3115 4.83773 14.6208L4.78148 14.649C4.66898 14.7615 4.4721 14.7615 4.3596 14.649L3.26273 13.524C3.17835 13.4396 3.17835 13.3552 3.17835 13.299C3.17835 13.2427 3.17835 13.1583 3.26273 13.074L3.31898 13.0177C3.7971 12.5677 3.93773 11.8646 3.6846 11.3021C3.65648 11.2177 3.62835 11.1333 3.5721 11.049C3.3471 10.4583 2.7846 10.0365 2.13773 10.0365H2.05335C1.8846 10.0365 1.74398 9.89585 1.74398 9.7271L1.7721 8.1521C1.7721 8.0396 1.82835 7.98335 1.85648 7.9271C1.8846 7.89897 1.96898 7.84272 2.08148 7.84272H2.16585C2.81273 7.87085 3.40335 7.4771 3.65648 6.88647C3.6846 6.8021 3.74085 6.71772 3.76898 6.63335C4.0221 6.07085 3.9096 5.36772 3.4596 4.91772L3.40335 4.83335C3.29085 4.72085 3.29085 4.52397 3.40335 4.41147L4.52835 3.3146C4.61273 3.23022 4.6971 3.23022 4.75335 3.23022C4.8096 3.23022 4.89398 3.23022 4.97835 3.3146L5.0346 3.39897C5.4846 3.8771 6.1596 4.01772 6.77835 3.7646L6.89085 3.70835C7.5096 3.45522 7.90335 2.89272 7.90335 2.24585V2.13335C7.90335 2.02085 7.9596 1.9646 7.98773 1.90835C8.01585 1.8521 8.10023 1.82397 8.21273 1.82397H9.78773C9.95648 1.82397 10.0971 1.9646 10.0971 2.13335V2.24585C10.0971 2.89272 10.4909 3.48335 11.1096 3.70835C11.194 3.73647 11.3065 3.79272 11.3909 3.82085C11.9815 4.1021 12.6846 3.9896 13.1627 3.5396L13.2471 3.48335C13.3596 3.37085 13.5565 3.37085 13.669 3.48335L14.7659 4.60835C14.8502 4.69272 14.8502 4.7771 14.8502 4.83335C14.8502 4.8896 14.8221 4.97397 14.7659 5.05835L14.7096 5.1146C14.2034 5.53647 14.0627 6.2396 14.2877 6.8021C14.3159 6.88647 14.344 6.97085 14.4002 7.05522C14.6252 7.64585 15.1877 8.06772 15.8346 8.06772H15.919C16.0315 8.06772 16.0877 8.12397 16.144 8.1521C16.2002 8.18022 16.2284 8.2646 16.2284 8.3771V9.9521Z"
                        fill=""
                      />
                      <path
                        d="M9.00029 5.22705C6.89092 5.22705 5.17529 6.94268 5.17529 9.05205C5.17529 11.1614 6.89092 12.8771 9.00029 12.8771C11.1097 12.8771 12.8253 11.1614 12.8253 9.05205C12.8253 6.94268 11.1097 5.22705 9.00029 5.22705ZM9.00029 11.6114C7.59404 11.6114 6.44092 10.4583 6.44092 9.05205C6.44092 7.6458 7.59404 6.49268 9.00029 6.49268C10.4065 6.49268 11.5597 7.6458 11.5597 9.05205C11.5597 10.4583 10.4065 11.6114 9.00029 11.6114Z"
                        fill=""
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_130_9763">
                        <rect
                          width="18"
                          height="18"
                          fill="white"
                          transform="translate(0 0.052124)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  Settings
                </NavLink>
              </li>
              {/* <!-- Menu Item Settings --> */}

              {/* <!-- Menu Item Credits --> */}
              <li>
            <NavLink
              to="/credits"
              className={`group relative flex items-center gap-2.5 rounded-md py-2 px-4 font-medium text-black duration-300 ease-in-out 
                ${pathname.includes('/credits') ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'} 
                dark:text-white dark:hover:bg-primary`}
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor" fontFamily="Arial, sans-serif">C</text>
              </svg>
              Credits
            </NavLink>
          </li>
          {/* <!-- Menu Item Credits --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>

      {/* Footer Section */}
      {/* <!-- Menu Group Others--> */}
      <div className="mt-auto flex flex-col items-start p-4">
        <img src={OCBCLogo} alt="Company Logo" className="max-w-25 py-2" />
        <p className="text-title-xs font-bold">OCBC Group</p>
        <p className="text-title-xxs text-gray-500 leading-tight dark:text-gray-300">© Copyright 2004 – 2024 – OCBC Bank. All Rights Reserved. </p>
      </div>
    </aside>
  );
};

export default Sidebar;
