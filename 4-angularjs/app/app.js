'use strict';

angular.module('myApp', [
    'ngRoute',
    'myApp.catalog'
]).config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/catalog'});
}]);
