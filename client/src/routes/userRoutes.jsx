import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import OrderConfirmation from "@/pages/OrderConfirmation";
import OrderHistory from "../pages/OrderHistory";
import Products from "../pages/Products";

export const userRoutes = [
  {
    path: "cart",
    element: <Cart />,
  },
  {
    path: "products",
    element: <Products />,
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
