angular.module('tattva')
.config(['$stateProvider','$urlRouterProvider',function($stateProvider){
  $stateProvider
  .state('design.streams',
  {
    url:'/streams',
    templateUrl: "/design/streams/template/namespaceListView.html",
    controller: 'namespaceListCtrl'
  })

  .state('design.streams.viewStreams',
  {
    url:'/:nsname',
    templateUrl: "/design/streams/template/streamsView.html",
    controller: 'viewStreamsCtrl'                       //< change this name > < changed >
  })

  .state('design.create',
  {
    url: '/create',
    templateUrl: "/design/streams/template/streamCreate.html",
    controller: 'streamCreateCtrl'
  })
  .state('design.edit',
  {
    url: '/editStream/:streamName',
    templateUrl: "/design/streams/template/streamCreate.html",
    controller: 'streamCreateCtrl'
  });
}]);
