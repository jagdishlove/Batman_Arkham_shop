import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import OrderConfirmation from "@/pages/OrderConfirmation";
import OrderHistory from "../pages/OrderHistory";

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
];
