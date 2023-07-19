beyondTheWalls.controller("LoginCtrl", [
  "$scope",
  "$cookies",
  "services",
  "factories",
  "$state",
  "$loading",
  function($scope, $cookies, services, factories, $state, $loading) {
    $scope.user = {
      email: "",
      password: ""
    };

    $scope.login = function(isValid) {
      if (isValid) {
        $loading.start();
        services.login($scope, function(response, status) {
          if (status == 1) {
            $cookies.put("token", response.data[0].accessToken);
            $loading.finish();
            $cookies.put("role", response.data[0].isSuperAdmin);
            $state.go("game.gameList");
            factories.hideSideMenu();
          } else {
            $loading.finish();
            factories.error(response.message);
            factories.unAuthorize(response);
          }
        });
      }
    };
  }
]);
