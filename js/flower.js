var app = angular.module('flower', ['ionic']);

app.service('$fHttp', ['$http', '$ionicLoading',
    function ($http, $ionicLoading) {
        this.sendRequest = function (url, successCallback) {
            $ionicLoading.show({
                template: 'loading...'
            });
            $http.get(url).success(function (data) {
                $ionicLoading.hide();
                successCallback(data);
            });
        }
    }]);

app.config(function ($stateProvider, $ionicConfigProvider, $urlRouterProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $stateProvider
        .state('start', {
            url: '/f_start',
            templateUrl: 'tpl/start.html'
        })
        .state('main', {
            url: '/f_main',
            templateUrl: 'tpl/main.html',
            controller: 'mainCtrl'
        })
        .state('detail', {
            url: '/f_detail/:id',
            templateUrl: 'tpl/detail.html',
            controller: 'detailCtrl'
        })
        .state('myCart', {
            url: '/f_myCart',
            templateUrl: 'tpl/myCart.html',
            controller: 'myCartCtrl'
        })
        .state('order', {
            url: '/f_order/:totalprice',
            params: {'cartDetail': null},
            templateUrl: 'tpl/order.html',
            controller: 'orderCtrl'
        })
        .state('myOrder', {
            url: '/f_myOrder',
            templateUrl: 'tpl/myOrder.html',
            controller: 'myOrderCtrl'
        })
        .state('setting', {
            url: '/f_setting',
            templateUrl: 'tpl/setting.html',
            controller: 'settingCtrl'
        })

        .state('loGin', {
            url: '/f_loGin',
            templateUrl: 'tpl/login.html',
            controller: 'Login'
        })
        .state('register', {
            url: '/f_register',
            templateUrl: 'tpl/register.html',
            controller: 'Register'
        });
    $urlRouterProvider.otherwise('/f_start')
});

app.controller('parentCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.jump = function (desState, args) {
        $state.go(desState, args);
    };

    //退出登录之后，将显示登录和注册
    $scope.logout = function () {
        $scope.unlogin = true;
        sessionStorage.userId = '';
        sessionStorage.uName = '';
        $state.go("start");
    }
}]);
/*商品主页展示部分*/
app.controller('mainCtrl', ['$scope', '$fHttp', function ($scope, $fHttp) {
    $scope.hasMore = true;
    $scope.info = {kw: ''};
    $scope.flowersList = [];

    $fHttp.sendRequest('data/f_page.php',
        function (data) {
            $scope.flowersList = data;
        });
    $scope.loadMore = function () {
        $fHttp.sendRequest(
            'data/f_page.php?start=' + $scope.flowersList.length,
            function (data) {
                if (data.length < 5) {
                    $scope.hasMore = false;
                }
                $scope.flowersList = $scope.flowersList.concat(data);
                $scope.$broadcast('scroll.infiniteScrollComplete')
            })
    };

    $scope.$watch('info.kw', function () {
        if ($scope.info.kw) {
            $fHttp.sendRequest(
                'data/f_getkw.php?kw=' + $scope.info.kw,
                function (data) {
                    if (data.length > 0) {
                        $scope.flowersList = data;

                    }
                }
            )
        }
    })
}]);
/*产品详情部分*/
app.controller('detailCtrl', ['$scope', '$fHttp', '$stateParams', '$ionicPopup',
    function ($scope, $fHttp, $stateParams, $ionicPopup) {
        $fHttp.sendRequest(
            'data/f_detail.php?id=' + $stateParams.id,
            function (data) {
                $scope.f = data[0];
            }
        );

        $scope.addToCart = function () {
            $fHttp.sendRequest(
                'data/cart_update.php?uid=' + sessionStorage.userId + '&id=' + $stateParams.id + "&count=-1",
                function (data) {
                    if (data.msg == 'succ') {
                        $ionicPopup.alert({
                            template: '添加到购物车成功'
                        });
                    } else {
                        if (!sessionStorage.userId) {
                            $ionicPopup.alert({
                                template: '请登录再添加！'
                            });
                        } else {
                            $ionicPopup.alert({
                                template: '添加到购物车失败'
                            });
                        }
                    }
                }
            )
        }
    }
]);
/*下单部分*/
app.controller('orderCtrl', ['$scope', '$fHttp', '$stateParams', '$httpParamSerializerJQLike',
    function ($scope, $fHttp, $stateParams, $httpParamSerializerJQLike) {
        $scope.order = {cartDetail: $stateParams.cartDetail,
            totalprice:$stateParams.totalprice,userid: sessionStorage.userId};
        $scope.submitOrder = function () {
            var result = $httpParamSerializerJQLike($scope.order);
            $fHttp.sendRequest(
                'data/order_add.php?' + result,
                function (data) {
                    if (data.length > 0) {
                        if (data[0].msg == 'succ') {
                            sessionStorage.setItem('phone', $scope.order.phone);
                            $scope.requestResult = '下单支付成功，订单编号为' + data[0].oid;
                        } else {
                            $scope.requestResult = '下单支付失败';
                        }
                    }
                }
            )
        }
    }]);
