var config = global.config,
    fs = require('fs'),
    path = require('path'),
    express = global.express;
    
var appsList = [];

var scanDirForApplications = function(dir) {
    var results = [];
    try {
        var files = fs.readdirSync(dir);
        for (var i = 0; i < files.length; i++) {
            var fn = files[i];

            var pkgfn = path.join(dir, fn, "package.json");
            try {
                var pkg = require(pkgfn);
                if (pkg['scripts']) {
                    var appDir = path.join(dir, fn);
                    var localDeployPath = {
                        "type": "local",
                        "directory": appDir
                    }
                    pkg['user'] = 'user';
                    pkg['repository'] = localDeployPath;
                    
                    results.push(pkg);
                }
            } catch(err) {
                console.log("Error");
            }
        }
    } catch(err) {
    }
    
    appsList = results;
    return results;
}

var start = function(req, res) {
    var name = req.body.name;
    console.log('Start: ' + name);
    
    // deploy on appserver
    var haibu = require('haibu');

    // Create a new client for communicating with the haibu server
    var client = new haibu.drone.Client({
      host: '127.0.0.1',
      port: 9002
    });
    
    var appMatchName = appsList.filter(function(item){
        return (item.name === name);
    });
    var app = appMatchName[0];
    
    if(app['started']) {
        // application has already been started before
        res.status(200).end();
        return;
    } else {
        client.start(app, function (err, result) {
            if (err) {
                res.status(500).end();
                console.log(err);
            } else {
                // record as started to prevent re-run of app
                app['started'] = true;
                var httpProxy = require('http-proxy');
                var apiProxy = httpProxy.createProxyServer();
            
                var appUrl = '/apps/' + name;
                var appPort = result.drone.port;
                express.get(appUrl, function(req, res) {
                    var rewriteAppUrl = req.url.replace(appUrl, '/');
                    req.url = rewriteAppUrl;
                    var targetAppUrl = 'http://127.0.0.1:' + appPort;
                    apiProxy.web(req, res, { target: targetAppUrl });
                });
                
                res.status(200).end();
            }
            //res.redirect(appUrl);
        });
    }
}

var list = function(req, res) {
    if (!res.getHeader('Cache-Control'))
        res.setHeader('Cache-Control', 'public, max-age=' + 1);
    
    res.json(appsList);
};

var init = function() {
    scanDirForApplications(config.directories.apps);
}

init();

module.exports = {
	list: list,
	start: start
};
