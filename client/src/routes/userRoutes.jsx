import Cart from "@/pages/checkout/Cart";
import Checkout from "@/pages/checkout/Checkout";
import OrderConfirmation from "@/pages/checkout/OrderConfirmation";
import OrderHistory from "../pages/user/OrderHistory";
import Profile from "../pages/user/Profile";

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
