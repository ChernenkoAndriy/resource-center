// src/api/logic/services/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
    }

    async sendConfirmationEmail(userEmail, token) {
        const confirmLink = `http://localhost:${process.env.PORT}/api/v1/auth/confirm?token=${token}`;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: userEmail,
            subject: 'Підтвердження реєстрації',
            html: `
                <h1>Вітаємо у нашій системі!</h1>
                <p>Будь ласка, підтвердіть свою пошту, натиснувши на кнопку нижче:</p>
                <a href="${confirmLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                    Підтвердити пошту
                </a>
                <p>Або перейдіть за посиланням: ${confirmLink}</p>
            `
        };

        return await this.transporter.sendMail(mailOptions);
    }

    async sendPasswordResetEmail(userEmail, token) {
        const resetLink = `http://localhost:5173/reset-password?token=${token}`;

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: userEmail,
            subject: 'Відновлення пароля',
            html: `
            <h1>Запит на зміну пароля</h1>
            <p>Ви отримали цей лист, тому що ви (або хтось інший) подали запит на скидання пароля для вашого акаунта.</p>
            <p>Будь ласка, натисніть на кнопку нижче для встановлення нового пароля:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; display: inline-block;">
                Змінити пароль
            </a>
            <p>Якщо ви не робили цього запиту, просто ігноруйте цей лист.</p>
            <p>Посилання дійсне протягом 1 години.</p>
        `
        };

        return await this.transporter.sendMail(mailOptions);
    }

    async sendOverdueReminder(userEmail, bookTitle, dueDate) {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: userEmail,
            subject: 'Нагадування: Термін повернення книги протерміновано',
            html: `
            <div style="font-family: sans-serif; border: 1px solid #e74c3c; padding: 20px;">
                <h2 style="color: #e74c3c;">У вас є заборгованість!</h2>
                <p>Книга: <strong>"${bookTitle}"</strong> мала бути повернена до ${new Date(dueDate).toLocaleDateString()}.</p>
                <p>Будь ласка, поверніть книгу найближчим часом, щоб уникнути блокування аккаунта.</p>
            </div>
        `
        };
        return await this.transporter.sendMail(mailOptions);
    }
}

module.exports = new EmailService();