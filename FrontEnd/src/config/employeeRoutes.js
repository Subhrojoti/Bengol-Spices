import DashboardIcon from "@mui/icons-material/Dashboard";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import ListAltIcon from "@mui/icons-material/ListAlt";
import Groups3Icon from "@mui/icons-material/Groups3";
import AdminDashboard from "../pages/Admin/Tabs/AdminDashboard/AdminDashboard";
import DeliveryManagement from "../pages/Admin/Tabs/Delivery/DeliveryManagement";
import OrderManagement from "../pages/Admin/Tabs/Orders/OrderManagement";
import ReturnManagement from "../pages/Admin/Tabs/Returns/ReturnManagement";
import ProductCreation from "../pages/Admin/Tabs/ProductCreation/ProductCreation";
import AllProducts from "../pages/Admin/Tabs/AllProducts/AllProducts";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import EmpProfile from "../components/profile/EmpProfile";
import Agent from "../pages/Admin/Tabs/Agent/Agent";
import PaymentInfo from "../pages/Admin/Tabs/PaymentInfo/PaymentInfo";
import Targets from "../pages/Admin/Tabs/Targets/Targets";
import { AllInbox, LocalShipping, OutboxOutlined } from "@mui/icons-material";
import CustomNotification from "../pages/Admin/Tabs/CustomNotification/CustomNotification";
import NotificationsActive from "@mui/icons-material/NotificationsActive";

export const employeeRoutes = [
  {
    path: "profile",
    label: "Profile",
    icon: PersonIcon,
    component: EmpProfile,
  },
  {
    label: "Dashboard",
    path: "dashboard",
    icon: DashboardIcon,
    permission: "canViewDashboardSummary",
    component: AdminDashboard,
  },
  {
    label: "Agent",
    path: "agent",
    icon: Groups3Icon,
    permission: "canManageAgents",
    component: Agent,
  },
  {
    label: "Delivery Partner",
    path: "delivery-management",
    icon: LocalShipping,
    permission: "canGetAllDeliveryPartners",
    component: DeliveryManagement,
  },
  {
    label: "Orders",
    path: "order-management",
    icon: AllInbox,
    permission: "canGetAllOrders",
    component: OrderManagement,
  },
  {
    label: "Returns",
    path: "return-management",
    permission: "canAssignReturn",
    icon: OutboxOutlined,
    component: ReturnManagement,
  },
  {
    label: "Product Creation",
    path: "products",
    icon: Inventory2Icon,
    permission: "canManageProducts",
    component: ProductCreation,
  },
  {
    label: "All Products",
    path: "allproducts",
    icon: ListAltIcon,
    permission: "canManageProducts",
    component: AllProducts,
  },
  {
    label: "Payment Info",
    path: "payment-summary",
    icon: PaymentIcon,
    permission: "canSeePaymentInfo",
    component: PaymentInfo,
  },
  {
    label: "Targets",
    path: "target-management",
    permission: "canSetTargets",
    icon: AdsClickIcon,
    component: Targets,
  },
  {
    label: "Custom Notification",
    path: "custom-notification",
    icon: NotificationsActive,
    component: CustomNotification,
  },
];
