import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "../../common/Breadcrumb";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2/dist/sweetalert2.js";
import ResponsivePagination from "react-responsive-pagination";
import { AdminBaseURL } from "../../config/config";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchData, setSearchData] = useState({
    reviewerName: "",
    pageNumber: 1,
  });
  const [loading, setLoading] = useState(false);

  // Fetch reviews from backend
  const viewReviews = () => {
    let params = { ...searchData, pageNumber: currentPage };
    axios
      .get(AdminBaseURL + "/review/all", { params })
      .then((res) => {
        if (res.data.status === 1) {
          setReviews(res.data.data);
          setTotalPages(res.data.totalPages || 0);
          setLimit(res.data.limit || 0);
        } else {
          toast.error("Failed to load reviews");
        }
      })
      .catch((err) => {
        toast.error("Failed to load reviews");
      });
  };

  // Delete a single review
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F90101",
      cancelButtonColor: "#0D0D0D",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(AdminBaseURL + `/review/delete/${id}`);
        Swal.fire("Deleted!", "Review has been deleted.", "success");
        viewReviews();
      } catch (error) {
        Swal.fire("Error!", "An error occurred while deleting.", "error");
      }
    }
  };

  // Handle multiple deletion
  const handleMultipleDelete = async () => {
    if (selectedIds.length === 0) {
      Swal.fire("Please select reviews to delete!");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert these deletions!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F90101",
      cancelButtonColor: "#0D0D0D",
      confirmButtonText: "Yes, delete them!",
    });

    if (result.isConfirmed) {
      try {
        await axios.post(AdminBaseURL + "/review/reviews/multiple-delete", {
          ids: selectedIds,
        });
        Swal.fire("Deleted!", "Selected reviews have been deleted.", "success");
        setSelectedIds([]);
        viewReviews();
      } catch (error) {
        Swal.fire("Error!", "An error occurred while deleting.", "error");
      }
    }
  };

  // Handle status change for selected reviews
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
        const res = await axios.post(AdminBaseURL + "/review/change-status", {
          id: selectedIds,
        });
        // Depending on your backend response, check the status accordingly:
        if (res.data.status === 1 || res.data.status === true) {
          toast.success(res.data.message);
          setSelectedIds([]);
          viewReviews(); // Refresh the list after status change
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    viewReviews();
  };

  // Select all reviews
  const handleSelectAll = () => {
    if (selectedIds.length === reviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reviews.map((review) => review._id));
    }
  };

  // Select individual review
  const handleSelectItem = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Fetch reviews when component mounts or when currentPage/searchData changes
  useEffect(() => {
    viewReviews();
  }, [currentPage, searchData]);

  return (
    <section className="w-full">
      <Breadcrumb path={"Reviews"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1350px] mx-auto py-5">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-3 gap-3 items-baseline py-3"
          >
            <div className="relative">
              <input
                type="text"
                id="reviewerName"
                name="reviewerName"
                onChange={handleSearchChange}
                value={searchData.reviewerName}
                className="block border-2 font-semibold px-2.5 py-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="reviewerName"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3"
              >
                Search by Reviewer Name
              </label>
            </div>
            <div className="grid-cols-2">
              <button
                type="submit"
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center mb-2"
              >
                Search
              </button>
            </div>
          </form>
          <div className="flex justify-between items-center">
            <button
              onClick={handleMultipleDelete}
              type="button"
              className="focus:outline-none my-10 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
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
            Reviews List
          </h3>
          <div className="border border-t-0 rounded-b-md border-slate-400">
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-gray-500">
                <thead className="text-sm text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3" width="150px">
                      <input
                        checked={selectedIds.length === reviews.length}
                        onChange={handleSelectAll}
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      Select All
                    </th>
                    <th className="px-6 py-3">S. No.</th>
                    <th className="px-6 py-3">Review ID</th>
                    <th className="px-6 py-3">Reviewer</th>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Rating</th>
                    <th className="px-6 py-3">Comment</th>
                    <th className="px-6 py-3">Created At</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <tr key={review._id} className="bg-white border-b">
                        <th className="px-6 py-4">
                          <input
                            onChange={() => handleSelectItem(review._id)}
                            checked={selectedIds.includes(review._id)}
                            type="checkbox"
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                          />
                        </th>
                        <td className="px-6 py-4">
                          {(currentPage - 1) * limit + (index + 1)}
                        </td>
                        <td className="px-6 py-4">{review._id}</td>
                        <td className="px-6 py-4">{review.reviewerName}</td>
                        <td className="px-6 py-4">
                          {review.product?.productName || "N/A"}
                        </td>
                        <td className="px-6 py-4">{review.rating}</td>
                        <td className="px-6 py-4">{review.comment}</td>
                        <td className="px-6 py-4">
                          {new Date(review.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {review.status ? (
                            <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Approved
                            </span>
                          ) : (
                            <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Not Approved
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4">
                        No reviews found.
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
