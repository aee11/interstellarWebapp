var interstellarServices = angular.module('interstellarServices', ['ngResource']);

interstellarServices.factory('Events', ['$resource', 
  function ($resource) {
    var eventApi = $resource('api/user/:userId/events/:eventId', {}, {
      query: {method: 'GET', params: {userId: '@id', eventId: ''}, isArray: true},
      update: {method: 'PUT', params: {userId: 'userId', eventId: '@_id'}},
      save: {method: 'POST', params: {userId: 'userId', eventId: ''}},
      remove: {method: 'DELETE', params: {userId: 'userId', eventId: '@_id'}}
    });

    function markDueEvents (events) {
      events.$promise.then(function(eventData) {
        angular.forEach(eventData, function (value, key) {
          var eventDate = new Date(eventData.nextReviewDate).toDateString();
          var today = new Date('YYYY-dd');
        });
      })
      
      return true;
    }

    function arrayObjectIndexOf(arr, obj){
      for(var i = 0; i < arr.length; i++){
        if(angular.equals(arr[i], obj)){
          return i;
        }
      };
      return -1;
    }

    return {
      eventApi: eventApi,
      markDueEvents: markDueEvents,
      arrayObjectIndexOf: arrayObjectIndexOf
    }
  }
]);

interstellarServices.factory('User', ['$resource', 
  function ($resource) {
    return $resource('api/username', {}, {
      query: {method: 'GET', isArray: false}
    });
  }
]);