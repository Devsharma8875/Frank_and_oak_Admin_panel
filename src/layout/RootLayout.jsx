import React, { useState } from "react";
import Sidebar from "../common/Sidebar";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <section className="w-full font-urbanist">
      <div className={`${sidebarOpen ? "overflow-hidden h-screen" : ""}`}>
        <div className="grid grid-cols-1 md:grid-cols-[22.5%_auto]">
          {/* Sidebar */}
          <div
            className={`sidebar-transition fixed md:relative z-50 w-[280px] h-full bg-gray-50 dark:bg-gray-800 ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }`}
          >
            <Sidebar />
            {/* Close button for mobile */}
            <button
              className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Overlay for mobile when sidebar is open */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={toggleSidebar}
            />
          )}

          <div className="relative">
            <Header toggleSidebar={toggleSidebar} />
            <main className="min-h-[calc(100vh-130px)]">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </section>
  );
}
