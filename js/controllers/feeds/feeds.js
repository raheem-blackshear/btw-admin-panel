beyondTheWalls.controller("feedsListCtrl", [
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
  "$sce",
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
    $uibModal,
    $sce
  ) {
    services.listFeeds(function(response, status) {
      $loading.start();
      if (status == 1) {
        $scope.feedList = response.data;
        $scope.images = [];
        response.data.forEach(function(col) {
          $scope.images.push({
            url: col.image ? col.image.original : "img/no-image-available.jpg",
            thumbUrl: col.image
              ? col.image.thumbnail
              : "img/no-image-available.jpg"
          });
        });
        services.datatable("feedsTable", {});
        $loading.finish();
      } else {
        factories.error(response.message);
        factories.unAuthorize(response);
        $loading.finish();
      }
    });

    $scope.setFeatured = function(id, value, index) {
      var block;
      switch (value) {
        case true:
          block = "mark this feed featured";
          break;
        case false:
          block = "unmark this feed from featured";
          break;
      }
      var message = "Do you want to " + block + "?";
      factories.confirm(message, function(flag) {
        if (flag) {
          services.featuredToggle(id, value, function(response, status) {
            $loading.start();
            if (status == 1) {
              $loading.finish();
              factories.successCallback(response.message, function() {
                $scope.feedList[index].is_featured = value;
              });
            } else {
              factories.error(response.message);
              factories.unAuthorize(response);
              $loading.finish();
            }
          });
        } else {
          $scope.feedList[index].is_featured = !value;
        }
      });
    };

    $scope.removePlayer = function(id, type) {
      factories.confirm("Do you want to remove this feed ?", function(flag) {
        if (flag) {
          services.setFeaturedOrDelete(id, type, function(response, status) {
            $loading.start();
            if (status == 1) {
              $loading.finish();
              factories.successCallback(response.message, function() {
                $state.transitionTo($state.current, $stateParams, {
                  reload: true,
                  inherit: false,
                  notify: true
                });
              });
            } else {
              factories.error(response.message);
              factories.unAuthorize(response);
              $loading.finish();
            }
          });
        }
      });
    };

    $scope.openLightboxModal = function(index) {
      Lightbox.openModal($scope.images, index);
    };

    $scope.showFeed = function(data) {
      $uibModal.open({
        animation: true,
        ariaLabelledBy: "modal-title",
        ariaDescribedBy: "modal-body",
        templateUrl: "feeds-template.html",
        controller: "showFeedCtrl",
        size: "",
        resolve: {
          items: function() {
            return {
              details: data
            };
          }
        }
      });
    };
    /// use youtube video-modal ///
    $scope.showFeedVideo = function(data) {
      $scope.videourl = $sce.trustAsResourceUrl(data);
      new ModalVideo(".js-video-btn");
    };
    ///////////////////////////////
  }
]);
beyondTheWalls.controller("showFeedCtrl", function(
  $uibModalInstance,
  $scope,
  $sce,
  items
) {
  $scope.videofile = $sce.trustAsResourceUrl(items.details);
  $scope.cancel = function() {
    $uibModalInstance.dismiss("cancel");
  };
});
