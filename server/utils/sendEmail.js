const axios = require("axios");

const sendEmail = async ({
    to,
    toName = "",
    subject,
    htmlContent,
}) => {

    try {

        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: process.env.EMAIL_FROM_NAME,
                    email: process.env.EMAIL_FROM,
                },

                to: [
                    {
                        name: toName,
                        email: to,
                    },
                ],

                subject,

                htmlContent,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        console.log("Email Sent Successfully");

        return response.data;

    } catch (error) {

        console.log("========== BREVO ERROR ==========");

        console.log(
            error.response?.data || error.message
        );

        console.log("===============================");

        throw error;
    }

};

module.exports = sendEmail;