angular.module('tattva')
.config(['$stateProvider','$urlRouterProvider',
function($stateProvider){
  $stateProvider
  .state('design.function',
  {
    url:'/function',
    templateUrl: "/design/functions/template/functionlist.html",
    controller:"functionlistCtrl"
  })
  .state('design.functionEdit', {
    url: '/functional/:functionname',
    templateUrl: '/design/functions/template/cfunctions.html',
    controller: 'functionEditCtrl'
  })
  .state('design.addfunction', {
    url:"/addFunction",
    templateUrl:"/design/functions/template/cfunctions.html"
  })
}]);
