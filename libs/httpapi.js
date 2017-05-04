"use strict";
var http = require('http');
var https = require('https');
class HttpApi{

    constructor(){
        
    }

    addBasicAuthHeader(username,password){
        this.authHeader = {
            'name': 'Authorization',
            'value': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
        }
    }

    doPostRequest(sb,cb,options,body){
        Homey.log('Request body: '+body);
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        options.headers['Content-length'] = Buffer.byteLength(body);
        var request = http.request(options,function(res){
            
        var body = '';
        
        res.on('data',function(chunk){
            Homey.log("Data retrieved");
            body += chunk;	
        }).on('end',function(){
            Homey.log("Data retrieval done");
           sb(body);
        }).on('error',function(data){
            Homey.log("Post request error");
           cb(data);
        });


        }).on('error',function(data){
            Homey.log('Error!!');
            Homey.log(data);
            cb(data);
        });
       
       request.setTimeout(1000,function(){
           Homey.log('Timeout');
           cb(false);
       });
        request.write(body);
        request.end();
        
    }

    doGetRequest(sb,cb,options){
        http.get(options,function(res){
       
        var body = '';
        res.on('data',function(chunk){
            body += chunk;	
        }).on('end',function(){
            sb(body);
        }).on('error',function(data){
            cb(data);
        });


    }).on('error',function(data){
        Homey.log('Error!!');
        Homey.log(data);
    });
    }

    generateOptions(hostname,defaultPath,params,method,port){
        
        var options = {};
        options.host = hostname;
        options.path = defaultPath;
        options.method = method;
        
        //options.headers = {};
        
        if(this.authHeader != null){
            options.headers[this.authHeader.name] = this.authHeader.value;
        }

        for(var i = 0; i < params.length;i++){
            if(i % 2 == 0){
                if(i == 0){
                        options.path = options.path.concat("?");
                }else{
                    options.path = options.path.concat("&");
                }
                
                options.path = options.path.concat(params[i]);
                options.path = options.path.concat("=");
            }else{
                options.path = options.path.concat(encodeURIComponent(params[i]));
            }
        }

        
        return options;
    }

}

module.exports = HttpApi