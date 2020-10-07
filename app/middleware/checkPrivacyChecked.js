module.exports = function(req,res,next){
    if (req.body.hasOwnProperty("privacy-checkbox")){
        if (!(req.body["privacy-checkbox"]==="on")){
            req.error = true;
            req.flash('pins', "Please check privacy statement");
        }
    } else{
        
        req.error = true;
        req.flash('index', "Please check privacy statement");

        // window.alert("Hello! Please check privacy statement!");

    }
    next();

}