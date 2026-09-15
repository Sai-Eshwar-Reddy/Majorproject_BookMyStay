module.exports.isLoggedin = (req,res,next)=>{
    if(req.isAuthenticated())
    {
        next();
    }
    else
    {
        req.session.redirectUrl = req.originalUrl;
        res.render("users/isloggedin.ejs");
    }
}

module.exports.saveredirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
