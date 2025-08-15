import Home from "@/pages/home/Home";
import BatmanSignup from "@/pages/auth/Signup";
import ContactUs from "@/pages/support/ContactUs";
import Faq from "@/pages/support/Faq";
import TermsOfService from "@/pages/legal/TermsOfService";
import Privacy from "@/pages/legal/Privacy";
import BatmanProductDetail from "@/pages/products/ProductDetail";
import BatmanLogin from "@/pages/auth/Login";
import Products from "@/pages/products/Products";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";

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
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
];
