angular.module('TvGuideControllers', ['TvGuideServices'])
.controller('MainController',['$scope','TvGuideService',function($scope,service){
    $scope.resourceBundle = i18n.getResourceBundle(i18n.lng());
    $scope.active = 1;

    service.getChannels().then(function(data){
        $scope.channels = data.result;
    },function(data){
        
    });



    $scope.tvGuideSelected = function(){}
}])
.controller('ChannelMappingController',['$scope','channelMappingService','TvGuideService',function($scope,settings,service){

   var mixMappingWithChannel = function(mapping,channel){
        var m = new Map();
        mapping.forEach(function(value){
            m.set(value.id,value.tvchannel);
        });

        for(var i= 0;i < channel.length;i++){
            var entry = channel[i];
            var id = entry.id;
            if(m.has(id)){
                entry.tvchannel = m.get(id);
            }
        }
   }


   $scope.mappingSelect = function(){
       console.log("mapping select");
       debugger;
       if($scope.mappings != null && $scope.channels != null){
           mixMappingWithChannel($scope.mappings,$scope.channels);
           debugger;
       }
   }

   $scope.$watch('mappings',function(n,o){
    if(n != null && $scope.channels != null){
        mixMappingWithChannel(n,$scope.channels);
    }
   });

    $scope.onMappingChange = function(c){
        settings.add(c).then(function(data){
            $scope.mappings = data.result;
        },function(data){});;
    };

    settings.get().then(function(data){
        $scope.mappings = data.result;
    },function(data){
        console.log("Error while retrieving mapping!!");
    });


}])
.controller('FilterController',['$scope','$window','SettingService','TvGuideService',function($scope,$window,settings,service){

    $scope.days = [];
    
    if(i18n.lng() == "nl"){
        $scope.language = i18n.getResourceBundle('nl');
    }else{
        $scope.language = i18n.getResourceBundle('en');
    }


    var i = -2;
    while(i < 3){
        var day = parseInt(moment().add(i,'days').format('d'));
        var dayObject = {
            id: i,
            description: $scope.language.weekDayArray[day]
        };

        if(i == 0){
            $scope.day = dayObject;
        }

        $scope.days.push(dayObject);
        
        
        i++;
    }


    $scope.onRemoveWatchlist = function(){
        if($window.confirm($scope.resourceBundle.settings.watchlist.removeWarning)){
            settings.removeAll().then(function(data){
                $scope.watchlist = data;
            },function(data){
                
            });
        }
    }

}])
.controller('GridController',['$scope','SettingService','TvGuideService',function($scope,service,tvGuide){

    $scope.$watch('channel',function(nv,ov){
        if(nv!=ov && nv!=null){ 
            tvGuide.getPrograms(nv.id,$scope.day.id).then(function(data){
                $scope.programs = data.result;
            },function(data){

            });
        }
    });

   $scope.$watch('day',function(nv,ov){
        if(nv!=ov && nv!=null){ 
            tvGuide.getPrograms($scope.channel.id,nv.id).then(function(data){
                $scope.programs = data.result;
            },function(data){

            });
        }
    });



    $scope.onProgramClick = function(entry){
        
        if($scope.watchlist.result.hasOwnProperty(entry.db_id)){
            service.remove(entry.db_id).then(function(data){
                $scope.watchlist = data;
            },function(data){
                
            });
        }else{
            entry.channel = $scope.channel.id;

            service.add(entry).then(function(data){
                $scope.watchlist = data;
            },function(data){
                
            });
        }
    }

    service.get().then(function(data){
        $scope.watchlist = data;
    },function(data){
        
    });
}])
.controller('FavoriteController',['$scope','SettingService',function($scope,service){
   $scope.favoriteSelect = function(){

   }
    $scope.removeFavorite = function(id){
        service.remove(id).then(function(data){
            $scope.watchlist = data;
        },function(data){
        });
    }


}])
.filter('channelName',function(){
    return function(input,channels){
        if(channels != null){
            for(var i = 0; i < channels.length;i++){
                if(channels[i].id == input){
                    return channels[i].name;
                }
            }
        }
    }
})
.filter('onWatchList',function(){
    return function(input,watchlist){
         var styleClass = 'fa fa-star-o';
        try{
            for(entry in watchlist.result){
                if(watchlist.result[entry].db_id == input){
                    return "fa fa-star";
                }
            } 
        }catch(e){}
        return styleClass;
    }
});