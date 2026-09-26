const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        console.log("COOKIE:", req.cookies);
        console.log("TOKEN:", req.cookies.token);
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Not authenticated"
            });
        }

        const decoded = jwt.verify(token, "secretkey");
        console.log("DECODED:", decoded);
        req.userId = decoded.id;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = auth;