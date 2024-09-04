// import modules:
import nodemailer from "nodemailer";
// send email function:
export const sendEmail = async ({to = '', subject = '', html = ''}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "helwasalma50@gmail.com",
      pass: "toxptakvhfbylxaz",
    },
  });

const info = await transporter.sendMail({
  from: 'e-commerce', // sender address
  to, // list of receivers
  subject, // Subject line
  html, // html body
});

};
