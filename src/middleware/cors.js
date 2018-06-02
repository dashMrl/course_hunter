function cors(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Credentials', true)
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
}

export {
    cors
}