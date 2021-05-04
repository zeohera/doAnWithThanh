
$(".gg-search").click(function (e) { 
    e.preventDefault();
    $(this).animate({
        top: '-10px',
        opacity: '0',
    })
    $(".search_form").fadeIn();
    $(".search_form").css("display","flex");
    $(".search_input").focus();
});

$(".gg-close-o").click(function (e) { 
    e.preventDefault();
    $(".gg-search").animate({
        top: '11px',
        opacity: '1'
    })
    $(".search_form").fadeOut();
    $(".search_input").val('');
    $(".gg-search").show();
});

$("#packageNGo").on('click', function(){
    $('#shippingInfo').show()
    $('#cancelInfo').hide()
    $('#mail').focus()
})

$("#cancel").on('click', function(){
    $('#shippingInfo').hide()
    $('#cancelInfo').show()})
    $('#mail').focus()
$("#complete").on('click', function(){
    $('#shippingInfo').hide()
    $('#cancelInfo').hide()})
    $('#mail').focus()

document.addEventListener( 'DOMContentLoaded', function () {new Splide( '#image-slider' ).mount();} );
document.addEventListener( 'DOMContentLoaded', function () {
        new Splide( '#image-slider', {
            'cover'      : true,
            'heightRatio': 0.5,
        } ).mount();
    } );

document.querySelector('header .menu button').addEventListener('click', toggleMenu)
function toggleMenu(e){
    $('#menuOption').toggleClass('d-none');
    $('.fixed-bottom').toggleClass('d-none');
}