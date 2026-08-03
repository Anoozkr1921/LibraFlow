const axios = require("axios");

axios
    .get("https://api.brevo.com")
    .then((res) => {
        console.log("Success:", res.status);
    })
    .catch((err) => {
        console.log("Error:");
        console.log("Code:", err.code);
        console.log("Message:", err.message);
    });