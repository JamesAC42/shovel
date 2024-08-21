const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const fs = require('fs');
const path = require('path');

const emailCredentials = require("../google_auth.json");
const {
    client_id, client_secret, refresh_token
} = emailCredentials;

const email = "ovelsh.feedback@gmail.com";

const createTransporter = async () => {

    const oauth2Client = new OAuth2(
        client_id,
        client_secret,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: refresh_token
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                console.log(err);
                reject("Failed to create access token :(");
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: email,
            accessToken,
            clientId: client_id,
            clientSecret: client_secret,
            refreshToken: refresh_token,
        },
    });

    return transporter;
};

let emailTransporter;
const getTransporter = async () => {
    if (!emailTransporter) {
        emailTransporter = createTransporter();
    }
    return emailTransporter;
}

const getEmailContent = (folder) => {

    // Read the email template
    const emailTemplateHTMLPath = path.join(__dirname, folder, 'emailTemplate.html');
    const emailTemplateHTML = fs.readFileSync(emailTemplateHTMLPath, 'utf8');
    const emailTemplatePath = path.join(__dirname, folder, 'emailTemplate.txt');
    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');

    const emailSubjectPath = path.join(__dirname, folder, 'subject.txt');
    const emailSubject = fs.readFileSync(emailSubjectPath, 'utf8');
    const subject = emailSubject.trim().replace(/\s+/g, ' ');

    return {
        text: emailTemplate,
        html: emailTemplateHTML,
        subject
    }
}

const sendEmail = async (email, subject, html, text) => {

    let transporter = await getTransporter();
    await transporter.sendMail({
        subject: subject,
        text: text,
        html: html,
        to: email,
        from: '"Shovel Productivity Team" <ovelsh.feedback@gmail.com>',
        replyTo: "ovelsh.feedback@gmail.com"
    });

}

module.exports = {
    getEmailContent,
    sendEmail
};