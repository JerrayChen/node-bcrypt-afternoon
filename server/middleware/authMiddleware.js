module.exports = {
    userOnly: (req, res, next) => {
        if(req.session.user){
            next();
        }else{
            res.status(401).json('Please log in');
        }
    },
    adminsOnly: (req, res, next) => {
        if(req.session.user.isAdmin){
            next();
        }else{
            res.status(403).json('You are not an admin');
        }
    },
}