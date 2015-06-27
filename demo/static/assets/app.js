/**
 * Demo
 */

/// <reference path="../../../typings/tsd.d.ts" />

// constants
var
	HEADER_NAME = 'x-demo-session-token';
	
var
	buttonCount,
	buttonMetrics,
	buttonDemo,
	buttonNewToken,
	inputToken,
	outputResult;

var HttpService = function () {
	
	this.token = '';
};

HttpService.prototype.getCount = function () {
	return this._get('/count');
};

HttpService.prototype.getMetrics = function () {
	return this._get('/metrics/header-session');
};

HttpService.prototype.getToken = function () {
	return this.token;
};

HttpService.prototype.removeToken = function () {
	this.token = '';
};

HttpService.prototype._get = function (url) {
	var
		_self = this;
		
	return $.ajax({
		url: url,
		beforeSend: function (xhr) {
			xhr.setRequestHeader(HEADER_NAME, _self.getToken());
		},
		cache: false,
		contentType: 'application/json',
		dataType: 'json',
	}).done(function (data, status, xhr) {
		_self.token = xhr.getResponseHeader(HEADER_NAME);
		inputToken.val(_self.token);
		console.log(xhr.getAllResponseHeaders());
		console.log('response token: %s', _self.token);
		return data;
	});
};



$(function () {
	var
		http = new HttpService();
	
	buttonCount = $('#buttonCount');
	buttonMetrics = $('#buttonMetrics');
	buttonDemo = $('#buttonDemo');
	buttonNewToken = $('#buttonNewToken');
	inputToken = $('#inputToken');
	outputResult = $('#outputResult');
	
	function _clickNewToken(ev) {
		
		http.removeToken();
		inputToken.val('');
		
		return false;
	}
	
	
	buttonCount.on('click', function (ev) {
		http.getCount().done(
			function (result) {
				outputResult.html(JSON.stringify(result, null, 2));
			}
		);
	});
	
	buttonMetrics.on('click', function (ev) {
		http.getMetrics().done(
			function (result) {
				outputResult.html(JSON.stringify(result, null, 2));
			}
		);
	});
	buttonDemo.on('click', _clickNewToken);
	buttonNewToken.on('click', _clickNewToken);
});

$(document).foundation();
