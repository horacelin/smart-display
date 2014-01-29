function Init($scope,$rootScope,$cookieStore,SlideService, VideoService){
    $rootScope.db = new PouchDB('mydb');
    if(!$rootScope.settings){
    
        var settings = localStorage.getItem("settings");
        if (typeof settings === "undefined" || settings === null || settings === "") {
            settings = {
                server:"http://maps.auctions411.com:5984/",
                db:"greenleaf",
                toDisplay: "1",
                slideType: "fade",
                slideDuration: "4000",
                slideDirection: "horizontal",
                webUrl: "http://www.posincloud.com"
            };
        //$cookieStore.put("settings",JSON.stringify(settings));
            localStorage.setItem("settings", JSON.stringify(settings));
            localStorage.setItem("pass", "");
        }
    }
        
        settings = JSON.parse(localStorage.getItem("settings"));
        $rootScope.server = settings.server;
        $rootScope.database = settings.database;
        $rootScope.toDisplay = settings.toDisplay;
        $rootScope.slideType = settings.slideType;
        $rootScope.slideDuration = settings.slideDuration;
        $rootScope.slideDirection = settings.slideDirection;
        $rootScope.webUrl = settings.webUrl;
        $rootScope.pass = typeof localStorage.pass !== "undefined" ? localStorage.pass : "";
        $rootScope.debug = 1;   //
    
    //if (!$rootScope.allSlides){
        if(!localStorage.slides){
        SlideService.query(function (response) { if (response!=null) {
            $rootScope.allSlides=response;
            localStorage.setItem("slides",JSON.stringify(response));
            $rootScope.imgstore = {};
            for(i=0; i<$rootScope.allSlides.length; i++){
            if($rootScope.allSlides[i].type === 1){
                $rootScope.db.get($scope.allSlides[i].doc_id, function(err, doc){
                if (!err) {
                    $rootScope.imgstore[doc._id] = doc.src;
                    $scope.$apply();    
                }      
            });
            }
        }
            } 
            });
        } else {
            $rootScope.allSlides=JSON.parse(localStorage.slides);
            $rootScope.imgstore = {};
            for(i=0; i<$rootScope.allSlides.length; i++){
                if($rootScope.allSlides[i].type === 1){
                    $rootScope.db.get($scope.allSlides[i].doc_id, function(err, doc){
                    if (!err) {
                        $rootScope.imgstore[doc._id] = doc.src;
                        $scope.$apply();    
                    }      
                });
                }
            }
        }
    //}
    $scope.allSlides=$rootScope.allSlides;
    
    setTimeout(function(){loadSlides(settings);},3000); 
    
    $scope.pass=$rootScope.pass;
    $scope.passRequest = false;
    if($rootScope.pass === ""){
        $scope.pass_description = "Create A Password!";
        $scope.pass_color = "danger";
    } else {
        $scope.pass_description = "Change Password Here!";
        $scope.pass_color = "info"; 
    }
    
    $scope.enterPass = function(){
        if(typeof $scope.pass === "undefined" || $scope.pass === "" || $scope.pass === null) $scope.passRequest = true;
        else {
        var passwd = prompt("Please enter password");
        if(passwd === $scope.pass) $scope.passRequest = true;
        }
    }
    $scope.updatePass = function(){
        $scope.passRequest = false;
        $rootScope.pass = $scope.pass;
        localStorage.pass = $rootScope.pass; 
        if(typeof $scope.pass === "undefined" || $scope.pass === "" || $scope.pass === null){
            $scope.pass_description = "Please Create A Password to protect this Kiosk!";
            $scope.pass_color = "danger";
        } else {
            $scope.pass_description = "Change Password Here!";
            $scope.pass_color = "info"; 
        }
        $scope.$apply();
    }
   $scope.CancelPass = function(){
        $scope.passRequest = false;
   }
}

