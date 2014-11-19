var interstellarApp = angular.module('interstellarApp', []);

interstellarApp
.factory('eventService', ['$http', '$q', function($http, $q) {

  return {
    getEvents: getEvents,
    addEvent: addEvent
  };

  function getEvents () {
    var request = $http({
      method: 'get',
      url: 'api/user/alex/events',
    });
    return request.then(handleSuccess, handleError);
  }
  var addEvent = function () {
    return 10;
  }

  // PRIVATE
  var handleSuccess = function (response) {
    return response.data;
  }

  var handleError = function (response) {
    return 5;
  }

}])
.directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function () {
            console.log('!!!!');
            scope.$evalAsync(attr.onFinishRender);
        });
      }
    }
  }
})
.controller('eventListController', ['$scope', 'eventService', function ($scope, eventService) {
    $scope.events = [];
    // $scope.events = [
    //   {'name': 'Computer Science',
    //    'snippet': 'Learn Haskel, Scheme and more!'},
    //   {'name': 'Formal languages and computability',
    //    'snippet': 'Discover living elves!'},
    //   {'name': 'Web programming',
    //    'snippet': 'Learn doing a project!'}
    // ];
    loadEvents(function () {
      // setTimeout(function() {
      //   $.material.checkbox();
      //   console.log('Material design loaded');
      // }, 5000);
    });
    $scope.loadMaterial = function () {
      console.log("!!!");
      $.material.checkbox();
    }
    // if ($scope.$last) {
    //   console.log("HEY");
    // }
    // $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
    //   console.log('Material design loaded');
    //   $.material.checkbox();
    // });

    function loadEvents (cb) {
      eventService.getEvents().then(function (events) {
        $scope.events = events.data;
        cb();
      });
    }
}]);