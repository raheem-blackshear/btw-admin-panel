var beyondTheWalls = angular.module("beyondTheWalls", [
    "ui.router", // Routing
    "oc.lazyLoad", // ocLazyLoad
    "ui.bootstrap", // Ui Bootstrap
    "ngCookies", // ng cookies
    "ui.sortable",
    "oitozero.ngSweetAlert", // sweetalert
    "ngSanitize",
    "hm.readmore",
    "summernote",
    "dndLists",
    "froala"
]);


beyondTheWalls.value("froalaConfig", {
    toolbarInline: false,
    placeholderText: "Enter Text Here",
});

beyondTheWalls.filter('htmlToPlaintext', function() {
    return function(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
});

beyondTheWalls.filter('timeFormat', function() {
    return function (number) {
        var aday = 3600000 * 24;
        var ahr = 3600000;
        var amin = 60000;
        var asec = 1000;
        var days = parseInt(number / aday);
        var hrs = parseInt((number % aday) / ahr);
        var mns = parseInt((number % ahr) / amin);
        var secs = parseInt((number % amin) / asec);
        var retStr = (days > 0 ? days.toString() + 'd ' : '') + hrs.toString() + 'h' + ' : ' + mns.toString() + 'm' + ' : ' + secs.toString() + 's';
        return retStr;
    }
});

beyondTheWalls.buildArray = function(name, size) {
    var i,
        array = [];
    for (i = 1; i <= size; i++) {
        array.push({
            text: name + " " + i,
            value: i
        });
    }
    return array;
};

beyondTheWalls.controller("Sidecontroller", [
    "$scope",
    "$rootScope",
    "$uibModal",
    "$http",
    "$cookies",
    "$loading",
    "services",
    "factories",
    "$state",
    "$stateParams",
    function(
        $scope,
        $rootScope,
        $uibModal,
        $http,
        $cookies,
        $loading,
        services,
        factories,
        $state,
        $stateParams
    ) {
        $scope.newRole = $cookies.get("role");
    }
]);

beyondTheWalls.directive('timer', function($timeout, $compile) {
    return {
        restrict: 'E',
        scope: {
            interval: '=', //don't need to write word again, if property name matches HTML attribute name
            startTimeAttr: '=?startTime', //a question mark makes it optional
            countdownAttr: '=?countdown' //what unit?
        },
        template: '{{ hours }} h : ' +
            '{{ minutes }} m : ' +
            '{{ seconds }} s ',

        link: function(scope, elem, attrs) {

            //Properties
            scope.startTime = scope.startTimeAttr ? new Date(scope.startTimeAttr) : new Date();
            var countdown = (scope.countdownAttr && parseInt(scope.countdownAttr, 10) > 0) ? parseInt(scope.countdownAttr, 10) : 60; //defaults to 60 seconds

            function tick() {

                //How many milliseconds have passed: current time - start time
                scope.millis = new Date() - scope.startTime;

                if (countdown > 0) {
                    scope.millis = countdown * 1000;
                    countdown--;
                } else if (countdown <= 0) {
                    scope.stop();
                    console.log('Your time is up!');
                }

                scope.seconds = Math.floor((scope.millis / 1000) % 60);
                scope.minutes = Math.floor(((scope.millis / (1000 * 60)) % 60));
                scope.hours = Math.floor(((scope.millis / (1000 * 60 * 60)) % 24));
                scope.days = Math.floor(((scope.millis / (1000 * 60 * 60)) / 24));

                //is this necessary? is there another piece of unposted code using this?
                scope.$emit('timer-tick', {
                    intervalId: scope.intervalId,
                    millis: scope.millis
                });

                scope.$apply();

            }

            function resetInterval() {
                if (scope.intervalId) {
                    clearInterval(scope.intervalId);
                    scope.intervalId = null;
                }
            }

            scope.stop = function() {
                scope.stoppedTime = new Date();
                resetInterval();
            }

            //if not used anywhere, make it a regular function so you don't pollute the scope
            function start() {
                resetInterval();
                scope.intervalId = setInterval(tick, scope.interval);
            }

            scope.resume = function() {
                scope.stoppedTime = null;
                scope.startTime = new Date() - (scope.stoppedTime - scope.startTime);
                start();
            }

            start(); //start timer automatically

            //Watches
            scope.$on('time-start', function() {
                start();
            });

            scope.$on('timer-resume', function() {
                scope.resume();
            });

            scope.$on('timer-stop', function() {
                scope.stop();
            });

            //Cleanup
            elem.on('$destroy', function() {
                resetInterval();
            });

        }
    };
});