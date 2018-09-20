'use strict';

angular.module('app', [
    'ngRoute',
    'components',
    'sections',
    'services'
]).config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/catalog'});
}]);
