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
        .when('/project/:id', {
            templateUrl: 'partials/project-edit.html',
            controller: 'EditProjectCtrl'
        })
        .when('/project/delete/:id', {
            templateUrl: '/partials/project-delete.html',
            controller: 'DeleteProjectCtrl'
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

app.controller('EditProjectCtrl', ['$scope', '$resource', '$location', '$routeParams',
  function($scope, $resource, $location, $routeParams) {
    var Projects = $resource('api/projects/:id', {id: '@_id'}, {
      update: { method: 'PUT'}
    });

    Projects.get({ id: $routeParams.id}, function(project) {
      $scope.project = project;
    });

    $scope.save = function() {
      Projects.update($scope.project, function(){
        $location.path('/project')
      });
    }
  }]);

app.controller('DeleteProjectCtrl', ['$scope', '$resource', '$location', '$routeParams',
  function($scope, $resource, $location, $routeParams) {
    var Projects = $resource('/api/projects/:id');

    Projects.get({ id: $routeParams.id}, function(project) {
      $scope.project = project;
    });

    $scope.delete = function(){
      Projects.delete({ id: $routeParams.id}, function(project) {
        $location.path('/project');
      });
    }
  }]);

//jQuery animations
$(document).ready(function() {
    var btt = $('.back-to-top');
    
    $(window).on('scroll', function(){
        var check = $(this),
            height = check.height(),
            top = check.scrollTop();
        
        if(top > height) {
            if(!btt .is(':visible')){
                btt.fadeIn();
            }
        } else {
            btt.hide();
        }
    });
    
    btt.on('click', function(e){
        $('html, body').animate({
            scrollTop: 0 
        }, 500);
        
        //stop default behaviour button
        e.preventDefault();
    });
});


