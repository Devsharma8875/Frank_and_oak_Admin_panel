import React, { useEffect, useState } from "react";
import Breadcrumb from "../common/Breadcrumb";
import axios from "axios";
import { AdminBaseURL } from "../config/config";
import toast from "react-hot-toast";

export default function Profile() {
  let [id, setId] = useState("");
  let [profileData, setProfileData] = useState({});
  let [path, setPath] = useState("");
  let [logoImage, setLogoImage] = useState("");
  let [subLogoImage, setsubLogoImage] = useState("");
  let [profileImage, setProfileImage] = useState("");
  let getProfileData = () => {
    axios.get(AdminBaseURL + "/profile/view").then((res) => {
      setProfileData(res.data.data);
      setId(res.data.data._id);
      setPath(res.data.path);
      setLogoImage(res.data.data.logoImage);
      setsubLogoImage(res.data.data.subLogoImage);
      setProfileImage(res.data.data.profileImage);
    });
  };
  useEffect(() => {
    axios.post(AdminBaseURL + "/profile/insert").then((res) => {
      getProfileData();
    });
  }, []);

  let submitProfileForm = (event) => {
    event.preventDefault();
    let formDataValue = new FormData(event.target);
    axios
      .put(AdminBaseURL + `/profile/update/${id}`, formDataValue)
      .then((res) => {
        getProfileData();
        toast.success("Profile Updated.");
      })
      .catch((error) => {
        toast.error("Server error occurred.");
      });
  };
  return (
    <>
      <Breadcrumb path={"Profile"} />
      <div className="w-full">
        <div className="max-w-[1350px] mx-auto py-5">
          <h3 className="text-[20px] font-semibold bg-slate-100 py-2 px-3 rounded-t-md border border-slate-400">
            Profile
          </h3>
          <form
            onSubmit={submitProfileForm}
            className="p-3 border border-t-0 rounded-b-md border-slate-400"
          >
            <div className="grid grid-cols-2">
              <div>
                <div className="mb-5">
                  <label
                    htmlFor="base-input"
                    className="block mb-5 text-md font-medium text-gray-900"
                  >
                    Name
                  </label>
                  <input
                    name="userName"
                    type="text"
                    defaultValue={profileData.userName}
                    id="base-input"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="base-input2"
                    className="block mb-5 text-md font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    name="userEmail"
                    type="email"
                    defaultValue={profileData.userEmail}
                    id="base-input2"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="base-input3"
                    className="block mb-5 text-md font-medium text-gray-900"
                  >
                    Phone
                  </label>
                  <input
                    name="userPhone"
                    defaultValue={profileData.userPhone}
                    type="tel"
                    id="base-input3"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                    placeholder="Enter your phone"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="base-input4"
                    className="block mb-5 text-md font-medium text-gray-900"
                  >
                    Address
                  </label>
                  <textarea
                    defaultValue={profileData.userAddress}
                    name="userAddress"
                    id="base-input4"
                    rows={4}
                    className="resize-none text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                    placeholder="Enter your address"
                  ></textarea>
                </div>
                <br />
                <div>
                  <label
                    htmlFor="base-input"
                    className="block mb-5 text-md font-medium text-gray-900"
                  >
                    Social Links
                  </label>
                  <div className="space-y-9">
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm  ">
                        <svg
                          fill="black"
                          className="w-5 h-5 me-1 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 320 512"
                        >
                          <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                        </svg>
                      </span>
                      <input
                        name="facebookLink"
                        type="text"
                        id="fb-link"
                        defaultValue={profileData.facebookLink}
                        className="rounded-lg border-2 text-black font-semibold shadow-sm  focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                        placeholder="Enter Facebook Account Link"
                      />
                    </div>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm  ">
                        <svg
                          fill="black"
                          className="w-5 h-5 me-1 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="instagramLink"
                        defaultValue={profileData.instagramLink}
                        id="ig-link"
                        className="rounded-lg border-2 text-black font-semibold shadow-sm  focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                        placeholder="Enter Instagram Account Link"
                      />
                    </div>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm  ">
                        <svg
                          fill="black"
                          className="w-5 h-5 me-1 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                        >
                          <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="youtubeLink"
                        defaultValue={profileData.youtubeLink}
                        id="yt-link"
                        className="rounded-lg border-2 text-black font-semibold shadow-sm  focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                        placeholder="Enter Youtube Account Link"
                      />
                    </div>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm  ">
                        <svg
                          fill="black"
                          className="w-5 h-5 me-1 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="xLink"
                        defaultValue={profileData.xLink}
                        id="x-link"
                        className="rounded-lg border-2 text-black font-semibold shadow-sm  focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                        placeholder="Enter X Account Link"
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="base-input"
                      className="block my-8 text-md font-medium text-gray-900"
                    >
                      Logo
                    </label>
                  </div>
                  <div className="grid grid-cols-[60%_auto] items-center gap-10">
                    <div className="max-w-full">
                      <label for="file-input" className="sr-only">
                        Choose file
                      </label>
                      <input
                        type="file"
                        name="logoImage"
                        id="file-input"
                        className="block w-full border-2 border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  
  file:bg-gray-50 file:border-0
  file:me-4
  file:py-3 file:px-4
  "
                      />
                    </div>
                    <div>
                      <img
                        className="w-20 border-black border-2 shadow-md rounded-md"
                        src={path + logoImage}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="base-input"
                      className="block my-8 text-md font-medium text-gray-900"
                    >
                      Sub Logo
                    </label>
                  </div>
                  <div className="grid grid-cols-[60%_auto] items-center gap-10">
                    <div className="max-w-full">
                      <label for="file-input" className="sr-only">
                        Choose file
                      </label>
                      <input
                        type="file"
                        name="subLogoImage"
                        id="file-input"
                        className="block w-full border-2 border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  
  file:bg-gray-50 file:border-0
  file:me-4
  file:py-3 file:px-4
  "
                      />
                    </div>
                    <div>
                      <img
                        className="w-20 border-black border-2 shadow-md rounded-md"
                        src={path + subLogoImage}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-16 flex items-center justify-start flex-col">
                <figure>
                  <img
                    className="rounded-full w-40 h-40 border-2 object-cover shadow-lg"
                    src={path + profileImage}
                    alt=""
                  />
                </figure>
                <div className="w-[100px] pt-4">
                  <label for="file-input" className="sr-only">
                    Choose file
                  </label>
                  <input
                    type="file"
                    name="profileImage"
                    id="file-input"
                    className="block w-full border-2 border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  
  file:bg-gray-50 file:border-0
  file:me-4
  file:py-3 file:px-4
  "
                  />
                </div>
                <h5 className="mt-3 text-[20px]">Profile Image</h5>
              </div>
            </div>
            <button
              type="submit"
              className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 my-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
