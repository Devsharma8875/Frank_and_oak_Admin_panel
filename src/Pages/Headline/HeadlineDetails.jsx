import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import { AdminBaseURL } from "../../config/config";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default function HeadlineDetails() {
  let { id } = useParams();
  let [navigatorStatus, setNavigatorStatus] = useState(false);
  let [controlledForm, setControlledForm] = useState({
    headlineName: "",
    headlineStatus: 1,
  });
  let insertForm = (event) => {
    event.preventDefault();
    let formDataValue = {
      headlineName: event.target.headlineName.value,
      headlineStatus: event.target.headlineStatus.value,
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
              .put(AdminBaseURL + `/headline/updaterow/${id}`, formDataValue)
              .then((res) => {
                if (res.data.status === 1) {
                  toast.success(`Record Updated`);
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
      axios
        .post(AdminBaseURL + "/headline/insert", formDataValue)
        .then((response) => {
          if (response.data.status == 1) {
            toast.success(`${response.data.res.headlineName} Headline added .`);
            event.target.reset();
            setNavigatorStatus(true);
          } else {
            if (response.data.error.code == 11000) {
              toast.error("Headline already exists !");
            }
          }
        });
    }
  };
  let navigator = useNavigate();
  useEffect(() => {
    if (navigatorStatus) {
      setTimeout(() => {
        navigator("/headline/view-headline");
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
    setControlledForm({
      headlineName: "",
      headlineStatus: 1,
    });
    axios
      .get(AdminBaseURL + `/headline/editrow/${id}`)
      .then((res) => res.data)
      .then((finalData) => {
        if (finalData.status === 1) {
          setControlledForm({
            headlineName: finalData.res.headlineName,
            headlineStatus: finalData.res.headlineStatus,
          });
        }
      });
  }, [id]);
  return (
    <>
      <Breadcrumb path={"Headline"} path2={"Headline Details"} slash={"/"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1350px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            Add Headline
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
                Headline Name
              </label>
              <input
                type="text"
                onChange={getsetValue}
                value={controlledForm.headlineName}
                name="headlineName"
                id="base-input"
                className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                placeholder="Side Name"
                required
              />
            </div>
            <div className="pe-5 ps-1">
              <span className="flex items-center gap-3">
                Status :
                <input
                  id="link-radio"
                  name="headlineStatus"
                  onChange={getsetValue}
                  type="radio"
                  value={1}
                  checked={controlledForm.headlineStatus == 1 ? true : ""}
                  required
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                ></input>
                Active
                <input
                  id="link-radio"
                  name="headlineStatus"
                  type="radio"
                  onChange={getsetValue}
                  value={0}
                  checked={controlledForm.headlineStatus == 0 ? true : ""}
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
              {id !== undefined ? "Update" : "Add"} Headline
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