/*购物车产品部分*/
app.controller('myCartCtrl', ['$scope', '$fHttp','$state', function ($scope, $fHttp,$state) {
    $scope.editShowMsg = '编辑';
    $scope.editEnable = false;
    $scope.cartDetail = [];
    $scope.funcToggleEdit = function () {
        $scope.editEnable = !$scope.editEnable;
        if ($scope.editEnable) {
            $scope.editShowMsg = '完成';
        } else {
            $scope.editShowMsg = '编辑';
        }
    };
    if (sessionStorage.userId) {
        $fHttp.sendRequest(
            'data/cart_select.php?uid=' + sessionStorage.userId,
            function (serverDate) {
                $scope.cart = serverDate.data;
            }
        )
    }
    $scope.sumAll = function () {
        var result = 0;
        angular.forEach($scope.cart, function (value, key) {
            result += parseInt(value.price * value.fCount);
        });
        $scope.sumprice=result;
        return result;
    };

    $scope.updateToServer = function (id, count) {
        if (count != 0) {
            $fHttp.sendRequest(
                'data/cart_update.php?uid=' + sessionStorage.userId + '&did=' + id + "&count=" + count
            )
        }
    };
    $scope.deleteToServer = function (id, count) {
        $fHttp.sendRequest(
            'data/cart_delete.php?uid=' + sessionStorage.userId + '&did=' + id + "&count=" + count
        )
    };

    $scope.add = function (index) {
        $scope.cart[index].fCount++;
        $scope.updateToServer(
            $scope.cart[index].did,
            $scope.cart[index].fCount
        );
    };

    $scope.reduce = function (index) {
        var num = $scope.cart[index].fCount;
        if (num <= 1) {
            $scope.cart[index].fCount = 1;
        } else {
            $scope.cart[index].fCount--;
        }
        $scope.updateToServer(
            $scope.cart[index].did,
            $scope.cart[index].fCount
        );
    };

    $scope.removeFlower = function (index) {
        $scope.deleteToServer(
            $scope.cart[index].did,
            $scope.cart[index].fCount
        );
        $scope.cart.splice(index, 1);
    };

    $scope.jumpOrder=function(){
        $state.go('order',{'cartDetail':$scope.cart,totalprice:$scope.sumprice});

    }

}]);
/*个人订单部分*/
app.controller('myOrderCtrl', ['$scope', '$fHttp', function ($scope, $fHttp) {
    if (sessionStorage.userId) {
        $fHttp.sendRequest(
            'data/order_getbyuserid.php?userid=' + sessionStorage.userId,
            function (serverData) {
                $scope.orderList = serverData.data;
            }
        )
    }
}]);

/*设置部分*/
app.controller('settingCtrl', ['$scope', '$ionicModal',
    function ($scope, $ionicModal) {

        $scope.infoList = [
            {name: '开发者', value: '李敏'},
            {name: '版本号', value: 'v1.1.7'},
            {name: 'email', value: 'weblimin@sina.com'}
        ];

        $ionicModal
            .fromTemplateUrl('tpl/about.html', {
                scope: $scope
            })
            .then(function (modal) {
                $scope.modal = modal;
            });

        $scope.open = function () {
            $scope.modal.show();
        };

        $scope.close = function () {
            $scope.modal.hide();
        };
    }]);

/*用户登录部分*/
app.controller('Login', ['$scope', '$fHttp', '$ionicPopup', '$state',
    function ($scope, $fHttp, $ionicPopup, $state) {
        //判断是否登录
        if (!sessionStorage.userId) {
            $scope.unlogin = true;
        } else {
            $scope.unlogin = false;
            $scope.username = sessionStorage.uName;
        }
        $scope.ulogin = {uName: "", upwd: ""};
        $scope.$watch('ulogin', function () {
            $scope.uLogin = function () {
                $fHttp.sendRequest(
                    'data/user_login.php?phone=' + $scope.ulogin.uName + "&upwd=" + $scope.ulogin.upwd,
                    function (data) {
                        if (data == -1) {
                            $ionicPopup.alert({
                                template: "用户名或密码有误！"
                            });
                        } else {
                            $ionicPopup.alert({
                                template: "登录成功！欢迎回来！" + data.uname
                            });
                            //登录成功之后，保存id,name
                            sessionStorage.userId = data.userid;
                            sessionStorage.uName = data.uname;
                            $state.go('main');
                        }
                    }
                )
            }
        });
    }]);

/*用户注册部分*/
app.controller('Register', ['$scope', '$fHttp', '$ionicPopup', '$state',
    function ($scope, $fHttp, $ionicPopup, $state) {
        $scope.uregister = {uName: '', uPwd: '', uPhone: ''};
        $scope.$watch('uregister', function () {
            $scope.uRegister = function () {
                $fHttp.sendRequest(
                    'data/user_register.php?uName=' + $scope.uregister.uName +
                    "&uPhone=" + $scope.uregister.uPhone + "&uPwd=" + $scope.uregister.uPwd,
                    function (data) {
                        if (data == 'succ') {
                            $ionicPopup.alert({
                                template: '注册成功！'
                            });
                            $state.go('loGin');
                        } else {
                            $ionicPopup.alert({
                                template: '注册失败！手机号码被已注册'
                            })
                        }
                    }
                )
            }
        })
    }]);