function SettingsCtrl($scope,$rootScope,$cookieStore,$upload,$location){
    $scope.server = $rootScope.server;
    $scope.database = $rootScope.database;
    $scope.toDisplay = $rootScope.toDisplay;
    $scope.slideType = $rootScope.slideType;
    $scope.slideDuration = $rootScope.slideDuration;
    $scope.slideDirection = $rootScope.slideDirection;
    $scope.webUrl = $rootScope.webUrl;
    $scope.menuitem = [{name:"Slideshow",id:"1"},{name:"Video",id:"4"},{name:"Web Page", id:"5"},{name:"Menu",id:"2"},{name:"Orders",id:"3"}];
    for(var i =0;i<$scope.menuitem.length;i++){
        if($scope.menuitem[i].id === $scope.toDisplay) $scope.menuitem[i].color="primary";
        else $scope.menuitem[i].color="default";
    }
    
    $scope.saveSettings = function () {
        var s = {};
        s.server = $rootScope.server = $scope.server;
        s.database = $rootScope.database = $scope.database;
        s.toDisplay = $rootScope.toDidplay = $scope.toDisplay;
        s.slideType = $rootScope.slideType = $scope.slideType;
        s.slideDuration = $rootScope.slideDuration = $scope.slideDuration;
        s.slideDirection = $rootScope.slideDirection = $scope.slideDirection;
        s.webUrl = $rootScope.webUrl = $scope.webUrl;
        //$cookieStore.put("settings",JSON.stringify(s));
        localStorage.setItem("settings", JSON.stringify(s));
        
        switch(s.toDisplay){
            case "1":
                        $location.path("/slideshow");
                        break;
            case "2":   $location.path("/menu");
                        break;
            case "3":   $location.path("/orders");
                        break;
            case "4":   $location.path("/videoshow/1");
                        break;
            case "5":   $location.path("/about");
                        break;
            default:    $location.path("/");
        
        }
    }
    
    $scope.changeDisplay = function(togo){
        $scope.toDisplay = $scope.menuitem[togo].id;
       
        for (var i=0; i<$scope.menuitem.length; i++){
            if(togo == i) $scope.menuitem[i].color = "primary";
            else $scope.menuitem[i].color = "default";
        }
        
    }
    
    $scope.file_changed = function(element, $scope){
       
         var photofile = element.files[0];
         var reader = new FileReader();
         reader.onload = (function(theFile) {
            return function(e){
                var span = document.createElement('span');
                span.innerHTML = ['<img class="thumb" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
                document.getElementById('list').insertBefore(span, null);
                localStorage.setItem("img1",e.target.result);
                $rootScope.img1 = e.target.result;
         };
         })(photofile);
         reader.readAsDataURL(photofile);
     
    };
    
    $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var $file = $files[i];
      $upload.upload({
        url: 'video/' + $file.name,
        file: $file
      }).then(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log(data);
      }); 
    }
  }
}

function loadAbout($scope, $rootScope, $sce){
    $scope.webUrl = $rootScope.webUrl;
    $scope.currentProjectUrl = $sce.trustAsResourceUrl($scope.webUrl);
    if(window.orientation == 90 || window.orientation == -90) {
            $scope.vwidth=1024; 
            $scope.vheight = 768;
        }     else
        {   
            $scope.vwidth=768; 
            $scope.vheight = 1024;
        }
}

function MenuListCtrl($scope, $rootScope, $http){
    $scope.default_pic = "generic.jpg";

    var addr = $rootScope.server + $rootScope.database;
    if ($rootScope.debug === 1) {
        var menuitems = JSON.parse(items11);
        $scope.items = menuitems.rows;
        $rootScope.items = menuitems.rows;
    } else {
    
    $http({
        method: 'GET',
        url : addr + '/_design/item/_view/menu2'
    }).success(function(data,status){
        $scope.items = data.rows;
        $rootScope.items = data.rows;
        
    }).error(function(data,status){
        alert('error: ' + data);
        return;
    });
    }
    var cat = [];
        var allitems = {};
        for (var i=0; i< $scope.items.length; i++){
            if(cat.indexOf($scope.items[i].value.category) === -1) {
                cat.push($scope.items[i].value.category); 
                allitems[$scope.items[i].value.category] = [];
                
            } 
                allitems[$scope.items[i].value.category].push($scope.items[i]);
           
                $scope.items[i].picurl = null;
            if ($scope.items[i].value._attachments) {
                for (var obj in $scope.items[i].value._attachments){
                $scope.items[i].picurl = addr + '/' + $scope.items[i].value._id + '/' + obj;
                }
            }
        }
    $scope.category = cat;
    $scope.allitems = allitems;    
}

