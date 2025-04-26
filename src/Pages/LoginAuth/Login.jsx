import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminBaseURL } from "../../config/config";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { adminDataStore } from "../../reducers/adminSlice";

export default function Login() {
  let [loginRedirectStatus, setLoginRedirectStatus] = useState(false);
  let [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  let handleLogin = (event) => {
    event.preventDefault();
    let authData = {
      uemail: event.target.uemail.value,
      upassword: event.target.upassword.value,
    };
    axios.post(AdminBaseURL + "/auth/login", authData).then((res) => {
      if (res.data.status) {
        dispatch(adminDataStore(res.data.data));
        setLoginRedirectStatus(true);
      } else {
        toast.error(res.data.message);
      }
    });
  };
  let navigator = useNavigate();
  useEffect(() => {
    if (loginRedirectStatus) {
      navigator("/home");
    }
  }, [loginRedirectStatus]);
  return (
    <section className="bg-gray-50 font-urbanist">
      <Toaster />

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        >
          {/* <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          /> */}
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
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Frank and Oak
          </span>
        </a>
        <div className="w-[500px] bg-white rounded-lg shadow-2xl">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  for="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="uemail"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div className="relative">
                <label
                  for="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="upassword"
                  id="password"
                  placeholder="xxxxxx"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
                <div className="z-[99999] absolute right-4 top-[60%]">
                  {showPassword ? (
                    <svg
                      onClick={() => setShowPassword(false)}
                      class="cursor-pointer w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M12 5c7 0 10 7 10 7s-3 7-10 7-10-7-10-7 3-7 10-7z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  ) : (
                    <svg
                      onClick={() => setShowPassword(true)}
                      class="cursor-pointer w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M12 5c7 0 10 7 10 7s-3 7-10 7-10-7-10-7 3-7 10-7z"></path>
                      <path
                        d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
                        fill="none"
                      ></path>
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        fill="currentColor"
                      ></circle>
                      <line
                        x1="2"
                        y1="2"
                        x2="22"
                        y2="22"
                        stroke="currentColor"
                      ></line>
                    </svg>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between"></div>

              <button
                type="submit"
                className="w-full text-white  bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
