const chalk = require("chalk");

global.__ = console.log;
global._ = (para) => {
	console.log(chalk.blue(para));
};
global._e = (para) => {
	console.log(chalk.red(para));
};

// *************** Setting Up environment variable
const dotenv = require("dotenv");
dotenv.config({
	path: "./.env",
});

// ************** Database configuration
require("./database");

const app = require("./app");

const { PORT } = process.env;

app.listen(PORT, () => {
	_(`----->> Server is running on ${PORT}`);
});