function WineListCtrl($scope,WineService,$rootScope) {
    $scope.default_pic = "generic.jpg";
    // Managing in-memory array so don't reset it if the JSON has already been retrieved initially
    if (!$rootScope.wines)
        WineService.query(function (response) { if (response!=null) {$rootScope.wines=response}});
}

function ItemListCtrl($scope,$http,ItemService,$rootScope) {
    $scope.default_pic = "generic.jpg";
    /*
    if (!$rootScope.items)
        ItemService.query(function (response) { if (response!=null) {
            var res = JSON.parse(response);
            $rootScope.items=response.rows}});  */
    var addr = $rootScope.server + $rootScope.database;
    if ($rootScope.debug === 1) {
        var menuitems = JSON.parse(menuitem);
        $scope.items = menuitems.rows;
        $rootScope.items = menuitems.rows;
        for (var i=0; i< $scope.items.length; i++){
                $scope.items[i].picurl = null;
            if ($scope.items[i].value._attachments) {
                for (var obj in $scope.items[i].value._attachments){
                $scope.items[i].picurl = addr + '/' + $scope.items[i].value._id + '/' + obj;
                }
            }
            }
    } else {
    
    $http({
        method: 'GET',
        url : addr + '/_design/item/_view/menu2'
    }).success(function(data,status){
        $scope.items = data.rows;
        $rootScope.items = data.rows;
        for (var i=0; i< $scope.items.length; i++){
                $scope.items[i].picurl = null;
            if ($scope.items[i].value._attachments) {
                for (var obj in $scope.items[i].value._attachments){
                $scope.items[i].picurl = addr + '/' + $scope.items[i].value._id + '/' + obj;
                }
            }
            }
    }).error(function(data,status){
        alert('error: ' + data);
    });
    }
}

function ItemDetailCtrl($scope, $rootScope){

}

function OrdListCtrl($scope,$http,$rootScope) {
    if($rootScope.debug === 1){
    var ords = JSON.parse(greenorders);
        $scope.orders = ords.rows;
        $rootScope.orders = ords.rows;
    } else {
    var addr = $rootScope.server + $rootScope.database;
    $http({
        method: 'GET',
        url : addr + '/_design/order/_view/open'
    }).success(function(data,status){
        $scope.orders = data.rows;
        $rootScope.orders = data.rows;
        
    }).error(function(data,status){
        alert('error: ' + data);
    });
    }
}

function RouteListCtrl($scope,$http,$rootScope,$routeParams) {
    var addr = $rootScope.server + $rootScope.database;
    $http({
        method: 'GET',
        url : addr + '/_design/order/_view/open'
    }).success(function(data,status){
        $scope.orders = [];
        $rootScope.orders = [];
        for (var i=0; i< data.rows.length; i++){
            var len = data.rows[i].value.lines.length;
            var hasItem = 0;
            while (len--){
                    if ( data.rows[i].value.lines[len].route.indexOf($routeParams.routeId) > -1) {
                        hasItem = 1;
                    } else {
                        data.rows[i].value.lines.splice(len, 1)
                    }
                }
                if (hasItem) {
                    $scope.orders.push(data.rows[i].value);
                    $rootScope.orders.push(data.rows[i].value);
                }
            }
        
    }).error(function(data,status){
        alert('error: ' + data);
    });
}

function CustListCtrl($scope,$http,$rootScope) {
    var addr = $rootScope.server + $rootScope.database;
    $http({
        method: 'GET',
        url : addr + '/_design/customer/_view/all'
    }).success(function(data,status){
        $scope.customers = data.rows;
        $rootScope.customers = data.rows;
        
    }).error(function(data,status){
        alert('error: ' + data);
    });
}

function SlideShow($scope, SlideService, $rootScope, $location){
    //if (!$rootScope.allSlides){
        if(!localStorage.slides){
        SlideService.query(function (response) { if (response!=null) {
            $rootScope.allSlides=response;
            localStorage.setItem("slides",JSON.stringify(response));
            } 
            });
        } else {
            $rootScope.allSlides=JSON.parse(localStorage.slides);
        }
    //}
    $scope.istore = $rootScope.imgstore;
    $scope.showSetting = false;
    $scope.allSlides=$rootScope.allSlides;
            var s = {};
            s.slideType = $rootScope.slideType;
            s.slideDuration = $rootScope.slideDuration;
            s.slideDirection = $rootScope.slideDirection;
            
        	setTimeout(function(){loadSlides(s);},2000); 
    $scope.showStatus = function(){
        $scope.showSetting = !$scope.showSetting;
        setTimeout(function(){
            if ($scope.showSetting) $scope.showSetting = false;
            $scope.$apply();
        }, 4000);
    }
    $scope.requestSet = function(){
        if(typeof $scope.pass === "undefined" || $scope.pass === "" || $rootScope.pass === null) { $location.path("/"); }
        else {
        var passwd = prompt("Please enter password");
        if(passwd === $rootScope.pass) $location.path("/"); }
    }
}

