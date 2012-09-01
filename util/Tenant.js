var express = require('express');

var OAE = require('./OAE');

var tenants = [];

///////////
// Model //
///////////

module.exports.Tenant = function(id, name, port) {
    
    var that = {};

    that.id = id;
    that.name = name;
    that.port = isNaN(port) ? parseInt(port) : port;

    module.exports.startTenant(that);
    tenants.push(that);
    return that;
    
};

///////////////
// Functions //
///////////////

module.exports.getTenants = function() {
    return tenants;
};

module.exports.startTenant = function(tenant) {
    if (tenant && tenant.port) {
        tenant.server = express();
        tenant.server.listen(tenant.port);
        registerAPI(tenant);
        console.log('Start tenant "' + tenant.name + '" on port ' + tenant.port);
    }
};

module.exports.stopTenant = function(tenant) {
    if (tenant && tenant.server) {
        tenant.server.close();
    }
};

/////////
// API //
/////////

var registerAPI = function(tenant) {
    
    tenant.server.get('/tenant/whoami', function(req, res) {
        res.send(tenant.name);
    });
    
    var modules = OAE.getAvailableModules(function(modules) {
        for (var m = 0; m < modules.length; m++) {
            require("../modules/" + modules[m]).init(tenant);
        }
    });
    
};
