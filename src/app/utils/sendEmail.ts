import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async(to:string, html:string) =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === 'production', // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "tayyabamerituran@gmail.com",
          pass: "puxs teoo kjhm fniq",
        },
      });

      await transporter.sendMail({
        from: 'tayyabamerituran@gmail.com', // sender address
        to, // list of receivers
        subject: "Forgot your password?Don't worry!! We've got you covered", // Subject line
        text: "", // plain text body
        html, // html body
      });
};