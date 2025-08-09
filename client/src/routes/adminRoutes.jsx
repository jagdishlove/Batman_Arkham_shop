import AddProduct from "../pages/adminPages/AddProduct";
import Dashboard from "../pages/adminPages/Dashboard";

export const adminRoutes = [
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "products/add",
    element: <AddProduct />,
  },
];
