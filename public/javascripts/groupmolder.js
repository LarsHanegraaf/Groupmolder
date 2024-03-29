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
            roles: ['teacher']
        })
        .when('/project/edit/:id', {
            templateUrl: 'partials/project-edit.html',
            controller: 'EditProjectCtrl',
            roles: ['teacher']
        })
        .when('/project/delete/:id', {
            templateUrl: '/partials/project-delete.html',
            controller: 'DeleteProjectCtrl',
            roles: ['teacher']
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
        .when('/project/random/:id', {
          templateUrl: '/partials/project-random.html',
          controller: 'AssignRandomCtrl',
          roles: ['teacher']
        })
        .when('/register', {
          templateUrl: '/partials/register.html',
          roles: ['anon']
		    })
        .when('/student', {
          templateUrl: '/partials/student.html',
          controller: 'StudentCtrl',
          roles: ['student']
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

app.controller('RandomGroupCtrl', ['$scope', '$resource', '$location', '$routeParams', '$route', '$http',
  function($scope, $resource, $location, $routeParams, $route, $http) {
    $scope.random = function() {
      $http.post("api/projects/" + $routeParams.id + "/random");
      $route.reload();
    };
}]);

app.controller('AssignRandomCtrl', ['$scope', '$resource', '$location', '$routeParams', '$http',
  function($scope, $resource, $location, $routeParams, $http) {
    $scope.random = function() {
      $http.post("api/projects/" + $routeParams.id + "/assignrandom");
      $location.path('/project');
    };
}]);

app.controller('StudentCtrl', ['$scope', '$resource',
  function($scope, $resource) {
    var Projects = $resource('api/users');
    Projects.query(function(projects){
      $scope.projects = projects;
    });
}]);

app.filter('groupFilter', function () {
    return function (groups, search) {
        if(isEmpty(search)){
          return groups;
        }else{
          var filteredGroups = [];
          search = search.toLowerCase();
          for(var i = 0; i<groups.length; i++){
            for (var j = 0; j<groups[i].members.length; j++){
              if(groups[i].members[j].facebook){
                // if the user is coupled to facebook
                var name = groups[i].members[j].facebook.name;
                if(name.toLowerCase().indexOf(search) > -1){
                  filteredGroups.push(groups[i]);
                  break;
                }
              }else{
                // if the user has a local account
                var name = groups[i].members[j].local.firstName + " " + groups[i].members[j].local.lastName;
                if(name.toLowerCase().indexOf(search) > -1){
                  filteredGroups.push(groups[i]);
                  break;
                }
              }
            }
          }
          return filteredGroups;
        }
    }
});

function isEmpty(str) {
    return (!str || 0 === str.length);
}

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
// $('#studentName').contenthover({
//     overlay_background:'#000',
//     overlay_opacity:0.8
// });
