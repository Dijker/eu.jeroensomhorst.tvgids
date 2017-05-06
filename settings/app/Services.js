angular.module('TvGuideServices',[])
.factory('SettingService',['$http','$q',function($http,$q){

    var s = {};
    s.baseUrl = '/api/app/eu.jeroensomhorst.tvgids/watch';

    s.get = function(){
        var def = $q.defer();
        $http.get(this.baseUrl).then(function(data){
            def.resolve(data.data);
        },function(data){
            def.reject(data);
        });
        return def.promise;
    }

    s.add = function(data){
        var def = $q.defer();
        $http.put(this.baseUrl,data,function(data){
            def.resolve(data.data);
        },function(data){
            def.reject(data);
        });
        return def.promise;
    }



    s.remove = function(id){
        var def = $q.defer();
        var url = this.baseUrl+"?dbid="+id;
        $http.delete(url,function(data){
            def.resolve(data.data);
        },function(data){
            def.reject(data.data);
        })
        return def.promise;
    }

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

    s.getPrograms = function(channels){
        
    }

    return s;
}]);