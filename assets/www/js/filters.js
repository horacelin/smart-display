'use strict';

/* Filters */
myApp.filter('capitalizeFirst', function() {
    return function(input) {
        if (input!=null)
            return input.substring(0,1).toUpperCase()+input.substring(1);
    }
});

myApp.filter('orderTypeColor', function() {
    return function(input) {
        var color;
        switch(input){
            case "0" : color = "blue";
                        break;
            case "1" : color = "yellow";
                        break;
            case "2": color = "red";
                        break;
            default: color = "blue";
        }
    return color;
    }
});

myApp.filter('picexist', function(){
    return function(input) {
        if(input === null | input ==="") {
            input = "img/drawer.png";
        }
        return input;
    }
});

myApp.filter('selectOne', function(items, index){
    var item = [];
    for(i=0; i< items.length; i++){
        if ( i == index) item.push(items[i]);
    }
    return item;
});

myApp.filter('getImgSrc', function(){
    return function(input){
        var sr;
        //sr = (typeof input.type !== "undefined" && input.type === 1) ? $rootScope.imgstore[input.doc_id] : input.imgsrc;
        return input.imgsrc;
    }
});