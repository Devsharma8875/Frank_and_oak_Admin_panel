import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import axios from "axios";
import { AdminBaseURL } from "../../config/config";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";

export default function CouponDetails() {
  let { id } = useParams();
  let [controlledForm, setControlledForm] = useState({
    couponName: "",
    couponCode: "",
    couponStatus: 1,
    discountType: "percentage", // Default to percentage discount
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    expiryDate: "",
    usageLimit: "",
  });

  let [navigatorStatus, setNavigatorStatus] = useState(false);
  let insertForm = (event) => {
    event.preventDefault();
    let formDataValue = new FormData(event.target);
    let couponCode = formDataValue.get("couponCode");

    if (couponCode) {
      formDataValue.set("couponCode", couponCode.toUpperCase());
    } else {
      toast.error("Coupon code is required");
      return;
    }

    // Convert FormData to JSON
    let jsonData = {};
    formDataValue.forEach((value, key) => {
      jsonData[key] = value;
    });

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
              .put(AdminBaseURL + `/coupon/updaterow/${id}`, jsonData)
              .then((res) => {
                if (res.data.status === 1) {
                  toast.success(`Record Updated`);
                  event.target.reset();
                  setNavigatorStatus(true);
                } else {
                  toast.error(`Unable to update record.`);
                }
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
              title: "Cancelled",
              text: "Record not Updated",
              icon: "error",
            });
          }
        });
    } else {
      axios.post(AdminBaseURL + "/coupon/insert", jsonData).then((response) => {
        if (response.data.status == 1) {
          toast.success(`${response.data.res.couponName} coupon added .`);
          event.target.reset();
          setNavigatorStatus(true);
        } else {
          if (response.data.error.code == 11000) {
            toast.error("Coupon code already exists !");
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
    if (id) {
      // Reset form before fetching data
      setControlledForm({
        couponName: "",
        couponCode: "",
        couponStatus: 1,
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        maxDiscountAmount: "",
        expiryDate: "",
        usageLimit: "",
      });

      // Fetch coupon data for editing
      axios
        .get(AdminBaseURL + `/coupon/editrow/${id}`)
        .then((res) => res.data)
        .then((finalData) => {
          if (finalData.status) {
            // Format date to YYYY-MM-DD for input field
            const formattedDate = finalData.res.expiryDate
              ? new Date(finalData.res.expiryDate).toISOString().split("T")[0]
              : "";

            setControlledForm({
              couponName: finalData.res.couponName,
              couponCode: finalData.res.couponCode,
              couponStatus: finalData.res.couponStatus,
              discountType: finalData.res.discountType,
              discountValue: finalData.res.discountValue,
              minOrderAmount: finalData.res.minOrderAmount,
              maxDiscountAmount: finalData.res.maxDiscountAmount,
              expiryDate: formattedDate,
              usageLimit: finalData.res.usageLimit,
            });
          }
        })
        .catch((error) => {
          toast.error(`Error fetching coupon data: ${error.message}`);
        });
    }
  }, [id]);

  let navigator = useNavigate();
  useEffect(() => {
    if (navigatorStatus) {
      setTimeout(() => {
        navigator("/coupon/coupon-items");
      }, 2000);
    }
  }, [navigatorStatus]);

  // Min date for expiry date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="w-full">
      <Breadcrumb path={"Coupon"} path2={"Coupon Details"} slash={"/"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1350px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            {id ? "Update Coupon" : "Add New Coupon"}
          </h3>
          <form
            onSubmit={insertForm}
            className="border border-t-0 p-3 rounded-b-md border-slate-400"
          >
            <div className="mb-5">
              <label
                htmlFor="couponName"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Coupon Name
              </label>
              <input
                type="text"
                name="couponName"
                id="couponName"
                onChange={getsetValue}
                value={controlledForm.couponName}
                className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                placeholder="Summer Sale"
                required
              />
            </div>

            <div className="mb-5">
              <label
                htmlFor="couponCode"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Coupon Code
              </label>
              <input
                type="text"
                name="couponCode"
                id="couponCode"
                onChange={getsetValue}
                value={controlledForm.couponCode}
                className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                placeholder="SUMMER25"
                maxLength="15"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-5">
              <div>
                <label
                  htmlFor="discountType"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Discount Type
                </label>
                <select
                  id="discountType"
                  name="discountType"
                  onChange={getsetValue}
                  value={controlledForm.discountType}
                  className="border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  required
                >
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="fixed">Fixed Amount Discount (₹)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="discountValue"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Discount Value
                </label>
                <input
                  type="number"
                  name="discountValue"
                  id="discountValue"
                  min={controlledForm.discountType === "percentage" ? "1" : "1"}
                  max={
                    controlledForm.discountType === "percentage"
                      ? "100"
                      : undefined
                  }
                  onChange={getsetValue}
                  value={controlledForm.discountValue}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder={
                    controlledForm.discountType === "percentage" ? "25" : "250"
                  }
                  required
                />
                {controlledForm.discountType === "percentage" && (
                  <p className="text-sm text-gray-500 mt-1">
                    Enter a value between 1 and 100
                  </p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-5">
              <div>
                <label
                  htmlFor="minOrderAmount"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Minimum Order Amount (₹)
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  id="minOrderAmount"
                  min="0"
                  onChange={getsetValue}
                  value={controlledForm.minOrderAmount}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="maxDiscountAmount"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Maximum Discount Amount (₹)
                </label>
                <input
                  type="number"
                  name="maxDiscountAmount"
                  id="maxDiscountAmount"
                  min="0"
                  onChange={getsetValue}
                  value={controlledForm.maxDiscountAmount}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="1000"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-5">
              <div>
                <label
                  htmlFor="expiryDate"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  id="expiryDate"
                  min={today}
                  onChange={getsetValue}
                  value={controlledForm.expiryDate}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="usageLimit"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Usage Limit (per user)
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  id="usageLimit"
                  min="1"
                  onChange={getsetValue}
                  value={controlledForm.usageLimit}
                  className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3"
                  placeholder="1"
                  required
                />
              </div>
            </div>

            <div className="mb-8 ps-1">
              <span className="flex items-center gap-3">
                Status :
                <input
                  id="active-radio"
                  onChange={getsetValue}
                  name="couponStatus"
                  type="radio"
                  value={1}
                  checked={Number(controlledForm.couponStatus) === 1}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                Active
                <input
                  id="inactive-radio"
                  name="couponStatus"
                  type="radio"
                  onChange={getsetValue}
                  value={0}
                  checked={Number(controlledForm.couponStatus) === 0}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                Inactive
              </span>
            </div>

            <button
              type="submit"
              className="focus:outline-none mt-4 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
            >
              {id !== undefined ? "Update" : "Add"} Coupon
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
