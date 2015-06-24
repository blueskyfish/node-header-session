/**
 * Demo
 */

/// <reference path="../../typings/tsd.d.ts" />

// constants
var
	HEADER_NAME = 'x-demo-session-token';
	
var
	buttonCount,
	inputToken,
	outputResult;

var HttpService = function () {
	
	this.token = '';
};

HttpService.prototype.getCount = function () {
	return this._get('/count');
};

HttpService.prototype.getToken = function () {
	return this.token;
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
	
	// iniitalize
	buttonCount = $('#buttonCount');
	inputToken = $('#inputToken');
	outputResult = $('#outputResult');
	
	
	
	buttonCount.on('click', function (ev) {
		http.getCount().done(
			function (result) {
				outputResult.html(JSON.stringify(result, null, 2));
			}
		);
	});
});
