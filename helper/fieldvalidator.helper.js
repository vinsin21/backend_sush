function fieldValidator(validFields, data) {
  const missingFields = [];
  const invalidFields = [];

  validFields.forEach((field) => {
    // Check for missing field
    if (data[field] === "undefined") {
      missingFields.push(field);
    } else {
      // Specific validation logic for email
      // if (
      //   field === "email" &&
      //   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[field])
      // ) {
      //   invalidFields.push({ field: "email", message: "Invalid email format" });
      // }

      // Specific validation logic for password
      if (
        field === "password" &&
        typeof data[field] === "string" &&
        data[field].length < 6
      ) {
        invalidFields.push({
          field: "password",
          message: "Password must be at least 6 characters long",
        });
      }

      // Add other specific validation logic as needed
    }
  });

  return { missingFields, invalidFields };
}
module.exports = { fieldValidator };
