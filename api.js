"use strict"
const api = require('./libs/TvGidsApi');


module.exports = [
    {
        description: "Get available channels",
        method: "GET",
        path: "/channels",
        fn: (callback,args)=>{
            console.log("Get available channels");
            var p = new api();
            p.getChannels(function(data){
                console.log("Succesfully retrieved channel data");
                callback(null,JSON.parse(data));
            },function(data){
                console.log("Error while retrieving data");
                callback(data,null);
            });
        }
    },
    {
        description: "Get programs for one or multiple channels",
        method: "GET",
        path:  "/programs",
        fn: (callback,args)=>{
            console.log("Request for program retrieval!!");
            var p = new api();
            if(args.query.hasOwnProperty('channels')){
                var offset = args.query.hasOwnProperty('offset') ? args.query.offset : 0;
                var channels = args.query.channels;
                p.getPrograms(channels,offset,function(data){
                    callback(null,JSON.parse(data));
                },function(data){
                    callback(data);
                });
            }
        }
    },
    {
        description: "Get the current watch list",
        method: "GET",
        path: "/watch",
        fn: (callback,args)=>{
            var value = Homey.manager('settings').get( 'watchlist' );
            if(value != null){
                callback(null,value); // return as plain text;
            }
        }   
    },
    {
        description: "Get the current channel mapping",
        method: "GET",
        path: "/mapping", 
        fn: (callback,args)=>{
            var currentMapping = Homey.manager('settings').get('channelmapping');
            if(currentMapping == null){
                Homey.manager('settings').set('channelmapping',[]);
            }
            var mapping = Homey.manager('settings').get('channelmapping');
            callback(null,mapping);
        }
    },
    {
        description: "Add a channel mapping",
        method: "PUT",
        path: "/mapping",
        fn: (callback,args)=>{
            console.log("Putting new channel mapping");
            console.log(args);
            var value = Homey.manager('settings').get('channelmapping');
            if(value == null){
                value = [];
            }else{
                var newValue = [];
                for(var i = 0; i < value.length;i++){
                    var entry = value[i];
                    if(entry.id != args.body.id){
                        newValue.push(entry);
                    }
                }
                value = newValue;
            }
            

            value.push(args.body);

            Homey.manager('settings').set('channelmapping',value);
            callback(null,Homey.manager('settings').get('channelmapping'));
        }
    },
    {
        description: "Remove a channel mapping",
        method: "DELETE",
        path: "/mapping",
        fn: (callback,args)=>{
            var channelmapping = Homey.manager('settings').get('channelmapping');
            if(channelmapping != null && channelmapping != []){
                if(args.query.hasOwnProperty('id')){
                    var newMapping = [];
                    for(var i = 0; i < channelmapping.length;i++){
                        var entry = channelmapping[i];
                        if(entry.id != args.query.id){
                            newMapping.push(entry);
                        }
                    }

                    Homey.manager('settings').set('channelmapping',newMapping);

                }else{
                    Homey.manager('settings').set('channelmapping',[]);
                }
            }
            var mapping = Homey.manager('settings').get('channelmapping');
            callback(null,mapping);
            
        }
    },
    {
        description: "Add a program to the watch list",
        method: "PUT",
        path: "/watch",
        fn: (callback,args)=>{
            console.log('Putting new value');
            console.log(args);
            console.log('get value from settings');
            var value = Homey.manager('settings').get('watchlist');
            console.log(value);
            if(value == null){ // settings found yet
                console.log('No value in settings create new value');
                value = {};
            }
            
            if(args.body.hasOwnProperty('db_id')){ // body seems to be correct
                console.log("")
                if(!value.hasOwnProperty(args.body.db_id)){
                    value[args.body.db_id] = args.body;
                }
                
                Homey.manager('settings').set('watchlist',value);
            }
            var watchlist = Homey.manager('settings') .get('watchlist');
            callback(null,watchlist);
        }
    },{
        description: "Remove a program from the watch list",
        method: "DELETE",
        path: "/watch",
        fn: (callback,args)=>{
            if(args.query.hasOwnProperty('id')){
                var value = Homey.manager('settings').get('watchlist');

                if(value != null){
                    delete value[args.query.id];
                    Homey.manager('settings').set('watchlist',value);
                    var watchlist = Homey.manager('settings') .get('watchlist');
                }
                callback(null,watchlist);
            }else{
               Homey.manager('settings').set('watchlist',{});
               var watchlist = Homey.manager('settings') .get('watchlist');
               callback(null,watchlist);
            }
            callback(null,false);
        }
    }
]