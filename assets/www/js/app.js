'use strict';

var videos;
var myApp = angular.module('myApp', ['ngResource','ngRoute','ngCookies','angular-flexslider','angularFileUpload']);

myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
            when('/', {templateUrl: 'partials/welcome.html',controller:Init}).
            when('/items', {templateUrl: 'partials/item-list.html',controller: ItemListCtrl}).
            when('/items/:itemId', {templateUrl: 'partials/item.html',controller: ItemDetailCtrl}).
            when('/menu', {templateUrl: 'partials/menu-list.html',controller: MenuListCtrl}).
            when('/settings', {templateUrl: 'partials/system.html',controller: SettingsCtrl}).
            when('/orders', {templateUrl: 'partials/order-list.html',controller: OrdListCtrl}).
            when('/orders/:routeId', {templateUrl: 'partials/route-list.html',controller: RouteListCtrl}).
            when('/slideshow', {templateUrl: 'partials/slider2.html',controller: SlideShow}).
            when('/slideshow/edit', {templateUrl: 'partials/slide-list.html',controller: SlideEdit}).
            when('/slideshow/new', {templateUrl: 'partials/slide-details.html',controller: SlideNew}).
            when('/slideshow/:slideId', {templateUrl: 'partials/slide-details.html',controller: SlideDetails}).
            when('/videoshow', {templateUrl: 'partials/videos.html',controller: videoShow}).
            when('/videoshow/edit', {templateUrl: 'partials/video-list.html',controller: VideoEdit}).
            when('/videoshow/edit/:videoId', {templateUrl: 'partials/video-details.html',controller: VideoDetails}).
            when('/videoshow/new', {templateUrl: 'partials/video-details.html',controller: VideoNew}).
            when('/videoshow/:videoId', {templateUrl: 'partials/video.html',controller: videoShow2}).
            when('/about', {templateUrl:  'partials/about.html', controller: loadAbout}).
            when('/guideacc', {templateUrl:  'partials/guidedaccess.html'}).
            otherwise({redirectTo: '/'});
    }]);



