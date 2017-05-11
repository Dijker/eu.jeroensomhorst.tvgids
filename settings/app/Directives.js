angular.module('TvGuideDirectives',['TvGuideControllers'])
.directive('guideFilter',function(){
    return {
        restrict: 'A',
        templateUrl: 'partials/TvFilter.html',
        controller: 'FilterController'
    }
})
.directive('guideGrid',function(){
    return {
        restrict: 'A',
        templateUrl: 'partials/TvGrid.html',
        controller: 'GridController'
    }
}).directive('channelMapping',function(){
    return {
        restrict: 'A',
        templateUrl: 'partials/Channelsetup.html',
        controller: 'ChannelMappingController'
    }
}).directive('favorites',function(){
    return {
        restrict: 'A',
        templateUrl: 'partials/Favorites.html',
    }
});