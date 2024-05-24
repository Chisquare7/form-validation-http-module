function isValidName(name) {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(name)
}

module.exports = isValidName;