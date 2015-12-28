var app = angular.module('GroupMolder', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
          templateUrl: 'partials/home.html'
        })
        .when('/group', {
            templateUrl: 'partials/group.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
