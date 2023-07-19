beyondTheWalls.service("services", [
    "$http",
    "Api",
    "$timeout",
    "$cookies",
    function($http, Api, $timeout, $cookies) {
        return {
            login: function($scope, callback) {
                $http({
                        url: Api.url + "/api/admin/login",
                        method: "POST",
                        data: {
                            email: $scope.user.email,
                            password: $scope.user.password
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            setDependencyService: function(data, callback) {
                $http({
                        url: Api.url + "/api/admin/makeChallengeAsDepended",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            unsetDependencyService: function(data, callback) {
                $http({
                        url: Api.url + "/api/admin/unsetDependValue",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            setDependency: function(
                fromChallengeId,
                toChallengeId,
                toChallengeName,
                callback
            ) {
                var depended = [];

                if (toChallengeName) {
                    depended.push({
                        dependUponChallengeName: toChallengeName,
                        dependUpon: toChallengeId
                    });
                } else {
                    depended.push({
                        dependUpon: toChallengeId
                    });
                }
                var data = {
                    accessToken: $cookies.get("token"),
                    whichChallengeId: fromChallengeId,
                    depended: depended
                };

                $http({
                        url: Api.url + "/api/admin/makeChallengeAsDepended",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            uncompchallenge: function($scope, playerId, callback) {
                $http({
                        url: Api.url + "/api/admin/getInCompleteChallenges",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            gameId: $scope.gameID,
                            userId: playerId
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            saveunapchallenge: function(
                challengeId,
                point,
                gameId,
                playerId,
                callback
            ) {
                $http({
                        url: Api.url + "/api/admin/completeUserChallengeForcely",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            challengeId: challengeId,
                            gameId: gameId,
                            userId: playerId,
                            points: point
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },
            setTimerStartService: function(data, callback) {
                $http({
                        url: Api.url + "/api/admin/timerStartIn",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            createGame: function($scope, data, id, callback) {
                var challengeArr = [];
                $scope.challenges.forEach(function(col) {
                    var tempObj = {
                        name: col.name,
                        details: col.details,
                        points: col.points,
                        hardonOff: col.hardonOff,
                        toughonOff: col.toughonOff,
                        onOff: col.onOff,
                        possibleAttemp: col.possibleAttemp,
                        hints: [{
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
                            title: col.title,
                            description: col.description
                        },
                        challengeType: col.challengeType
                    };

                    if (col.id) {
                        tempObj._id = col.id;
                    }
                    if (col.image) {
                        tempObj.original = col.image.original;
                        tempObj.thumbnail = col.image.thumbnail;
                    }

                    if (col.image1) {
                        tempObj.descOriginal = col.image1.original;
                        tempObj.descThumbnail = col.image1.thumbnail;
                    }

                    if (col.challengeType == "Image") {
                        tempObj.isShown = col.isShown;
                        if (col.isKeyword) {
                            var tempKeywords = [];
                            col.keywords.forEach(function(c) {
                                tempKeywords.push(c.text.toLowerCase());
                            });
                            tempObj.keywords = tempKeywords;
                            tempObj.isKeyword = true;
                        } else {
                            tempObj.isKeyword = false;
                        }
                    } else if (col.challengeType == "Location") {
                        if (localStorage.getItem("gameData") == null) {
                            if (col.locationType == "Address") {
                                tempObj.location = col.location;
                                tempObj.latitute = col.geometry.geometry.location.lat();
                                tempObj.longitute = col.geometry.geometry.location.lng();
                            } else if (col.locationType == "Lat_Long") {
                                tempObj.location = "location temp";
                                tempObj.latitute = col.lat;
                                tempObj.longitute = col.long;
                            }
                        } else if (localStorage.getItem("gameData") != null) {
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
                    if (col.timerStatus) {
                        tempObj.timer = col.timer;
                        tempObj.timerStatus = col.timerStatus;
                    }
                    challengeArr.push(tempObj);
                });

                var formData = new FormData();
                formData.append("accessToken", $cookies.get("token"));
                formData.append("name", $scope.game.name);
                formData.append("details", $scope.game.description);
                if ($scope.game.isProtected) {
                    formData.append("is_protected", $scope.game.isProtected);
                    formData.append("password", $scope.resultValue);
                } else {
                    formData.append("is_protected", $scope.game.isProtected);
                }

                formData.append("isOrderLock", $scope.game.isOrderLock);
                formData.append("gameImage", JSON.stringify($scope.gameImage));

                if (!$scope.game.city) {
                    formData.append("cityName", $scope.game.stateName);
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
                if (data) {
                    formData.append("timerStatus", data.timerStatus);
                    if (data.timerStatus) {
                        formData.append("timer", parseInt(data.timer));
                    }
                }

                formData.append("paused", data.paused);
                if (data._id) {
                    formData.append("_id", data._id);
                }

                if (id) {
                    formData.append("_id", id);
                }
                formData.append("challenges", JSON.stringify(challengeArr));
                $http({
                        url: Api.url + "/api/admin/createGame",
                        method: "POST",
                        headers: {
                            "Content-Type": undefined
                        },
                        data: formData
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            createGameService: function(input, callback) {
                $http({
                        url: Api.url + "/api/admin/createGame",
                        method: "POST",
                        headers: {
                            "Content-Type": undefined
                        },
                        data: input
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            // clonegame : function ($scope,gamedata, callback) {
            //     var challengeArr = [];
            //     $scope.challenges.forEach(function (col) {
            //         var tempObj = {
            //             name:col.name,
            //             details:col.details,
            //             points:col.points,
            //             possibleAttemp : col.possibleAttemp,
            //             hints:[{
            //                 name:col.name1,
            //                 type:col.type1,
            //                 point:col.points1
            //             },{
            //                 name:col.name2,
            //                 type:col.type2,
            //                 point:col.points2
            //             },{
            //                 name:col.name3,
            //                 type:col.type3,
            //                 point:col.points3
            //             }],
            //             customDialog:{
            //                 "title":col.customDialogtitle,
            //                 "description":col.customDialogdesc
            //             },
            //             challengeType:col.challengeType
            //         };
            //
            //         if(col.image){
            //             tempObj.original = col.image.original;
            //             tempObj.thumbnail = col.image.thumbnail
            //         }
            //
            //         if(col.image1){
            //             tempObj.descOriginal = col.image1.original;
            //             tempObj.descThumbnail = col.image1.thumbnail;
            //         }
            //
            //         if(col.challengeType == 'Image'){
            //             tempObj.isShown = col.isShown;
            //             if(col.isKeyword){
            //                 var tempKeywords = [];
            //                 col.keywords.forEach(function (c) {
            //                     tempKeywords.push(c.text.toLowerCase());
            //                 });
            //                 tempObj.keywords = tempKeywords;
            //                 tempObj.isKeyword = true;
            //             }
            //             else {
            //                 tempObj.isKeyword = false;
            //             }
            //         }
            //         else if(col.challengeType == 'Location'){
            //             if(localStorage.getItem('gameData') == null){
            //                 if(col.locationType == 'Address'){
            //                     tempObj.location = col.location;
            //                     tempObj.latitute = col.geometry.geometry.location.lat();
            //                     tempObj.longitute = col.geometry.geometry.location.lng();
            //                 }
            //                 else if(col.locationType == 'Lat_Long'){
            //                     tempObj.location = "location temp";
            //                     tempObj.latitute = col.lat;
            //                     tempObj.longitute = col.long;
            //                 }
            //             }
            //             else if(localStorage.getItem('gameData') != null){
            //                 if(col.locationType == 'Address'){
            //                     tempObj.location = col.location;
            //                     tempObj.latitute = col.latitude;
            //                     tempObj.longitute = col.longitute;
            //                 }
            //                 else if(col.locationType == 'Lat_Long'){
            //                     tempObj.location = "location temp";
            //                     tempObj.latitute = col.lat;
            //                     tempObj.longitute = col.long;
            //                 }
            //             }
            //             tempObj.distanceDiff = col.distanceDiff;
            //         }
            //         else if(col.challengeType == 'QR code'){
            //             tempObj.qrCode = col.qrCode.toLowerCase();
            //         }
            //         else if(col.challengeType == 'Text'){
            //             var tempTextAns = [];
            //             if(col.textAnswer != null) {
            //                 col.textAnswer.forEach(function (c) {
            //                     tempTextAns.push(c.text.toLowerCase());
            //                 });
            //
            //                 if(tempTextAns.length != 0)
            //                     tempObj.textAnswer = tempTextAns;
            //             }
            //         }
            //         challengeArr.push(tempObj);
            //     });
            //
            //     var formData = new FormData();
            //     formData.append('accessToken',$cookies.get('token'));
            //     formData.append('name',$scope.game.name);
            //     formData.append('details',$scope.game.description);
            //     if($scope.game.isProtected){
            //         formData.append('is_protected',$scope.game.isProtected);
            //         formData.append('password',JSON.parse($scope.tempPassword));
            //     }
            //     else {
            //         formData.append('is_protected',$scope.game.isProtected);
            //     }
            //
            //     formData.append('isOrderLock',$scope.game.isOrderLock);
            //     formData.append('gameImage',$scope.picFile);
            //     if(!$scope.city){
            //         formData.append('cityName',$scope.state);
            //     }
            //     else if ($scope.city){
            //         formData.append('cityName',$scope.city);
            //     }
            //     else if(!gamedata.cityName) {
            //         formData.append('cityName',gamedata.stateName);
            //     }
            //     else {
            //         formData.append('cityName',gamedata.cityName);
            //     }
            //     if($scope.state){
            //         formData.append('stateName',$scope.state);
            //     }
            //     else {
            //         formData.append('stateName',gamedata.stateName);
            //     }
            //
            //     if($scope.country){
            //         formData.append('countryName',$scope.country);
            //     }
            //     else {
            //         formData.append('countryName',gamedata.countryName);
            //     }
            //
            //     formData.append('maxPlayer',parseInt($scope.game.maxPlayer));
            //     formData.append('minPlayer',parseInt($scope.game.minPlayer));
            //     formData.append('startDate',$scope.datePicker.startDate);
            //     formData.append('endDate',$scope.datePicker.endDate);
            //     formData.append('gameLocation',$scope.game.location);
            //     formData.append('latitude',gamedata.geolocation[1]);
            //     formData.append('longitude',gamedata.geolocation[0]);
            //     formData.append('challenges',JSON.stringify(challengeArr));
            //     $http
            //     ({
            //         url: Api.url + '/api/admin/createGame',
            //         method: "POST",
            //         headers: {
            //             'Content-Type':undefined
            //         },
            //         data: formData
            //     }).success(function (response) {
            //         callback(response, 1);
            //     }).error(function (response) {
            //         callback(response, 0);
            //     });
            // },

            viewans: function($scope, callback) {
                $http({
                        url: Api.url + "/api/admin/findUserAnswerForPerticularChallenge",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            gameId: $scope.gameID,
                            challengeId: $scope.challengeID,
                            userId: $scope.playerId
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            changepassword: function(data, $scope, callback) {
                var formData = new FormData();
                formData.append("accessToken", $cookies.get("token"));
                formData.append("oldPassword", data.oldPassword);
                formData.append("newPassword", data.newPassword);
                $http({
                        url: Api.url + "/api/admin/changePassword",
                        method: "POST",
                        headers: {
                            "Content-Type": undefined
                        },
                        data: formData
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            changepasswordAdmin: function(data, callback) {
                var formData = new FormData();
                formData.append("accessToken", $cookies.get("token"));
                formData.append("password", data.password);
                formData.append("subAdminId", data.subAdminId);

                $http({
                        url: Api.url + "/api/admin/editSubAdmin",
                        method: "POST",
                        headers: {
                            "Content-Type": undefined
                        },
                        data: formData
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            addadmin: function(data, $scope, callback) {
                var formData = new FormData();
                formData.append("name", data.name);
                formData.append("email", data.email);
                formData.append("password", data.password);
                formData.append("accessToken", $cookies.get("token"));
                $http({
                        url: Api.url + "/api/admin/addSubAdmin",
                        method: "POST",
                        headers: {
                            "Content-Type": undefined
                        },
                        data: formData
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            viewusers: function(data, $scope, callback) {
                var data = {
                    accessToken: $cookies.get("token"),
                    gameId: data
                };
                $http({
                        url: Api.url + "/api/admin/usersCompletedGame",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            editpoints: function(data, $scope, callback) {
                var formData = new FormData();
                formData.append("totalPoints", data.totalPoints);
                formData.append(
                    "totalChallengeCompeleted",
                    data.totalChallengeCompeleted
                );
                formData.append("totalGameStarted", data.totalGameStarted);
                formData.append("userId", data.userId);
                formData.append("accessToken", $cookies.get("token"));

                $http({
                        url: Api.url + "/api/admin/updatepoints",
                        method: "POST",
                        headers: {
                            "Content-Type": undefined
                        },
                        data: formData
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            // editGame : function ($scope,callback) {
            //     var challengeArr = [];
            //     $scope.newChallenges.forEach(function (col) {
            //         var tempObj = {
            //             name:col.name,
            //             details:col.details,
            //             hints:[{
            //                 name:col.name1,
            //                 type:col.type1,
            //                 point:col.points1
            //             },{
            //                 name:col.name2,
            //                 type:col.type2,
            //                 point:col.points2
            //             },{
            //                 name:col.name3,
            //                 type:col.type3,
            //                 point:col.points3
            //             }],
            //             points:parseInt(col.points),
            //             customDialog:{
            //                 "title":col.customDialogtitle,
            //                 "description":col.customDialogdesc
            //             },
            //             challengeType:col.challengeType
            //         };
            //         if(col.challengeType == 'Image'){
            //             tempObj.isShown = col.isShown;
            //             if(col.isKeyword){
            //                 var tempKeywords = [];
            //                 col.keywords.forEach(function (c) {
            //                     tempKeywords.push(c.text.toLowerCase());
            //                 });
            //                 tempObj.keywords = tempKeywords;
            //                 tempObj.isKeyword = true;
            //             }
            //             else {
            //                 tempObj.isKeyword = false;
            //             }
            //         }
            //         else if(col.challengeType == 'Location'){
            //             if($scope.locationType == 'Address'){
            //                 tempObj.location = col.location;
            //                 tempObj.latitute = col.geometry.geometry.location.lat();
            //                 tempObj.longitute = col.geometry.geometry.location.lng();
            //             }
            //             else if($scope.locationType == 'Lat_Long'){
            //                 tempObj.location = "location temp";
            //                 // tempObj.latitute = col.geometry.geometry.location.lat();
            //                 // tempObj.longitute = col.geometry.geometry.location.lng();
            //                 tempObj.longitute = col.long;
            //                 tempObj.latitute = col.lat;
            //             }
            //             tempObj.distanceDiff = col.distanceDiff;
            //         }
            //         else if(col.hasOwnProperty('qrCode')){
            //             tempObj.qrCode = col.qrCode;
            //         }
            //         else if(col.hasOwnProperty('textAnswer')){
            //             var tempTextAns = [];
            //             if(col.textAnswer.length != 0) {
            //                 col.textAnswer.forEach(function (c) {
            //                     tempTextAns.push(c.text.toLowerCase());
            //                 });
            //                 tempObj.textAnswer = tempTextAns;
            //             }
            //         }
            //         challengeArr.push(tempObj);
            //     });
            //
            //     var formData = new FormData();
            //     formData.append('accessToken',$cookies.get('token'));
            //     formData.append('gameId',$scope.game.id);
            //     formData.append('name',$scope.game.name);
            //     formData.append('details',$scope.game.description);
            //     if($scope.game.isProtected){
            //         formData.append('is_protected',$scope.game.isProtected);
            //         formData.append('password',$scope.resultValue);
            //     }
            //     else {
            //         formData.append('is_protected',$scope.game.isProtected);
            //     }
            //     if($scope.picFile != null){
            //         formData.append('gameImage',$scope.picFile);
            //     }
            //     else if($scope.picFile == null && $scope.fileObj != null){
            //         formData.append('gameImage',$scope.fileObj);
            //     }
            //     formData.append('startDate',$scope.datePicker.startDate);
            //     formData.append('endDate',$scope.datePicker.endDate);
            //     formData.append('gameLocation',$scope.game.location);
            //     if( typeof $scope.game.geometry.geometry !='undefined'){
            //         formData.append('latitude',$scope.game.geometry.geometry.location.lat());
            //     }
            //     else {
            //         formData.append('latitude',$scope.game.geolocation[1]);
            //     }
            //     if( typeof $scope.game.geometry.geometry !='undefined'){
            //         formData.append('longitude',$scope.game.geometry.geometry.location.lng());
            //     }
            //     else {
            //         formData.append('longitude',$scope.game.geolocation[0]);
            //     }
            //
            //     if(challengeArr.length != 0) {
            //         formData.append('challenges', JSON.stringify(challengeArr));
            //     }
            //     $http
            //     ({
            //         url: Api.url + '/api/admin/editGame',
            //         method: "POST",
            //         headers: {
            //             'Content-Type':undefined
            //         },
            //         data: formData
            //     }).success(function (response) {
            //         callback(response, 1);
            //     }).error(function (response) {
            //         callback(response, 0);
            //     });
            // },

            uploadimage: function(file, callback) {
                var formdata = new FormData();
                formdata.append("accessToken", $cookies.get("token"));
                formdata.append("challengeImage", file);
                $http({
                        url: Api.url + "/api/admin/uploadImageOnS3",
                        method: "POST",
                        headers: {
                            "Content-Type": undefined
                        },
                        data: formdata
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            savepoint: function($scope, data, callback) {
                var dta = {
                    accessToken: $cookies.get("token"),
                    challengeId: data._id,
                    points: data.points.toString()
                };
                $http({
                        url: Api.url + "/api/admin/editChallenge",
                        method: "POST",
                        data: dta
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            // savepointService : function (data,callback) {
            //     callback('response', 1);
            // },

            savepointService: function(data, callback) {
                console.log("gId, gameId : " + data.gameId);
                var dta = {
                    accessToken: $cookies.get("token"),
                    newPoints: data.newPoints.toString(),
                    oldPoints: data.points.toString(),
                    gameId: data.gameId,
                    challengeId: data._id,
                    playerId: data.playerId
                };
                //   gameId: localStorage.getItem("NgameId"),
                $http({
                        url: Api.url + "/api/admin/challengeEditPoint",
                        method: "POST",
                        data: dta
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            completeGameService: function(data, callback) {
                $http({
                        url: Api.url + "/api/admin/completeUserChallengeForcely",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            listGame: function(skip, limit, search, callback) {
                var data = {
                    accessToken: $cookies.get("token"),
                    limit: limit.toString(),
                    skip: skip.toString()
                };
                if (search != "") {
                    data.searchText = search;
                }
                $http({
                        url: Api.url + "/api/admin/gameListing",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            viewgame: function(id, callback) {
                var data = {
                    accessToken: $cookies.get("token"),
                    userId: id
                };
                $http({
                        url: Api.url + "/api/admin/usergame",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            gamepoints: function(gameId, challengeIDs, userId, callback) {
                var data = {
                    accessToken: $cookies.get("token"),
                    userId: userId,
                    gameId: gameId,
                    challengeIds: challengeIDs
                };
                $http({
                        url: Api.url + "/api/admin/gameDescrptionToAdmin",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            // userChallengePointListingService: function(gameId, userId, callback){
            //     var data = {
            //         accessToken:$cookies.get('token'),
            //         userId: userId,
            //         gameId : gameId
            //     };
            //     $http
            //     ({
            //         url: Api.url + '/api/admin/userChallengePointListing',
            //         method: "POST",
            //         data: data
            //     }).success(function (response) {
            //         callback(response, 1);
            //     }).error(function (response) {
            //         callback(response, 0);
            //     });
            // },

            csvGame: function(callback) {
                var data = {
                    accessToken: $cookies.get("token"),
                    limit: "1000",
                    skip: "0"
                };
                $http({
                        url: Api.url + "/api/admin/gameListing",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            listAdmin: function(skip, limit, search, callback) {
                var data = {
                    accessToken: $cookies.get("token"),
                    limit: limit.toString(),
                    skip: skip.toString()
                };
                if (search != "") {
                    data.searchText = search;
                }
                $http({
                        url: Api.url + "/api/admin/subAdminListing",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            removeGame: function(id, callback) {
                $http({
                        url: Api.url + "/api/admin/removeGame",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            gameId: id,
                            type: "delete"
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            removeCategoryService: function(data, callback) {
                $http({
                        url: Api.url + "/api/admin/deleteCategory",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            removechallenge: function(id, callback) {
                $http({
                        url: Api.url + "/api/admin/deleteChallenge",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            challengeId: id
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            listPlayer: function(skip, limit, search, callback) {
                var data = {
                    accessToken: $cookies.get("token"),
                    limit: limit.toString(),
                    skip: skip.toString()
                };
                if (search != "") {
                    data.searchText = search;
                }
                $http({
                        url: Api.url + "/api/admin/playerListing",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            csvPlayer: function(callback) {
                var data = {
                    accessToken: $cookies.get("token")
                };
                $http({
                        url: Api.url + "/api/admin/exportToCsv",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            csvGame: function(callback) {
                var data = {
                    accessToken: $cookies.get("token")
                };
                $http({
                        url: Api.url + "/api/admin/exportGameCsv",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            teamList: function(data, callback) {
                $http({
                        url: Api.url + "/api/admin/teamListing",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            gameId: data.gameId,
                            challengeId: data._id
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            listFeeds: function(callback) {
                $http({
                        url: Api.url + "/api/admin/feeds",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token")
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            listlevelService: function(level, callback) {
                $http({
                        url: Api.url + "/api/admin/listCategory",
                        method: "POST",
                        data: {
                            // accessToken:$cookies.get('token'),
                            level: level
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            listlevelwithIdService: function(data, callback) {
                $http({
                        url: Api.url + "/api/admin/listCategory",
                        method: "POST",
                        data: data
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            liveGamesService: function(callback) {
                $http({
                        url: Api.url + "/api/admin/listGamesWithFilter",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token")
                            // paused: formdata
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },
            addCategoryService: function(formdata, callback) {
                $http({
                        url: Api.url + "/api/admin/addEditCategory",
                        method: "POST",
                        data: formdata
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            setFeaturedOrDelete: function(id, type, callback) {
                $http({
                        url: Api.url + "/api/admin/setFeaturedorDelete",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            feedId: id,
                            status: type
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            featuredToggle: function(id, value, callback) {
                $http({
                        url: Api.url + "/api/admin/setFeaturedorDelete",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            feedId: id,
                            status: "featured",
                            type: value.toString()
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            setFeaturedGame: function(id, value, callback) {
                $http({
                        url: Api.url + "/api/admin/removeGame",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            gameId: id,
                            type: "featured",
                            status: value.toString()
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            blockUnblockPlayer: function(id, status, callback) {
                $http({
                        url: Api.url + "/api/admin/blockOrUnblock",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            userId: id,
                            status: status
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            swapOrder: function(from, to, callback) {
                // var len  = from.length;
                // var arr =[];
                // for(var i=0;i<len;i++){
                //     arr.push({
                //         old:from[i],
                //         new:to[i]
                //     })
                // }
                $http({
                        url: Api.url + "/api/admin/swapOrderOfChallange",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            data: JSON.stringify(to)
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            blockUnblockAdmin: function(id, status, callback) {
                if (status == "Block") {
                    var block = true;
                } else var block = false;
                $http({
                        url: Api.url + "/api/admin/editSubAdmin",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            subAdminId: id,
                            block: block
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            deleteuser: function(id, callback) {
                $http({
                        url: Api.url + "/api/admin/MakeUserAsDeleted",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            userId: id
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            removePlayer: function(id, callback) {
                $http({
                        url: Api.url + "/api/admin/removePlayer",
                        method: "POST",
                        data: {
                            accessToken: $cookies.get("token"),
                            userId: id
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            forgot: function(password, token, callback) {
                $http({
                        url: Api.url + "/api/admin/resetPassword",
                        method: "POST",
                        data: {
                            passwordResetToken: token,
                            password: password
                        }
                    })
                    .success(function(response) {
                        callback(response, 1);
                    })
                    .error(function(response) {
                        callback(response, 0);
                    });
            },

            datatable: function(id, options) {
                if ($.fn.DataTable.isDataTable("#" + id)) {
                    angular
                        .element("#" + id)
                        .DataTable()
                        .clear()
                        .destroy();
                }
                var dtInstance;
                $timeout(function() {
                    if (!$.fn.dataTable) return;
                    dtInstance = $("#" + id).dataTable(options);
                }, 100);
            },

            datatables: function(id, options) {
                var dtInstance;
                $timeout(function() {
                    if (!$.fn.dataTable) return;
                    dtInstance = $("#" + id).dataTable(options);
                });
            }
        };
    }
]);

beyondTheWalls.factory("factories", [
    "SweetAlert",
    "$state",
    "$cookies",
    function(SweetAlert, $state, $cookies) {
        return {
            success: function(message) {
                SweetAlert.swal({
                    title: message,
                    type: "success"
                });
            },
            error: function(message) {
                SweetAlert.swal({
                    title: message,
                    type: "error"
                });
            },
            successCallback: function(message, callback) {
                SweetAlert.swal({
                        title: message,
                        type: "success"
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            callback();
                        }
                    }
                );
            },
            errorCallback: function(message, callback) {
                SweetAlert.swal({
                        title: message,
                        type: "danger"
                    },
                    function() {
                        callback();
                    }
                );
            },
            confirmDelete: function(message, callback) {
                SweetAlert.swal({
                        title: "",
                        text: message,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        closeOnConfirm: false
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            callback(true);
                        } else {
                            // callback(false);
                        }
                    }
                );
            },
            confirm: function(message, callback) {
                SweetAlert.swal({
                        title: message,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        closeOnConfirm: false
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            callback(true);
                        } else {
                            callback(false);
                        }
                    }
                );
            },
            logoutForm: function(message, callback) {
                SweetAlert.swal({
                        title: message,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes",
                        closeOnConfirm: false,
                        closeOnCancel: true
                    },
                    function(isConfirm) {
                        if (isConfirm) {
                            callback();
                        }
                    }
                );
            },
            unAuthorize: function(data) {
                if (data.statusCode == 401) {
                    $state.go("login");
                    $cookies.remove("obj");
                }
            },
            hideSideMenu: function() {
                angular.element(".pace-done").addClass("mini-navbar");
                $cookies.put("sidemenu", true);
            }
        };
    }
]);

beyondTheWalls.service("$loading", [
    "$timeout",
    function($timeout) {
        return {
            start: function() {
                $timeout(function() {
                    pleaseWait({
                        backgroundColor: "#fed14e",
                        loadingHtml: "<div class='sk-spinner sk-spinner-chasing-dots'><div class='sk-dot1'></div><div class='sk-dot2'></div></div>"
                    });
                    angular.element(".pg-loading-logo-header").remove();
                    angular.element(".pg-loading-screen .pg-loading-html").css({
                        "margin-top": "0px"
                    });
                    angular.element(".sk-spinner-chasing-dots.sk-spinner").css({
                        width: "50px",
                        height: "50px"
                    });
                });
            },
            finish: function(timeout) {
                if (!timeout) {
                    timeout = 0;
                }
                $timeout(function() {
                    angular.element("body").removeClass(".pg-loading");
                    angular.element(".pg-loading-screen").remove();
                    angular.element("body.pg-loading").css({
                        overflow: "visible"
                    });
                }, timeout);
            }
        };
    }
]);