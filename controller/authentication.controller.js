const User = require("../database/models/user.model");
const _Error = require("../utils/_Error.js");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const send_Mail = require("../utils/send_mails");

module.exports.signUp = catchAsync(async (req, res, next) => {
	const { name, email, password, confirmPassword } = req.body;
	console.log(req.body);
	if (password !== confirmPassword) {
		return next(new _Error("Password do not match 😁", 400));
	}

	const user = await User.create({
		name,
		email,
		password,
		confirmPassword,
	});

	const token = jwt.sign(
		{
			id: user._id,
			name: user.name,
			email: user.email,
			username: user.username,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "24h",
		},
	);

	_(user);
	console.log(token, "<==");

	res.cookie("authorization", token, {
		expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24),
		// httpOnly: true,
		// secure: process.env.NODE_ENV === "production",
	});

	res.status(200).json({
		status: "success",
		data: { user, token },
	});
});

// ******************************* SignIN *********************************
module.exports.signIn = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email && !password) {
		return next(
			new _Error("Please provide email and password", 400),
		);
	}

	const user = await User.findOne({ email }).select("+password");
	const user_ = await User.findOne({ email });

	if (!user) {
		return next(new _Error("Invalid email/user", 401));
	}

	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		return next(new _Error("Password is wrong", 401));
	}

	const token = jwt.sign(
		{
			name: user.name,
			email: user.email,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "24h",
		},
	);

	res.cookie("authorization", token, {
		expiresIn: new Date(Date.now() + 1000 * 60 * 60 * 24),
	});

	res.status(200).json({
		status: "success",
		message: `Welcome back ${user.name}`,
		data: { user_, token },
	});
});

// ******************************** Forget Password ***********************************
module.exports.forgetPassword = catchAsync(async (req, res, next) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		return next(
			new _Error(
				`User with the email ${email} does not exist`,
				400,
			),
		);
	}

	await user.generateOTP();

	await send_Mail({
		to: email,
		subject: "Reset Password OTP ",
		text: `Your OTP is ${user.OTP}`,
	});

	res.status(200).json({
		status: "success",
		message: "OTP sent to your email",
	});
});
// ***************************** Reset Password ******************************
module.exports.resetPassword = catchAsync(async (req, res, next) => {
	const { OTP } = req.query;

	if (!OTP) {
		return next(new _Error("Please provide OTP", 400));
	}

	const user = await User.findOne({ OTP });

	if (!user) {
		return next(new _Error("Invalid OTP", 404));
	}

	if (user.OTPExpiry < Date.now()) {
		return next(new _Error("OTP expired", 404));
	}

	const { password, confirmPassword } = req.body;

	if (password !== confirmPassword) {
		return next(new _Error("Passwords do not match 😁😁", 400));
	}

	user.password = password;
	user.confirmPassword = confirmPassword;

	user.OTP = undefined;
	user.OTPExpiry = undefined;

	await user.save();

	res.status(200).json({
		status: "success",
		message: "Password reset successfully",
	});
});
