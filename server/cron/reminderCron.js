const cron = require("node-cron");

const Borrow = require("../models/Borrow");
const {
    sendDueReminderEmail,
} = require("../services/emailService");

const sendDueReminders = async () => {

    try {

        console.log("Checking for books due tomorrow...");

        // ----------------------------------------
        // 1. Get today's date
        // ----------------------------------------

        const today = new Date();

        // ----------------------------------------
        // 2. Calculate tomorrow
        // ----------------------------------------

        const tomorrow = new Date(today);

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        // ----------------------------------------
        // 3. Start of tomorrow
        // ----------------------------------------

        const startOfTomorrow = new Date(tomorrow);

        startOfTomorrow.setHours(
            0,
            0,
            0,
            0
        );

        // ----------------------------------------
        // 4. End of tomorrow
        // ----------------------------------------

        const endOfTomorrow = new Date(tomorrow);

        endOfTomorrow.setHours(
            23,
            59,
            59,
            999
        );

        // ----------------------------------------
        // 5. Find eligible borrow records
        // ----------------------------------------

        const borrows = await Borrow.find({

            // Book has not been returned
            status: "borrowed",

            // Book is due tomorrow
            dueDate: {
                $gte: startOfTomorrow,
                $lte: endOfTomorrow,
            },

            // Reminder hasn't been sent yet
            reminderSent: false,

        })
            .populate(
                "student",
                "name email"
            )
            .populate(
                "book",
                "title"
            );

        console.log(
            `Found ${borrows.length} reminder(s) to send.`
        );

        // ----------------------------------------
        // 6. Process each borrow record
        // ----------------------------------------

        for (const borrow of borrows) {

            // Safety check
            if (
                !borrow.student ||
                !borrow.book
            ) {
                continue;
            }

            // ----------------------------------------
            // 7. Send reminder email
            // ----------------------------------------

            await sendDueReminderEmail(
                borrow.student.name,
                borrow.student.email,
                borrow.book.title,
                borrow.dueDate
            );

            // ----------------------------------------
            // 8. Mark reminder as sent
            // ----------------------------------------

            borrow.reminderSent = true;

            await borrow.save();

            console.log(
                `Reminder sent to ${borrow.student.email}`
            );
        }

    } catch (error) {

        console.error(
            "Reminder cron error:",
            error.message
        );

    }
};


// ----------------------------------------
// Run every minute for testing
// ----------------------------------------

cron.schedule(
    "0 9 * * *",
    sendDueReminders
);


console.log(
    "Reminder cron job started."
);