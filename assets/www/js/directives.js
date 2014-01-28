'use strict';

myApp.directive('showAlert', function(){
    return function (scope, element, attrs){
        scope.$watch("showFlag",  function(newValue, oldValue){
            console.log(newValue);
            if (newValue) {
                element.removeClass("hide");
                element.addClass("show");
            }
            else {
                element.removeClass("show");
                element.addClass("hide");
            }
        }, true);
    }
});

myApp.directive('web', function() {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            var url = attrs.src;
            element.replaceWith('<object type="text/html" data="http://' + url + '" width="1000px" height="720px" style="overflow:auto;border:5px ridge blue"></object>');
        }
    };
});