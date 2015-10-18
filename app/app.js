app = angular.module('brotrained', ['ngStorage', 'ngRoute', 'angular-chartist']);

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