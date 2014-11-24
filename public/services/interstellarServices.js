var interstellarServices = angular.module('interstellarServices', ['ngResource']);

interstellarServices.factory('Events', ['$resource', 
  function ($resource) {
    var eventApi = $resource('api/user/:userId/events/:eventId', {}, {
      query: {method: 'GET', params: {userId: '@id', eventId: ''}, isArray: true},
      update: {method: 'PUT', params: {userId: 'userId', eventId: '@_id'}},
      save: {method: 'POST', params: {userId: 'userId', eventId: ''}},
      remove: {method: 'DELETE', params: {userId: 'userId', eventId: '@_id'}},
      updateReviewDate: {method: 'PUT', url: 'api/user/:userId/events/:eventId/updateReviewDate', 
                         params: {userId: 'userId', eventId: 'eventId'}}
    });

    function markIfDue (events) {
      events.$promise.then(function(eventData) {
        var now = moment().add(1, 'days');
        angular.forEach(eventData, function (singleEvent, key) {
          singleEvent.nextReviewDateObj = new Date(singleEvent.nextReviewDate)
          var eventDate = moment(singleEvent.nextReviewDate);
          if (eventDate.isBefore(now, 'day')) {
            singleEvent.isDue = true;
          } else {
            singleEvent.isDue = false;
          }
        });
        console.log(eventData);
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
      markIfDue: markIfDue,
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