"use strict";
const api = require('./libs/TvGidsApi');
const flowProcessor = require('./flowProcessor');


function init() {
	
	console.log("Starting");
	var processor = new flowProcessor();
	processor.init();

	

}

module.exports.init = init;