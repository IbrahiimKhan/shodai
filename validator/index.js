exports.expressSignupValidator = (req, res,next) => {
    req.check("name", "Name is required").notEmpty().trim();
    req.check("email", "Email is required")
      .notEmpty()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      .withMessage("Invalid email address")
      .isLength({ min: 4, max: 32 });
  
    req.check("phone", "Phone number is required")
      .notEmpty()
      .matches(/^(\+?88)?01[0-9]{9}$/)
      .withMessage("Invalid Bangladeshi phone number");
  
    req.check("password", "Password is required")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one alphanumeric character");
  
    // ... additional validation rules
  
    // Handle validation errors
    const errors = req.validationErrors();
    if (errors) {
      const errorMessage = errors[0].msg;
      return res.status(400).json({ error: errorMessage });
    }
  next()
    // If there are no validation errors, proceed with the signup process
    // ...
  };
  