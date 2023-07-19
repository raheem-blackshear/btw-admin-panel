beyondTheWalls.controller('teamListCtrl', ['$scope', '$rootScope', '$cookies', 'services', 'factories', '$state', '$stateParams', '$loading', '$timeout', 'Lightbox', '$uibModal', function($scope, $rootScope, $cookies, services, factories, $state, $stateParams, $loading, $timeout, Lightbox, $uibModal) {

    $scope.game = {
        data: [],
        selected: null
    };

    $scope.challenge = {
        details: null,
        data: []
    };

    services.datatable('teamList', {});
    $scope.teamList = [];

    $scope.viewChallenge = function() {
        $scope.challenge.details = null;
        $scope.challenge.data = $scope.game.selected.challenges;
    };

    services.listGame(0, 0, '', function(response, status) {
        $loading.start();
        if (status == 1) {
            $scope.game.data = response.data.list;
            $loading.finish();
        } else {
            factories.error(response.message);
            factories.unAuthorize(response);
            $loading.finish();
        }
    });

    $scope.filterTeam = function() {
        if ($scope.challenge.details == null) {
            factories.error('Please select a challenge');
        } else {
            $loading.start();
            console.log($scope.challenge.details);
            services.teamList($scope.challenge.details, function(response, status) {
                if (status == 1) {
                    $scope.teamList = response.data;
                    $scope.images = [];
                    response.data.forEach(function(col) {
                        $scope.images.push({
                            url: col.teamImage ? col.teamImage.original : "img/no-image-available.jpg",
                            thumbUrl: col.teamImage ? col.teamImage.thumbnail : "img/no-image-available.jpg"
                        });
                    });
                    services.datatable('teamList', {});
                    $loading.finish();
                } else {
                    factories.error(response.message);
                    factories.unAuthorize(response);
                    $loading.finish();
                }
            });
        }
    };

    $scope.openLightboxModal = function(index) {
        Lightbox.openModal($scope.images, index);
    };

    $scope.listMembers = function(data) {
        $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'listmembers-template.html',
            controller: 'listmembersCtrl',
            size: 'sm',
            resolve: {
                items: function() {
                    return {
                        details: data
                    };
                }
            }
        });
    };

}]);

beyondTheWalls.controller('listmembersCtrl', function($uibModalInstance, $scope, items) {
    $scope.list = items.details;
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});