var interstellarControllers = angular.module('interstellarControllers', ['ui.bootstrap']);

interstellarControllers.controller('EventListController', ['$scope', 'User', 'Events', '$modal', 
  function ($scope, User, Events, $modal) {
    $scope.user = User.query(function (user) {
      $scope.events = Events.eventApi.query({userId: user.username});
      Events.markDueEvents($scope.events);
    });
    
    $scope.editEvent = function (eventData) {
      //console.log(eventData);
      var eventModal = $modal.open({
        templateUrl: 'editEventModal.html',
        controller: 'EventModalController',
        resolve: {
          eventData: function () {
            return eventData;
          }
        }
      });

      eventModal.opened.then(function () {
        setTimeout(function () { //loadum material input design
          $.material.input();
        }, 500);
      });

      eventModal.result.then(function (eventData) {
        Events.eventApi.update({userId: $scope.user.username}, eventData, function() {
          console.log("Updated event");
        });
        console.log("Modal dismissed", eventData);
      });
    }
    $scope.loadMaterial = function () {
      $.material.checkbox();
    }
  }
]);

interstellarControllers.controller('EventModalController', 
  function ($scope, $modalInstance, eventData) {
    $scope.originalEventData = {};
    $scope.eventData = eventData;
    angular.copy($scope.eventData, $scope.originalEventData);
    $scope.change = function () {
      $modalInstance.close($scope.eventData);
    };

    $scope.cancel = function () {
      console.log("Modal canceled");
      angular.copy($scope.originalEventData, $scope.eventData);
      $modalInstance.dismiss('cancel');
    };
});