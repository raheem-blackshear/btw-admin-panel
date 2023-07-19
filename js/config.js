beyondTheWalls.config(config).run([
  "$rootScope",
  "$state",
  "factories",
  "$window",
  "$cookies",
  function($rootScope, $state, factories, $window, $cookies) {
    $rootScope.$state = $state;
    $rootScope.logout = function() {
      factories.logoutForm("Do you want to log out ?", function() {
        $state.go("login");
        $cookies.remove("token");
        localStorage.clear();
        factories.success("Logged out successfully");
      });
    };

    $rootScope.goBack = function() {
      $window.history.back();
    };
  }
]);

function config(
  $stateProvider,
  $urlRouterProvider,
  $ocLazyLoadProvider,
  RouteHelpersProvider,
  APP_REQUIRES,
  $sceProvider
) {
  $urlRouterProvider.otherwise("/login");
  $sceProvider.enabled(false);

  $ocLazyLoadProvider.config({
    debug: false,
    events: true,
    modules: APP_REQUIRES.modules
  });

  $stateProvider
    .state("login", {
      url: "/login",
      templateUrl: "views/external/login.html",
      data: { pageTitle: "Login" },
      controller: "LoginCtrl",
      resolve: RouteHelpersProvider.resolveFor("login-controller")
    })
    .state("forgotPassword", {
      url: "/forgotPassword?token",
      templateUrl: "views/external/changePassword.html",
      data: { pageTitle: "Forgot Password" },
      controller: "ForgotPasswordCtrl",
      resolve: RouteHelpersProvider.resolveFor("ForgotPassword-controller")
    })
    .state("parent", {
      abstract: true,
      url: "/parent",
      templateUrl: "views/parent/common/content.html"
    })
    .state("parent.dashboard", {
      url: "/dashboard",
      templateUrl: "views/parent/dashboard.html",
      data: { pageTitle: "Dashboard" },
      controller: "dashboardCtrl",
      resolve: RouteHelpersProvider.resolveFor("dashboardCtrl-controller")
    })
    .state("parent.teamList", {
      url: "/teamList",
      templateUrl: "views/parent/teamList.html",
      data: { pageTitle: "Team List" },
      controller: "teamListCtrl",
      resolve: RouteHelpersProvider.resolveFor(
        "teamListCtrl-controller",
        "ui.select",
        "bootstrapLightbox"
      )
    })
    .state("parent.settings", {
      url: "/settings",
      templateUrl: "views/parent/settings.html",
      data: { pageTitle: "Settings" },
      controller: "settingCtrl",
      resolve: RouteHelpersProvider.resolveFor(
        "settingCtrl-controller",
        "bootstrapLightbox"
      )
    })
    .state("parent.addAdmin", {
      url: "/addAdmin",
      templateUrl: "views/parent/addAdmin.html",
      data: { pageTitle: "Add Admin" },
      controller: "addadminCtrl",
      resolve: RouteHelpersProvider.resolveFor(
        "addadminCtrl-controller",
        "bootstrapLightbox"
      )
    })
    .state("parent.adminList", {
      url: "/adminList",
      templateUrl: "views/parent/adminList.html",
      data: { pageTitle: "List Admin" },
      controller: "adminListCtrl",
      resolve: RouteHelpersProvider.resolveFor(
        "adminListCtrl-controller",
        "bootstrapLightbox"
      )
    })
    .state("parent.adminChangePassword", {
      url: "/adminChangePassword",
      templateUrl: "views/parent/adminChangePassword.html",
      data: { pageTitle: "Admin Change Password" },
      controller: "adminPasswordCtrl",
      resolve: RouteHelpersProvider.resolveFor(
        "adminListCtrl-controller",
        "bootstrapLightbox"
      )
    })
    .state("parent.feeds", {
      url: "/feeds",
      templateUrl: "views/parent/feeds.html",
      data: { pageTitle: "Feeds List" },
      controller: "feedsListCtrl",
      resolve: RouteHelpersProvider.resolveFor(
        "feedsListCtrl-controller",
        "bootstrapLightbox"
      )
    })
    .state("game", {
      abstract: true,
      url: "/game",
      templateUrl: "views/parent/common/content.html"
    })
    .state("game.gameList", {
      url: "/gameList",
      templateUrl: "views/parent/gameList.html",
      data: { pageTitle: "Game List" },
      controller: "gameListCtrl",
      resolve: RouteHelpersProvider.resolveFor(
        "gameListCtrl-controller",
        "bootstrapLightbox"
      )
    })
    .state("game.playerGame", {
      url: "/playerGame",
      templateUrl: "views/parent/playerGame.html",
      data: { pageTitle: "Player Game List" },
      controller: "playergameListCtrl",
      resolve: RouteHelpersProvider.resolveFor(
        "playergameListCtrl-controller",
        "bootstrapLightbox"
      )
    })
    .state("game.createGame", {
      url: "/createGame",
      templateUrl: "views/parent/createGame.html",
      data: { pageTitle: "Create Game" },
      controller: "createGameCtrl",
      resolve: RouteHelpersProvider.resolveFor(
        "createGameCtrl-controller",
        "ngFileUpload",
        "ngAutocomplete",
        "ngTagsInput",
        "daterangepicker"
      )
    })

    .state("player", {
      abstract: true,
      url: "/player",
      templateUrl: "views/parent/common/content.html"
    })
    .state("player.playerList", {
      url: "/playerList",
      templateUrl: "views/parent/playerList.html",
      data: { pageTitle: "Player List" },
      controller: "playerListCtrl",
      resolve: RouteHelpersProvider.resolveFor(
        "playerListCtrl-controller",
        "bootstrapLightbox"
      )
    })
    .state("live", {
      abstract: true,
      url: "/live",
      templateUrl: "views/parent/common/content.html"
    })
    .state("live.liveGames", {
      url: "/liveGames",
      templateUrl: "views/parent/liveGames.html",
      data: { pageTitle: "Live Games" },
      controller: "liveGamesCtrl",
      resolve: RouteHelpersProvider.resolveFor(
        "liveGamesCtrl-controller",
        "bootstrapLightbox"
      )
    })

    .state("category", {
      abstract: true,
      url: "/category",
      templateUrl: "views/parent/common/content.html"
    })

    .state("category.list1", {
      url: "/list1/:level",
      templateUrl: "views/parent/list1.html",
      data: { pageTitle: "" },
      controller: "list1Ctrl",
      resolve: RouteHelpersProvider.resolveFor(
        "list1-controller",
        "bootstrapLightbox"
      )
    })

    .state("category.list2", {
      url: "/list2/:level",
      templateUrl: "views/parent/list2.html",
      data: { pageTitle: "" },
      controller: "list2Ctrl",
      resolve: RouteHelpersProvider.resolveFor(
        "list2-controller",
        "bootstrapLightbox"
      )
    })

    .state("category.list3", {
      url: "/list3/:level",
      templateUrl: "views/parent/list3.html",
      data: { pageTitle: "" },
      controller: "list3Ctrl",
      resolve: RouteHelpersProvider.resolveFor(
        "list3-controller",
        "bootstrapLightbox"
      )
    });
}

beyondTheWalls.config([
  "$controllerProvider",
  "$compileProvider",
  "$filterProvider",
  "$provide",
  "$httpProvider",
  "$injector",
  function(
    $controllerProvider,
    $compileProvider,
    $filterProvider,
    $provide,
    $httpProvider,
    $injector
  ) {
    "use strict";
    // registering components after bootstrap
    beyondTheWalls.controller = $controllerProvider.register;
    beyondTheWalls.directive = $compileProvider.directive;
    beyondTheWalls.filter = $filterProvider.register;
    beyondTheWalls.factory = $provide.factory;
    beyondTheWalls.service = $provide.service;
    beyondTheWalls.constant = $provide.constant;
    beyondTheWalls.value = $provide.value;

    // added http interceptors
    $httpProvider.interceptors.push(function($q) {
      return {
        responseError: function(rejection) {
          if (rejection.status <= -1) {
            window.location = "error.html";
            return;
          }
          return $q.reject(rejection);
        }
      };
    });
  }
]);
