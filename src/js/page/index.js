var $ = require('jquery');

//引入css
require("../../css/lib/reset.css");
require('../../css/lib/common.less');
require("../../css/page/index.less");

//spotlight
$('#spotlight').html(require('../components/spotlight/spotlight.html'));
require('../components/spotlight/spotlight.js')();


$('#text').find('span').html('我来自index.js！');
//增加事件
$('.button').click(function() {

    $.get('/test').done(function() {
        alert(1);
    }).fail(function() {
        alert(2);
    })

    //第1种异步加载
    // require.ensure(['../components/dialog/index.js'], function(require) {
	// 	var Dialog = require('../components/dialog/index.js');
	// 	new Dialog();
	// });
    //第2种异步加载的方法
    // require(['../components/dialog/index.js'], function(Dialog) {
	// 	new Dialog();
	// });
});
