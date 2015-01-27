var Autolinker = require('autolinker');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;
var ObjectId = mongoose.Types.ObjectId;
var redirectingTable = require("./models/redirectingTable.js");
var cheerio = require('cheerio');

	var MailUtils = function(config) {

		var _createUniqueId = function() {
			return new ObjectId();
		};

		var replaceUrlByRedirectingUrl = function(entry) {
			redirectingTable.createNewEntry(entry, function(err, result) {
				return;
			});
			return config.hostName + config.rederictingPath + "?id=" + entry._id.toString();
		};

		var getUnsubscribeLink = function(entry) {
			redirectingTable.createNewEntry(entry, function(err, result) {
				return;
			});
			return config.hostName + config.unsubscribePath + "?id=" + entry._id.toString();
		};

		var getOpenRateLink = function(entry) {
			redirectingTable.createNewEntry(entry, function(err, result) {
				return;
			});
			return config.hostName + config.openRatePath + "?id=" + entry._id.toString();
		};

		var _addUrlTracking = function(htmlContent, email, campaignId, createUniqueId) {
			return Autolinker.link(htmlContent, {
				replaceFn: function(autolinker, match) {
					switch (match.getType()) {
						case 'url':
							var tag = autolinker.getTagBuilder().build(match);
							var entry = {
								_id: createUniqueId || _createUniqueId,
								email: email,
								url: tag.href,
								campaignId: campaignId
							};

							tag.attrs.href = replaceUrlByRedirectingUrl(entry);
							return tag;
						default:
							return true;
					};
				}
			});
		};
		var _addUnsubscribeLink = function(htmlContent, email, campaignId, createUniqueId) {
			var entry = {
				_id: createUniqueId || _createUniqueId,
				email: email,
				url: "http://efektjow.pl",
				campaignId: campaignId
			};
			console.log('Entry!!!' +  entry);
			return (htmlContent.indexOf('#Unsubscribe#') > -1) ? htmlContent.replace('#Unsubscribe#', '<a href="' + getUnsubscribeLink(entry) + '" target="_blank">Nie chcę więcj otrzymywać maili od zmieleni.pl i efektjow.pl</a>') : htmlContent;
		};

		var _addOpenRateTracking = function(htmlContent, email, campaignId, createUniqueId) {
			var entry = {
				_id: createUniqueId || _createUniqueId,
				email: email,
				url: config.hostName + config.openRatePath,
				campaignId: campaignId
			};
			return (htmlContent.indexOf('#OpenRate#') > -1) ? htmlContent.replace('#OpenRate#', '<img src="' + getOpenRateLink(entry) + '" height="0" width="0"/>') : htmlContent;
		};

		var _replaceExistingUrlByTracking = function(htmlContent, email, campaignId, createUniqueId) {
			$ = cheerio.load(htmlContent);
			$("a").attr("href", function(i, val) {
			var entry = {
				_id: createUniqueId || _createUniqueId,
				email: email,
				url: val,
				campaignId: campaignId
			};
			return replaceUrlByRedirectingUrl(entry);
			});
			return $.html();
		};

		var _replaceNickName = function(htmlContent, nick, campaignId, createUniqueId) {
				console.log("nick " + nick);
				return htmlContent.replace(/#Nick#/g, nick);				
			}; 

		var _wrapMailInTrackingUrls = function(htmlContent,email,nick, campaignId, createUniqueId) {
			htmlContent = _replaceNickName(htmlContent, nick, campaignId, createUniqueId);			
			htmlContent = _replaceExistingUrlByTracking(htmlContent, email, campaignId, createUniqueId);
			htmlContent = _addUrlTracking(htmlContent, email, campaignId, createUniqueId);
			htmlContent = _addUnsubscribeLink(htmlContent, email, campaignId, createUniqueId);
			htmlContent = _addOpenRateTracking(htmlContent, email, campaignId, createUniqueId);
			return htmlContent;				
		};

		return {
//			addUrlTracking: _addUrlTracking,
//			addOpenRateTracking: _addOpenRateTracking,
//			addUnsubscribeLink: _addUnsubscribeLink,
//			replaceExistingUrlByTracking: _replaceExistingUrlByTracking
			wrapMailInTrackingUrls : _wrapMailInTrackingUrls
		}
	};

module.exports = MailUtils;