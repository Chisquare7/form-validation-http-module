function isValidPhoneNumber(phone) {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone)
}

module.exports = isValidPhoneNumber;