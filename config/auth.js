module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.send("Error: Please log in to view this resource")
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
            return res.send(401);
        }
    }
}
//middlewear to protect routes