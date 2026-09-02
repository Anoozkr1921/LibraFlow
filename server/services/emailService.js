const axios = require("axios");

const verifyEmailTemplate = require("../templates/verifyEmail");
const dueReminderTemplate = require("../templates/dueReminder");
const overdueEmailTemplate = require("../templates/overdueEmail");


// ======================================================
// SEND VERIFICATION EMAIL
// ======================================================

const sendVerificationEmail = async (
    name,
    email,
    token
) => {

    const verificationUrl =
        `${process.env.SERVER_URL}/api/auth/verify-email/${token}`;

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

                htmlContent: verifyEmailTemplate(
                    name,
                    verificationUrl
                ),
            },

            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        console.log(
            "Verification email sent:",
            response.data
        );

    } catch (error) {

        console.log(
            "Verification email error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ======================================================
// SEND DUE REMINDER EMAIL
// ======================================================

const sendDueReminderEmail = async (
    name,
    email,
    bookTitle,
    dueDate
) => {

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

                subject: "Library Book Due Reminder",

                htmlContent: dueReminderTemplate(
                    name,
                    bookTitle,
                    dueDate
                ),
            },

            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        console.log(
            "Due reminder sent:",
            response.data
        );

    } catch (error) {

        console.log(
            "Due reminder error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// ======================================================
// SEND OVERDUE EMAIL
// ======================================================

const sendOverdueEmail = async (
    name,
    email,
    bookTitle,
    dueDate,
    lateDays,
    fine
) => {

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

                subject: "Library Book Overdue",

                htmlContent: overdueEmailTemplate(
                    name,
                    bookTitle,
                    dueDate,
                    lateDays,
                    fine
                ),
            },

            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        console.log(
            "Overdue email sent:",
            response.data
        );

    } catch (error) {

        console.log(
            "Overdue email error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


module.exports = {
    sendVerificationEmail,
    sendDueReminderEmail,
    sendOverdueEmail,
};