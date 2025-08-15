import Home from "@/pages/Home";
import BatmanLogin from "../pages/Login";
import BatmanSignup from "../pages/Signup";
import BatmanProductDetail from "../pages/ProductDetail";
import ContactUs from "../pages/ContactUs";
import Privacy from "../pages/Privacy";
import TermsOfService from "../pages/TermsOfService";
import Faq from "../pages/Faq";
import Products from "@/pages/Products";

export const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <BatmanLogin />,
  },
  {
    path: "/signup",
    element: <BatmanSignup />,
  },
  {
    path: "/products/:id",
    element: <BatmanProductDetail />,
  },
  {
    path: "/contact",
    element: <ContactUs />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/terms",
    element: <TermsOfService />,
  },
  {
    path: "/faq",
    element: <Faq />,
  },
  {
    path: "products",
    element: <Products />,
  },
];
