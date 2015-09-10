//jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    var opacity = 150 - $(".navbar").offset().top;
    $('.brand-heading').css({'opacity':opacity/150});
    $('.intro-text').css({'opacity':opacity/150});
    
    if ($(".navbar").offset().top > 100) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }

    if ($(".navbar").offset().top > 200) {
        $(".navbar-fixed-top").addClass("white-backgroud");
    } else {
        $(".navbar-fixed-top").removeClass("white-backgroud");
    }
});

//jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('.page-scroll a').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});
