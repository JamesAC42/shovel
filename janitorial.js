const {sendEmail, getEmailContent} = require("./email/sendEmail");

const {
    html,
    text,
    subject
} = getEmailContent("newsletter-08-18-2024");
sendEmail("ovelsh.feedback@gmail.com",subject,html,text);
console.log("done");