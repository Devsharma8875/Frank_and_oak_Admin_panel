import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import axios from "axios";
import toast from "react-hot-toast";
import { AdminBaseURL } from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default function StoryDetails() {
  let { id } = useParams();
  let [navigatorStatus, setNavigatorStatus] = useState(false);
  let [controlledForm, setControlledForm] = useState({
    storyName: "",
    storyDescription: "",
    storyStatus: 1,
  });
  let [storyImagePreview, setStoryImagePreview] =
    useState("/assets/no-img.png");
  let [bannerImagePreview, setBannerImagePreview] =
    useState("/assets/no-img.png");
  let insertForm = (event) => {
    event.preventDefault();
    let formDataValue = new FormData(event.target);
    if (id !== undefined) {
      const swalWithBootstrapButtons = Swal.mixin({
        buttonsStyling: true,
      });
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You want to update the record.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, update it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
          confirmButtonColor: "#F90101",
          cancelButtonColor: "#0D0D0D",
        })
        .then((result) => {
          if (result.isConfirmed) {
            axios
              .put(AdminBaseURL + `/story/updaterow/${id}`, formDataValue)
              .then((res) => {
                if (res.data.status === 1) {
                  toast.success("Record Updated");
                  event.target.reset();
                  setNavigatorStatus(true);
                } else {
                  toast.error(`Unable to update record.`);
                }
              });
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire({
              title: "Cancelled",
              text: "Record not Updated",
              icon: "error",
            });
          }
        });
    } else {
      axios.post(AdminBaseURL + "/story/insert", formDataValue).then((res) => {
        if (res.data.status == 1) {
          toast.success(`${res.data.res.storyName} story added .`);
          event.target.reset();
          setNavigatorStatus(true);
        } else {
          if (res.data.error.code == 11000) {
            toast.error("Same Story already exists !");
          }
        }
      });
    }
  };

  let getsetValue = (event) => {
    let oldData = { ...controlledForm };
    oldData[event.target.name] = event.target.value;
    setControlledForm(oldData);
  };

  useEffect(() => {
    setControlledForm({
      storyName: "",
      storyDescription: "",
      storyStatus: 1,
    });
    setStoryImagePreview("/assets/no-img.png");
    setBannerImagePreview("/assets/no-img.png");
    axios
      .get(AdminBaseURL + `/story/editrow/${id}`)
      .then((res) => res.data)
      .then((finalData) => {
        setControlledForm({
          storyName: finalData.res.storyName,
          storyDescription: finalData.res.storyDescription,
          storyStatus: finalData.res.storyStatus,
        });
        setStoryImagePreview(finalData.path + finalData.res.storyImage);
        setBannerImagePreview(finalData.path + finalData.res.bannerImage);
      });
  }, [id]);

  let storyImgPreview = (event) => {
    const file = event.target.files[0];
    if (
      file.type == "image/webp" ||
      file.type == "image/png" ||
      file.type == "image/jpg" ||
      file.type == "image/jpeg" ||
      file.type == "image/svg" ||
      file.type == "image/svg+xml"
    ) {
      let previewImage = URL.createObjectURL(file);
      setStoryImagePreview(previewImage);
    } else {
      setStoryImagePreview("/assets/no-img.png");
      toast.error(
        "Please select a valid image file (PNG, JPG, JPEG, WEBP, SVG)."
      );
    }
  };

  let bannerImgPreview = (event) => {
    const file = event.target.files[0];
    if (
      file.type == "image/webp" ||
      file.type == "image/png" ||
      file.type == "image/jpg" ||
      file.type == "image/jpeg" ||
      file.type == "image/svg" ||
      file.type == "image/svg+xml"
    ) {
      let previewImage = URL.createObjectURL(file);
      setBannerImagePreview(previewImage);
    } else {
      setBannerImagePreview("/assets/no-img.png");
      toast.error(
        "Please select a valid image file (PNG, JPG, JPEG, WEBP, SVG)."
      );
    }
  };

  let navagior = useNavigate();
  useEffect(() => {
    if (navigatorStatus) {
      setTimeout(() => {
        navagior("/story/story-view");
      }, 2000);
    }
  }, [navigatorStatus]);
  return (
    <section className="w-full">
      <Breadcrumb path={"Story"} path2={"Story Details"} slash={"/"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1350px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            Our Story's
          </h3>
          <form
            onSubmit={insertForm}
            className="border border-t-0 p-3 rounded-b-md border-slate-400"
          >
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Story Name
              </label>
              <input
                type="text"
                name="storyName"
                onChange={getsetValue}
                value={controlledForm.storyName}
                id="base-input"
                className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                placeholder="Story Name"
                required
              />
            </div>
            <div className="grid grid-cols-[60%_auto] gap-10">
              <div className="mb-5">
                <label
                  for="base-input"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Image
                </label>
                <div className="max-w-full">
                  <label for="file-input" className="sr-only">
                    Choose file
                  </label>
                  <input
                    type="file"
                    name="storyImage"
                    onChange={storyImgPreview}
                    id="file-input"
                    className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  
    file:bg-gray-50 file:border-0
    file:me-4
    file:py-3 file:px-4
    "
                  />
                </div>
              </div>
              <div>
                <img
                  className="w-[120px] shadow-lg border object-cover object-top mb-10"
                  src={storyImagePreview}
                  alt=""
                />
              </div>
            </div>
            <div className="grid grid-cols-[60%_auto] gap-10">
              <div className="mb-5">
                <label
                  for="base-input"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Banner Image
                </label>
                <div className="max-w-full">
                  <label for="file-input" className="sr-only">
                    Choose file
                  </label>
                  <input
                    type="file"
                    onChange={bannerImgPreview}
                    name="bannerImage"
                    id="file-input"
                    className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  
    file:bg-gray-50 file:border-0
    file:me-4
    file:py-3 file:px-4
    "
                  />
                </div>
              </div>
              <div>
                <img
                  className="w-[120px] shadow-lg border object-cover object-top mb-10"
                  src={bannerImagePreview}
                  alt=""
                />
              </div>
            </div>
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Description
              </label>
              <textarea
                name="storyDescription"
                onChange={getsetValue}
                value={controlledForm.storyDescription}
                required
                id="message"
                rows="3"
                className=" resize-none block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Description....."
              ></textarea>
            </div>
            <div className="pe-5 ps-1">
              <span className="flex items-center gap-3">
                Status :
                <input
                  id="link-radio"
                  name="storyStatus"
                  onChange={getsetValue}
                  type="radio"
                  value={1}
                  checked={controlledForm.storyStatus == 1 ? true : ""}
                  required
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                ></input>
                Active
                <input
                  id="link-radio"
                  name="storyStatus"
                  onChange={getsetValue}
                  type="radio"
                  value={0}
                  checked={controlledForm.storyStatus == 0 ? true : ""}
                  required
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                ></input>
                Deactive
              </span>
            </div>
            <button
              type="submit"
              className="focus:outline-none my-10 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              {id !== undefined ? "Update" : "Add"} Story
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
