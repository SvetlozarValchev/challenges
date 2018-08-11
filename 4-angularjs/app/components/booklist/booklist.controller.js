angular.module("components.booklist")
    .controller('BookListCtrl', ['booksService', '$scope', function(booksService, $scope) {
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
            $scope.totalPages = Math.ceil(booksService.total() / size);
            $scope.hasPrevPage = page > 0;
            $scope.hasNextPage = $scope.currentPage < $scope.totalPages;
            $scope.books = booksService.fetch(page * size, 5);
        }

        booksService.load().then(function() {
            loadPage(page);
        });
    }]);
