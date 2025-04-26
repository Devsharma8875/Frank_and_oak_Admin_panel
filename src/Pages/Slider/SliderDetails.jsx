import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import axios from "axios";
import { AdminBaseURL } from "../../config/config";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default function SliderDetails() {
  let { id } = useParams();
  let [navigatorStatus, setNavigatorStatus] = useState(false);
  let [controlledForm, setControlledForm] = useState({
    sliderName: "",
    sliderHeading: "",
    sliderSubHeading: "",
    sliderStatus: 1,
  });
  let [preview, setPreview] = useState("/assets/no-img.png");
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
              .put(AdminBaseURL + `/slider/updaterow/${id}`, formDataValue)
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
      axios.post(AdminBaseURL + "/slider/insert", formDataValue).then((res) => {
        if (res.data.status == 1) {
          toast.success(`${res.data.res.sliderName} slider added .`);
          event.target.reset();
          setNavigatorStatus(true);
        } else {
          if (res.data.error.code == 11000) {
            toast.error("Same slider already exists !");
          }
        }
      });
    }
  };

  let imagePreview = (event) => {
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
      setPreview(previewImage);
    } else {
      setPreview("/assets/no-img.png");
      toast.error(
        "Please select a valid image file (PNG, JPG, JPEG, WEBP, SVG)."
      );
    }
  };

  let navigator = useNavigate();
  useEffect(() => {
    if (navigatorStatus) {
      setTimeout(() => {
        navigator("/slider/slider-view");
      }, 2000);
    }
  }, [navigatorStatus]);

  let getsetValue = (event) => {
    let oldData = { ...controlledForm };
    let inputName = event.target.name;
    let inputValue = event.target.value;
    oldData[inputName] = inputValue;
    setControlledForm(oldData);
  };
  useEffect(() => {
    setPreview("/assets/no-img.png");
    setControlledForm({
      sliderName: "",
      sliderHeading: "",
      sliderSubHeading: "",
      sliderStatus: 1,
    });
    axios
      .get(AdminBaseURL + `/slider/editrow/${id}`)
      .then((res) => res.data)
      .then((finalData) => {
        if (finalData.status === 1) {
          setPreview(finalData.path + finalData.res.sliderImage);
          setControlledForm({
            sliderName: finalData.res.sliderName,
            sliderHeading: finalData.res.sliderHeading,
            sliderSubHeading: finalData.res.sliderSubHeading,
            sliderStatus: finalData.res.sliderStatus,
          });
        }
      });
  }, [id]);
  return (
    <section className="w-full">
      <Breadcrumb path={"Slider"} path2={"Slider Details"} slash={"/"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1350px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            Add Slider
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
                Slider Name
              </label>
              <input
                type="text"
                name="sliderName"
                onChange={getsetValue}
                value={controlledForm.sliderName}
                id="base-input"
                className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                placeholder="Slider Name"
                required
              />
            </div>
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Heading
              </label>
              <input
                type="text"
                name="sliderHeading"
                onChange={getsetValue}
                value={controlledForm.sliderHeading}
                id="base-input"
                className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                placeholder="Heading"
                required
              />
            </div>
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Sub Heading
              </label>
              <input
                type="text"
                name="sliderSubHeading"
                onChange={getsetValue}
                value={controlledForm.sliderSubHeading}
                id="base-input"
                className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                placeholder="Sub Heading"
                required
              />
            </div>
            <div className="grid grid-cols-[60%_auto] gap-10">
              <div className="mb-5">
                <label
                  for="base-input"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Slider Images
                </label>
                <div className="max-w-full">
                  <label for="file-input" className="sr-only">
                    Choose file
                  </label>
                  <input
                    type="file"
                    onChange={imagePreview}
                    name="sliderImage"
                    id="file-input"
                    className="block w-full border-2 border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  
  file:bg-gray-50 file:border-0
  file:me-4
  file:py-3 file:px-4
  "
                  />
                </div>
              </div>
              <div>
                <img
                  className="w-[120px] shadow-lg border object-cover object-top"
                  src={preview}
                  alt=""
                />
              </div>
            </div>
            <div className="pe-5 ps-1">
              <span className="flex items-center gap-3">
                Status :
                <input
                  id="link-radio"
                  name="sliderStatus"
                  onChange={getsetValue}
                  type="radio"
                  value={1}
                  checked={controlledForm.sliderStatus == 1 ? true : ""}
                  required
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                ></input>
                Display
                <input
                  id="link-radio"
                  name="sliderStatus"
                  type="radio"
                  onChange={getsetValue}
                  value={0}
                  checked={controlledForm.sliderStatus == 0 ? true : ""}
                  required
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                ></input>
                No Display
              </span>
            </div>
            <button
              type="submit"
              className="focus:outline-none my-10 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              {id !== undefined ? "Update" : "Add"} Slider
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
