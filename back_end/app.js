import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
