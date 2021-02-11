// Middleware which validates the email address
module.exports = function(req, res, next){
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(req.error == null && !re.test(req.body.email)) {
    req.flash('form-error', "Please enter a valid email address");
    req.error = true;
  }

  next();
}
