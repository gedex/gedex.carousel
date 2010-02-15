/*
 * jQuery gedexCarousel
 * @author admin@gedex.web.id - http://gedex.web.id
 * @version 0.1
 * @date February 8, 2010
 * @category jQuery plugin
 * @copyright (c) 2010 admin@gedex.web.id (gedex.web.id)
 * @license MIT licensed
 */
(function($) {
    $.fn.gedexCarousel = function(params) {
        params = params || {};
        
        var defaults = {
            animate: true,              // should animate
            slideSpeed: 10000,          // speed of slide's change
            fadeInSpeed: 1000,          // fadeIn speed when slide changes
            fadeOutSpeed: 1000,         // fadeOut speed when slide changes
            event: 'click',             // Event can be mouseover or click
            stopWhenEvent: false,       // should slide animation
                                        // stops when navChild's event
                                        // happens
                                    
            pauseWhenEvent: 10000,      // how long to pause slide
                                        // animation when navChild's event
                                        // happens
            
            // child considered as slide
            carouselContainer: '#carousel_container',
            carouselContent: '.carousel_content',
                                    
            nav: '#carousel_nav',       // child element container
            navChild: 'li',             // child element of nav
            
            // class when navChild is active
            navChildActiveClass: 'carousel_active',
            
            navChildZIndex: 9,          // default navChild z-index
            navChildStart: 0            // index of navChild to start
        }
        
        if (params.event != 'click' || params.event != 'mouseover') {
            params.event = 'click';
        }
        var options = $.extend(defaults, params);
        var obj = $(this);
        var container = $(options.carouselContainer);
        var nav = $(options.nav);
        
        // make sure container's position
        // is relative.
        // This can be done via css
        obj.css('position', 'relative');
        container.css('position', 'relative');
        
        // make sure carouselContent
        // is hidden
        container.children(options.carouselContent).each(function(){
            $(this).hide();
        });
        
        // make sure container has z-index
        // greater than nav child(s),
        // also set z-index of nav child
        // to navChildZIndex
        // This can be done via css
        var totalNavChild = 0;
        var navChilds = nav.children(options.navChild);
        navChilds.each(function(index){
            $(this).css('z-index', options.navChildZIndex).removeClass(
                options.navChildActiveClass);
            
            // mapping each navChild with its corresponding
            // carouselContent
            var content = $( $(this).children('a').attr('href') );
            if ( !content.length ) {
                content = $(options.carouselContent, container)[index];
            }
            $.data( this, 'content',  content);
            totalNavChild++;
        });
        container.css('z-index', options.navChildZIndex+1);
        
        // make sure navChildStart exists
        if ( !navChilds[options.navChildStart] ) {
            // if navChildStart doesn't exist,
            // use first child
            options.navChildStart = 0;
            // check again, if still
            // false, return false
            if ( !navChilds[options.navChildStart] || 
                !totalNavChild ) {
                return false;
            }
        }
        // activate navChildStart
        // with its corresponding carouselContent
        var start = $( navChilds[options.navChildStart] ).addClass(
            options.navChildActiveClass).css('z-index', options.navChildZIndex+2);
        $.data( start[0], 'content').show();
        
        // bind event and start animate
        $('a', navChilds).bind(options.event, onEventHappens);
        var timerID = null;
        if ( options.animate ) {
            timerID = startAnimate();
        }
        
        function startAnimate() {
            var t = setInterval(function() {
                    var c = $('.' + options.navChildActiveClass, nav);
                    var n = navChilds.index(c) + 1;
                    
                    if ( n === totalNavChild ) {
                        n = 0;
                    }
                    var s = $.data(c[0], 'content');
                    s.fadeOut(options.fadeSpeed, function() {
                        change($(navChilds[n]).children('a'));
                    });
                },
                options.slideSpeed
            );
            return t;
        }
        
        function change(obj) {
            // remove other navChildActiveClass
            navChilds.each(function(){
                $(this).removeClass(options.navChildActiveClass).css(
                    'z-index', options.navChildZIndex);
                $.data( this, 'content').hide();
            });
            
            // activate navChildActiveClass
            // and show corresponding content
            $.data( obj.parent()[0], 'content').show();
            obj.parent().addClass(options.navChildActiveClass).css('z-index', 
                    options.navChildZIndex+2);    
        }
        
        function onEventHappens(e) {
            change( $(e.target) );
            
            if ( options.pauseWhenEvent && timerID && !options.stopWhenEvent ) {
                clearInterval( timerID );
                setTimeout( function() {
                        timerID = startAnimate();
                    },
                    options.pauseWhenEvent
                );
            }
            
            if ( options.stopWhenEvent && timerID ) {
                clearInterval( timerID );
            }
            
            e.preventDefault();
            return false;
        }
    };
})(jQuery);