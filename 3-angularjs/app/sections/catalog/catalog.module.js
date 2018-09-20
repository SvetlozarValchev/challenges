angular.module("sections.catalog", [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/catalog', {
            templateUrl: 'sections/catalog/catalog.html'
        });
    }]);