const isValidEmail = require("./emailValidation");
const isValidPhoneNumber = require("./phoneValidation");
const isValidName = require("./nameValidation");


function validateFormFields(formData) {
    const errors = [];

    const { firstName, lastName, otherNames, email, phone, gender } = formData;

    if (!firstName || !lastName) {
        errors.push("First name and last name are required.");
    } else {
        if (!isValidName(firstName)) {
            errors.push("First name cannot contain numbers and must be at least 1 character long.");
        }
        if (!isValidName(lastName)) {
            errors.push("Last name cannot contain numbers and must be at least 1 character long.");
        }
    }

    if (otherNames && !isValidName(otherNames)) {
        errors.push("Other names cannot contain numbers.")
    }

    if (!isValidEmail(email)) {
        errors.push("The email must be a valid email with @ and .")
    }

    if (!isValidPhoneNumber(phone)) {
        errors.push("The phone number must be a specific number of characters (11 characters long).");
    }

    if (!gender) {
        errors.push("Gender is required.")
    }

    return errors;
}

module.exports = validateFormFields;


