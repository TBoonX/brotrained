var app = angular.module('brotrained', ['ngStorage', 'ngRoute']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'app/views/main.html',
            controller: 'maincontroller'
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);