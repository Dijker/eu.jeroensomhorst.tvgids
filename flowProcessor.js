"use strict"
const api = require('./libs/TvGidsApi');

class flowProcessor{
    constructor(){
        this.api = new api();
        this.channelData = {};
        this.manager = Homey.manager('flow');
    }
	
    init(){
        this.manager.on('trigger.program_start',(callback,args,state)=> {this.onProgramStartTriggerTrigger(callback,args,state)});
        this.manager.on("trigger.any_program_start",(callback,args,state)=>{this.onAnyProgramStartTrigger(callback,args,state)});
        this.manager.on('trigger.program_start.name.autocomplete',(callback,args)=>{this.programAutoComplete(callback,args)});
        this.parseChannelData(); // trigger it on load
        setInterval(()=>{this.parseChannelData()},60000); //  every minute check if we need to trigger things
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

    /**
     * @TODO When a programn already has been cast remove it from the watchlist?
     */
    parseChannelData(){
        console.log("Validate watchlist");
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
                console.log(currentDate<=startDate);
                if(currentDate <= startDate){ // if currentdate is before or on the startdate of the program
                    console.log("Validate triggers");
                    var state = {
                        channel: this.getMappedChannel(value.channel),
                        title: value.titel
                    };
                    var args = {
                        "programdata": value
                    };
                    
                    this.manager.trigger('program_start',state,args);
                    this.manager.trigger('any_program_start',state,args);
                }

            }
        }
    }

    getMappedChannel(channel){
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
        return mapping;
    }


    onProgramStartTriggerTrigger(callback,args,state){
        console.log("On program start trigger");
        console.log(args);
        console.log(state);

        var programData = state.programdata;
        var offset = parseInt(args.offset) * 60000; // offset in milliseconds;
        var program = args.name;
        var id = program.id;
        if(programData.db_id == id){ // its the same
            console.log("trigger");
            var startDate = new Date(programData.datum_start);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);
            var time = startDate.getTime() - offset;

            startDate.setTime(time);

            

            var currentDate = new Date();
            currentDate.setSeconds(0);
            currentDate.setMilliseconds(0);
            console.log(currentDate);
            console.log(startDate);            

            if(currentDate.getTime() == startDate.getTime()){
                callback(null,true);
            }else{            
                callback(null,false);
            }
        }
  
    }

    onAnyProgramStartTrigger(callback,args,state){
        console.log("On any program start trigger");
        console.log(args);
        console.log(state);

        var programData = state.programdata;
        var offset = parseInt(args.offset) * 60000; // offset in milliseconds;
        var startDate = new Date(programData.datum_start);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        var time = startDate.getTime() - offset;

        startDate.setTime(time);

        

        var currentDate = new Date();
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        console.log(currentDate);
        console.log(startDate);            

        if(currentDate.getTime() == startDate.getTime()){
            callback(null,true);
        }else{            
            callback(null,false);
        }
  
    }


}

module.exports = flowProcessor;