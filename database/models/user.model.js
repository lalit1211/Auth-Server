const { model } = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = require("../schema/user.schema");

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 12);
		this.confirmPassword = undefined;
	}

	next();
});

userSchema.methods.generateOTP = async function () {
	this.OTP = Math.floor(Math.random() * 1000000);
	this.OTPExpiry = new Date(Date.now() + 1000000);

	await this.save({ validateBeforeSave: false });
};

const User = model("user", userSchema);

module.exports = User;
