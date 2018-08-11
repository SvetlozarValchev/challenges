'use strict';

angular.module('myApp.booksData', [])
    .service('booksData', function($http, $q) {
        var loaded = false;
        var booksData = null;

        this.load = function() {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (!booksData) {
                $http.get('data/books.json')
                    .success(function(data) {
                        booksData = data.books;
                        loaded = true;

                        deferred.resolve();
                    })
                    .error(function() {
                        deferred.reject('Could not find books.json');
                    });
            } else {
                deferred.resolve();
            }

            return promise;
        };

        this.fetch = function(offset, size) {
            if (!loaded) throw new Error('Data not loaded yet');

            return booksData.slice(offset, offset + size);
        };

        this.total = function() {
            if (!loaded) throw new Error('Data not loaded yet');

            return booksData.length;
        };
    });