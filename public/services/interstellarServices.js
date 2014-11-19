var interstellarServices = angular.module('interstellarServices', ['ngResource']);

interstellarServices.factory('Events', ['$resource', 
  function ($resource) {
    var eventApi = $resource('api/user/:userId/events/:eventId', {}, {
      query: {method: 'GET', params: {userId: '@id', eventId: ''}, isArray: true},
      update: {method: 'PUT', params: {userId: 'userId', eventId: '@_id'}}
    });

    return {
      eventApi: eventApi
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