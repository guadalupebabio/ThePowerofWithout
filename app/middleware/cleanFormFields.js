// Middleware which cleans spaces from all form inputs
module.exports = function(req, res, next){
  if(req.error) next();
  else {
    for(let field in req.body){
      if(req.body.hasOwnProperty(field)) req.body[field] = req.body[field].trim();
    }

    next();
  }
};
