beyondTheWalls.controller("createGameCtrl", [
  "$scope",
  "$rootScope",
  "$cookies",
  "services",
  "factories",
  "$state",
  "$stateParams",
  "$loading",
  "$timeout",
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
    $uibModal
  ) {
    $scope.options = {
      height: 200,
      toolbar: [
        ["edit", ["undo", "redo"]],
        ["headline", ["style"]],
        [
          "style",
          [
            "bold",
            "italic",
            "underline",
            "superscript",
            "subscript",
            "strikethrough",
            "clear"
          ]
        ],
        ["fontface", ["fontname"]],
        ["textsize", ["fontsize"]],
        ["fontclr", ["color"]],
        ["alignment", ["ul", "ol", "paragraph", "lineheight"]],
        ["height", ["height"]],
        ["table", ["table"]],
        ["insert", ["link", "picture", "video", "hr"]],
        ["view", ["fullscreen", "codeview"]],
        ["help", ["help"]]
      ]
    };

    $scope.obj = {};
    $scope.abc = 0;
    $scope.cloned = false;
    $scope.textbox = 1;

    $scope.deletedChanllenges = [];

    $scope.geocoder = new google.maps.Geocoder();
    var placeSearch, autocomplete;
    var componentForm = {
      street_number: "short_name",
      route: "long_name",
      locality: "long_name",
      administrative_area_level_1: "long_name",
      country: "long_name",
      postal_code: "short_name"
    };

    function initialize() {
      var input = document.getElementById("searchTextField");
      var autocomplete = new google.maps.places.Autocomplete(input);
      google.maps.event.addListener(autocomplete, "place_changed", function() {
        var place = autocomplete.getPlace();
        document.getElementById("city2").value = place.name;
        document.getElementById(
          "cityLat"
        ).value = place.geometry.location.lat();
        document.getElementById(
          "cityLng"
        ).value = place.geometry.location.lng();
        var arrAddress = place.address_components;
        $scope.game.latitude = place.geometry.location.lat();
        $scope.game.longitude = place.geometry.location.lng();
        var lastData = arrAddress[arrAddress.length - 1];
        $.each(arrAddress, function(i, address_component) {
          if (address_component.types[0] == "locality") {
            $scope.game.cityName = address_component.long_name;
            // console.log('$scope.game.cityName',$scope.game.cityName)
          } else if (address_component.types[0] == "country") {
            // console.log("country:" + address_component.short_name);
            $scope.game.countryName = address_component.short_name;
          }
          if (address_component.types[0] == "administrative_area_level_1") {
            $scope.game.stateName = address_component.long_name;
          }
          $scope.game.cityName = document.getElementById(
            "searchTextField"
          ).value;
          // console.log("909090909", $scope.game.cityName);
        });
      });
    }

    google.maps.event.addDomListener(window, "load", initialize);
    $timeout(function() {
      initialize();
    }, 1000);

    $scope.getList = function(val) {
      services.listlevelService(val, function(response, status) {
        if (val == 1) {
          $scope.list1 = _.sortBy(response.data, [
            function(o) {
              return o.name;
            }
          ]);
          if ($scope.myGameData) {
            var findIndex = _.findIndex(response.data, {
              _id: $scope.myGameData.levelOne
            });
            $scope.levelOne = response.data[findIndex];
            $scope.change1($scope.levelOne);
          }
        }
        // else if(val == 2){
        //     $scope.list2 = _.sortBy(response.data, [function(o) { return o.name; }]);
        //     if ($scope.myGameData) {
        //         var findIndex = _.findIndex(response.data, {'_id':  $scope.myGameData.levelTwo})
        //         $scope.levelTwo = response.data[findIndex];
        //         // $scope.change2($scope.levelTwo);
        //     }
        // }
        // else {
        //     $scope.list3 =  _.sortBy(response.data, [function(o) { return o.name; }]);
        //     if ($scope.myGameData) {
        //         var findIndex = _.findIndex(response.data, {'_id':  $scope.myGameData.levelThree})
        //         $scope.levelThree = response.data[findIndex];
        //     }
        // }
      });
    };

    $scope.getList(1);

    $scope.change1 = function(val) {
      //      console.log("data", val);
      if (val) {
        var data = {};
        data.level = 2;
        data.id = val._id;
        services.listlevelwithIdService(data, function(response, status) {
          $loading.start();
          if (status == 1) {
            $scope.list2 = _.sortBy(response.data, [
              function(o) {
                return o.name;
              }
            ]);
            if ($scope.myGameData) {
              var findIndex = _.findIndex(response.data, {
                _id: $scope.myGameData.levelTwo
              });
              $scope.levelTwo = response.data[findIndex];
              $scope.change2($scope.levelTwo);
            }
            $loading.finish();
          }
        });
      } else {
        $scope.levelTwo = "";
        $scope.levelThree = "";
      }
    };
    $scope.change2 = function(val) {
      //      console.log("data", val);
      if (val) {
        var data = {};
        data.level = 3;
        data.id = val._id;
        services.listlevelwithIdService(data, function(response, status) {
          $loading.start();
          if (status == 1) {
            $scope.list3 = _.sortBy(response.data, [
              function(o) {
                return o.name;
              }
            ]);
            if ($scope.myGameData) {
              var findIndex = _.findIndex(response.data, {
                _id: $scope.myGameData.levelThree
              });
              $scope.levelThree = response.data[findIndex];
            }
            $loading.finish();
          }
        });
      } else {
        $scope.levelThree = "";
      }
    };

    $scope.tempPassword = [];

    if (localStorage.getItem("gameData") != null) {
      //      console.log("am in if");
      var gameObj = JSON.parse(localStorage.getItem("gameData"));
      $scope.myGameData = JSON.parse(localStorage.getItem("gameData"));
      //      console.log(gameObj, "gameObj -->>");
      console.log("cloned = " + localStorage.getItem("clone"));
      $scope.id = gameObj._id;
      $scope.fileObj = gameObj.gameImage.original;
      $scope.chal = gameObj.challenges;
      $scope.game = {
        _id: gameObj._id,
        name: gameObj.name,
        description: gameObj.details,
        isProtected: gameObj.is_protected,
        password: gameObj.password,
        isOrderLock: gameObj.isOrderLock,
        gameImage: gameObj.original,
        geometry: "",
        location: gameObj.location,
        timerStatus: gameObj.timerStatus,
        timer: gameObj.timer / 1000,
        paused: gameObj.paused,
        maxPlayer: gameObj.maxPlayer,
        minPlayer: gameObj.minPlayer,
        stateName: gameObj.stateName,
        cityName: gameObj.cityName,
        countryName: gameObj.countryName,
        latitude: gameObj.location[0],
        longitude: gameObj.location[1]
      };

      if (gameObj.password) {
        $scope.game.password = gameObj.password.split(",");
        // $scope.game.password = (gameObj.password);
        //        console.log("yess   ", $scope.game.password);
      } else {
        $scope.game.password = "";
      }

      $scope.passWordCreate = {};
      $scope.gamePassword = $scope.game.password;
      if ($scope.gamePassword) {
        //        console.log("[]][]", $scope.gamePassword);
        // for (var i = 0; i < $scope.gamePassword.length; i++) {
        $scope.passWordCreate[0] = $scope.gamePassword;
        // }
      }
      //      console.log("mypass", $scope.game.password);
      if ($scope.game.password) {
        $scope.tempPassword = $scope.game.password;
      }

      $scope.mindate = moment();

      if (gameObj.cityName == "undefined") {
        //        console.log("if -->>");
        //$scope.game.location = gameObj.stateName + "," + gameObj.countryName;
        $scope.game.location = gameObj.stateName;
      } else {
        //        console.log("else -->>");
        //        $scope.game.location = gameObj.cityName + "," + gameObj.countryName;
        $scope.game.location = gameObj.cityName;
      }

      $scope.datePicker = {
        startDate: gameObj.startDate,
        endDate: gameObj.endDate
      };
      $scope.gameImage = {
        original: gameObj.gameImage.original,
        thumbnail: gameObj.gameImage.thumbnail
      };

      $scope.challenges = [];
      $scope.toggleCheck = function(data, index) {
        //        console.log(data, "data ==>>");
      };

      $scope.toggleHardCheck = function(data) {
        $scope.hardonOff = data;
      };

      $scope.toggleToughCheck = function(data) {
        $scope.toughonOff = data;
      };

      $scope.newChallenges = [];
      gameObj.challenges.forEach(function(col) {
        //        console.log("before", col);
        var obj = {
          original: col.challengeImage.original,
          thumbnail: col.challengeImage.thumbnail
        };
        var tempObj = {
          id: col._id,
          name: col.name,
          details: col.details,
          descriptionImage: col.original,
          possibleAttemp: col.possibleAttemp,
          hints: col.hints,
          orderId: col.orderId,
          points: col.points,
          customDialog: col.customDialog,
          challengeType: col.challengeType,
          onOff: col.onOff,
          hardonOff: col.hardonOff,
          toughonOff: col.toughonOff,
          timer: col.timer / 1000,
          timerStatus: col.timerStatus,
          isShown: col.isShown
        };

        angular.forEach(col.hints, function(val, key) {
          //          console.log("val", val);
          if (val.hintType == "Easy") {
            tempObj.name1 = val.name;
            tempObj.points1 = val.points;
            tempObj.type1 = "Easy";
          }
          if (val.hintType == "Hard") {
            tempObj.name2 = val.name;
            tempObj.points2 = val.points;
            tempObj.type2 = "Hard";
          }
          if (val.hintType == "Too tough") {
            tempObj.name3 = val.name;
            tempObj.points3 = val.points;
            tempObj.type3 = "Too tough";
          }
        });

        if (col.challengeImage.original) {
          tempObj.image1 = obj;
        }
        if (col.descriptionImage.descOriginal) {
          tempObj.descriptionImage = obj;
        }

        if (col.challengeType == "Image") {
          tempObj.isShown = col.isShown;
          //          console.log("tempObj.isShown", tempObj.isShown);
          if (col.isKeyword) {
            var tempKeywords = [];
            angular.forEach(col.keywords, function(val, key) {
              //              console.log("cca", val);
              tempKeywords.push(val);
            });

            tempObj.keywords = tempKeywords;
            tempObj.isKeyword = true;
          } else {
            tempObj.isKeyword = false;
          }
        } else if (col.challengeType == "Location") {
          tempObj.location = col.location;
          if (tempObj.location == "location temp") {
            tempObj.locationType = "Lat_Long";
            tempObj.long = col.longitute;
            tempObj.lat = col.latitute;
          } else {
            tempObj.locationType = "Address";
            tempObj.long = col.longitute;
            tempObj.lat = col.latitute;
          }
          tempObj.latitute = col.location[1];
          tempObj.longitute = col.location[0];
          tempObj.distanceDiff = Number(col.distanceDiff);
        } else if (col.challengeType == "QR code") {
          tempObj.qrCode = col.qrCode;
        } else if (col.challengeType == "Text") {
          var tempTextAns = [];
          angular.forEach(col.textAnswer, function(val, key) {
            tempTextAns.push(val);
          });
          //          console.log("-=-=--=-=-=-", col);
          tempObj.textAnswer = tempTextAns;
        }
        $scope.challenges.push(tempObj);
        //        console.log("after", $scope.challenges);
      });
    } else {
      $scope.game = {
        name: "",
        description: "",
        minPlayer: "",
        maxPlayer: "",
        isProtected: false,
        password: "",
        isOrderLock: true,
        location: "",
        geometry: "",
        timerStatus: true,
        paused: false,
        timer: "",
        isShown: false
      };

      $scope.mindate = moment();

      $scope.datePicker = {
        startDate: null,
        endDate: null
      };
      $scope.challenges = [{}];
      $scope.challenges[0].type1 = "Easy";
      $scope.challenges[0].type2 = "Hard";
      $scope.challenges[0].type3 = "Too tough";
      $scope.challenges[0].onOff = true;
      $scope.challenges[0].hardonOff = true;
      $scope.challenges[0].toughonOff = true;
    }

    $scope.newArray = [];

    $scope.addPassword = function() {
      if ($scope.game.isProtected) {
        //        console.log("$scope.game.password", $scope.game.password);
        var result = Object.values($scope.game.password);
        $scope.resultValue = result;
        $scope.val = "";
        $scope.tempPassword.push($scope.val);
      }
    };

    $scope.minusPassword = function(index) {
      $scope.tempPassword = $scope.resultValue.splice(index, 1);
    };

    $scope.addChallenge = function() {
      $scope.filedata = "";
      $scope.challenges.push({});
      //      console.log($scope.challenges.length, "$scope.challenges ----->>>>>>>>>");

      // for (var i = 0; i < $scope.challenges.length - 1; i++) {
      //     $scope.challenges[i + 1].type1 = 'Easy';
      //     $scope.challenges[i + 1].type2 = 'Hard';
      //     $scope.challenges[i + 1].type3 = 'Too tough';
      //     $scope.challenges[i + 1].onOff = false;
      //     $scope.challenges[i + 1].hardonOff = false
      //     $scope.challenges[i + 1].toughonOff = false;
      // }
    };

    $scope.toggleCheck = function(data, index) {
      $scope.challenges[index].onOff = data;
    };

    $scope.toggleHardCheck = function(data, index) {
      $scope.challenges[index].hardonOff = data;
    };

    $scope.toggleToughCheck = function(data, index) {
      $scope.challenges[index].toughonOff = data;
    };

    $scope.showDelete = function(index) {
      $scope.challenges[index].classes = true;
    };

    $scope.hideDelete = function(index) {
      $scope.challenges[index].classes = false;
    };

    $scope.deleteGame = function(index, data) {
      $scope.deletedChanllenges.push(data.id);
      $scope.challenges.splice(index, 1);
    };

    $scope.hints = [];

    $scope.deleteChallengeObj = function(type, obj) {
      switch (type) {
        case "Image":
          delete obj.qrCode;
          delete obj.location;
          delete obj.geometry;
          delete obj.textAnswer;
          delete obj.distanceDiff;
          break;
        case "Location":
          delete obj.keywords;
          delete obj.qrCode;
          delete obj.textAnswer;
          delete obj.isKeyword;
          break;
        case "QR code":
          delete obj.keywords;
          delete obj.location;
          delete obj.geometry;
          delete obj.distanceDiff;
          delete obj.textAnswer;
          delete obj.isKeyword;
          break;
        case "Text":
          delete obj.qrCode;
          delete obj.keywords;
          delete obj.location;
          delete obj.distanceDiff;
          delete obj.geometry;
          delete obj.isKeyword;
          break;
        case "Custom":
          delete obj.keywords;
          delete obj.location;
          delete obj.geometry;
          delete obj.distanceDiff;
          delete obj.textAnswer;
          delete obj.isKeyword;
          break;
      }
    };

    $scope.changeLocObj = function(text) {
      $scope.locationType = text;
    };

    $scope.createGame = function(data, isValid) {
      if ($scope.game.password) {
        var result = Object.values($scope.game.password);
        $scope.resultValue = result;
      }

      // console.log('opopoppo',$scope.resultValue);

      if ($scope.game.isProtected) {
        //        console.log("opopoppo", $scope.resultValue);
        if ($scope.resultValue) {
        } else {
          factories.error("Please add atleast 1 password");
        }
        // if($scope.game.password.length){
        // }
        // else {
        //     factories.error('Please add atleast 1 password');
        // }
        angular.forEach($scope.resultValue, function(val, key) {
          if (val) {
          } else {
            factories.error("Password should not be empty");
          }
        });
      }

      if (isValid) {
        if (parseInt($scope.game.minPlayer) > parseInt($scope.game.maxPlayer)) {
          factories.error(
            "Maximum Players should be greater than Minimum Players."
          );
          return false;
        }
        $loading.start();
        for (var i = 0; i < $scope.challenges.length; i++) {
          if (
            parseInt($scope.challenges[i].points1) +
              parseInt($scope.challenges[i].points2) +
              parseInt($scope.challenges[i].points3) >
            parseInt($scope.challenges[i].points)
          ) {
            factories.error(
              "The points of hints used should not exceed total challenge points"
            );
            $loading.finish();
            return false;
          }
        }
        var challengeArr = [];

        if (localStorage.getItem("clone")) {
        } else {
          if ($scope.deletedChanllenges.length > 0) {
            $scope.deletedChanllenges.forEach(chal => {
              if(chal){
                services.removechallenge(chal, function (response,status) {
                    if(status == 1){
                    }
                    else {
                        factories.error(response.message);
                        factories.unAuthorize(response);
                    }
                });
              }  
            });
          }
        }
        
        // console.log($scope.challenges);
        console.log("size " + $scope.challenges.length);
        $scope.challenges.forEach(function(col) {
          console.log("Here: " + col.customDialog);
          var customTitle = "";
          var customDescription = "";
          if (col.customDialog) {
            customTitle = col.customDialog.title;
            customDescription = col.customDialog.description;
          }
          var customDetails = "";
          if (col.details) {
            customDetails = col.details;
          }
          var tempObj = {
            name: col.name,
            details: customDetails,
            points: col.points,
            hardonOff: col.hardonOff,
            toughonOff: col.toughonOff,
            onOff: col.onOff,
            possibleAttemp: col.possibleAttemp,
            hints: [
              {
                name: col.name1,
                type: "Easy",
                point: col.points1
              },
              {
                name: col.name2,
                type: "Hard",
                point: col.points2
              },
              {
                name: col.name3,
                type: "Too tough",
                point: col.points3
              }
            ],
            customDialog: {
              title: customTitle,
              description: customDescription
            },
            challengeType: col.challengeType
          };

          if (localStorage.getItem("clone")) {
          } else {
            if (col.id) {
              tempObj._id = col.id;
            }
          }

          if (col.descriptionImage) {
            tempObj.descOriginal = col.descriptionImage.original;
            tempObj.descThumbnail = col.descriptionImage.thumbnail;
          }

          if (col.image1) {
            tempObj.original = col.image1.original;
            tempObj.thumbnail = col.image1.thumbnail;
          }
          if (col.challengeType == "Image") {
            //            console.log("if1");
            if (col.isKeyword) {
              //              console.log("if2");
              var tempKeywords = [];
              angular.forEach(col.keywords, function(c) {
                tempKeywords.push(c.text.toLowerCase());
              });
              tempObj.keywords = _.uniq(tempKeywords);
              tempObj.isKeyword = true;
              tempObj.isShown = col.isShown ? col.isShown : false;
              // var uniq = _.uniq(tempKeywords);
              // console.log('-=-=-==-rererererererererere',tempKeywords,uniq)
            } else {
              //              console.log("else");
              tempObj.isKeyword = false;
              tempObj.isShown = col.isShown ? col.isShown : false;
            }
          } else if (col.challengeType == "Location") {
            if (localStorage.getItem("gameData") == null) {
              if (col.locationType == "Address") {
                tempObj.location = col.location;
                tempObj.latitute = col.geometry.geometry.location.lat();
                tempObj.longitute = col.geometry.geometry.location.lng();
              } else if (col.locationType == "Lat_Long") {
                tempObj.location = "location temp";
                // tempObj.latitute = col.geometry.geometry.location.lat();
                // tempObj.longitute = col.geometry.geometry.location.lng();
                tempObj.latitute = col.lat;
                tempObj.longitute = col.long;
              }
            } else if (localStorage.getItem("gameData") != null) {
              // console.log('lat',geolocation)
              if (col.locationType == "Address") {
                tempObj.location = col.location;
                tempObj.latitute = col.latitude;
                tempObj.longitute = col.longitute;
              } else if (col.locationType == "Lat_Long") {
                tempObj.location = "location temp";
                tempObj.latitute = col.lat;
                tempObj.longitute = col.long;
              }
            }
            tempObj.distanceDiff = col.distanceDiff;
          } else if (col.challengeType == "QR code") {
            tempObj.qrCode = col.qrCode.toLowerCase();
          } else if (col.challengeType == "Text") {
            var tempTextAns = [];
            if (col.textAnswer != null) {
              col.textAnswer.forEach(function(c) {
                tempTextAns.push(c.text.toLowerCase());
              });

              if (tempTextAns.length != 0) tempObj.textAnswer = tempTextAns;
            }
          }

          tempObj.timerStatus = col.timerStatus ? col.timerStatus : false;
          if (col.timerStatus) {
            tempObj.timer = col.timer;
          }
          challengeArr.push(tempObj);
        });

        //        console.log("city name", $scope.game.cityName);

        var formData = new FormData();
        formData.append("accessToken", $cookies.get("token"));
        formData.append("name", $scope.game.name);
        formData.append("details", $scope.game.description);
        if ($scope.game.isProtected) {
          formData.append("is_protected", $scope.game.isProtected);
          if ($scope.resultValue) {
            formData.append("password", $scope.resultValue);
          }
        } else {
          formData.append("is_protected", $scope.game.isProtected);
        }

        formData.append("isOrderLock", $scope.game.isOrderLock);
        formData.append("gameImage", JSON.stringify($scope.gameImage));

        if (!$scope.game.city) {
          formData.append("cityName", $scope.game.cityName);
        } else {
          formData.append("cityName", $scope.game.cityName);
        }
        if ($scope.game.stateName) {
          formData.append("stateName", $scope.game.stateName);
        }
        if ($scope.game.countryName) {
          formData.append("countryName", $scope.game.countryName);
        }

        formData.append("maxPlayer", parseInt($scope.game.maxPlayer));
        formData.append("minPlayer", parseInt($scope.game.minPlayer));
        formData.append("startDate", $scope.datePicker.startDate);
        formData.append("endDate", $scope.datePicker.endDate);

        formData.append("gameLocation", $scope.game.location);
        formData.append("latitude", $scope.game.latitude);
        formData.append("longitude", $scope.game.longitude);

        if ($scope.levelOne) {
          formData.append("levelOne", $scope.levelOne._id);
          formData.append("levelOneName", $scope.levelOne.name);
        }
        if ($scope.levelTwo) {
          formData.append("levelTwo", $scope.levelTwo._id);
          formData.append("levelTwoName", $scope.levelTwo.name);
        }
        if ($scope.levelThree) {
          formData.append("levelThree", $scope.levelThree._id);
          formData.append("levelThreeName", $scope.levelThree.name);
        }

        if ($scope.game) {
          formData.append("timerStatus", $scope.game.timerStatus);
          if ($scope.game.timerStatus) {
            formData.append("timer", parseInt($scope.game.timer));
          }
        }
        formData.append("paused", $scope.game.paused);

        if (localStorage.getItem("clone")) {
        } else {
          if ($scope.id) {
            formData.append("_id", $scope.id);
          }
        }
        formData.append("challenges", JSON.stringify(challengeArr));
        console.log("challenges length = " +  challengeArr.length);
        services.createGameService(formData, function(response, status) {
          if (status == 1) {
            $loading.finish();
            localStorage.clear();
            $state.go("game.gameList");
            factories.success(response.message);
          } else {
            $loading.finish();
            factories.error(response.message);
            factories.unAuthorize(response);
          }
        });
      }
    };

    var Currentindex;
    $scope.GetIndexValue = function(index, data) {
      Currentindex = index;
      console.log(data);
      var empty = "";
      if (data) {
        $("#summernote").summernote("code", data);
        $("#summernote1").summernote("code", data);
      }
      console.log(Currentindex);
    };

    $scope.uploadImage = function(file, error, index) {
      $loading.start("uploadPics");
      console.log(file);
      services.uploadimage(file, function(response, status) {
        $loading.finish("uploadPics");
        if (status == 1) {
          console.log("opop", $scope.picFile, response.data);
          $scope.gameImage = {
            original: response.data.original,
            thumbnail: response.data.thumbnail
          };
        }
      });
    };

    $scope.uploadFiles = function(file, error, index) {
      $loading.start("uploadPics");

      services.uploadimage(file, function(response, status) {
        $loading.finish("uploadPics");
        if (status == 1) {
          $scope.challenges[index].descriptionImage = response.data;
        }
      });
    };

    $scope.uploadFiles1 = function(file, error, index) {
      $loading.start("uploadPics");

      services.uploadimage(file, function(response, status) {
        $loading.finish("uploadPics");
        if (status == 1) {
          $scope.challenges[index].image1 = response.data;
          console.log(
            $scope.challenges[index].image1,
            "$scope.challenges[index].image1"
          );
        }
      });
    };
  }
]);
