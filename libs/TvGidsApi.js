"use strict"
var path = require('path');
var HttpApi = require( path.resolve( __dirname, "./httpapi.js" ) );


class TvGidsApi extends HttpApi{

    constructor(){
       super();
       this._hostname = "www.tvgids.nl";
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
        console.log("Get programs primetime");
        var channels = channel;
        if(typeof channel  != 'string'){
            channels = channel.join(',');
        }

        var options = this.generateOptions('/json/lists/nustraks.php',['channels',channels,'day',offset]);
        super.doGetRequest(sb,eb,options);
    }

    getChannels(sb, eb){
        console.log("get channels");
        var options = this.generateOptions("/json/lists/channels.php",[]);
        super.doGetRequest(sb,eb,options);     
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
        console.log("Retrieve programs");
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
        }else{
            args.push("day");
            args.push("0");
        }

        var options = this.generateOptions("/json/lists/programs.php",args);
        console.log("options");
        super.doGetRequest(sb,eb,options);
    }


    generateOptions(path,args){
        return super.generateOptions(this._hostname,path,args,"GET",80);
    }


}

module.exports = TvGidsApi;