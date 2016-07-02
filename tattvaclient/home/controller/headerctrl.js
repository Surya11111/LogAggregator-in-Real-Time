angular.module('tattva')
.controller('HeaderCtrl',function($scope,$http,AuthService,$mdSidenav){
  $scope.openLeftMenu = function() {
    $mdSidenav('left').toggle();
  };

  $scope.userNavItems = AuthService.getUserNavItem();
  $scope.user = AuthService.getCurrentUser();
  $scope.items=$scope.userNavItems.sideNav;
});
