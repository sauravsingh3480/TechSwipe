const validator = require("validator");

const signUpDataSanitization = (req) => {
    const { firstName, lastName, age, gender, emailId, password } = req.body;

    if (!firstName || !age || !gender || !emailId || !password) {
        throw new Error("Enter all required fields");
    }
    else if (firstName.length < 3) {
        throw new Error("First Name is not correct");
    }
    else if (age <= 0) {
        throw new Error("Age must be greater than 0");
    }
    else if (!["Male", "Female", "Other"].includes(gender)) {
        throw new Error("Gender is not correct");
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not correct");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password");
    }

}

const updateDataSanitization = (req) => {
    const user = req.user;
    const { firstName, lastName, age, gender, emailId, password, profileImageURL, skills, bio } = req.body;

    if (firstName.length < 3) {
        throw new Error("First Name is not correct");
    }
    else if (age <= 0) {
        throw new Error("Age must be greater than 0");
    }
    else if (!["Male", "Female", "Other"].includes(gender)) {
        throw new Error("Gender is not correct");
    }
    else if (emailId && emailId != user.emailId) {
        throw new Error("Can not change emailId");
    }
    else if (password) {
        throw new Error("Invalid entry password");
    }
    else if (profileImageURL && !validator.isURL(profileImageURL)) {
        throw new Error("Invalid image URL");
    }
    else if (skills && skills.length > 10) {
        throw new Error("Add atmost 10 skills");
    }
}

const updatePasswordDataSanitization = (req) => {
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword) {
        throw new Error("Please fill all required fields");
    }
    else if (newPassword !== confirmPassword) {
        throw new Error("New password and Confirm password should be same");
    }
    else if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Enter strong password");
    }
}

const feedCreateSanitization = (req) => {
    const { feedImageURL, caption } = req.body;

    if (!feedImageURL) {
        throw new Error("Please upload a picture");
    }
    else if (!validator.isURL(feedImageURL)) {
        throw new Error("Invalid image");
    }
    else if (caption && caption.length > 250) {
        throw new Error("Add short description");
    }
}

module.exports = {
    signUpDataSanitization,
    updateDataSanitization,
    updatePasswordDataSanitization,
    feedCreateSanitization
};