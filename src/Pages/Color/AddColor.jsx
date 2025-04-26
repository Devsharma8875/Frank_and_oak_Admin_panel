import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import { ChromePicker } from "react-color";
import axios from "axios";
import { AdminBaseURL } from "../../config/config";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default function AddColor() {
  let { id } = useParams();
  let [currentColor, setCurrentColor] = useState("");
  let [navigatorStatus, setNavigatorStatus] = useState(false);
  let [controlledForm, setControlledForm] = useState({
    colorName: "",
    colorCode: "",
    colorStatus: 1,
  });
  let handleChange = (color) => {
    setCurrentColor(color.hex);
  };
  let insertForm = (event) => {
    event.preventDefault();
    let colorData = {
      colorName: event.target.colorName.value,
      colorCode: currentColor,
      colorStatus: event.target.colorStatus.value,
    };
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
              .put(AdminBaseURL + `/color/updaterow/${id}`, colorData)
              .then((res) => {
                if (res.data.status == 1) {
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
      axios.post(AdminBaseURL + "/color/insert", colorData).then((res) => {
        if (res.data.status == 1) {
          toast.success(`${res.data.res.colorName} color added .`);
          event.target.reset();
          setNavigatorStatus(true);
        } else {
          if (res.data.error.code == 11000) {
            toast.error("Same color already exists !");
          }
        }
      });
    }
  };
  let navigator = useNavigate();
  useEffect(() => {
    if (navigatorStatus) {
      setTimeout(() => {
        navigator("/colors/view-color");
      }, 2000);
    }
  }, [navigatorStatus]);

  let getsetValue = (event, isColorPicker = false) => {
    let oldData = { ...controlledForm };
    if (isColorPicker) {
      oldData["colorCode"] = event.hex;
    } else {
      let inputName = event.target.name;
      let inputValue = event.target.value;
      oldData[inputName] = inputValue;
    }
    setControlledForm(oldData);
  };
  useEffect(() => {
    setControlledForm({
      colorName: "",
      colorCode: "",
      colorStatus: 1,
    });
    if (id !== undefined) {
      axios
        .get(AdminBaseURL + `/color/editrow/${id}`)
        .then((res) => res.data)
        .then((finalData) => {
          if (finalData.status === 1) {
            setControlledForm({
              colorName: finalData.res.colorName,
              colorCode: finalData.res.colorCode,
              colorStatus: finalData.res.colorStatus,
            });
          }
        });
    }
  }, [id]);
  useEffect(() => {}, [controlledForm]);
  return (
    <>
      <Breadcrumb path={"Colors"} path2={"Add Color"} slash={"/"} />
      <div className="w-full">
        <div className="max-w-[1350px] mx-auto py-5">
          <h3 className="text-[20px] font-semibold bg-slate-100 py-2 px-3 rounded-t-md border border-slate-400">
            Add colors
          </h3>
          <form
            onSubmit={insertForm}
            className="p-3 border border-t-0 rounded-b-md border-slate-400"
          >
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Color Name
              </label>
              <input
                type="text"
                name="colorName"
                onChange={getsetValue}
                value={controlledForm.colorName}
                required
                id="base-input"
                className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                placeholder="Color Name"
              />
            </div>
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-8 text-md font-medium text-gray-900"
              >
                Color Picker
              </label>
              <ChromePicker
                name="colorCode"
                required
                color={currentColor}
                onChange={(color) => getsetValue(color, true)}
                onChangeComplete={handleChange}
              />
              {id != undefined ? (
                <div className="pt-5 ps-2 flex items-center gap-3">
                  <span className="font-semibold">Color code : </span>{" "}
                  <div
                    style={{ backgroundColor: controlledForm.colorCode }}
                    className="h-5 w-5 rounded-full"
                  ></div>{" "}
                  {controlledForm.colorCode}
                </div>
              ) : (
                ""
              )}
              <br />
            </div>
            <div className="pe-5 ps-1">
              <span className="flex items-center gap-3">
                Status :
                <input
                  id="link-radio"
                  name="colorStatus"
                  type="radio"
                  value={1}
                  onChange={getsetValue}
                  checked={controlledForm.colorStatus == 1 ? true : ""}
                  required
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                ></input>
                Active
                <input
                  id="link-radio"
                  name="colorStatus"
                  type="radio"
                  value={0}
                  onChange={getsetValue}
                  checked={controlledForm.colorStatus == 0 ? true : ""}
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
              {id !== undefined ? "Update" : "Select"} Color
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
