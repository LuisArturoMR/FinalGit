// Toggle Function
var menu="plus";
$('.toggle').click(function(){
  // Switches the Icon
    if(menu=="plus")
    {
        $(this).children('i').html("  Log in");
        $(this).children('i').removeClass('fa fa-times fa-plus');
        $(this).children('i').toggleClass('fa fa-pencil');
        menu="pencil";
    }
    else
    {   
        $(this).children('i').html("  Subscribe");
        $(this).children('i').removeClass('fa fa-pencil');
        $(this).children('i').toggleClass('fa fa-times fa-plus');
        menu="plus";
    }
    // Switches the forms  
    $('.form').animate({
        height: "toggle",
        'padding-top': 'toggle',
        'padding-bottom': 'toggle',
        opacity: "toggle"
        }, "slow");
    });
function interactMenu()
{
    $('.toggle').children('i').html("  Subscribe");
    $('.toggle').children('i').removeClass('fa fa-pencil');
    $('.toggle').children('i').toggleClass('fa fa-times fa-plus');
    // Switches the forms  
    $('.form').animate({
    height: "toggle",
    'padding-top': 'toggle',
    'padding-bottom': 'toggle',
    opacity: "toggle"
    }, "slow");
}