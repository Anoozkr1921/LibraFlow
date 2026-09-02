const overdueEmailTemplate = (
    name,
    bookTitle,
    dueDate,
    lateDays,
    fine
) => {

    return `
<!DOCTYPE html>

<html>

<head>
    <meta charset="UTF-8">
</head>

<body
    style="
        font-family: Arial;
        background: #f5f5f5;
        padding: 40px;
    "
>

<div
    style="
        max-width: 600px;
        margin: auto;
        background: white;
        padding: 40px;
        border-radius: 10px;
    "
>

<h1 style="color:#dc2626;">
    📚 LibraFlow - Book Overdue
</h1>

<p>
    Hello <strong>${name}</strong>,
</p>

<p>
    The following book has not been returned yet
    and is now overdue.
</p>

<h2>
    ${bookTitle}
</h2>

<p>
    <strong>Due Date:</strong>
    ${new Date(dueDate).toDateString()}
</p>

<p>
    <strong>Late By:</strong>
    ${lateDays} day(s)
</p>

<p>
    <strong>Current Fine:</strong>
    ₹${fine}
</p>

<p>
    Please return the book as soon as possible
    to prevent additional fines.
</p>

<hr>

<p style="color:gray;">
    LibraFlow Library Management System
</p>

</div>

</body>

</html>
`;
};

module.exports = overdueEmailTemplate;