const dueReminderTemplate = (name, bookTitle, dueDate) => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="font-family:Arial;background:#f5f5f5;padding:40px;">

<div style="max-width:600px;margin:auto;background:white;padding:40px;border-radius:10px;">

<h1 style="color:#2563eb;">
📚 LibraFlow Reminder
</h1>

<p>Hello <strong>${name}</strong>,</p>

<p>
This is a reminder that the following book is due soon:
</p>

<h2>${bookTitle}</h2>

<p>
<strong>Due Date:</strong>
${new Date(dueDate).toDateString()}
</p>

<p>
Please return the book before the due date to avoid a late fine.
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

module.exports = dueReminderTemplate;