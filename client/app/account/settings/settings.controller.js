'use strict';

angular.module('doingFineApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
    };

    $scope.accountUpdate = function(topForm) {
      $scope.submitted = true;
      if(topForm.$valid){
        User.accountUpdate($scope.user);
      }
    };

    User.get(function(result){
      $scope.user = result;
      if('+1' === result.phone.slice(0,2)){
        $scope.user.phone = result.phone.slice(2);
      }
    });
  });
