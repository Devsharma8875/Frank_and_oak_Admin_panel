import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "../../common/Breadcrumb";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2/dist/sweetalert2.js";
import ResponsivePagination from "react-responsive-pagination";
import { AdminBaseURL } from "../../config/config";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(0);
  const [orderModal, setOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  let [searchData, setSearchData] = useState({
    orderId: "",
    pageNumber: 1,
  });

  let viewOrders = () => {
    let obj = { ...searchData };
    obj["pageNumber"] = currentPage;
    axios
      .get("http://localhost:8000/admin/order/orders", { params: obj })
      .then((res) => {
        if (res.data.status == 1) {
          setOrders(res.data.data);
          setTotalPages(res.data.allPage);
          setLimit(res.data.limit);
        }
      });
  };

  // Fetch Orders from Backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/admin/order/orders"
      );

      if (response.data.status === 1) {
        setOrders(response.data.data); // Save orders to state
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  };

  // Handle Order Status Update
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/admin/order/orders/${orderId}`,
        { status: newStatus }
      );

      if (response.data.status === 1) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
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
        await axios.delete(AdminBaseURL + `/order/delete/${id}`);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        viewOrders();
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
        await axios.post(AdminBaseURL + "/order/multiple-delete", {
          ids: selectedIds,
        });
        Swal.fire("Deleted!", "Your files have been deleted.", "success");
        setSelectedIds([]);
        viewOrders();
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
        const res = await axios.post(AdminBaseURL + "/order/change-status", {
          id: selectedIds,
        });
        if (res.data.status === true) {
          toast.success(res.data.message);
          setSelectedIds([]);
          viewOrders(); // Refresh the list after status change
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
    viewOrders();
  };

  // Handle select all items
  const handleSelectAll = () => {
    if (selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((item) => item._id));
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

  // Handle sending invoice for a single order
  const handleSendInvoice = async (orderId, customerEmail) => {
    try {
      const result = await Swal.fire({
        title: "Send Invoice?",
        text: "Are you sure you want to send the invoice to the customer?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, send it!",
      });

      if (result.isConfirmed) {
        const response = await axios.post(
          "http://localhost:8000/website/send-Invoice",
          {
            _id: orderId,
            Email: customerEmail,
          }
        );

        if (response.data.status === 1) {
          Swal.fire(
            "Sent!",
            "The invoice has been sent successfully.",
            "success"
          );
        } else {
          throw new Error(response.data.message || "Failed to send invoice");
        }
      }
    } catch (error) {
      Swal.fire("Error!", error.message || "Failed to send invoice", "error");
    }
  };

  // Handle bulk sending invoices for selected orders
  const handleBulkSendInvoice = async () => {
    if (selectedIds.length === 0) {
      Swal.fire("Please select orders to send invoices!");
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Send Invoices?",
        text: `Are you sure you want to send invoices for ${selectedIds.length} selected orders?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, send them!",
      });

      if (result.isConfirmed) {
        // Get emails for selected orders
        const selectedOrders = orders.filter((order) =>
          selectedIds.includes(order._id)
        );
        const sendPromises = selectedOrders.map((order) =>
          axios.post("http://localhost:8000/website/send-Invoice", {
            _id: order._id,
            Email: order.user.userEmail,
          })
        );

        await Promise.all(sendPromises);
        Swal.fire(
          "Sent!",
          `Invoices for ${selectedIds.length} orders have been sent.`,
          "success"
        );
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to send some invoices", "error");
    }
  };

  // Fetch categories on component mount and when dependencies change
  useEffect(() => {
    viewOrders();
  }, [currentPage, searchData]);

  return (
    <section className="w-full">
      <Breadcrumb path={"Orders"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1350px] mx-auto py-5">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-3 gap-3 items-baseline py-3"
          >
            <div className="relative">
              <input
                type="text"
                id="orderId"
                name="orderId"
                onChange={handleSearchChange}
                value={searchData.orderId}
                className="block border-2 font-semibold px-2.5 py-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="catName"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                Search by Order Id
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
            <div>
              <button
                onClick={handleStatusChange}
                type="button"
                className="focus:outline-none my-10 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 mr-2"
              >
                Change Status
              </button>
              <button
                onClick={handleBulkSendInvoice}
                type="button"
                className="focus:outline-none my-10 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900"
              >
                Send Invoices (Selected)
              </button>
            </div>
          </div>
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            Order's List
          </h3>
          <div className="border border-t-0 rounded-b-md border-slate-400">
            <div className="relative overflow-x-auto">
              <table className="w-full text-left text-gray-500">
                <thead className="text-sm text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3" width="150px">
                      <input
                        checked={selectedIds.length === orders.length}
                        onChange={handleSelectAll}
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      Select All
                    </th>
                    <th className="px-6 py-3">S. No.</th>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <tr key={order._id} className="bg-white border-b">
                        <th
                          scope="row"
                          className="px-6 py-4 text-[18px] font-semibold text-gray-900 whitespace-nowrap"
                        >
                          <input
                            onChange={() => handleSelectItem(order._id)}
                            checked={selectedIds.includes(order._id)}
                            type="checkbox"
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                          />
                        </th>
                        <td className="px-6 py-4">
                          {(currentPage - 1) * limit + (index + 1)}
                        </td>
                        <td className="px-6 py-4">{order.orderId}</td>
                        <td className="px-6 py-4">
                          {order.user.firstName} {order.user.lastName}
                        </td>
                        <td className="px-6 py-4">₹ {order.orderAmount}</td>
                        <td className="px-6 py-4">
                          <select
                            value={order.orderStatus}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            className="border rounded p-1"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 flex items-center">
                          <svg
                            onClick={() => handleDelete(order._id)}
                            fill="red"
                            className="w-4 h-4 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
                          </svg>
                          <button
                            onClick={() =>
                              handleSendInvoice(order._id, order.user.userEmail)
                            }
                            className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-sm"
                          >
                            Send Invoice
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setOrderModal(true);
                            }}
                            className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No orders found.
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
      {/* Order Modal */}
      {orderModal && selectedOrder && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-md shadow-md w-[80%] h-[80%] overflow-y-scroll">
            <h3 className="text-xl font-bold mb-4">Order Details</h3>

            {/* Basic Order Details */}
            <p>
              <strong>Order ID:</strong> {selectedOrder.orderId}
            </p>
            <p>
              <strong>Customer:</strong> {selectedOrder.user.firstName}{" "}
              {selectedOrder.user.lastName}
            </p>
            <p>
              <strong>Customer Email:</strong> {selectedOrder.user.userEmail}
            </p>
            <p>
              <strong>Order Amount:</strong> ₹ {selectedOrder.orderAmount}
            </p>
            <p>
              <strong>Order Status:</strong> {selectedOrder.orderStatus}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              {selectedOrder.paymentStatus === "1"
                ? "Pending"
                : "2" === "2"
                ? "Confirmed"
                : "3" === "3"
                ? "Cancelled"
                : "Cancelled"}
            </p>
            <p>
              <strong>Payment Type:</strong>{" "}
              {selectedOrder.paymentType === "1"
                ? "Cash on Delivery"
                : "2" === "2"
                ? "Online Payment"
                : "Online Payment"}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(selectedOrder.updatedAt).toLocaleDateString()}
            </p>

            {/* Shipping Address */}
            <h4 className="mt-4 font-bold">Shipping Address:</h4>
            <p>
              {selectedOrder.shippingAddress.firstName}{" "}
              {selectedOrder.shippingAddress.lastName}
            </p>
            <p>{selectedOrder.shippingAddress.userAddress}</p>
            <p>{selectedOrder.shippingAddress.userSubAddress}</p>
            <p>
              {selectedOrder.shippingAddress.cityName},{" "}
              {selectedOrder.shippingAddress.stateName}
            </p>
            <p>{selectedOrder.shippingAddress.zipCode}</p>
            <p>{selectedOrder.shippingAddress.countryName}</p>
            <p>
              <strong>Phone:</strong> {selectedOrder.shippingAddress.userPhone}
            </p>

            {/* Products in Cart */}
            <h4 className="mt-4 font-bold">Products:</h4>
            {selectedOrder.productCart.map((product, idx) => (
              <div key={idx} className="mt-2 border-b pb-2">
                <p>
                  <strong>Product Name:</strong> {product.product.productName}
                </p>
                <p>
                  <strong>Product Price:</strong> {product.product.productPrice}
                </p>
                <p>
                  <strong>Quantity:</strong> {product.quantity}
                </p>
                <p>
                  <strong>Size:</strong> {product.size.sizeName}
                </p>
                <p>
                  <strong>Color:</strong> {product.color.colorName}
                </p>
                <p>
                  <strong>Color Code:</strong>{" "}
                  <span
                    style={{
                      backgroundColor: product.color.colorCode,
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {product.color.colorCode}
                  </span>
                </p>
              </div>
            ))}

            {/* Close Button */}
            <button
              onClick={() => setOrderModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
