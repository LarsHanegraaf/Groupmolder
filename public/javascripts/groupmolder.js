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
        .when('/project/:id/group/:number', {
            templateUrl: '/partials/group-view.html',
            controller: 'JoinGroupCtrl',
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
        .when('/login', {
          templateUrl: '/partials/login.html',
          roles: ['anon']
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

// get the role of the user
app.factory('getUserRole', function(){

  var fac = {};
  fac.role = 'superuser';
  fac.userInArray = function(roles){
    if(this.role === 'superuser'){
      return true;
    }
    for(var i = 0; i<roles.length; i++){
      if(this.role === roles[i]){
        return true;
      }
    }
    return false;
  }
  fac.setRole = function(role){
    this.role = role;
  }
  return fac;
});

app.controller('elementCtrl', [
  '$scope', '$attrs', 'getUserRole',
  function($scope, $attrs, getUserRole) {
    $scope.role = $attrs.role;
    getUserRole.setRole($scope.role);
  }
]);

app.run(function(getUserRole, $rootScope, $location){
  $rootScope.$on("$routeChangeStart", function(event, next, current){
    if(next.roles){
      if(!getUserRole.userInArray(next.roles)){
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
      console.log(projects);
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

      var Projects = $resource('api/projects/' + $routeParams.id);
      Projects.get(function(projects){
        $scope.projects = projects;
      });

      $scope.projectid = $routeParams.id;

      Groups.query({ id: $routeParams.id}, function(groups) {
        $scope.groups = groups;
      });
}]);

app.controller('JoinGroupCtrl', ['$scope', '$resource', '$location', '$routeParams', '$http',
  function($scope, $resource, $location, $routeParams, $http) {
    var Groups = $resource('api/projects/:id/groups/:number/check', {id: '@_id', number: '@number'}, {
      update: { method: 'PUT'}
    });

    Groups.get({ id: $routeParams.id, number: $routeParams.number}, function(group) {
      //check if a status error is given
      if(group.status) {
        $(".status").css("display", "block");
        $(".submitButton").attr("disabled", true);
        $(".submitButton").css("background-color", "#506B73");
      }

      if(group.error) {
        $(".error").css("display", "block");
        $(".submitButton").attr("disabled", true);
        $(".submitButton").css("background-color", "#506B73");
      }
    });

}]);

app.controller('ParseGroupCtrl', ['$scope', '$resource', '$location', '$routeParams', '$http',
  function($scope, $resource, $location, $routeParams, $http) {
    var Groups = $resource('api/projects/:id/groups/:number', {id: '@_id', number: '@number'}, {
      update: { method: 'PUT'}
    });

    Groups.get({ id: $routeParams.id, number: $routeParams.number}, function(group) {
      $scope.group = group;
    });

    $scope.save = function() {
      $http.post("api/projects/" + $routeParams.id + "/groups/" + $routeParams.number);
      $location.path('/project/' + $routeParams.id);
    }
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
