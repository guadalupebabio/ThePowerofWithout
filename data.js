export default const sectionDataContainer = {
    header: "fill-in-form",
    sections: [
      {
        label: "Name of the City",
        name: "city",
        type: "text",
        value: "City",
      },
      {
        label: "Name of the Informal Settlement",
        name: "settlement",
        type: "text",
        value: "Settlements",
      },
      {
        label: "Settlement Location (Set a point on the map)",
        name: "geolocation",
        type: "coords",
        value: "Select a point on the map",
      },
      {
        label: "Email Address",
        name: "email",
        type: "text",
        value: "somebody@example.com",
      },
      {
        label: "Privacy Statement",
        name: "privacy-checkbox",
        type: "checkbox",
        value:
          "By submitting your email address, you consent to us keeping you informed about updates to our website and about other products and services that we think might interest you.\
         You can unsubscribe at any time. Please read our Privacy Statement and Terms & Conditions.",
        options: [
          "By submitting your email address, you consent to us keeping you informed about updates to our website and about other products and services that we think might interest you.\
        You can unsubscribe at any time. Please read our Privacy Statement and Terms & Conditions.",
        ],
      },
    ],
  };

  let modalData = {

    description:
      "Thank you for taking the time to fill the survey!  When you continue to the next section,\
       an email will be sent to your account with a link that will allow you to complement or update your responses at any time after you close this window.\
      This is the fist time we are sharing this platform so we very much appreciate any feedback that will help us improve our work.\
       Since every question informs a different part of the taxonomy it is very important that we ask for feedback on each one individually, but \
       this questions are optional. You will be finding along with each questions a series of icons that represent the following and whose responses are unequly \
       link to the question they belong to.",
    icons: [
      {
        image: "./assets/error_outline_24px.png",
        description: "Defines what it is asked in the questions",
      },
      {
        image: "./assets/chat_24px.png",
        description: "Provide feedback about the question (relevance, accuracy, ect) ",
      },

      {
        image: "./assets/link_24px.png",
        description: "Paste any link or reference that might be relevant or informed your response",
      },

      {
        image: "./assets/add_photo_alternate_24px.png",
        description: "Attached a picture if it can be used to back up the reponse provided (not available)",
      },
    ],
  };

  res.render("form", {
    sectionData: sectionDataContainer,
    modalData : modalData,
    url: "/api/settlements",
    notification:
      'Already created a settlement? Edit it <a href = "/contribute/u">here</a>',
    map: true,
    error: req.flash("form-error"),
  });