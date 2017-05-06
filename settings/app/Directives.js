angular.module('TvGuideDirectives',['TvGuideControllers'])
.directive('guideFilter',function(){
    return {
        restrict: 'A',
        templateUrl: 'partials/TvFilter.html',
        controller: 'GridController'
    }
})
.directive('guideGrid',function(){
    return {
        restrict: 'A',
        templateUrl: 'partials/TvGrid.html',
        controller: 'GridController'
    }
})