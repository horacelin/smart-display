/*
 Copyright (c) 2010-2012, The Auctions411 All Rights Reserved.
 
 http://www.auctions411.com
 */ 

function addSwipeListener(el, listener)
{
 var startX;
 var dx, dy;
 var direction;
 
 function cancelTouch()
 {
  el.removeEventListener('touchmove', onTouchMove);
  el.removeEventListener('touchend', onTouchEnd);
  startX = null;
  startY = null;
  direction = null;
 }
 
 function onTouchMove(e)
 {
  if (e.touches.length > 1)
  {
   cancelTouch();
  }
  else
  {
   dx = e.touches[0].pageX - startX;
   dy = e.touches[0].pageY - startY;
   if (direction == null)
   {
    direction = dx;
    e.preventDefault();
   }
   else if ((direction < 0 && dx > 0) || (direction > 0 && dx < 0) )
   {
    cancelTouch();
   }
  }
 }

function onTouchEnd(e){
      cancelTouch();
      if (Math.abs(dx) > 50 || Math.abs(dy) > 50)
        {
            var way2go;
            if(Math.abs(dx) > Math.abs(dy) ) way2go = dx > 0 ? 'right' : 'left';
            else way2go = dy < 0 ? 'up' : 'down';
            listener ({ target: el, direction: way2go });
    
        }
 }
 
 function onTouchStart(e)
 {
  if (e.touches.length == 1)
  {
   startX = e.touches[0].pageX;
   startY = e.touches[0].pageY;
   el.addEventListener('touchmove', onTouchMove, false);
   el.addEventListener('touchend', onTouchEnd, false);
   dx=0;
   dy=0;
  }
 }
 
 el.addEventListener('touchstart', onTouchStart, false);
}

function addYScroll(el, hei)
{
    var startX;
    var startY;
    var dx;
    var dy;
    var directionX;
    var directionY;
    var scrolltop;
    var maxH;
    
    
    function cancelTouch()
    {
        el.removeEventListener('touchmove', onTouchMove);
        el.removeEventListener('touchend', onTouchEnd);
        startX = null;
        startY = null;
        directionX = null;
        directionY = null;

    }
    
    function onTouchMove(e)
    {
        if (e.touches.length > 1)
        {
            cancelTouch();
        }
        else
        {
            dx = e.touches[0].pageX - startX;
            dy = e.touches[0].pageY - startY;
            
            if (dy < 0) {
                var top = scrolltop + dy;
                top = Math.abs(top) > maxH ? - maxH : top;
                scrolltop = top;
                           } else {
                var top = scrolltop + dy;
                scrolltop = (top > 0) ? 0 : top;
                }
            //alert(scrolltop);
            var stp = "-" + Math.abs(scrolltop).toString() + "px";            
            el.style.top= stp;
            if (el.offsetHeight > (hei-20)) { 
            el.style.height= (hei - scrolltop).toString() + "px";
            el.style.maxHeight= (hei - scrolltop).toString() + "px";
            }
            //document.getElementById("display1").scorllTop += dy;
                //cancelTouch();
                startX = e.touches[0].pageX;
                startY = e.touches[0].pageY;
                e.preventDefault();
        }
    }
    
    function onTouchEnd(e)
    {
        cancelTouch();

    }
    
    function onTouchStart(e)
    {
        
        if (e.touches.length == 1)
        {
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
            el.addEventListener('touchmove', onTouchMove, false);
            el.addEventListener('touchend', onTouchEnd, false);        
            el.style.position="relative";
            el.parentNode.style.overflow="hidden";  
            maxH = (el.offsetHeight - 100) < 0 ? 50 : (el.offsetHeight - 100);
            
            if (el.style.top) {
                
                var st=el.style.top;
                scrolltop = parseInt(st.substr(0, st.length-2));
               
            } else {
                    scrolltop = 0;}
            
            if (el.style.left) {
                
                var st=el.style.left;
                scrollleft = parseInt(st.substr(0, st.length-2));
                
            } else {
                scrollleft = 0;}
            
        }
    }
    
    el.addEventListener('touchstart', onTouchStart, false);
    
}

function addXScroll(el, wid)
{
    var startX;
    var startY;
    var dx;
    var dy;
    var directionX;
    var directionY;
    var scrollleft;
    
    
    function cancelTouch()
    {
        el.removeEventListener('touchmove', onTouchMove);
        el.removeEventListener('touchend', onTouchEnd);
        startX = null;
        startY = null;
        directionX = null;
        directionY = null;
        
    }
    
    function onTouchMove(e)
    {
        if (e.touches.length > 1)
        {
            cancelTouch();
        }
        else
        {
            dx = e.touches[0].pageX - startX;
            dy = e.touches[0].pageY - startY;
            
            if (dx < 0) {
                var left = scrollleft + dx;
                scrollleft = left;
            } else {
                var left = scrollleft + dx;
                scrollleft = (left > 0) ? 0 : left;
            }
            //alert(scrolltop);
            var stp = "-" + Math.abs(scrollleft).toString() + "px";            
            el.style.left= stp;
            if (el.offsetWidth > (wid-20)) { 
                el.style.width= (wid - scrollleft).toString() + "px";
                el.style.maxWidth= (wid - scrollleft).toString() + "px";
            }
            //document.getElementById("display1").scorllTop += dy;
            //cancelTouch();
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
            e.preventDefault();
        }
    }
    
    function onTouchEnd(e)
    {
        cancelTouch();
        
    }
    
    function onTouchStart(e)
    {
        
        if (e.touches.length == 1)
        {
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
            el.addEventListener('touchmove', onTouchMove, false);
            el.addEventListener('touchend', onTouchEnd, false);        
            el.style.position="relative";
            el.parentNode.style.overflow="hidden";  
            
            if (el.style.left) {
                
                var st=el.style.left;
                scrollleft = parseInt(st.substr(0, st.length-2));
                
            } else {
                scrollleft = 0;}
            
            if (el.style.left) {
                
                var st=el.style.left;
                scrollleft = parseInt(st.substr(0, st.length-2));
                
            } else {
                scrollleft = 0;}
            
        }
    }
    
    el.addEventListener('touchstart', onTouchStart, false);
    
}    
    
