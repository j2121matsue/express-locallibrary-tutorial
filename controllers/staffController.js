const Staff = require("../models/staff");


const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Staff.
exports.staff_list = asyncHandler(async (req, res, next) => {
  const allStaffs = await Staff.find().sort({ name: 1 }).exec();
  res.render("staff_list", {
    title: "Staff List",
    list_staff: allStaffs,
  });
});


// Display Genre create form on GET.
exports.staff_create_get = (req, res, next) => {
  res.render("staff_form", { title: "Create Staff" });
};

// Handle Genre create on POST.
exports.staff_create_post = [
  // Validate and sanitize the name field.
  body("name", "Staff name must contain at least 3 characters")
    .trim()
    .isLength({ min: 20 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const staff = new Staff({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("staff_form", {
        title: "Create Staff",
        staff: staff,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name (case insensitive) already exists.
      const staffExists = await Staff.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (staffExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(staffExists.url);
      } else {
        await staff.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(staff.url);
      }
    }
  }),
];

// Display Genre delete form on GET.
exports.staff_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of genre and all associated books (in parallel)
  
  if (staff === null) {
    // No results.
    res.redirect("/catalog/staffs");
  }

  res.render("staff_delete", {
    title: "Delete staff",
    staff: staff,
  });
});

// Display Genre update form on GET.
exports.Staff_update_get = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id).exec();

  if (staff === null) {
    // No results.
    const err = new Error("Staff not found");
    err.status = 404;
    return next(err);
  }

  res.render("staff_form", { title: "Update Staff", staff: staff });
});

// Handle Genre update on POST.
exports.staff_update_post = [
  // Validate and sanitize the name field.
  body("name", "Staff name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request .
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
    const staff = new Staff({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render("staff_form", {
        title: "Update Staff",
        staff: staff,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Staff.findByIdAndUpdate(req.params.id, staff);
      res.redirect(staff.url);
    }
  }),
];
