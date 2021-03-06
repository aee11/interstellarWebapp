var interstellarControllers = angular.module('interstellarControllers', ['ui.bootstrap']);

interstellarControllers.controller('EventListController', ['$scope', 'User', 'Events', '$modal', 
  function ($scope, User, Events, $modal) {
    $scope.now = moment();
    $scope.isModalOpen = false;

    $scope.user = User.query(function (user) {
      $scope.events = Events.eventApi.query({userId: user.username});
      Events.markIfDue($scope.events);
    });

    $scope.eventDone = function (event) {
      setTimeout(function () {
        var now = moment().add(1, 'days');
        var currentDate = moment(event.nextReviewDate);
        
        Events.eventApi.updateReviewDate({
          userId: $scope.user.username, 
          eventId: event._id}, event, function (response) {
            event.nextReviewDate = response.updatedReviewDate;
            momentNextReviewDate = moment(event.nextReviewDate);
            event.nextReviewDateObj = moment(response.updatedReviewDate).toDate();
            if (!momentNextReviewDate.isBefore(now, 'day')) {
              event.isDue = false;
            }
          }
        );
      }, 2000);
      
    }

    $scope.addEvent = function () {
      $scope.isModalOpen = true;
      var addEventModal = $modal.open({
        templateUrl: 'template/addEventForm.html',
        controller: 'AddEventModalController',
        resolve: {
          eventData: function () {
            return true;
          }
        }
      });

      addEventModal.opened.then(function () {
        setTimeout(function () { //loadum material input design
          $.material.input();
        }, 500);
      });

      addEventModal.result.finally(function () {
        console.log($scope.isModalOpen);
        $scope.isModalOpen = false;
        console.log($scope.isModalOpen);
      })

      addEventModal.result.then(function (eventData) {
        console.log("add event closed");
        Events.eventApi.save({userId: $scope.user.username}, eventData, function (newEvent) {
          $scope.events.push(newEvent);
        }, function (err) {
          console.error("Event failed to save");
        });
      });
    };

    $scope.editEvent = function (eventData) {
      $scope.isModalOpen = true;
      var eventModal = $modal.open({
        templateUrl: 'template/eventEditForm.html',
        controller: 'EditEventModalController',
        resolve: {
          eventData: function () {
            return eventData;
          }
        }
      });

      eventModal.opened.then(function () {
        setTimeout(function () { //loadum material input design
          $.material.input();
          $.material.ripples();
        }, 500);
      });

      eventModal.result.finally(function () {
        $scope.isModalOpen = false;
      })

      eventModal.result.then(function (eventData) {
        Events.eventApi.update({userId: $scope.user.username}, eventData, function (res) {
          console.log("Updated event");
        }, function (err) {
          //console.log(err);
        });
      }, function (reason) {
        if (reason == 'delete') {
          Events.eventApi.remove({userId: $scope.user.username, eventId: eventData._id},
            function (res) {
              var indexToDelete = Events.arrayObjectIndexOf($scope.events, eventData);
              $scope.events.splice(indexToDelete, 1);
            }
          );
        }
      });
    }

    $scope.loadMaterial = function () {
      $.material.checkbox();
    }

  }
]);

interstellarControllers.controller('AddEventModalController', 
  function ($scope, $modalInstance) {
    $scope.eventData = {};

    $scope.add = function () {
      $modalInstance.close($scope.eventData);
    };

    $scope.cancel = function () {
      console.log("Modal canceled");
      $modalInstance.dismiss('cancel');
    };
});

interstellarControllers.controller('EditEventModalController', 
  function ($scope, $modalInstance, eventData) {
    console.log(eventData);
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

    $scope.delete = function () {
      $modalInstance.dismiss('delete');
    }
});