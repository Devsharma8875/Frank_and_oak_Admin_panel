import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./Home.jsx";
import "sweetalert2/src/sweetalert2.scss";
import "react-responsive-pagination/themes/bootstrap.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./Pages/Dashboard.jsx";
import Login from "./Pages/LoginAuth/Login.jsx";
import Profile from "./Pages/Profile.jsx";
import AddColor from "./Pages/Color/AddColor.jsx";
import ViewColor from "./Pages/Color/ViewColor.jsx";
import SizeDetails from "./Pages/Size/SizeDetails.jsx";
import ViewSize from "./Pages/Size/ViewSize.jsx";
import AddCategory from "./Pages/Parent_Category/AddCategory.jsx";
import ViewCategory from "./Pages/Parent_Category/ViewCategory.jsx";
import AddSubCategory from "./Pages/Sub Category/AddSubCategory.jsx";
import ViewSubCategory from "./Pages/Sub Category/ViewSubCategory.jsx";
import ProductDetails from "./Pages/Product/ProductDetails.jsx";
import ProductItems from "./Pages/Product/ProductItems.jsx";
import StoryDetails from "./Pages/Story/StoryDetails.jsx";
import StoryView from "./Pages/Story/StoryView.jsx";
import Orders from "./Pages/Orders/Orders.jsx";
import SliderDetails from "./Pages/Slider/SliderDetails.jsx";
import SliderView from "./Pages/Slider/SliderView.jsx";
import RootLayout from "./layout/RootLayout.jsx";
import { Provider } from "react-redux";
import { store } from "./store.js";
import HeadlineDetails from "./Pages/Headline/HeadlineDetails.jsx";
import ViewHeadline from "./Pages/Headline/ViewHeadline.jsx";
import CouponDetails from "./Pages/Coupon/CouponDetails.jsx";
import CouponItems from "./Pages/Coupon/CouponItems.jsx";
import Reviews from "./Pages/Orders/Orders.jsx";
import Review from "./Pages/Review/Review.jsx";

// const route=createBrowserRouter([
//   {
//     path:"/",
//     element:<Login/>
//   },
//   {
//     path:"/Home",
//     element: <Home/>
//   },
//   {
//     path:"/Dashboard",
//     element:<Dashboard/>
//   },
//   {
//     path:"/Profile",
//     element:<Profile/>
//   },
//   {
//     path:"/Colors/Add-Color",
//     element: <AddColor/>
//   },
//   {
//     path:"/Colors/View-Color",
//     element:<ViewColor/>
//   },
//   {
//     path:"/Size/Size-Details",
//     element:<SizeDetails/>
//   },
//   {
//     path:"/Size/View-Size",
//     element:<ViewSize/>
//   },
//   {
//     path:"/ParentCategory/Add-Category",
//     element:<AddCategory/>
//   },
//   {
//     path:"/ParentCategory/View-Category",
//     element:<ViewCategory/>
//   },
//   {
//     path:"/SubCategory/Add-Sub-Category",
//     element:<AddSubCategory/>
//   },
//   {
//     path:"/SubCategory/View-Sub-Category",
//     element:<ViewSubCategory/>
//   },
//   {
//     path:"/Product/Product-Details",
//     element:<ProductDetails/>
//   },
//   {
//     path:"/Product/Product-Items",
//     element:<ProductItems/>
//   },
//   {
//     path:"/Story/Story-Details",
//     element:<StoryDetails/>
//   },
//   {
//     path:"/Story/Story-View",
//     element:<StoryView/>
//   },
//   {
//     path:"/Orders",
//     element:<Orders/>
//   },
//   {
//     path:"/Slider/Slider-Details",
//     element:<SliderDetails/>
//   },
//   {
//     path:"/Slider/Slider-View",
//     element:<SliderView/>
//   }
// ])

const route = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Login />} />
      <Route path="/" element={<RootLayout />}>
        <Route path="home" element={<Home />} />
      </Route>
      <Route element={<RootLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="colors">
          <Route path="add-color/:id?" element={<AddColor />}></Route>
          <Route path="view-color" element={<ViewColor />}></Route>
        </Route>
        <Route path="size">
          <Route path="add-size/:id?" element={<SizeDetails />}></Route>
          <Route path="view-size" element={<ViewSize />}></Route>
        </Route>
        <Route path="parent-category">
          <Route path="add-category/:id?" element={<AddCategory />}></Route>
          <Route path="view-category" element={<ViewCategory />}></Route>
        </Route>
        <Route path="sub-category">
          <Route
            path="add-sub-category/:id?"
            element={<AddSubCategory />}
          ></Route>
          <Route path="view-sub-category" element={<ViewSubCategory />}></Route>
        </Route>
        <Route path="product">
          <Route path="add-product/:id?" element={<ProductDetails />}></Route>
          <Route path="view-product" element={<ProductItems />}></Route>
        </Route>
        <Route path="coupon">
          <Route path="coupon-details/:id?" element={<CouponDetails />}></Route>
          <Route path="coupon-items" element={<CouponItems />}></Route>
        </Route>
        <Route path="story">
          <Route path="story-details/:id?" element={<StoryDetails />}></Route>
          <Route path="story-view" element={<StoryView />}></Route>
        </Route>
        <Route path="orders">
          <Route path="orders" element={<Orders />}></Route>
        </Route>
        <Route path="reviews">
          <Route path="reviews" element={<Review />}></Route>
        </Route>
        <Route path="headline">
          <Route
            path="headline-details/:id?"
            element={<HeadlineDetails />}
          ></Route>
          <Route path="view-headline" element={<ViewHeadline />}></Route>
        </Route>
        <Route path="slider">
          <Route path="slider-details/:id?" element={<SliderDetails />}></Route>
          <Route path="slider-view" element={<SliderView />}></Route>
        </Route>
      </Route>
    </>
  )
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  </StrictMode>
);
