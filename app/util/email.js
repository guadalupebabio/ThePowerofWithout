/*
  Handles sign up email
*/

let nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: "login", 
        user: 'thepowerofwithout@gmail.com',
        pass: process.env.EMAIL_PASSWORD
      }
    });

module.exports = function(to, settlement, token){
  let mailOptions = {
    from: 'thepowerofwithout@gmail.com',
    to: to,
    subject: "The Power of Without - MIT collaboration to enable more equitable communities",
    html: `
    Hello,
    <br/>
    <br/>
    Thank you for taking the time to complete the survey!
    <br/>
    <br/>
    Your participation will give voice to an Informal Settlement around the globe, and your comments will be taken into consideration to improve our work. We will keep you updated about the research conducted on “the Power of Without” and if you are interested, it would be an honor to collaborate further.
    <br/>
    <br/>
    We are very appreciative of the time you have taken to assist with our Taxonomy, and we are committed to utilizing this information to implement worthwhile improvements to the world map of informality. New map information is posted to our website. We are also aware that some of the questions asked were challenging and extensive. If you want to edit your response, you can do so here:
    <br/>
    <a href = "https://powerofwithout.herokuapp.com/contribute/u/${settlement}/${token}">https://powerofwithout.herokuapp.com/contribute/u/${settlement}/${token}</a>
    <br/>
    <br/>
    Once again, we are extremely grateful for your contribution, your insight, and your thoughtful suggestions.
    <br/>
    <br/>
    Keep in touch!
    <br/>
    <br/>
    Best,<br/>
    The City Science group
    <br/>
    <br/>
    --
    <br/>
    The Power of Without is an initiative is to identify cost-efficient and lightweight infrastructure systems for deployment in rapidly urbanizing areas.<br/>
    <a href = "http://www.settlementswithout.media.mit.edu">http://www.settlementswithout.media.mit.edu</a><br/>
    Contact: settlements@mit.edu
    `,
    text: `
    Hello,

    Thank you for taking the time to complete the survey!

    Your participation will give voice to an Informal Settlement around the globe, and your comments will be taken into consideration to improve our work. We will keep you updated about the research conducted on “the Power of Without” and if you are interested, it would be an honor to collaborate further.

    We are very appreciative of the time you have taken to assist with our Taxonomy, and we are committed to utilizing this information to implement worthwhile improvements to the world map of informality. New map information is posted to our website. We are also aware that some of the questions asked were challenging and extensive. If you want to edit your response, you can do so here:
    https://powerofwithout.herokuapp.com/contribute/u/${settlement}/${token}

    Once again, we are extremely grateful for your contribution, your insight, and your thoughtful suggestions.

    Keep in touch!

    Best,
    The City Science group
    --
    The Power of Without is an initiative is to identify cost-efficient and lightweight infrastructure systems for deployment in rapidly urbanizing areas.
    www.settlementswithout.media.mit.edu
    Contact: settlements@mit.edu
    `,
  };

  transporter.sendMail(mailOptions, function(error, info){
    // console.log("This is the password",process.env.EMAIL_PASSWORD)
    console.log(error);
    console.log(info);
  });
}
