$(function(){ // This is the same as document.addEventListener("DOMContentLoaded", ...)

    $("#navbarToggle").blur(function(event){
        var screenWidth = window.innerWidth;
        if(screenWidth < 768){
            $("#collapsable-nav").collapse('hide');
        }
    });
});