import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import axios from "axios";
import { AdminBaseURL } from "../../config/config";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default function AddSubCategory() {
  let { id } = useParams();
  let [parentCatData, setParentCatData] = useState([]);
  let [controlledForm, setControlledForm] = useState({
    subCategoryName: "",
    parentCategoryId: "",
    subcatDescription: "",
    subCategoryStatus: 1,
  });
  let [preview, setPreview] = useState("/assets/no-img.png");
  let [navigatorStatus, setNavigatorStatus] = useState(false);
  useEffect(() => {
    axios.get(AdminBaseURL + "/sub-category/parent-category").then((res) => {
      if (res.data.status) {
        setParentCatData(res.data.datalist);
      }
    });
  }, []);

  let insertData = (event) => {
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
              .put(
                AdminBaseURL + `/sub-category/updaterow/${id}`,
                formDataValue
              )
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
      axios
        .post(AdminBaseURL + "/sub-category/insert", formDataValue)
        .then((res) => {
          if (res.data.status) {
            toast.success(
              `${res.data.res.subCategoryName} sub category added.`
            );
            setNavigatorStatus(true);
            event.target.reset();
          } else {
            if (res.data.error.code == 11000) {
              toast.error("Same sub category already exists !");
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
    setPreview("/assets/no-img.png");
    setControlledForm({
      subCategoryName: "",
      parentCategoryId: "",
      subcatDescription: "",
      subCategoryStatus: 1,
    });
    axios
      .get(AdminBaseURL + `/sub-category/editrow/${id}`)
      .then((res) => res.data)
      .then((finalData) => {
        setPreview(finalData.path + finalData.res.subCategoryImage);
        setControlledForm({
          subCategoryName: finalData.res.subCategoryName,
          parentCategoryId: finalData.res.parentCategoryId,
          subcatDescription: finalData.res.subcatDescription,
          subCategoryStatus: finalData.res.subCategoryStatus,
        });
      });
  }, [id]);
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
        navigator("/sub-category/view-sub-category");
      }, 2000);
    }
  }, [navigatorStatus]);

  return (
    <section className="w-full">
      <Breadcrumb
        path={"Sub Category"}
        path2={"Add Sub Category"}
        slash={"/"}
      />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1350px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            Add Sub Category
          </h3>
          <form
            onSubmit={insertData}
            className="border border-t-0 p-3 rounded-b-md border-slate-400"
          >
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Category Name
              </label>
              <input
                type="text"
                name="subCategoryName"
                value={controlledForm.subCategoryName}
                onChange={getsetValue}
                id="base-input"
                className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                placeholder="Category Name"
                required
              />
            </div>
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Parent Category Name
              </label>

              <select
                id="default"
                name="parentCategoryId"
                value={controlledForm.parentCategoryId}
                onChange={getsetValue}
                className=" border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              >
                <option selected>--Select Category--</option>
                {parentCatData.map((item, index) => {
                  return (
                    <option required key={index} value={item._id}>
                      {item.categoryName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-5">
              <div className="grid grid-cols-[60%_auto] gap-10 items-start">
                <div>
                  <label
                    for="base-input"
                    className="block mb-5 text-md font-medium text-gray-900"
                  >
                    Category Image
                  </label>
                  <div className="max-w-full">
                    <label for="file-input" className="sr-only">
                      Choose file
                    </label>
                    <input
                      type="file"
                      onChange={imagePreview}
                      name="subCategoryImage"
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
                    className="w-[120px] shadow-lg border object-cover object-top"
                    src={preview}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Category Description
              </label>
              <textarea
                id="message"
                required
                name="subcatDescription"
                value={controlledForm.subcatDescription}
                onChange={getsetValue}
                rows="3"
                className=" resize-none block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Add Product Description....."
              ></textarea>
            </div>
            <div className="pe-5 ps-1">
              <span className="flex items-center gap-3">
                Status :
                <input
                  id="link-radio"
                  required
                  name="subCategoryStatus"
                  type="radio"
                  value={1}
                  onChange={getsetValue}
                  checked={controlledForm.subCategoryStatus == 1}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                ></input>
                Active
                <input
                  id="link-radio"
                  required
                  name="subCategoryStatus"
                  type="radio"
                  value={0}
                  onChange={getsetValue}
                  checked={controlledForm.subCategoryStatus == 0}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                ></input>
                Deactive
              </span>
            </div>
            <button
              type="submit"
              className="focus:outline-none my-10 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              {id !== undefined ? "Update" : "Add"} Sub Category
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
