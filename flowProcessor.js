"use strict"
const api = require('./libs/TvGidsApi');


class flowProcessor{
    constructor(){
        this.api = new api();
        this.channelData = {};
        this.manager = Homey.manager('flow');
    }
	
    init(){
        this.manager.on('trigger.program_start',(callback,args,state)=> {this.onTrigger(callback,args,state)});
        this.manager.on('trigger.program_start.name.autocomplete',(callback,args)=>{this.programAutoComplete(callback,args)});
        setInterval(()=>{this.parseChannelData()},5000); //  every 30 seconds check if we need to trigger things
    }

    programAutoComplete(callback,args){
        var returnValue = [];
        var watchlist = Homey.manager('settings').get( 'watchlist' );
        if(args.query != ""){
            

            if(watchlist!= null){
                for (var property in watchlist) {
                    
                    var dbid = watchlist[property].db_id;
                    var titel = watchlist[property].titel.toLowerCase();
                    if(dbid.indexOf(args.query) > -1 || titel.indexOf(args.query.toLowerCase()) > -1){
                        returnValue.push({
                            id: dbid,
                            name: titel +" ( "+ watchlist[property].datum_start+")",
                            programData: watchlist[property]
                        });
                    }                    
                }
            }

        }else{
            for (var property in watchlist) {
                var titel = watchlist[property].titel.toLowerCase();
                returnValue.push({
                    id: watchlist[property].db_id,
                    name: titel +"( "+ watchlist[property].datum_start+")",
                    programData: watchlist[property]
                });
            }
        }
        callback(null,returnValue);
    }


    parseChannelData(){
        var watchlist = Homey.manager('settings').get('watchlist');
        if(watchlist != null){
            var currentDate = new Date();
            currentDate.setSeconds(0);
            currentDate.setMilliseconds(0);

            for(var property in watchlist){
                var value = watchlist[property];
               

                var startDate = new Date(value.datum_start);
                startDate.setSeconds(0);
                startDate.setMilliseconds(0);
                if(currentDate <= startDate){ // if currentdate is before or on the startdate of the program
                    this.manager.trigger('program_start',{
                        channel: getMappedChannel(value.channel),
                        title: value.titel
                    },{
                        "programdata": value
                    });
                }

            }
        }
    }

    getMappedChannel(channel){
        console.log("Get mapped channel for: "+channel);
        var channelMapping = Homey.manager('settings').get('channelmapping');
        var mapping = channel;
        if(channelMapping != null){
            
            for(var i = 0; i < channelMapping.length;i++){
                var entry = channelMapping[i];
                if(entry.id == channel){
                    mapping = entry.tvchannel;
                }
            }
        }
        console.log("Return");
        console.log(mapping);
        return mapping;
    }


    onTrigger(callback,args,state){
        console.log('Triggering"');
        console.log(args);
        console.log(state);


        var args = args.name;
        var programData = state.programdata;
        var offset = parseInt(args.offset) * 60000; // offset in milliseconds;
        var name = args.name;
        var id = args.id;
        if(programData.db_id == id){ // its the same
            console.log("We found something we should take a look at");
            console.log(programData);
            var startDate = new Date(programData.datum_start);
            var newStartDate = startDate.getTime()-offset;
            startDate.setTime(newStartDate);

            var currentDate = new Date();
            currentDate.setSeconds(0);
            currentDate.setMilliseconds(0);
            if(currentDate.getTime() == startDate.getTime()){
                callback(null,true);
            }else{
                callback(null,false);
            }
        }
  
    }


}

module.exports = flowProcessor;