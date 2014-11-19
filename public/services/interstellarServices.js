var interstellarServices = angular.module('interstellarServices', ['ngResource']);

interstellarServices.factory('Events', ['$resource', 
  function ($resource) {
    var eventApi = $resource('api/user/:userId/events', {}, {
      query: {method: 'GET', params: {userId: '@id'}, isArray: true}
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