const jwt = require('jsonwebtoken');

async function authArtist(req, res, next) {
      const cookieToken = req.cookies && req.cookies.token;
      const authHeader = req.headers && req.headers.authorization;
      const bearerToken = authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.slice(7)
          : null;
      const token = cookieToken || bearerToken;

     if(!token){
        return res.status(401).json({
            message: 'Unauthorized'
        });
     }

     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if(decoded.role !== 'artist') {
                return res.status(403).json({ message: "You don't have access to create an album" });
            }
            req.user = decoded; // Attach decoded token to request for later use
            next();

        }
        catch(err){
            console.error(err);
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
}
async function authUser(req, res, next) {
    const cookieToken = req.cookies && req.cookies.token;
    const authHeader = req.headers && req.headers.authorization;
    const bearerToken = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null;
    const token = cookieToken || bearerToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // allow both regular users and artists to access read endpoints
        if (decoded.role !== 'user' && decoded.role !== 'artist') {
            return res.status(403).json({ message: "You don't have access to this resource" });
        }

        req.user = decoded; // Attach decoded token to request for later use
        next();

    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = { authArtist, authUser }