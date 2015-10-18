$(document).ready(function(){

    // Top navbar
    //$('body').scrollspy({ target: '#hidden-navbar' });


    // Scrolling header
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