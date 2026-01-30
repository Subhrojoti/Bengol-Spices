// import AdminSettings from "../pages/Admin/AdminSettings";
// import AdminProfile from "../pages/Admin/AdminProfile";
import AdminDashboard from "../pages/Admin/Tabs/AdminDashboard/AdminDashboard";
import EmpCreation from "../pages/Admin/Tabs/EmpCreation/EmpCreation";
import ProductCreation from "../pages/Admin/Tabs/ProductCreation/ProductCreation";
import AllProducts from "../pages/Admin/Tabs/AllProducts/AllProducts";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export const adminRoutes = [
  {
    label: "Dashboard",
    path: "dashboard",
    icon: DashboardIcon,
    component: AdminDashboard,
  },
  {
    label: "Employee Creation",
    path: "employees",
    icon: PeopleAltIcon,
    component: EmpCreation,
  },
  {
    label: "Product Creation",
    path: "products",
    icon: Inventory2Icon,
    component: ProductCreation,
  },

  {
    label: "All Products",
    path: "allproducts",
    icon: ListAltIcon,
    component: AllProducts,
  },
  //   {
  //     label: "Settings",
  //     path: "settings",
  //     icon: SettingsIcon,
  //     component: AdminSettings,
  //   },
  //   {
  //     label: "Profile",
  //     path: "profile",
  //     icon: AccountCircleIcon,
  //     component: AdminProfile,
  //   },
];
