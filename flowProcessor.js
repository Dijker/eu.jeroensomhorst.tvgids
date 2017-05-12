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
        setInterval(()=>{this.parseChannelData()},2000); //  every 5 seconds check if we need to trigger things
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
                        channel: this.getMappedChannel(value.channel),
                        title: value.titel
                    },{
                        "programdata": value
                    });
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

    onTrigger(callback,args,state){
        var programData = state.programdata;
        var offset = parseInt(args.offset) * 60000; // offset in milliseconds;
        var program = args.name;
        var id = program.id;
        if(programData.db_id == id){ // its the same
            console.log("We need to validate something..");
            var startDate = new Date(programData.datum_start);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);
            var time = startDate.getTime() - offset;

            startDate.setTime(time);

            

            var currentDate = new Date();
            currentDate.setMilliseconds(0);
            

            if(currentDate.getTime() == startDate.getTime()){
                console.log("We need to trigger");
                callback(null,true);
            }else{
                console.log("We dont need to trigger it");
                callback(null,false);
            }
        }
  
    }


}

module.exports = flowProcessor;