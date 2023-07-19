beyondTheWalls.controller('dashboardCtrl', ['$scope','$rootScope','$cookies','services','factories','$state','$stateParams','$loading',function ($scope,$rootScope,$cookies,services,factories,$state,$stateParams,$loading) {
    
    $scope.tickers = {
        users: 0,
        supplier: 0,
        category: 0,
        detailsSub: 0,
        product: 0  
    };

    // services.getDashboardTickers(function (response,status) {
    //     if(status == 1){
    //         $scope.tickers = {
    //             users: response.data.users,
    //             supplier: response.data.supplier,
    //             category: response.data.category,
    //             detailsSub: response.data.detailsSub,
    //             product: response.data.product
    //         };
    //     }
    //     else {
    //         factories.error(response.message);
    //         factories.unAuthorize(response);
    //     }
    // });
}]);