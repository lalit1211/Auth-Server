const { connection, connect } = require("mongoose");

const { DB_URL } = process.env;

connect(DB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

connection.on("connected", () => {
	_("----->> Connected to database");
});

connection.on("error", (error) => {
	_e("Error connecting to database: " + error);
});
