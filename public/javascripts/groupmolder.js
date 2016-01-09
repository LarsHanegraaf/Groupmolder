var app = angular.module('GroupMolder', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
          templateUrl: 'partials/home.html',
          roles: ['anon', 'teacher', 'student']
        })
        .when('/project', {
            templateUrl: 'partials/project.html',
            controller: 'ProjectCtrl',
            roles: ['teacher', 'student']
        })
        .when('/project/edit/:id', {
            templateUrl: 'partials/project-edit.html',
            controller: 'EditProjectCtrl',
            roles: ['teacher', 'student']
        })
        .when('/project/delete/:id', {
            templateUrl: '/partials/project-delete.html',
            controller: 'DeleteProjectCtrl',
            roles: ['teacher', 'student']
        })
        .when('/project/:id', {
            templateUrl: '/partials/project-view.html',
            controller: 'ViewProjectCtrl',
            roles: ['teacher', 'student']
        })
        .when('/register', {
          templateUrl: '/partials/register.html',
          roles: ['anon']
		    })
        .when('/student', {
          templateUrl: '/partials/student.html',
          roles: ['teacher', 'student']
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

// get the role of the user
app.factory('getUser', ['$http', function($http){
  var role = 'superuser';
  var fac = {};
  fac.userInArray = function(roles){
    if(role === 'superuser'){
      return true;
    }
    for(var i = 0; i<roles.length; i++){
      if(role === roles[i]){
        return true;
      }
    }
    return false;
  }
  return fac;
}]);

app.run(function(getUser, $rootScope, $location){
  $rootScope.$on("$routeChangeStart", function(event, next, current){
    if(next.roles){
      if(!getUser.userInArray(next.roles)){
        $location.path('/');
      }
    }
  });
});



app.controller('ProjectCtrl', ['$scope', '$resource',
  function($scope, $resource) {
    var Projects = $resource('api/projects');
    Projects.query(function(projects){
      $scope.projects = projects;
    });
}]);

app.controller('AddProjectCtrl', ['$scope', '$resource', '$route',
  function($scope, $resource, $route) {
    $scope.save = function() {
      var Projects = $resource('/api/projects');
      Projects.save($scope.project, function(){
      });
      $route.reload();
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

  app.controller('ViewProjectCtrl', ['$scope', '$resource', '$routeParams',
    function($scope, $resource, $routeParams) {
      var Groups = $resource('/api/projects/:id/groups');

      Groups.query({ id: $routeParams.id}, function(groups) {
        $scope.groups = groups;
      });
}]);

//jQuery animations
$(document).ready(function() {
    var btt = $('.back-to-top');

    btt.on('click', function(e){
        $('html, body').animate({
            scrollTop: 0
        }, 500);

        //stop default behaviour button
        e.preventDefault();
    });

    $(window).on('scroll', function(){
        var self = $(this),
            height = self.height(),
            top = self.scrollTop();

        if(top > height) {
            if(!btt.is(':visible')){
                btt.fadeIn();
            }
        } else {
            btt.hide();
        }
    });
});

//Hover effect
$('#studentName').contenthover({
    overlay_background:'#000',
    overlay_opacity:0.8
});
