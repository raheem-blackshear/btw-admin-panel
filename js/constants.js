beyondTheWalls.constant("Api", {
  url: "http://localhost:8002" //local
  //    "url": "http://192.168.8.102:8002"
  //    "url": "http://18.217.79.229:8002"

  // sudo ssh -i beyoundTheWellTesting.pem ubuntu@18.217.79.229
});

beyondTheWalls.constant("APP_REQUIRES", {
  // jQuery based and standalone scripts
  scripts: {
    "login-controller": ["js/controllers/login/login.js"],
    "dashboardCtrl-controller": ["js/controllers/dashboard/dashboard.js"],
    "createGameCtrl-controller": ["js/controllers/game/create.js"],
    "gameListCtrl-controller": ["js/controllers/game/gameList.js"],
    "playerListCtrl-controller": ["js/controllers/player/playerList.js"],
    "liveGamesCtrl-controller": ["js/controllers/liveGames/liveGames.js"],
    "teamListCtrl-controller": ["js/controllers/teamList/teamList.js"],
    "feedsListCtrl-controller": ["js/controllers/feeds/feeds.js"],
    "ForgotPassword-controller": [
      "js/controllers/forgotPassword/forgotPassword.js"
    ],
    "settingCtrl-controller": ["js/controllers/settings/settings-ctrl.js"],
    "addadminCtrl-controller": ["js/controllers/addAdmin/addAdmin.js"],
    "adminListCtrl-controller": ["js/controllers/addAdmin/adminList.js"],
    "list1-controller": ["js/controllers/category/list1.js"],
    "list2-controller": ["js/controllers/category/list2.js"],
    "list3-controller": ["js/controllers/category/list3.js"],
    "playergameListCtrl-controller": ["js/controllers/game/playergame.js"]
  },
  // Angular based script
  modules: [
    {
      name: "ngFileUpload",
      files: ["js/plugins/ng-file-upload/ng-file-upload.min.js"]
    },
    {
      name: "bootstrapLightbox",
      files: [
        "js/plugins/angular-bootstrap-lightbox/angular-bootstrap-lightbox.min.css",
        "js/plugins/angular-bootstrap-lightbox/angular-bootstrap-lightbox.min.js"
      ]
    },
    {
      name: "ui.select",
      files: [
        "js/plugins/angular-ui-select/dist/select.css",
        "js/plugins/angular-ui-select/dist/select.js"
      ]
    },
    {
      name: "ngAutocomplete",
      files: ["js/plugins/ngAutocomplete/ngAutocomplete.js"]
    },
    {
      name: "ngTagsInput",
      files: [
        "js/plugins/ng-tags-input/ng-tags-input.css",
        "js/plugins/ng-tags-input/ng-tags-input.js"
      ]
    },
    {
      name: "daterangepicker",
      files: [
        "js/plugins/angular-daterange-picker/daterangepicker.js",
        "js/plugins/angular-daterange-picker/angular-daterangepicker.js",
        "js/plugins/angular-daterange-picker/daterangepicker.css"
      ]
    }
  ]
});
