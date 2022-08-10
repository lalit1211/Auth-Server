const nodemailer = require("nodemailer");

const sendMail = async (options) => {
	//` create reusable transporter object using the default SMTP transport
	var transport = nodemailer.createTransport({
		host: "smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "ec6114c64d055a",
			pass: "61f10ba535e29b",
		},
	});

	//` send mail with defined transport object
	const mailOptions = {
		from: "Hello From Let's walk <contact@letswalk.com>",
		to: options.to,
		subject: options.subject,
		text: options.text,
		// html: options.html,
	};

	await transport.sendMail(mailOptions);
};

module.exports = sendMail;
