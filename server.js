import express from "express";
import nodemailer from "nodemailer";
import "dotenv/config";
import twilio from "twilio";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.html");
});

app.post("/registro", async (req, res) => {
  const { nombre, apellido, email, password, telefono, mensaje } = req.body;

  let htmlTemplate = `
    <h1>Bienvenido ${nombre} ${apellido}</h1>
    <p>
      Su correo ${email} ha sido registrado con éxito.
    </p>
  `;

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.USER_ETHEREAL,
      pass: process.env.PASS_ETHEREAL,
    },
  });

  const sendedEmail = await transporter.sendMail({
    from: '"Laurita 👻"',
    to: email,
    subject: "Email de prueba",
    text: "Hello world?",
    html: htmlTemplate,
  });

  const twilioAccount = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  twilioAccount.messages.create({
    body: "Hello from Twilio!",
    to: "whatsapp+541151036298",
    from: "whatsapp+14155238886", // From a valid Twilio number
  });
  res.send("Email enviado");
});
/** Enviar un mensaje a twilio whatsapp+14155238886
 *  con tu sandbox name (algo como 'join blue-spider')
 *  para habilitar recibir mensajes de twilio
 */
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(
    `🚀 Server started on PORT ${PORT} at ${new Date().toLocaleString()}`
  )
);
server.on("error", (err) => console.log(err));
