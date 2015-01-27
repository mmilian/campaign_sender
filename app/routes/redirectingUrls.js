		var bus = require("../utility/globalEventBus.js");
//var redirectingTable = require("../models/redirectingTable.js");
var _ = require('lodash');

var RedirecitngUrl = function(config, redirectingTable, app) {
	var redirecitngUrlMap = {};
	redirecitngUrlMap[config.rederictingPath] = {
		//method: 'get',
		fn: function(req, res) {
			redirectingTable.findUrlById(req.query.id, function(redirectUrl) {				
				res.redirect(302, redirectUrl);
				bus.emitEvent('link_clicked', req.query.id);
			});
		}
	};
	app.get("/unsubscribe", function(req, res) {
		console.log(req.query.id);
		//console.log(req);
		redirectingTable.findUrlById(req.query.id, function(redirectUrl) {
			console.log('redirecitngUrl' +redirectUrl);
			res.redirect(302, redirectUrl);
			bus.emitEvent('unsubscribe_clicked', req.query.id);
		})
	});
	/*redirecitngUrlMap[config.unsubscribePath] = {
		//method: 'get',
		fn: function(req, res) {
			res.redirect(302, config.hostName);
			bus.emitEvent('unsubscribe_clicked', req.hash);
		}
	};*/
	_.forOwn(redirecitngUrlMap, function(value, key) {
		var func = app[value.method];
		console.log('key ' + JSON.stringify(key) + 'value ' + JSON.stringify(value) + " " + redirecitngUrlMap[key].fn);
		app.get(key, redirecitngUrlMap[key].fn);
	});
	return redirecitngUrlMap;
};



/*app.get('/', function (req, res) {
    res.render('index');
  });
*/
/*module.exports = function (app) {
  app.get('/', function (req, res) {
    res.render('index');
  });
}*/



module.exports = RedirecitngUrl;