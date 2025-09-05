const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Middleware to protect the route
const protect = async (req, res, next) =>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.user.id).select("-password");
            next();
        }catch(error){
            console.log("Error in auth middleware Token verification : ",error);
            res.status(401).json({message: "Not Authorized, token failed"})
        }
    }else{
        res.status(401).json({message: "Not authorized, No token provided."});
    }
};

module.exports = protect;