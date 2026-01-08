import * as yup from "yup";

export const userSchema = yup.object({
  username: yup
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .required("Username is required"),

  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Email is not valid")
    .required("Email is required"),

  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

export const validateUser = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      errors: err.errors,
    });
  }
};
