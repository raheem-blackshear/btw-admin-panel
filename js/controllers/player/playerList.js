beyondTheWalls.controller("playerListCtrl", [
  "$scope",
  "$rootScope",
  "$cookies",
  "services",
  "factories",
  "$state",
  "$stateParams",
  "$loading",
  "$timeout",
  "Lightbox",
  "$uibModal",
  function(
    $scope,
    $rootScope,
    $cookies,
    services,
    factories,
    $state,
    $stateParams,
    $loading,
    $timeout,
    Lightbox,
    $uibModal
  ) {
    /* Initialize list options */
    $scope.listOptions = {
      pageNo: 1,
      limit: 10,
      total: null,
      maxSize: 10
    };

    $scope.search = "";

    $loading.start();

    /* function to generate table with pagination */
    $scope.listPlayerFunc = function() {
      if ($scope.listOptions.pageNo == 1) {
        $scope.listOptions.skip = 0 * $scope.listOptions.limit;
      } else {
        $scope.listOptions.skip =
          ($scope.listOptions.pageNo - 1) * $scope.listOptions.limit;
      }
      $loading.start();
      services.listPlayer(
        $scope.listOptions.skip,
        $scope.listOptions.limit,
        $scope.search,
        function(response, status) {
          if (status == 1) {
            $scope.playerList = response.data.list;
            $scope.listOptions.total = response.data.totalCount;
            $scope.images = [];
            response.data.list.forEach(function(col) {
              $scope.images.push({
                url: col.profilePic
                  ? col.profilePic.original
                  : "img/no-image-available.jpg",
                thumbUrl: col.profilePic
                  ? col.profilePic.thumbnail
                  : "img/no-image-available.jpg"
              });
            });
            // call info table

            table = $("#playerList").DataTable();
            table.destroy();

            $scope.tableInfo();
            // services.datatable('playerList',{});
            $loading.finish();
          } else {
            factories.error(response.message);
            factories.unAuthorize(response);
            $loading.finish();
          }
        }
      );
    };

    $scope.viewGame = function(id, index) {
      console.log(id);
      $scope.userID = id;
      $cookies.put("userId", $scope.userID);
      localStorage.setItem("userId", $scope.userID);
      $state.go("game.playerGame");
    };

    $scope.allexcelItems = [];
    $scope.alsqldata = function() {
      alasql('SELECT * INTO XLSX("PlayersList.xlsx",{headers:true}) FROM ?', [
        $scope.allexcelItems
      ]);
    };

    $scope.exportCSV = function(id) {
      services.csvPlayer(function(response, status) {
        if (status == 1) {
          console.log(response);
          $scope.allexcelItems = response.data;
          $scope.count = 1;
          response.data.forEach(function(col) {
            $scope.allexcelItems.push({
              "S.No": $scope.count++,
              "Sort Name": col.sortName,
              Email: col.email,
              Name: col.name,
              "Facebook id": col.facebookId,
              "Total Points": col.totalPoints,
              "Twitter id": col.twitterId
            });
          });
          $scope.alsqldata();
        } else {
          factories.error(response.message);
          factories.unAuthorize(response);
          $loading.finish();
        }
      });
    };

    /* Call Function to paginate */
    $scope.listPlayerFunc();

    /* function to call after page change */
    $scope.pageChanged = function() {
      $scope.listPlayerFunc();
    };

    /* function to show table info */
    $scope.tableInfo = function() {
      $scope.pg_options = {
        start: "",
        end: ""
      };
      if ($scope.listOptions.currentPage == 0) {
        $scope.pg_options.start = 1;
        $scope.pg_options.end = $scope.listOptions.limit;
      } else {
        $scope.pg_options.start = $scope.listOptions.skip + 1;
        $scope.pg_options.end =
          $scope.listOptions.skip + $scope.playerList.length;
      }
    };

    $scope.blockUnblockPlayer = function(id, sts, index) {
      var message = "Do you want to " + sts + " this player ?";
      factories.confirm(message, function(flag) {
        if (flag) {
          services.blockUnblockPlayer(id, sts, function(response, status) {
            if (status == 1) {
              factories.successCallback(response.message, function() {
                if (sts == "Block") {
                  $scope.playerList[index].is_block = true;
                } else {
                  $scope.playerList[index].is_block = false;
                }
              });
            } else {
              factories.error(response.message);
              factories.unAuthorize(response);
            }
          });
        }
      });
    };

    $scope.removePlayer = function(id, index) {
      factories.confirm("Do you want to remove this player ?", function(flag) {
        if (flag) {
          services.removePlayer(id, function(response, status) {
            if (status == 1) {
              factories.successCallback(response.message, function() {
                $scope.listPlayerFunc();
              });
            } else {
              factories.error(response.message);
              factories.unAuthorize(response);
            }
          });
        }
      });
    };

    $scope.editPointopen = function(details) {
      $uibModal.open({
        animation: true,
        ariaLabelledBy: "modal-title",
        ariaDescribedBy: "modal-body",
        templateUrl: "edit-points.html",
        controller: "challengeCtrl",
        size: "",
        resolve: {
          items: function() {
            return {
              details: details
            };
          }
        }
      });
    };

    $scope.openLightboxModal = function(index) {
      Lightbox.openModal($scope.images, index);
    };
  }
]);

beyondTheWalls.controller("challengeCtrl", function(
  $uibModalInstance,
  $scope,
  items,
  services,
  factories,
  $state,
  $stateParams
) {
  $scope.tmpData = items.details;
  console.log($scope.tmpData, "$scope.challenges");

  $scope.savePoints = function(points) {
    console.log(points);

    var param_data = {};
    param_data.totalPoints = document
      .getElementById("totPoints")
      .value.toString();
    param_data.totalChallengeCompeleted = document
      .getElementById("totChallengeCompeleted")
      .value.toString();
    param_data.totalGameStarted = document
      .getElementById("totGameStarted")
      .value.toString();
    param_data.userId = document.getElementById("_id").value;

    services.editpoints(param_data, $scope, function(response, status) {
      if (status == 1) {
        factories.successCallback("Points edited successfully", function() {
          $state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: true
          });
          $uibModalInstance.dismiss("cancel");
          swal.close();
          // $state.reload();
        });
      } else {
        factories.error(response.message);
        factories.unAuthorize(response);
      }
    });
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss("cancel");
  };
});
