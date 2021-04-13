const jwt = require('jsonwebtoken');


exports.verify = (req, res, next) => {
    const token = req.headers.authorization;

    if (token == null) {
        res.status(401).json({error: 'please provide a token'});
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({error: 'failed to authenticate token'});
        }
        req.user = user;
        next();
    });
}