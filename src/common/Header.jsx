import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { AdminBaseURL } from "../config/config";
import { useNavigate } from "react-router-dom";
import HeadDropDown from "./HeadDropDown";

export default function Header({ toggleSidebar }) {
  const adminData = useSelector((state) => state.adminReducer.adminInfo);
  const navigate = useNavigate();
  const [path, setPath] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (!adminData._id) {
      navigate("/");
    }
  }, [adminData, navigate]);

  useEffect(() => {
    axios
      .get(AdminBaseURL + "/profile/view")
      .then((res) => {
        setPath(res.data.path);
        setProfileImage(res.data.data.profileImage);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  return (
    <header className="border-b-2">
      <Toaster position="top-center" reverseOrder={false} />
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="mr-3 lg:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <span className="self-center text-xl text-slate-500 font-semibold whitespace-nowrap">
              Dashboard
            </span>
          </div>

          <div className="flex items-center">
            <figure className="relative group w-12 h-12 cursor-pointer rounded-full">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={path + profileImage}
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <HeadDropDown />
            </figure>
          </div>
        </div>
      </nav>
    </header>
  );
}
