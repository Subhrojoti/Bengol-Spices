export const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
  next();
};

export const isAgent = (req, res, next) => {
  if (req.user.role !== "AGENT") {
    return res.status(403).json({
      success: false,
      message: "Agent access only",
    });
  }
  next();
};

export const isDeliveryPartner = (req, res, next) => {
  if (req.user.role !== "DELIVERY_PARTNER") {
    return res.status(403).json({
      success: false,
      message: "DELIVERY PARTNER access only",
    });
  }
  next();
};

export const isAdminOrEmployee = (req, res, next) => {
  if (req.user.role === "ADMIN" || req.user.role === "EMPLOYEE") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied",
  });
};
