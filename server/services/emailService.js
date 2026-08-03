// const axios = require("axios");

// const verifyEmailTemplate = require("../templates/verifyEmail");
// const ApiError = require("../utils/ApiError");

// const sendVerificationEmail = async (
//     name,
//     email,
//     token
// ) => {

//     const verificationUrl =
//         `${process.env.CLIENT_URL}/verify-email/${token}`;

//     try {
//         await axios.post(
//             "https://api.brevo.com/v3/smtp/email",
//             {
//                 sender: {
//                     name: process.env.EMAIL_FROM_NAME,
//                     email: process.env.EMAIL_FROM,
//                 },
//                 to: [
//                     {
//                         email,
//                         name,
//                     },
//                 ],
//                 subject: "Verify your LibraFlow account",
//                 htmlContent: verifyEmailTemplate(
//                     name,
//                     verificationUrl
//                 ),
//             },
//             {
//                 headers: {
//                     "accept": "application/json",
//                     "api-key": process.env.BREVO_API_KEY,
//                     "content-type": "application/json",
//                 },
//             }
//         );
//     } catch (error) {
//         console.error("Email Service Error:", error.response?.data || error.message);
//         throw new ApiError(500, "Failed to send verification email. Please check email service configuration.");
//     }
// };

// module.exports = {
//     sendVerificationEmail,
// };

const axios = require("axios");
const verifyEmailTemplate = require("../templates/verifyEmail");

const sendVerificationEmail = async (name, email, token) => {
    const verificationUrl = `${process.env.SERVER_URL}/api/auth/verify-email/${token}`;

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