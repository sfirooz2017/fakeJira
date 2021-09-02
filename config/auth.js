module.exports = {
    ensureAuthenticated: function(req, res, next){
        //check for an authenticated user session
        if(req.isAuthenticated()){
            return next();
        }
        return res.send(401);
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
            return res.send(403);
        }
    },
    ensureUser: function(req, res, next){

        //restrict user access to only their own information
        if (!req.user) res.send(401)
        //var tasks = req.user.tasks;
       // var lists = req.user.lists;
        var id = req.query.id;

        //check if id exists in either array of user objs
        var tasks = Boolean(req.user.tasks.find(x => x._id === id))
        var lists = Boolean(req.user.lists.find(x => x._id === id))

        if(req.user.role == 'ADMIN' || tasks || lists)
            return next();
        else
            return res.send(403)
        
        // req.flash('error_msg', 'Please log in to view that resource');
        // return res.send(401);
    }
}
//middlewear to protect routes