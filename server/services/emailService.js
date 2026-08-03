const axios = require("axios");
const verifyEmailTemplate = require("../templates/verifyEmail");

const sendVerificationEmail = async (name, email, token) => {
    const verificationUrl = `${process.env.SERVER_URL}/api/auth/verify-email/${token}`;

    try {
        console.log("SERVER_URL:", process.env.SERVER_URL);
        console.log("BREVO KEY:", process.env.BREVO_API_KEY?.substring(0, 15));
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: process.env.EMAIL_FROM_NAME,
                    email: process.env.EMAIL_FROM,
                },
                to: [
                    {
                        name,
                        email,
                    },
                ],
                subject: "Verify your LibraFlow account",
                htmlContent: verifyEmailTemplate(name, verificationUrl),
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        console.log("Brevo Success:", response.data);
    } catch (error) {
        console.log("========== BREVO ERROR ==========");
        console.log("Status:", error.response?.status);
        console.log("Data:", JSON.stringify(error.response?.data, null, 2));
        console.log("Code:", error.code);
        console.log("Message:", error.message);
        console.log("=================================");

        throw error;
    }
};

module.exports = {
    sendVerificationEmail,
};