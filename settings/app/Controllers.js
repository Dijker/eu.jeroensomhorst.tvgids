angular.module('TvGuideControllers', ['TvGuideServices'])
.controller('MainController',['$scope','TvGuideService',function($scope,service){
    $scope.resourceBundle = i18n.getResourceBundle(i18n.lng());

    service.getChannels().then(function(data){
        console.log("Retrieved channel data");
        $scope.channels = data.result;
    },function(data){
        console.log('Error while retrieving channel data!!!');
    })
}])
.controller('ChannelMappingController',['$scope','SettingService','TvGuideService',function($scope,settings,service){
   
    $scope.onMappingChange = function(c){
        
    }

}])
.controller('FilterController',['$scope','SettingService','TvGuideService',function($scope,settings,service){

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
                console.log('fout');
            });
        }else{
            service.add(entry).then(function(data){
                $scope.watchlist = data;
            },function(data){
                console.log("error");
            });
        }


    }

    service.get().then(function(data){
        $scope.watchlist = data;
    },function(data){
        console.log("Error while retrieving data");
    });
}])
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