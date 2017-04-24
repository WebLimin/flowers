var app = angular.module('flower', ['ionic']);

app.service('$fHttp', ['$http', '$ionicLoading',
    function ($http, $ionicLoading) {

        this.sendRequest = function (url, successCallback) {
            $ionicLoading.show({
                template: 'loading...'
            })
            $http.get(url).success(function (data) {
                $ionicLoading.hide();
                successCallback(data);
            });
        }

    }])

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
        .state('order', {
            url: '/f_order/:id',
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
        .state('myCart', {
            url: '/f_myCart',
            templateUrl: 'tpl/myCart.html',
            controller: 'myCartCtrl'
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
        })
    $urlRouterProvider.otherwise('/f_start')
})

app.controller('parentCtrl', ['$scope', '$state', function ($scope, $state) {
    $scope.jump = function (desState, args) {
        $state.go(desState, args);
    }
}])

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
    }

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
}])


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
                'data/cart_update.php?uid=1&did=' + $stateParams.id + "&count=-1",
                function (data) {
                    if (data.msg == 'succ') {
                        $ionicPopup.alert({
                            template: '添加到购物车成功'
                        });
                    }
                }
            )
        }
    }
]);

app.controller('orderCtrl', ['$scope', '$fHttp', '$stateParams', '$httpParamSerializerJQLike',
    function ($scope, $fHttp, $stateParams, $httpParamSerializerJQLike) {
        $scope.order = {did: $stateParams.id}
        console.log($scope.order);
        $scope.submitOrder = function () {
            var result = $httpParamSerializerJQLike($scope.order);
            console.log(result);
            $fHttp.sendRequest(
                'data/order_add.php?' + result,
                function (data) {
                    if (data.length > 0) {
                        if (data[0].msg == 'succ') {
                            sessionStorage.setItem('phone', $scope.order.phone)
                            $scope.requestResult = '下单支付成功，订单编号为' + data[0].oid;
                        } else {
                            $scope.requestResult = '下单支付失败';
                        }
                    }
                }
            )
        }
    }]);
app.controller('myOrderCtrl', ['$scope', '$fHttp', function ($scope, $fHttp) {
    $fHttp.sendRequest(
        'data/order_getbyuserid.php?userid=1',
        function (serverData) {
            $scope.orderList = serverData.data;
        }
    )
}]);
app.controller('settingCtrl', ['$scope', '$ionicModal',
    function ($scope, $ionicModal) {

        $scope.infoList = [
            {name: '开发者', value: 'limin'},
            {name: '版本号', value: 'v1.0'},
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

app.controller('myCartCtrl', ['$scope', '$fHttp', function ($scope, $fHttp) {
    $scope.editShowMsg = '编辑';
    $scope.editEnable = false;

    $scope.funcToggleEdit = function () {
        $scope.editEnable = !$scope.editEnable;
        if ($scope.editEnable) {
            $scope.editShowMsg = '完成';
        } else {
            $scope.editShowMsg = '编辑';
        }
    }

    $fHttp.sendRequest(
        'data/cart_select.php?uid=1',
        function (serverDate) {
            $scope.cart = serverDate.data;
        }
    )

    $scope.sumAll = function () {
        var result = 0;
        angular.forEach($scope.cart, function (value, key) {
            result += parseInt(value.price * value.fCount);
        })
        return result;
    }

    $scope.updateToServer = function (id, count) {
        $fHttp.sendRequest(
            'data/cart_update.php?uid=1&did=' + id + "&count=" + count,
            function (data) {

            }
        )
    }
    $scope.deleteToServer = function (id, count) {
        $fHttp.sendRequest(
            'data/cart_delete.php?uid=1&did=' + id + "&count=" + count,
            function (data) {
            }
        )
    }

    $scope.add = function (index) {
        $scope.cart[index].fCount++;
        $scope.updateToServer(
            $scope.cart[index].did,
            $scope.cart[index].fCount
        );
    }

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
    }

    $scope.removeFlower = function (index) {
        var ions = document.querySelectorAll("ion-item");
        for (var i = 0, len = ions.length; i < len; i++) {
            ions[i].onclick = function () {
                this.remove();
            }
        }
        $scope.deleteToServer(
            $scope.cart[index].did,
            $scope.cart[index].fCount
        );

        $scope.updateToServer(
            $scope.cart[index].did,
            $scope.cart[index].fCount = 0
        );

    }
}]);
var userId=" ";
var uName=" ";

/*用户登录部分*/
app.controller('Login', ['$scope', '$fHttp',
    function ($scope, $fHttp) {
        $scope.info = {uNmae:"",upwd:""};
        $scope.$watch('info.phone',function(){
        $scope.uLogin = function () {
            $fHttp.sendRequest(
                'data/user_login.php?phone='+$scope.info.uName+"&upwd="+$scope.info.upwd,
                function (data) {
                    if(data==-1){
                        alert("用户名或密码有误！");
                    }else{
                        alert("登录成功！欢迎回来！"+data.uname);
                        sessionStorage.userId = data.userid;
                        sessionStorage.uName = data.uname;
                    }

                }
            )
        }
        })
    }]);

///*用户注册部分*/
app.controller('Register', ['$scope', '$fHttp', function ($scope, $fHttp) {
    $scope.uRegister = function () {
        $scope.$watch('aa',function(){


        })

        console.log(1);
    }
}]);











