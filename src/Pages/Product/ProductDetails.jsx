import React, { useEffect, useState } from "react";
import Breadcrumb from "../../common/Breadcrumb";
import axios from "axios";
import { AdminBaseURL } from "../../config/config";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Select from "react-select";

export default function ProductDetails() {
  let { id } = useParams();
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionSize, setSelectedOptionSize] = useState(null);
  const [options, setOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  let [controlledForm, setControlledForm] = useState({
    productName: "",
    productDescription: "",
    productShortDesc: "",
    productPrice: "",
    productMRP: "",
    productParentCategoryId: "",
    productSizeId: "",
    productColorId: "",
    productStatus: 1,
  });
  let [sizeData, setSizeData] = useState([]);
  let [colorData, setColorData] = useState([]);
  let [parentCatData, setParentCatData] = useState([]);
  let [subCatData, setSubCatData] = useState([]);
  let [navigatorStatus, setNavigatorStatus] = useState(false);
  const [productImgPreview, setProductImgPreview] =
    useState("/assets/no-img.png");
  const [animationImgPreview, setAnimationImgPreview] =
    useState("/assets/no-img.png");
  const [galleryPreview, setGalleryPreview] = useState([]);
  useEffect(() => {
    axios.get(AdminBaseURL + "/product/parentcategory-view").then((res) => {
      if (res.data.status) {
        setParentCatData(res.data.datalist);
      }
    });

    axios.get(AdminBaseURL + "/product/size-view").then((res) => {
      if (res.data.status) {
        setSizeData(res.data.datalist);
        const sizeSelect = res.data.datalist.map((size) => ({
          ...size,
          value: size._id,
          label: size.sizeName,
        }));
        setSizeOptions(sizeSelect);
      }
    });

    axios.get(AdminBaseURL + "/product/color-view").then((res) => {
      if (res.data.status) {
        setColorData(res.data.datalist);

        const newArr = res.data.datalist.map((color) => ({
          ...color,
          value: color._id,
          label: color.colorName,
        }));
        setOptions(newArr);
      }
    });
  }, []);

  let getSubCategory = (pid) => {
    axios.get(AdminBaseURL + `/product/subcategory-view/${pid}`).then((res) => {
      if (res.data.status) {
        setSubCatData(res.data.datalist);
      }
    });
  };

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
              .put(AdminBaseURL + `/product/updaterow/${id}`, formDataValue)
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
        .post(AdminBaseURL + "/product/product-insert", formDataValue)
        .then((res) => res.data)
        .then((finalData) => {
          toast.success(`${finalData.res.productName} product added.`);
          setNavigatorStatus(true);
          event.target.reset();
        });
    }
  };

  const colorStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.data.colorCode,
    }),
    multiValue: (provided, state) => ({
      ...provided,
      backgroundColor: state.data.colorCode,
    }),
  };

  let getsetValue = (event) => {
    let oldData = { ...controlledForm };
    oldData[event.target.name] = event.target.value;
    setControlledForm(oldData);
  };

  useEffect(() => {
    setProductImgPreview("/assets/no-img.png");
    setAnimationImgPreview("/assets/no-img.png");
    setControlledForm({
      productName: "",
      productDescription: "",
      productShortDesc: "",
      productPrice: "",
      productMRP: "",
      productParentCategoryId: "",
      productSizeId: "",
      productColorId: "",
      productStatus: 1,
    });
    axios
      .get(AdminBaseURL + `/product/editrow/${id}`)
      .then((res) => res.data)
      .then((finalData) => {
        if (finalData.status) {
          setControlledForm({
            productName: finalData.res.productName,
            productDescription: finalData.res.productDescription,
            productShortDesc: finalData.res.productShortDesc,
            productPrice: finalData.res.productPrice,
            productMRP: finalData.res.productMRP,
            productParentCategoryId: finalData.res.productParentCategoryId,
            productSizeId: finalData.res.productSizeId,
            productColorId: finalData.res.productColorId,
            productStatus: finalData.res.productStatus,
          });
          setProductImgPreview(finalData.path + finalData.res.productImage);
          setAnimationImgPreview(
            finalData.path + finalData.res.productAnimationImage
          );

          let data = finalData.res.productGallery.map(
            (items) => finalData.path + items
          );

          getSubCategory(finalData.res.productParentCategoryId);
          setGalleryPreview(data);
        }
      });
  }, [id]);

  let handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file.type == "image/webp" ||
      file.type == "image/png" ||
      file.type == "image/jpg" ||
      file.type == "image/jpeg" ||
      file.type == "image/svg" ||
      file.type == "image/svg+xml"
    ) {
      const selectedFiles = Array.from(event.target.files);
      if (selectedFiles.length <= 10) {
        let finalFile = selectedFiles.map((item) => URL.createObjectURL(item));

        setGalleryPreview(finalFile);
      } else {
        toast.error("Maximum limit reached! Please choose up to 10 images.");
      }
    } else {
      toast.error(
        "Please select a valid image file (PNG, JPG, JPEG, WEBP, SVG)."
      );
    }
  };

  let productImagePreview = (event) => {
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
      setProductImgPreview(previewImage);
    } else {
      setProductImgPreview("/assets/no-img.png");
      toast.error(
        "Please select a valid image file (PNG, JPG, JPEG, WEBP, SVG)."
      );
    }
  };

  let animationImagePreview = (event) => {
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
      setAnimationImgPreview(previewImage);
    } else {
      setAnimationImgPreview("/assets/no-img.png");
      toast.error(
        "Please select a valid image file (PNG, JPG, JPEG, WEBP, SVG)."
      );
    }
  };

  let navigator = useNavigate();
  useEffect(() => {
    if (navigatorStatus) {
      setTimeout(() => {
        navigator("/product/view-product");
      }, 2000);
    }
  }, [navigatorStatus]);

  return (
    <section className="w-full">
      <Breadcrumb path={"Product"} path2={"Add Product"} slash={"/"} />
      <div className="w-full min-h-[610px]">
        <div className="max-w-[1350px] mx-auto py-5">
          <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
            Add Product
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
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                onChange={getsetValue}
                value={controlledForm.productName}
                id="base-input"
                className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                placeholder="Product Name"
              />
            </div>
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Product Description
              </label>
              <textarea
                name="productDescription"
                onChange={getsetValue}
                value={controlledForm.productDescription}
                id="message"
                rows="3"
                className=" resize-none block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Add Product Description....."
              ></textarea>
            </div>
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Short Description
              </label>
              <textarea
                name="productShortDesc"
                onChange={getsetValue}
                value={controlledForm.productShortDesc}
                id="message"
                rows="3"
                className=" resize-none block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                placeholder="Add Product Short Description....."
              ></textarea>
            </div>
            <div className="grid grid-cols-[60%_auto] gap-10">
              <div className="mb-5">
                <label
                  for="base-input"
                  className="block mb-5 text-md font-medium text-gray-900"
                >
                  Product Image
                </label>
                <div className="max-w-full">
                  <label for="file-input" className="sr-only">
                    Choose file
                  </label>
                  <input
                    type="file"
                    onChange={productImagePreview}
                    name="productImage"
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
                  src={productImgPreview}
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
                  Image Animation
                </label>
                <div className="max-w-full">
                  <label for="file-input" className="sr-only">
                    Choose file
                  </label>
                  <input
                    type="file"
                    onChange={animationImagePreview}
                    name="productAnimationImage"
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
                  src={animationImgPreview}
                  alt=""
                />
              </div>
            </div>
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Product Gallery
              </label>
              <div className="max-w-full">
                <label for="file-input" className="sr-only">
                  Choose file
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  name="productGallery"
                  id="file-input"
                  className="block w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none  
  file:bg-gray-50 file:border-0
  file:me-4
  file:py-3 file:px-4
  "
                  multiple
                />
              </div>
            </div>
            <div className="mb-5 flex flex-wrap gap-4">
              {galleryPreview.length > 0 &&
                galleryPreview.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="object-scale-down h-24 rounded-md border  shadow-md   object-center w-24"
                  />
                ))}
            </div>
            <div className="mb-5">
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <label className="block mb-5 text-md font-medium text-gray-900">
                    Price
                  </label>
                  <input
                    type="tel"
                    name="productPrice"
                    onChange={getsetValue}
                    value={controlledForm.productPrice}
                    id="base-input"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                    placeholder="Product Price"
                  />
                </div>
                <div>
                  <label className="block mb-5 text-md font-medium text-gray-900">
                    MRP
                  </label>
                  <input
                    type="tel"
                    name="productMRP"
                    onChange={getsetValue}
                    value={controlledForm.productMRP}
                    id="base-input"
                    className="text-[19px] border-2 shadow-sm border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-3 "
                    placeholder="Product MRP"
                  />
                </div>
              </div>
            </div>
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Select Parent Category
              </label>

              <select
                id="default"
                name="productParentCategoryId"
                onChange={(event) => {
                  getSubCategory(event.target.value);
                  getsetValue(event);
                }}
                value={controlledForm.productParentCategoryId}
                className=" border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              >
                <option value="" disabled selected hidden>
                  --Select Parent Category--
                </option>

                {parentCatData.map((item, index) => {
                  return (
                    <option key={index} value={item._id}>
                      {item.categoryName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-5">
              <label
                for="base-input"
                className="block mb-5 text-md font-medium text-gray-900"
              >
                Select Sub Category
              </label>

              <select
                id="default"
                name="productSubCategoryId"
                className=" border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
              >
                <option value="" disabled selected hidden>
                  --Select Sub Category--
                </option>
                {subCatData.map((item, index) => {
                  return (
                    <option selected key={index} value={item._id}>
                      {item.subCategoryName}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-5">
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <label className="block mb-5 text-md font-medium text-gray-900">
                    Size
                  </label>
                  <Select
                    name="productSizeId"
                    defaultValue={selectedOptionSize}
                    onChange={setSelectedOptionSize}
                    options={sizeOptions}
                    isMulti
                  />
                  {/* <select
                    id="default"
                    multiple
                    onChange={getsetValue}
                    value={controlledForm.productSizeId}
                    name="productSizeId[]"
                    className=" border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  >
                    <option disabled hidden selected>
                      --Select Size--
                    </option>
                    {sizeData.map((item, index) => {
                      return (
                        <option key={index} value={item._id}>
                          {item.sizeName}
                        </option>
                      );
                    })}
                  </select> */}
                </div>
                <div>
                  <label className="block mb-5 text-md font-medium text-gray-900">
                    Color
                  </label>
                  <Select
                    name="productColorId"
                    defaultValue={selectedOption}
                    onChange={setSelectedOption}
                    options={options}
                    isMulti
                    styles={colorStyles}
                  />
                  {/* <select
                    id="default"
                    multiple
                    onChange={getsetValue}
                    value={controlledForm.productColorId}
                    name="productColorId[]"
                    className=" border-2 border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
                  >
                    <option disabled hidden selected>
                      --Select Color--
                    </option>
                    {colorData.map((item, index) => {
                      return (
                        <option key={index} value={item._id}>
                          {item.colorName}
                        </option>
                      );
                    })}
                  </select> */}
                </div>
              </div>
            </div>
            <div className="pe-5 ps-1">
              <span className="flex items-center gap-3">
                Status :
                <input
                  id="link-radio"
                  onChange={getsetValue}
                  name="productStatus"
                  type="radio"
                  value={1}
                  checked={controlledForm.productStatus == 1 ? true : ""}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                ></input>
                Active
                <input
                  id="link-radio"
                  name="productStatus"
                  type="radio"
                  onChange={getsetValue}
                  value={0}
                  checked={controlledForm.productStatus == 0 ? true : ""}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 "
                ></input>
                Deactive
              </span>
            </div>
            <button
              type="submit"
              className="focus:outline-none my-10 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              {id !== undefined ? "Update" : "Add"} Product
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
