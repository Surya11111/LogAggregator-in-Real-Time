angular.module("tattva")
.controller('DataFieldsCtrl',['$scope','$mdDialog','fieldData','fieldData2','loadExprData','namespaceFactory',function($scope,$mdDialog,fieldData,fieldData2,loadExprData,namespaceFactory)
{
  $scope.fieldData=fieldData;
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.updateBackPublisher = function() {
    $scope.fieldData.exprAsText = $scope.getExprAsText();
    $mdDialog.hide($scope.fieldData);
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
//@Todo
  $scope.getExprAsText=function() {
    return "DataField("+$scope.fieldData.DataField+")";
  }

  $scope.DataField=[];
  //console.log("name",fieldData2.namespace);
  namespaceFactory.getNamespaceDetails(fieldData2.namespace).then(function(data){
  //console.log(data);
  for (i in data.dataSchema){
  $scope.DataField.push(data.dataSchema[i].name)

  }
  // //console.log($scope.DataField);
  })
}]);
