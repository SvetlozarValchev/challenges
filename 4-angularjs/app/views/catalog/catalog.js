'use strict';

angular.module('myApp.catalog', [
    'ngRoute',
    'myApp.booklist'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/catalog', {
    templateUrl: 'views/catalog/catalog.html',
    controller: 'CatalogCtrl'
  });
}])

.controller('CatalogCtrl', [function() {
}]);