//加载模块css
require('./spotlight.css');
var $ = require('jquery');
//加载模板
module.exports = function() {
    var spotlight = {
        opacity: 0.2,
        imgWidth: $('.spotlightWrapper ul li').find('img').width(),
        imgHeight: $('.spotlightWrapper ul li').find('img').height()

    };

    //set the width and height of the list items same as the images
    $('.spotlightWrapper ul li').css({
        'width': spotlight.imgWidth,
        'height': spotlight.imgHeight
    });

    //when mouse over the list item...
    $('.spotlightWrapper ul li').hover(function() {

        //...find the image inside of it and add active class to it and change opacity to 1 (no transparency)
        $(this).find('img').addClass('active').css({
            'opacity': 1
        });

        //get the other list items and change the opacity of the images inside it to the one we have set in the spotlight array
        $(this).siblings('li').find('img').css({
            'opacity': spotlight.opacity
        });

        //when mouse leave...
    }, function() {

        //... find the image inside of the list item we just left and remove the active class
        $(this).find('img').removeClass('active');

    });

    //when mouse leaves the unordered list...
    $('.spotlightWrapper ul').on('mouseleave', function() {
        //find the images and change the opacity to 1 (fully visible)
        $(this).find('img').css('opacity', 1);
    });

}
