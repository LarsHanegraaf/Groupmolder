var app = angular.module('GroupMolder', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
          templateUrl: 'partials/home.html'
        })
        .when('/project', {
            templateUrl: 'partials/project.html',
            controller: 'ProjectCtrl'
        })
        .when('/project/add', {
            templateUrl: 'partials/project-form.html',
            controller: 'AddProjectCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('ProjectCtrl', ['$scope', '$resource',
  function($scope, $resource) {
    var Projects = $resource('api/projects');
    Projects.query(function(projects){
      $scope.projects = projects;
    });
}]);

app.controller('AddProjectCtrl', ['$scope', '$resource', '$location',
  function($scope, $resource, $location) {
    $scope.save = function() {
      var Projects = $resource('/api/projects');
      Projects.save($scope.project, function(){
        $location.path('/project');
      });
    };
}]);
