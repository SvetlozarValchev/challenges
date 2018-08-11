'use strict';

angular.module("myApp.booklist", [
    'myApp.booksData'
])
    .controller('BookListCtrl', ['booksData', '$scope', function(booksData, $scope) {
        var page = 0;

        $scope.hasPrevPage = false;
        $scope.hasNextPage = false;
        $scope.expandedRow = -1;

        $scope.nextPage = function() {
            page += 1;

            loadPage();
        };

        $scope.prevPage = function() {
            page -= 1;

            loadPage();
        };

        $scope.expandRow = function(idx) {
            if ($scope.expandedRow === idx) {
                $scope.expandedRow = -1;
            } else {
                $scope.expandedRow = idx;
            }
        };

        function loadPage() {
            var size = 5;

            $scope.expandedRow = -1;
            $scope.currentPage = page + 1;
            $scope.totalPages = Math.ceil(booksData.total() / size);
            $scope.hasPrevPage = page > 0;
            $scope.hasNextPage = $scope.currentPage < $scope.totalPages;
            $scope.books = booksData.fetch(page * size, 5);
        }

        booksData.load().then(function() {
            loadPage(page);
        });
    }])
    .directive("booklist", function() {
        return {
            templateUrl: 'components/booklist/booklist.html',
            controller: 'BookListCtrl'
        };
    });