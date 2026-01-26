import "dotenv/config"; // ✅ THIS LINE
import express from "express";
import cors from "cors";
import connectDB from "./database/db.js";
import agentRoutes from "./routes/agent.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoute from "./routes/auth.routes.js";
import storeRoutes from "./routes/store.routes.js";
import orderRoutes from "./routes/order.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import deliveryRoutes from "./routes/deliveryPartner.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

connectDB();

// console.log(process.env.CLOUDINARY_API_KEY);

// ✅ USE ROUTER, NOT CONTROLLER
app.use("/agent", agentRoutes);
app.use("/admin", adminRoutes);
app.use("/employee", employeeRoutes);
app.use("/auth", authRoute);
app.use("/agent/store", storeRoutes);
app.use("/agent/orders", orderRoutes);
app.use("/delivery-partner", deliveryRoutes);
app.use("/products", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
