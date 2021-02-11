// Middleware which throws an error if any of the form fields are empty
module.exports = function(req, res, next){
  for(let field in req.body){
    if(req.body.hasOwnProperty(field) && !req.body[field].length) {
      req.flash('form-error', "Please fill out all fields");
      req.error = true;
      break;
    }
  }
  next();
}
