const nodemailer = require('nodemailer');
// const pug = require('pug');
// const juice = require('juice');
// const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'cassiopaixaoti@gmail.com',
      pass: 'myGmailPassword',
  }
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  const inlined = juice(html);
  return inlined;
};

exports.send = async (options) => {
  // const html = generateHTML(options.filename, options);
  // const text = htmlToText.fromString(html);
  const text = 'opa';

  const mailOptions = {
    from: `Cássio Paixão <noreply@demoapp.com>`,
    to: options.user.email,
    subject: options.subject,
    text
  };
  // html,
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