function SlideDetails($scope, SlideService, $rootScope,$routeParams,$location){
    if ($rootScope.allSlides){
        $scope.slide = filterById($rootScope.allSlides, $routeParams.slideId);
        $scope.ImgSrc = $scope.slide.type === 1 ? $rootScope.imgstore[$scope.slide.doc_id] : $scope.slide.imgsrc;
    }
    
    $scope.file_changed = function(element, $scope){
       
         var photofile = element.files[0];
         var reader = new FileReader();
         reader.onload = (function(theFile) {
            return function(e){
            	$scope.ImgSrc = e.target.result;
                localStorage.setItem(theFile.name,e.target.result);
                $rootScope.img1 = e.target.result;
         };
         })(photofile);
         reader.readAsDataURL(photofile);
     
    };
    
    $scope.saveSlide = function () {
        for(i = 0; i< $rootScope.allSlides.length; i++){
            if($rootScope.allSlides[i]._id == $routeParams.slideId) {
                $rootScope.allSlides[i] = $scope.slide;
                localStorage.setItem("slides",JSON.stringify($rootScope.allSlides));
            }
        }
        
    }

    $scope.deleteSlide = function (slide) {
        if(slide.type=== 1 && slide.img) localStorage.removeItem(slide.img);
        $scope.allSlides.splice($scope.allSlides.indexOf(slide),1);
        for(var i=0; i<$scope.allSlides.length; i++){
            $scope.allSlides[i]._id = i + 1;  // rearrange id
        }
        $rootScope.allSlides = $scope.allSlides;
        localStorage.setItem("slides",JSON.stringify($rootScope.allSlides));
        //alert("deleted!");
        $location.path("/slideshow/edit");
        if(!$scope.$$phase) $scope.$apply();
    }
    
    function filterById(wines, id){return wines.filter(function(wines) {return (wines['_id'] == id);})[0];}
    
}

function SlideNew($scope, $rootScope, $location){
    $rootScope.db = new PouchDB('mydb');
    $scope.slide = {};
    $scope.slide._id = $rootScope.allSlides.length+1;
    $scope.slide.name = "";
    $scope.slide.description="";
    $scope.slide.imgsrc="";
    $scope.slide.type = 0;

        $scope.file_changed = function(element){
         var photofile = element.files[0];
         var reader = new FileReader();
         reader.onload = (function(theFile) {
            return function(e){
                $scope.ImgSrc = e.target.result;
                $rootScope.imgsrc = e.target.result;
                $rootScope.imgName = theFile.name;
                $scope.slide.type = 1;
         };
         })(photofile);
         reader.readAsDataURL(photofile);
    };
    
    $scope.saveSlide = function () {
        $scope.slide.img = $rootScope.imgName;
        if ($scope.slide.img !== ""){
                var timestamp = new Date().getTime();
                $rootScope.db.put({
                    _id: timestamp.toString(),
                    name: $rootScope.imgName,
                    src: $rootScope.imgsrc
                }, function(err, response){
                    if(err) { 
                        alert(JSON.stringify(err));
                    } else {
                        $scope.slide.doc_id = timestamp.toString();
                        $scope.slide.name = $rootScope.imgName;
                        $rootScope.allSlides.push($scope.slide);
                        localStorage.setItem("slides",JSON.stringify($rootScope.allSlides));
                        $scope.showFlag = true;
                        $rootScope.imgstore[$scope.slide.doc_id] = $rootScope.imgsrc;
                        $location.path("/slideshow/edit");
                        if(!$scope.$$phase) $scope.$apply();
                    }
                });
        }
    }
    
    function convertImgToBase64(url, callback, outputFormat){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img,0,0);
            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
            callback.call(this, dataURL);
            // Clean up
            canvas = null; 
        };
	   img.src = url;
    }
}

