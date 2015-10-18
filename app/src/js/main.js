$(document).ready(function(){

    // Top navbar
    $('body').scrollspy({ target: '#hidden-navbar' });

    $(function () {
        $(window).scroll(function () {
            // set distance user needs to scroll before we start fadeIn
            if ($(this).scrollTop() > 100) {
                $('#hidden-navbar').fadeIn('slow');
            } else {
                $('#hidden-navbar').fadeOut('slow');
            }
        });
    });


    // Scrolling header
    // TODO make this more generic
    window.setInterval(function(){
        $('.header-scroll p').first().css('margin-top', function(){
            if ($(this).css('margin-top') == '-224px') {
                return '0px';
            } else if ($(this).css('margin-top') == '-112px') {
                return '-224px';
            } else {
                return '-112px';
            }
        })},
        3000
    );

});