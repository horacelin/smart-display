'use strict';

myApp.factory('WineService', function($resource){
    return $resource('wines/wines.json', {}, {
        query: {method:'GET', isArray:true}
    });
});

myApp.factory('ItemService', function($resource){
    return $resource('http://127.0.0.1\\:5984/greenleaf/_design/item/_view/menu2', {callback:'JSON_CALLBACK'}, {
        query: {method:'JSONP', isArray:true}
    });
});

myApp.factory('SlideService', function($resource){
    return $resource('wines/slides.json', {}, {
        query: {method:'GET', isArray:true}
    });
});

myApp.factory('VideoService', function($resource){
    return $resource('wines/videos.json', {}, {
        query: {method:'GET', isArray:true}
    });
});