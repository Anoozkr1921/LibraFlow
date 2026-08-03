const verifyEmailTemplate = (name, verificationUrl) => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="font-family:Arial;background:#f5f5f5;padding:40px;">

<div style="max-width:600px;margin:auto;background:white;padding:40px;border-radius:10px;">

<h1 style="color:#2563eb;">
📚 Welcome to LibraFlow
</h1>

<p>Hello <strong>${name}</strong>,</p>

<p>
Thank you for registering.
Please verify your email by clicking the button below.
</p>

<div style="margin:30px 0;">
<a href="${verificationUrl}"
style="
background:#2563eb;
color:white;
padding:14px 25px;
text-decoration:none;
border-radius:6px;
">
Verify Email
</a>
</div>

<p>
If you didn't create this account,
please ignore this email.
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

module.exports = verifyEmailTemplate;