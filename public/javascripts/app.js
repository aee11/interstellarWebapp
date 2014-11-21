var interstellarApp = angular.module('interstellarApp', [
  'angular.filter',
  'angularMoment',
  'interstellarServices',
  'interstellarDirectives',
  'interstellarControllers'
]);

interstellarApp.run(function(amMoment) {
  amMoment.changeLocale('is');
});