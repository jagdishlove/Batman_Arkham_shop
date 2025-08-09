import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import OrderConfirmation from "@/pages/OrderConfirmation";

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
    element: <Orders />,
  },
  {
    path: "order-confirmation/:id",
    element: <OrderConfirmation />,
  },
];
