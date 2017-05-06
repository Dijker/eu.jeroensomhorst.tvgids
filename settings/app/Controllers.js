angular.module('TvGuideControllers',[])
.controller('MainController',['$scope',function($scope){
    console.log('Main controller!!');
}])
.controller('GridController',['$scope',function($scope){
    console.log("Grid controller");
}])
.controller('GuideController',['$scope',function($scope){
    console.log("GuideController");
}]);