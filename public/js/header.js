
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