function SlideEdit($scope, SlideService, $rootScope, $location){
    //if (!$rootScope.allSlides){
        if(!localStorage.slides){
        SlideService.query(function (response) { if (response!=null) {
            $rootScope.allSlides=response;
            localStorage.setItem("slides",JSON.stringify(response));
            } 
            });
        } else {
            $rootScope.allSlides=JSON.parse(localStorage.slides);
        }
    //}
    $scope.slides = $rootScope.allSlides;
    $scope.istore = $rootScope.imgstore;
}

function VideoEdit($scope, VideoService, $rootScope){
    
        if(!localStorage.videos){
        VideoService.query(function (response) { if (response!=null) {
            $rootScope.videos=response;
            localStorage.setItem("videos",JSON.stringify(response));
            } 
            });
        } else {
            $rootScope.videos=JSON.parse(localStorage.videos);
        }
   
    $scope.videos = $rootScope.videos;
}

function videoShow($scope, $rootScope, $location){
    
        $rootScope.videos=[{type:"webm",
                            url:"video/restaurant.webm"},
                           {type:"mp4",
                            url:"video/cloudpos.mp4"}
                          ];
    
        $scope.videos = $rootScope.videos;
    $scope.showSetting = false;
    addSwipeListener(document.getElementById("vd"),function(e) {
    //alert(e.direction);
        $rootScope.$apply(function(){
        if (e.direction === "up" || e.direction==="down") $location.path("/");
        });
});
    $scope.showStatus = function(){
        $scope.showSetting = !$scope.showSetting;
        setTimeout(function(){
            if ($scope.showSetting) $scope.showSetting = false;
            $scope.$apply();
        }, 4000);
    }
    
}

function videoShow2($scope, $rootScope, $location, $routeParams, VideoService){
    $rootScope.db = new PouchDB('mydb');
    
        if(!localStorage.videos){
        VideoService.query(function (response) { if (response!=null) {
            $rootScope.videos=response;
            localStorage.setItem("videos",JSON.stringify(response));
            playVideo();
            } 
            });
        } else {
            $rootScope.videos=JSON.parse(localStorage.videos);
            playVideo();
        }
  

    setTimeout(function(){
        var tp = document.getElementById("vd2");
        tp.innerHTML = '<source type="video/mp4" src="' + $rootScope.videos[0].url + '" />';
    },1500);
    
    $scope.showStatus = function(){
        $scope.showSetting = !$scope.showSetting;
        setTimeout(function(){
            if ($scope.showSetting) $scope.showSetting = false;
            $scope.$apply();
        }, 4000);
    }
    $scope.requestSet = function(){
        if(typeof $scope.pass === "undefined" || $scope.pass === "" || $rootScope.pass === null) { $location.path("/"); }
        else {
        var passwd = prompt("Please enter password");
        if(passwd === $rootScope.pass) $location.path("/"); }
    }
    
    function playVideo(){
        var sc = [];
        for(i=0; i<$rootScope.videos.length; i++){
            if( (i+1).toString() === $routeParams.videoId) sc.push($rootScope.videos[i]);
        }
    
        if(window.orientation == 90 || window.orientation == -90) {
            $scope.vwidth=screen.width; 
            $scope.vheight = screen.height;
        }     else
        {   
            $scope.vwidth=screen.width; 
            $scope.vheight = screen.height;
        }
        $scope.showSetting = false;
        $scope.v = {};
        //$scope.v.src = sc[0].src;
        $scope.v.name = sc[0].name;
        $scope.v.doc_id = sc[0].doc_id;
        if (sc[0].type === 1) {
            $rootScope.db.get($scope.v.doc_id, function(err, doc){
                if (!err){
                    var span = ['<video width="', $scope.vwidth ,'" height="', $scope.vheight, '" autoplay loop src="', doc.src, '" title="', $scope.v.name, '"></video>'].join('');
                    document.getElementById('vlist').innerHTML = span;
                }
            });
        }
            else {
                $scope.v.src = sc[0].src;
                setTimeout(function(){
                	document.getElementById("vd2").play();
                },
                	1000);	
                //$scope.apply();
            }	
    
        addSwipeListener(document.getElementById("vd2"),function(e) {
    
            $rootScope.$apply(function(){
            if (e.direction === "left"){
                $location.path("/videoshow/" + ($routeParams.videoId === "1" ? $rootScope.videos.length : parseInt($routeParams.videoId) - 1));
            }
            if (e.direction === "right"){
                $location.path("/videoshow/" + ($routeParams.videoId === $rootScope.videos.length.toString()  ? 1 : parseInt($routeParams.videoId) + 1));
            }    
            if (e.direction === "up" || e.direction==="down") $location.path("/");
            });
    });
    }
}

