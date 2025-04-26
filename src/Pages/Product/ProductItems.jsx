import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import axios from "axios";
import { AdminBaseURL } from "../../config/config";
import ResponsivePagination from "react-responsive-pagination";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProductItems() {
  let [orderModal, setOrderModal] = useState(false);
  let [productData, setProductData] = useState([]);
  let [path, setPath] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  let [productdeatils, setproductDetails] = useState(null);
  const [limit, setLimit] = useState(0);
  let [searchData, setSearchData] = useState({
    productName: "",
    productShortDesc: "",
    pageNumber: 1,
  });
  const [selectedIds, setSelectedIds] = useState([]);
  let viewProduct = () => {
    let obj = { ...searchData };
    obj["pageNumber"] = currentPage;
    axios
      .get(AdminBaseURL + "/product/product-view", { params: obj })
      .then((res) => res.data)
      .then((finalData) => {
        if (finalData.status) {
          setProductData(finalData.dataList);
          setPath(finalData.path);
          setTotalPages(finalData.allPage);
          setLimit(finalData.limit);
        }
      });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F90101",
      cancelButtonColor: "#0D0D0D",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(AdminBaseURL + `/product/delete/${id}`);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        viewProduct();
      } catch (error) {
        Swal.fire("Error!", "An server error occurred!", "error");
      }
    }
  };

  // Handle multiple delete
  const handleMultipleDelete = async () => {
    if (selectedIds.length === 0) {
      Swal.fire("Please select items to delete!");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F90101",
      cancelButtonColor: "#0D0D0D",
      confirmButtonText: "Yes, delete them!",
    });

    if (result.isConfirmed) {
      try {
        await axios.post(AdminBaseURL + "/product/multiple-delete", {
          ids: selectedIds,
        });
        Swal.fire("Deleted!", "Your files have been deleted.", "success");
        setSelectedIds([]);
        viewProduct();
      } catch (error) {
        Swal.fire("Error!", "An server error occurred!", "error");
      }
    }
  };

  // Handle status change
  const handleStatusChange = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select items to change status!");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to change the status of selected items!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F90101",
      cancelButtonColor: "#0D0D0D",
      confirmButtonText: "Yes, change status!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.post(AdminBaseURL + "/product/change-status", {
          id: selectedIds,
        });
        if (res.data.status === true) {
          toast.success(res.data.message);
          setSelectedIds([]);
          viewProduct(); // Refresh the list after status change
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchData({ ...searchData, [event.target.name]: event.target.value });
  };

  // Handle search form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    viewProduct();
  };

  // Handle select all items
  const handleSelectAll = () => {
    if (selectedIds.length === productData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(productData.map((item) => item._id));
    }
  };

  // Handle select individual item
  const handleSelectItem = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Fetch categories on component mount and when dependencies change
  useEffect(() => {
    viewProduct();
  }, [currentPage, searchData]);

  return (
    <section className="w-full">
      {/* Order Modal Start */}
      <div
        id="order-modal"
        className={`${
          orderModal === true ? `opacity-100 visible` : `opacity-0 invisible`
        }  duration-700 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        {productdeatils !== null ? (
          <div
            className="fixed w-full h-screen "
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          >
            <div className="relative p-4 px-20 w-full max-w-full max-h-full">
              <div className="relative bg-white rounded-lg shadow ">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Product Image's & Price
                  </h3>
                  <button
                    onClick={() => setOrderModal(false)}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    data-modal-hide="order-modal"
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                  <div className="grid grid-cols-[15%_auto_27%] gap-10">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="border-2 rounded-md shadow-md p-2">
                        <img
                          className="w-full h-full object-contain"
                          src={path + productdeatils.productImage}
                          alt=""
                        />
                      </div>
                      <div className="border-2 rounded-md shadow-md p-2">
                        <img
                          className="w-full h-full object-contain"
                          src={path + productdeatils.productAnimationImage}
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 border-2 rounded-md shadow-md p-3">
                      {productdeatils.productGallery.map((item, index) => {
                        return (
                          <img
                            className="w-36 h-36 object-cover object-top"
                            key={index}
                            src={path + item}
                            alt={productdeatils.productName}
                          />
                        );
                      })}
                    </div>
                    <div className="border-2 rounded-md shadow-md p-3">
                      <h3 className="text-center font-semibold text-[20px]">
                        Product Details
                      </h3>
                      <ul className="space-y-4 mt-4">
                        <li className="font-semibold text-[17px]">
                          Price :{" "}
                          <span className="font-normal text-[16px] ">
                            &nbsp; ₹ {productdeatils.productPrice}
                          </span>{" "}
                        </li>
                        <li className="font-semibold text-[17px]">
                          MRP :{" "}
                          <span className="font-normal text-[16px] ">
                            &nbsp; ₹ {productdeatils.productMRP}
                          </span>{" "}
                        </li>
                        <li className="font-semibold text-[17px]">
                          Manage Stock :{" "}
                          <span className="font-normal text-[16px] ">
                            &nbsp;{" "}
                            {productdeatils.productStatus
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>{" "}
                        </li>
                        <li className="font-semibold text-[17px]">
                          Product Name:{" "}
                          <span className="font-normal text-[16px] ">
                            &nbsp; {productdeatils.productName}
                          </span>{" "}
                        </li>
                        <li className="font-semibold text-[17px]">
                          Product Sub Category:{" "}
                          <span className="font-normal text-[16px] ">
                            &nbsp;{" "}
                            {
                              productdeatils.productSubCategoryId
                                .subCategoryName
                            }
                          </span>{" "}
                        </li>
                        <li className="font-semibold text-[17px]">
                          Product Parent Category:{" "}
                          <span className="font-normal text-[16px] ">
                            &nbsp;{" "}
                            {
                              productdeatils.productParentCategoryId
                                .categoryName
                            }
                          </span>{" "}
                        </li>
                        <li className="font-semibold text-[17px] ">
                          <div className="pb-1">Size :</div>
                          <div className="font-semibold text-[16px] flex flex-wrap gap-3">
                            {productdeatils.productSizeId.map((item, index) => {
                              return (
                                <div
                                  key={index}
                                  className="border px-3 rounded-sm shadow-sm border-black"
                                >
                                  {item.sizeName}
                                </div>
                              );
                            })}{" "}
                          </div>{" "}
                        </li>
                        <li className="font-semibold text-[17px]  ">
                          <div className="pb-1">Color :</div>
                          <div className="font-semibold text-[16px] flex flex-wrap gap-3">
                            {productdeatils.productColorId.map(
                              (item, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="border px-2 rounded-sm shadow-sm border-black flex items-center gap-1"
                                  >
                                    <div
                                      className="w-3.5 h-3.5 rounded-full"
                                      style={{ background: item.colorCode }}
                                    ></div>{" "}
                                    {item.colorName}
                                  </div>
                                );
                              }
                            )}{" "}
                          </div>{" "}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* Order Modal End */}

      <Breadcrumb path={"Product"} path2={"View Product"} slash={"/"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1350px] mx-auto py-5">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-3 gap-3 items-baseline py-3"
          >
            <div className="relative">
              <input
                type="text"
                id="productName"
                name="productName"
                onChange={handleSearchChange}
                value={searchData.productName}
                className="block border-2 font-semibold px-2.5 py-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="catName"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                Search by Product Name
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                id="productShortDesc"
                name="productShortDesc"
                onChange={handleSearchChange}
                value={searchData.productShortDesc}
                className="block border-2 font-semibold px-2.5 py-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="catDesc"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                Search by Product Description
              </label>
            </div>
            <div className="grid-cols-2">
              <button
                type="submit"
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2"
              >
                Search
              </button>
            </div>
          </form>
          <div className="flex justify-between items-center">
            <button
              onClick={handleMultipleDelete}
              type="button"
              className="focus:outline-none my-10 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Delete Selected
            </button>
            <button
              onClick={handleStatusChange}
              type="button"
              className="focus:outline-none my-10 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              Change Status
            </button>
          </div>
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            View Product
          </h3>
          <div className="border border-t-0 rounded-b-md border-slate-400">
            <div className="relative overflow-x-auto">
              <table className="w-full  text-left rtl:text-right text-gray-500 ">
                <thead className="text-sm text-gray-700 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" className="px-6 py-3" width="150px">
                      <input
                        checked={selectedIds.length === productData.length}
                        onChange={handleSelectAll}
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      Select All
                    </th>
                    <th scope="col" className="px-6 py-3">
                      S. No.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Product Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Short Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Thumbnails
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productData.length >= 1 ? (
                    productData.map((item, index) => {
                      return (
                        <tr className="bg-white border-b">
                          <th
                            scope="row"
                            className="px-6 py-4 text-[18px] font-semibold text-gray-900 whitespace-nowrap"
                          >
                            <input
                              onChange={() => handleSelectItem(item._id)}
                              checked={selectedIds.includes(item._id)}
                              type="checkbox"
                              className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                            />
                          </th>
                          <td className="px-6 py-4">
                            {(currentPage - 1) * limit + (index + 1)}
                          </td>
                          <td className="px-6 py-4">{item.productName}</td>
                          <td className="px-6 py-4">
                            <p className="line-clamp-1 w-[180px]">
                              {item.productDescription}
                            </p>
                            <button
                              onClick={() => {
                                setproductDetails(item);
                                setOrderModal(true);
                              }}
                              className="text-[14px] text-blue-500 font-semibold hover:text-blue-700 hover:font-semibold"
                            >
                              Read More
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <p className="line-clamp-1 w-[180px]">
                              {item.productShortDesc}
                            </p>
                            <button
                              onClick={() => {
                                setproductDetails(item);
                                setOrderModal(true);
                              }}
                              className="text-[14px] text-blue-500 font-semibold hover:text-blue-700 hover:font-semibold"
                            >
                              Read More
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <img
                              className="w-16 h-16 rounded-md object-cover object-top"
                              src={path + item.productImage}
                              alt={item.productName}
                            />
                          </td>
                          <td className="px-6 py-4 flex gap-3 mt-6">
                            <svg
                              fill="red"
                              onClick={() => deleteSingleProduct(item._id)}
                              className="w-4 h-4 cursor-pointer"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 448 512"
                            >
                              <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                            </svg>
                            |
                            <Link to={`/product/add-product/${item._id}`}>
                              <svg
                                fill="gold"
                                className="w-4 h-4 cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 512 512"
                              >
                                <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
                              </svg>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            {item.productStatus ? "Active" : "Deactive"}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="bg-white w-full border-b ">
                      <td colSpan={8} className=" block text-center py-3">
                        No Data Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="py-5">
                <ResponsivePagination
                  current={currentPage}
                  total={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
