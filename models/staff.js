const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StaffSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

// Virtual for this genre instance URL.
StaffSchema.virtual("url").get(function () {
  return "/catalog/staff/" + this._id;
});

// Export model.
module.exports = mongoose.model("Staff", StaffSchema);
