//引入css
require("../../css/lib/reset.css");
require('../../css/lib/common.less');
require("../../css/page/chart.less");

var echarts = require('echarts');
require('echarts/chart/line');
require('echarts/chart/funnel');
require('echarts/chart/force');

var mychart = echarts.init(document.getElementById('charts'));
var forceChart = echarts.init(document.getElementById('force'));
var chartOptions = {
    title: {
        text: '某楼盘销售情况',
        subtext: '纯属虚构'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['意向', '预购', '成交']
    },
    toolbox: {
        show: true,
        feature: {
            mark: {
                show: true
            },
            dataView: {
                show: true,
                readOnly: false
            },
            magicType: {
                show: true,
                type: ['line', 'bar', 'stack', 'tiled']
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    calculable: true,
    xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }],
    yAxis: [{
        type: 'value'
    }],
    series: [{
        name: '成交',
        type: 'line',
        smooth: true,
        itemStyle: {
            normal: {
                areaStyle: {
                    type: 'default'
                }
            }
        },
        data: [10, 12, 21, 54, 260, 830, 710]
    }, {
        name: '预购',
        type: 'line',
        smooth: true,
        itemStyle: {
            normal: {
                areaStyle: {
                    type: 'default'
                }
            }
        },
        data: [30, 182, 434, 791, 390, 30, 10]
    }, {
        name: '意向',
        type: 'line',
        smooth: true,
        itemStyle: {
            normal: {
                areaStyle: {
                    type: 'default'
                }
            }
        },
        data: [1320, 1132, 601, 234, 120, 90, 20]
    }]
};



var nodes = [];
var links = [];
var constMaxDepth = 2;
var constMaxChildren = 7;
var constMinChildren = 4;
var constMaxRadius = 10;
var constMinRadius = 2;

function rangeRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function createRandomNode(depth) {
    var node = {
        name : 'NODE_' + nodes.length,
        value : rangeRandom(constMinRadius, constMaxRadius),
        // Custom properties
        id : nodes.length,
        depth : depth,
        category : depth === constMaxDepth ? 0 : 1
    }
    nodes.push(node);

    return node;
}

function forceMockThreeData() {
    var depth = 0;
    var rootNode = {
        name : 'ROOT',
        value : rangeRandom(constMinRadius, constMaxRadius),
        // Custom properties
        id : 0,
        depth : 0,
        category : 2
    }
    nodes.push(rootNode);

    function mock(parentNode, depth) {
        var nChildren = Math.round(rangeRandom(constMinChildren, constMaxChildren));

        for (var i = 0; i < nChildren; i++) {
            var childNode = createRandomNode(depth);
            links.push({
                source : parentNode.id,
                target : childNode.id,
                weight : 1
            });
            if (depth < constMaxDepth) {
                mock(childNode, depth + 1);
            }
        }
    }

    mock(rootNode, 0);
}

forceMockThreeData();

var forceOpts = {
    title : {
        text: 'Force',
        subtext: 'Force-directed tree',
        x:'right',
        y:'bottom'
    },
    tooltip : {
        trigger: 'item',
        formatter: '{a} : {b}'
    },
    toolbox: {
        show : true,
        feature : {
            restore : {show: true},
            magicType: {show: true, type: ['force', 'chord']},
            saveAsImage : {show: true}
        }
    },
    legend: {
        x: 'left',
        data:['叶子节点','非叶子节点', '根节点']
    },
    series : [
        {
            type:'force',
            name : "Force tree",
            ribbonType: false,
            categories : [
                {
                    name: '叶子节点'
                },
                {
                    name: '非叶子节点'
                },
                {
                    name: '根节点'
                }
            ],
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    },
                    nodeStyle : {
                        brushType : 'both',
                        borderColor : 'rgba(255,215,0,0.6)',
                        borderWidth : 1
                    }
                }
            },
            minRadius : constMinRadius,
            maxRadius : constMaxRadius,
            coolDown: 0.995,
            steps: 10,
            nodes : nodes,
            links : links,
            steps: 1
        }
    ]
};




mychart.setOption(chartOptions);

forceChart.setOption(forceOpts);
