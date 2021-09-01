module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        return res.send(401);
       // res.send("UNAUTHORIZED")
        console.log(req.user);
    },
    forwardAuthenticated: function(req, res, next) {
        if (!req.isAuthenticated()) {
          return next();
        }
        res.redirect('/dashboard');      
      }, 
    ensureAdmin: function(req, res, next) {
        // ensure authenticated user exists with admin role, 
        // otherwise send 401 response status
        if (req.user && req.user.role == 'ADMIN') {
            return next();
        } else {
            return res.send(402);
        }
    }
}
//middlewear to protect routes