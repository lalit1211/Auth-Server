const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

const origin = ["http://localhost:3000", "http://localhost:3001"];

app.use(
	cors({
		origin,
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());

// we have to add routes

// app.use("/api/v1/", require("./routes/index.routes"));
const authRouter = require("./routes/authentication.routes");
app.use("/api/v1/", authRouter);

// ****************** Global error handling
app.use((err, req, res, next) => {
	const errorStatus = err.statusCode || 500;
	const message = err.message || "Something went wrong";
	const status = err.status || "error";

	res.status(errorStatus).json({ message, status });
});

// ********************* Error handling for unknown path or url

app.all("8", (req, res) => {
	res.status(400).json({
		status: "fail",
		message: "Not found",
	});
});

module.exports = app;
