const cron = require("node-cron");

const Borrow = require("../models/Borrow");

const calculateFine = require("../utils/fineCalculator");

const {
    sendOverdueEmail,
} = require("../services/emailService");


// ======================================================
// CHECK OVERDUE BOOKS
// ======================================================

const checkOverdueBooks = async () => {

    try {

        console.log(
            "Checking for overdue books..."
        );


        // ------------------------------------------
        // 1. Current time
        // ------------------------------------------

        const now = new Date();


        // ------------------------------------------
        // 2. Find overdue borrow records
        // ------------------------------------------

        const borrows = await Borrow.find({

            // Book hasn't been returned
            status: "borrowed",

            // Due date has already passed
            dueDate: {
                $lt: now,
            },

            // Don't send the same overdue email again
            overdueReminderSent: false,

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
            `Found ${borrows.length} overdue book(s).`
        );


        // ------------------------------------------
        // 3. Process each overdue book
        // ------------------------------------------

        for (const borrow of borrows) {


            // Safety check
            if (
                !borrow.student ||
                !borrow.book
            ) {
                continue;
            }


            // --------------------------------------
            // 4. Calculate current fine
            // --------------------------------------

            const fineData = calculateFine(
                borrow.dueDate
            );


            // --------------------------------------
            // 5. Update fine in database
            // --------------------------------------

            borrow.fine = fineData.fine;


            // --------------------------------------
            // 6. Send overdue email
            // --------------------------------------

            await sendOverdueEmail(

                borrow.student.name,

                borrow.student.email,

                borrow.book.title,

                borrow.dueDate,

                fineData.lateDays,

                fineData.fine
            );


            // --------------------------------------
            // 7. Mark email as sent
            // --------------------------------------

            borrow.overdueReminderSent = true;


            await borrow.save();


            console.log(
                `Overdue reminder sent to ${borrow.student.email}`
            );
        }

    } catch (error) {

        console.error(
            "Overdue cron error:",
            error.message
        );
    }
};


// ======================================================
// RUN EVERY DAY AT 9 AM
// ======================================================

cron.schedule(
    "0 9 * * *",
    checkOverdueBooks
);


console.log(
    "Overdue cron job started."
);