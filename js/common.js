// list of pages
var pages = ['game', 'music', 'photo', 'contact'];
var currentPage = 0;

$(window).on('load', function () {
    $('#transition-screen').delay(400).fadeOut(10).trigger('onTransitionComplete');
    var pageName = window.location.pathname.split('/').pop().split('.')[0];
    currentPage = pages.indexOf(pageName);
});

$('#right-button').on('click', function () {
    // clockwise rotate between pages
    currentPage = (currentPage + 1) % pages.length;
    // change page
    window.location.href = pages[currentPage] + '.html';
});

$('#left-button').on('click', function () {
    // counter-clockwise rotate between pages
    currentPage = (currentPage - 1 + pages.length) % pages.length;
    // change page
    window.location.href = pages[currentPage] + '.html';
});

$('#close-button').on('click', function () {
    // close the current page
    window.location.href = 'index.html';
});


