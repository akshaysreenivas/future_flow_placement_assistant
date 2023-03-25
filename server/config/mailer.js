const nodemailer = require("nodemailer");



module.exports = (email, subject, text) => {
    return new Promise((resolve, reject) => {

        // Set the email options
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: subject,
            html: text
        };
        const transporter = nodemailer.createTransport({
            service: process.env.NODEMAILER_SERVICE,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            },
        });

        //sending email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("mail not sent: " + error);
                reject({ status: false });
            } else {
                console.log("mail sent: " + info.response);
                resolve({ status: true });
            }
        });
    });
};

