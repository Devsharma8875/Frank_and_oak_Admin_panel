import React, { useState } from "react";
import { Link } from "react-router-dom";
import { navList } from "./NavList";
import { useDispatch } from "react-redux";
import { logOut } from "../reducers/adminSlice";

export default function Sidebar() {
  const [sidebar, setSidebar] = useState(null);
  const dispatch = useDispatch();

  const toggleMenu = (index) => {
    setSidebar(sidebar === index ? null : index);
  };

  return (
    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 scrollbar-hide">
      <Link to="/home">
        <div className="flex items-center ps-2.5 mb-5 border-b border-slate-400 pb-7">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="25"
            viewBox="0 0 23 24"
            fill="none"
          >
            <g clip-path="url(#clip0_2406_20469)">
              <path
                d="M18.9397 16.0898C18.9397 15.7398 18.8797 15.3898 18.7697 15.0498C18.7397 14.9398 18.6997 14.8298 18.6497 14.7298C18.3397 13.9998 17.7997 13.3998 17.1097 13.0298C16.9097 12.9298 16.7097 12.8398 16.4897 12.7798C16.2697 12.7098 16.0497 12.6698 15.8197 12.6498C15.5897 12.6298 15.3497 12.6298 15.1197 12.6498C14.8897 12.6798 14.6697 12.7198 14.4597 12.7998C14.3497 12.8398 14.2497 12.8798 14.1497 12.9198C13.7097 13.1098 13.3197 13.3998 12.9997 13.7598C12.6797 14.1198 12.4297 14.5398 12.2797 15.0098C12.1297 15.4698 12.0697 15.9598 12.1097 16.4498C12.1497 16.9398 12.2897 17.4098 12.5297 17.8298C12.5497 17.8598 12.5697 17.8998 12.5897 17.9298C12.6497 18.0198 12.7097 18.1198 12.7697 18.1998C13.1997 18.7898 13.7997 19.2298 14.4897 19.4598C15.1797 19.6798 15.9197 19.6798 16.5997 19.4398C17.2797 19.2098 17.8797 18.7598 18.2997 18.1498C18.7197 17.5498 18.9397 16.8298 18.9297 16.0898V16.0698L18.9397 16.0898Z"
                fill="black"
              ></path>
              <path
                d="M8.08 3.31982L0 6.02982L5.66 23.6598C10.35 19.3498 11.28 11.8198 8.08 3.31982Z"
                fill="black"
              ></path>
              <path
                d="M21.8598 0.000234375L11.2598 0.150234C11.3498 6.14023 16.1598 10.9202 22.0198 10.8302L21.8698 -0.00976562L21.8598 0.000234375Z"
                fill="black"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_2406_20469">
                <rect width="22.02" height="23.66" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Frank and Oak
          </span>
        </div>
      </Link>

      <ul className="space-y-2 font-medium">
        {/* Dashboard Link */}
        <Link to="/dashboard">
          <li>
            <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              {/* Dashboard icon */}
              <span className="ms-3">Dashboard</span>
            </div>
          </li>
        </Link>

        {/* Profile Link */}
        <Link to="/profile">
          <li>
            <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              {/* Profile icon */}
              <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
            </div>
          </li>
        </Link>

        {/* Logout Button */}
        <li>
          <div
            onClick={() => dispatch(logOut())}
            className="flex items-center mb-5 p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            {/* Logout icon */}
            <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
          </div>
        </li>

        <h5 className="uppercase text-[13px] text-slate-400 ps-2">
          ecommerce components
        </h5>

        {/* Dynamic Navigation Items */}
        {navList.map((items, index) => {
          const { navName, icon, id, subMenu } = items;
          return (
            <li key={index}>
              <div
                onClick={() => toggleMenu(id)}
                className="flex items-center p-2 text-gray-900 cursor-pointer rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                {icon}
                <span className="flex-1 ms-3 whitespace-nowrap">{navName}</span>
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 font-medium">
                  {sidebar === id ? (
                    <svg
                      fill="currentColor"
                      className="w-3 h-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" />
                    </svg>
                  ) : (
                    <svg
                      fill="currentColor"
                      className="w-3 h-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                    </svg>
                  )}
                </span>
              </div>

              <ul className={sidebar === id ? "block" : "hidden"}>
                {subMenu.map((subItems, index) => (
                  <Link to={subItems.link} key={index}>
                    <li>
                      <button className="flex items-center p-2 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg
                          fill="currentColor"
                          className="w-3 h-3 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
                        </svg>
                        <span className="font-semibold ms-4 text-[14px] whitespace-nowrap">
                          {subItems.navName}
                        </span>
                      </button>
                    </li>
                  </Link>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
