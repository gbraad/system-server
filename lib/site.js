var index = function(req, res) {
    res.sendFile('/index.html', { root: __dirname + "/public" });
};

module.exports = {
	index: index
};