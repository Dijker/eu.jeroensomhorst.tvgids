"use strict"
const api = require('./libs/TvGidsApi');


class flowProcessor{
    constructor(){
        this.api = new api();
        this.validateTriggers = false;
        this.channelData = {};
        this.manager = Homey.manager('flow');
    }
	
    init(){
        this.retrieveProgramming(); // onetime retrieval of the programming
        this.manager.on('trigger.program_start',(callback,args,state)=> {this.onTrigger(callback,args,state)});
        setInterval(()=>{this.retrieveProgramming()},900000); // every 15 minutes retrieve it again.
        setInterval(()=>{this.parseChannelData()},30000); //  every 30 seconds check if we need to trigger things
    }

    retrieveProgramming(){
        this.api.getPrograms(["1","2","3"],0,(data)=>{
            this.channelData = JSON.parse(data);            
            if(this.validateTriggers == false){
                this.validateTriggers = true;
            }
            this.parseChannelData();
        },(data)=>{
            console.log('Error while retrieving data for channel 1');
        });

    }

    parseChannelData(){
        if(this.validateTriggers){ // only when we have some data
            var currentDate = new Date();
            currentDate.setSeconds(0);
            currentDate.setMilliseconds(0);

            for (var property in this.channelData) {
                
                var programs = this.channelData[property];
                if(Array.isArray(programs)){
                    
                    programs.forEach((value)=>{
                            var startDate = new Date(value.datum_start);
                            startDate.setSeconds(0);
                            startDate.setMilliseconds(0);
                            if(currentDate <= startDate){  // if the currentdate is before or on the start date of the item!
                                this.manager.trigger('program_start',{},{
                                    "programdata" : value
                                });
                            }
                    });
                }else{
                    
                    for(var program in programs){
                        program = programs[program];
                        var startDate = new Date(program.datum_start);
                        startDate.setSeconds(0);
                        startDate.setMilliseconds(0);
                         if(currentDate <= startDate){  // if the currentdate is before or on the start date of the item!
                            this.manager.trigger('program_start',{},{
                                "programdata" : program
                            });
                        }
                    }
                }                
            }
        }
    }

    onTrigger(callback,args,state){
        
        
        var programData = state.programdata;
        var offset = parseInt(args.offset) * 60000; // offset in milliseconds;
        var argName = args.name.trim();
        var argName = argName.toLowerCase();
        var stateName = programData.titel.toLowerCase();
        var startDate = new Date(programData.datum_start);
        startDate.setMilliseconds(0);
        startDate.setSeconds(0);

        var offset = parseInt(args.offset) * 60000; // millisonds;
        var newStartDate = startDate.getTime()-offset;
        startDate.setTime(newStartDate);
        

        var currentDate = new Date();
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);
        
        if(stateName.indexOf(argName) >= 0){ // if name found or starts
            console.log("Found something that we should check for start time");
            console.log(stateName);
            console.log("Validate : "+currentDate.getTime() +"("+currentDate+")");
            console.log("vs "+startDate.getTime() + "("+startDate+")");

            if(startDate.getTime() == currentDate.getTime()){
                console.log("We should run!!");
                callback( null, true ); // If true, this flow should run. The callback is (err, result)-style.
            } else {
                console.log("Skip ")
                callback( null, false );
            }
        }        
    }


}

module.exports = flowProcessor;