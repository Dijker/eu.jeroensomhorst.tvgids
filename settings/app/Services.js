angular.module('TvGuideServices',[])
.factory('channelMappingService',['$http','$q',function($http,$q){
    var s = {};
    s.baseUrl = 'api/app/eu.jeroensomhorst.tvgids/mapping';
    s.get = function(){}
    s.add = function(data){}
}])
.factory('SettingService',['$http','$q',function($http,$q){

    var s = {};
    s.baseUrl = '/api/app/eu.jeroensomhorst.tvgids/watch';
    s.get = function(){
        var def = $q.defer();
        var self =this;
        $http.get(this.baseUrl).then(function(data){
            def.resolve(data.data);
        },function(data){
            def.reject(data);
        });
        return def.promise;
    }

    s.add = function(data){
        var def = $q.defer();
        $http.put(this.baseUrl,data).then(function(data){
            def.resolve(data.data);
        },function(data){
            def.reject(data);
        });
        return def.promise;
    }
    
    s.remove = function(id){
        var def = $q.defer();
        var url = this.baseUrl+"?id="+id;
        $http.delete(url).then(function(data){
            def.resolve(data.data);
        },function(data){
            def.reject(data.data);
        });
        return def.promise;
    }

    return s;

}])
.factory('TvGuideService',['SettingService','$http','$q',function(Settings,$http,$q){
    var s = {};
    s.channelCache = null;
    s.baseUrl = '/api/app/eu.jeroensomhorst.tvgids/';

    s.getChannels = function(){
        var def = $q.defer();
        if(this.channelCache == null){
            var url = this.baseUrl+"channels";
            var def = $q.defer();
            if(this.channelCache != null){
                def.resolve(this.channelCache);
            }else{
                $http.get(url).then(function(data){
                    this.channelCache = data.data;
                    def.resolve(data.data);
                },function(data){
                    def.reject(data);
                });
            }
            
            return def.promise;
        }else{
            def.resolve(this.channelCache);
        }
    }

    s.getPrograms = function(channels,offset){
        var def = $q.defer();
        if(this.channelCache == null){
            var url = this.baseUrl+"programs";
            var def = $q.defer();
            if(this.channelCache != null){
                def.resolve(this.channelCache);
            }else{
                $http.get(url,{params: {"channels": channels,"offset": offset}}).then(function(data){
                    this.channelCache = data.data;
                    def.resolve(data.data);
                },function(data){
                    def.reject(data);
                });
            }
            
            return def.promise;
        }else{
            def.resolve(this.channelCache);
        }
    }

    return s;
}]);