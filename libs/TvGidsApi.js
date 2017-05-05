"use strict"
var path = require('path');
var HttpApi = require( path.resolve( __dirname, "./httpapi.js" ) );


class TvGidsApi extends HttpApi{

    constructor(){
       super();
       this._hostname = "www.tvgids.nl";
       this._channelCache = null;
       this._channelIds = [];
    }
    
    /**
     * 
     * @param {*} channel string or array of channel id's
     * @param {*} offset offset in days -1 0 or 1
     * @param {*} hour   hour of the day (0 - 24)
     * @param {*} minute minute of the hour
     * @param {*} sb     callback for success response
     * @param {*} eb     callback for error response
     */

    getProgramsFromTime(channel, offset, sb, eb){
        console.log("Retrieve programs from channel and specific time");
        console.log("Channel :"+channel)
        console.log("Offset :"+offset)
        
        var channels = channel;
        if(typeof channel  != 'string'){
            channels = channel.join(',');
        }

        var options = this.generateOptions('/json/lists/nustraks.php',['channels',channels,'day',offset]);
        
        super.doGetRequest((data)=>{
            console.log(data);
            sb(data);
        },(data)=>{
            console.log("Error");
            eb(data);
        },options);
    }

    getChannels(sb, eb){
     if(this._channelCache == null){
        var options = this.generateOptions("/json/lists/channels.php",[]);
        super.doGetRequest((data)=>{
            this._channelCache = data;
            this._channelCache.forEach((value)=>{
                this._channelIds.push(value.id);
            });

            sb(data);
        },(data)=>{
            this._channelCache = null;
            console.log("error ");
            eb(data);
        },options);

     }else{
         console.log( "Get data from cache");
         sb(this._channelCache);
     }
      
    }



    /**
     * Retrieve all programs for all channels in cache for the current day
     * @param {*} offset in days -1 0 or 1
     * @param {*} sb callback for success
     * @param {*} eb callback for error 
     */
    getAllPrograms(offset,sb,eb){

    }


    getPrograms(channel,offset,sb,eb){
        var args = [];

        
        args.push("channels");
        console.log(typeof channel);
        if(typeof channel === 'string'){
            args.push(channel);
        }else{ // we asume it's an array
            args.push(channel.join(','));
        }

        if(offset != null){
            args.push("day");
            args.push(offset);
        }

        var options = this.generateOptions("/json/lists/programs.php",args);
        
        super.doGetRequest((data)=>{
            console.log("Succesfully retrieved data");
            sb(data);
        },(data)=>{
            console.log("Error while retrieving data");
            eb(data);
        },options);
    }


    generateOptions(path,args){
        return super.generateOptions(this._hostname,path,args,"GET",80);
    }


}

module.exports = TvGidsApi;