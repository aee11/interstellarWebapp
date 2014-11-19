var interstellarControllers = angular.module('interstellarControllers', []);

interstellarControllers.controller('EventListController', ['$scope', 'User', 'Events', 
  function ($scope, User, Events) {
    $scope.user = User.query(function (user) {
      $scope.events = Events.eventApi.query({userId: user.username});
    });
    
    $scope.editEvent = function (event) {
      console.log(event);
      Events.displayEditForm(event);
    }
    $scope.loadMaterial = function () {
      $.material.checkbox();
    }
  }
]);