import { securityKeyCheck } from "./securityKeyCheckUp.js";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const signUpAllowedFieldValidation = [
  "email",
  "password",
  "firstName",
  "lastName",
  "role",
  "securityKey",
];
const loginAllowedField = ["email", "password"];

function removeAllSpaces(str) {
  return str.replace(/\s+/g, "");
}

function checker(fieldsNameValidationBox, req, res) {
  for (const field of fieldsNameValidationBox) {
    if (!(field in req.body)) {
      return res
        .status(400)
        .json({ message: `${field} is missing `, flag: false });
    }
  }
  if (Object.keys(req.body).length !== fieldsNameValidationBox.length) {
    return res.status(400).json({
      message: { field: "You are not allowed to add multiple fields " },
      flag: false,
    });
  }
}

export const signUpValidation = async (req, res, next) => {
  try {
    let { email, password, firstName, lastName, role, securityKey } = req.body;

    // Adjust allowed fields based on role
    const allowedFields = [
      "email",
      "password",
      "firstName",
      "lastName",
      "role",
    ];
    if (role === "admin") {
      allowedFields.push("securityKey");
    }

    // Check for required fields
    for (const field of allowedFields) {
      if (!(field in req.body)) {
        return res
          .status(400)
          .json({ message: `${field} is missing`, flag: false });
      }
    }

    // Check for extra fields
    if (Object.keys(req.body).length !== allowedFields.length) {
      return res.status(400).json({
        message: "You are not allowed to add extra fields",
        flag: false,
      });
    }

    email = email.toLowerCase();
    password = removeAllSpaces(password);
    firstName = firstName.trim();
    lastName = lastName.trim();

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Email must be a valid email address", flag: false });
    }

    if (password.length < 6 || password.length > 30) {
      return res.status(400).json({
        message: "Password must be between 6 and 30 characters",
        flag: false,
      });
    }

    if (firstName.trim().length === 0 || firstName.trim().length > 30) {
      return res.status(400).json({
        message: "First name should have characters between 1 to 30",
        flag: false,
      });
    }

    if (
      lastName &&
      (lastName.trim().length === 0 || lastName.trim().length > 30)
    ) {
      return res.status(400).json({
        message: "Last name should have characters between 1 to 30",
        flag: false,
      });
    }

    if (role !== "admin" && role !== "member") {
      return res
        .status(400)
        .json({ message: "Please enter valid role", flag: false });
    }

    // Validate security key only for admin role
    if (role === "admin") {
      if (!securityKeyCheck(securityKey)) {
        return res.status(400).json({
          message: "Invalid security key. Must be 6-10 characters",
          flag: false,
        });
      }
    }

    next();
  } catch (error) {
    console.error("SignupValidation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginValidation = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    checker(loginAllowedField, req, res);
    email = email.toLowerCase();
    password = removeAllSpaces(password);
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Email must be a valid email address", flag: false });
    }

    if (password.length < 6 || password.length > 30) {
      return res
        .status(400)
        .json({ message: "Password must be between 6 and 30 characters" });
    }
    next();
  } catch (error) {
    console.error("LoginValidation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

