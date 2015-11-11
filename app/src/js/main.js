$(document).ready(function(){

    $(function () {
        $(window).scroll(function () {
            // set distance user needs to scroll before we start fadeIn
            if ($(this).scrollTop() > 100) {
                // TODO check why slideDown/slideUp fails
                $('#hidden-navbar').fadeIn('slow');
            } else {
                $('#hidden-navbar').fadeOut('slow');
            }
        });
    });


    // Scrolling header
    window.setInterval(function(){
        $('.header-scroll p').first().css('margin-top', function(){
            currentMargin = parseInt($('.header-scroll p').css('margin-top').replace('px', '').replace('-', ''));
            maxMargin = ($('.header-scroll p').length - 1) * 112;
            newMargin  = currentMargin < maxMargin ? currentMargin + 112 : 0;
            return '-' + newMargin.toString() + 'px';
        })},
        3000
    );

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

});