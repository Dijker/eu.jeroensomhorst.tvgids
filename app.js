"use strict";
const api = require('./libs/TvGidsApi');
const flowProcessor = require('./flowProcessor');


function init() {
	
	var processor = new flowProcessor();
	processor.init();

	Homey.on('memwarn', function( data ){
    	console.log('memory above 100mb')
    	console.log('count: ' +  data.count + '/30'); // count: 1/30, 2/30 etc. after count 30, your app is killed
	});

	Homey.on('cpuwarn', function( data ){
    	console.log('cpu above 80%')
    	console.log('count: ' +  data.count + '/30'); // count: 1/30, 2/30 etc. after count 30, your app is killed
	});

}

module.exports.init = init;