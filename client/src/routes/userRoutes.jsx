import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import OrderHistory from "../pages/OrderHistory";
import Products from "../pages/Products";
import Profile from "../pages/Profile";

export const userRoutes = [
  {
    path: "cart",
    element: <Cart />,
  },
  {
    path: "checkout",
    element: <Checkout />,
  },
  {
    path: "orders",
    element: <OrderHistory />,
  },
  {
    path: "order-confirmation/:id",
    element: <OrderConfirmation />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
];