function VideoDetails($scope, VideoService, $rootScope,$routeParams,$location){
    if ($rootScope.videos){
        $scope.video = filterById($rootScope.videos, $routeParams.videoId);
    }
    
    $scope.file_changed = function(element, $scope){
       
         var videofile = element.files[0];
         var reader = new FileReader();
         reader.onload = (function(theFile) {
            return function(e){
                var span = document.createElement('span');
                span.innerHTML = ['<video " src="', e.target.result,
                            '" width="240" controls />'].join('');
                document.getElementById('list').insertBefore(span, null);
                localStorage.setItem(theFile.name,e.target.result);
                $rootScope.name = theFile.name;
         };
         })(videofile);
         reader.readAsDataURL(videofile);
     
    };
    
    $scope.saveVideo = function () {
        for(i = 0; i< $rootScope.videos.length; i++){
            if($rootScope.videos[i]._id == $routeParams.videoId) {
                $rootScope.videos[i] = $scope.video;
                localStorage.setItem("videos",JSON.stringify($rootScope.videos));
            }
        }
        
    }

    $scope.deleteVideo = function (video) {
        if(video.type=== 1 && video.name) localStorage.removeItem(video.name);
        $scope.videos.splice($scope.videos.indexOf(video),1);
        for(var i=0; i<$scope.videos.length; i++){
            $scope.videos[i]._id = i + 1;  // rearrange id
        }
        $rootScope.videos = $scope.videos;
        localStorage.setItem("videos",JSON.stringify($rootScope.videos));
        $location.path("/videoshow/edit");
        if(!$scope.$$phase) $scope.$apply();
    }
    
    function filterById(wines, id){return wines.filter(function(wines) {return (wines['_id'] == id);})[0];}
    
}

function VideoNew($scope, $rootScope,$location){
    var couch = new PouchDB('mydb');
    $scope.video = {};
    $scope.video._id = $rootScope.videos.length+1;
    $scope.video.name = "";
    $scope.video.description="";
    $scope.video.doc_id="";
    $scope.video.format="mp4";
    $scope.video.type = 1;
    $rootScope.db = couch;
    
    $scope.file_changed = function(element, $scope){
       
         var videofile = element.files[0];
         var reader = new FileReader();
         reader.onload = (function(theFile) {
            return function(e){
                var span = document.createElement('span');
              /*  span.innerHTML = ['<video width="240" controls src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
                document.getElementById('list').insertBefore(span, null); */
               // localStorage.setItem(theFile.name,e.target.result);
                span.innerHTML = "done";
                $rootScope.videoName = theFile.name;
                $rootScope.videoFile = e.target.result;
                $scope.video.type = 1;
         };
         })(videofile);
         reader.readAsDataURL(videofile);
    };
    
    $scope.saveVideo = function () {
        var span = document.createElement('span');
                span.innerHTML = '<h2> ... Saving ... </h2>';
                document.getElementById('list').insertBefore(span, null);
        var timestamp = new Date().getTime();
        $rootScope.db.put({
                    _id: timestamp.toString(),
                    name: $rootScope.videoName,
                    src: $rootScope.videoFile
                }, function(err, response){
                    if(err) { 
                        alert(JSON.stringify(err));
                    } else {
                        $scope.video.doc_id = timestamp.toString();
                        $scope.video.name = $rootScope.videoName;
                        $rootScope.videos.push($scope.video);
                        localStorage.setItem("videos",JSON.stringify($rootScope.videos));
                        //$rootScope.vsrc[$scope.video.doc_id] = $rootScope.videos;
                        $scope.showFlag = true;
                        $location.path("/videoshow/edit");
                        if(!$scope.$$phase) $scope.$apply();
                    }
                });
    }
    
}

