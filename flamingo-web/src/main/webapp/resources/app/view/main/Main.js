Ext.define('flamingo.view.main.Main', {
    extend: 'Ext.panel.Panel',
    
    xtype: 'app-main',
    
    requires :[
        'Ext.tab.Panel',
        'flamingo.view.main.MainController',
        'flamingo.view.main.MainModel'
    ],

    controller : 'main',
    viewModel : 'main',

    height:1128,
    width:1920,
    layout:'border',
    items:[{
        region:'north',
        xtype:'component',
        height: 45,
        html:'<h3 style="color:#5fa2dd"> &ensp;Flamingo</h3>',
        style :{
            backgroundColor: '#F5F5F5',
            borderStyle:'solid',
            borderWidth:'0.1px',
            borderColor:'black'
        }
    },{
        region:'west',
        xtype:'panel',
        height:1083,
        width:220,
        style:{
            borderStyle:'solid',
            borderColor:'black',
            borderTopStyle:'hidden',
            borderWidth:'1px'
        },
        layout:'vbox',
        items: [{
            xtype:'button',
            style:{
                backgroundColor:'white',
                borderColor:'white'
            },
            text: '<text style="color:black">모니터링</text>',
            width:220
        },{
            xtype:'button',
            style:{
                backgroundColor:'white',
                borderColor:'white'
            },
            text: '<text style="color:black">워크플로우</text>',
            width:220
        },{
            xtype:'button',
            style:{
                backgroundColor:'white',
                borderColor:'white'
            },
            text: '<text style="color:black">파일 시스템 관리</text>',
            width:220
        }]
    },{
        region:'center',
        layout:'border',
        items:[{
            layout:'vbox',
            items:[{
                height:700,
                width:1400,
                xtype:'panel',
                title:'<text style="color:black;font-size:small">&ensp;workflow design area</text>',
                header:{
                    style :{
                        backgroundColor: '#F5F5F5'
                    },
                    height:35,
                    padding:'0.2px'
                },
                bodyBorder:true,
                bodyStyle:{
                    borderStyle:'solid',
                    borderColor:'black',
                    borderWidth:'1px'
                }
            },{
                height:383,
                width:1400,
                xtpye:'panel',
                title:'<text style="color:black;font-size:small">&ensp;XML editor</text>',
                header:{
                    style :{
                        backgroundColor: '#F5F5F5'
                    },
                    height:35,
                    padding:'0.2px'
                },
                bodyBorder:true,
                bodyStyle:{
                    borderStyle:'solid',
                    borderColor:'black',
                    borderWidth:'1px'
                },
                style:{
                    borderBottomStyle:'solid',
                    borderTopStyle:'solid',
                    borderColor:'black',
                    borderWidth:'1px'
                }
            }]
        }]
    },{
        region:'east',
        layout:'vbox',
        items:[{
            xtype:'panel',
            height:700,
            width:300,
            title:'<text style="color:black;font-size:small">&ensp;icon tab</text>',
            header:{
                style :{
                    backgroundColor: '#F5F5F5'
                },
                height:35,
                padding:'0.2px'
            },
            layout:'accordion',
            bodyBorder:true,
            bodyStyle:{
                borderStyle:'solid',
                borderColor:'black',
                borderWidth:'1px'
            },
            style:{
                borderLeftStyle:'solid',
                borderRightStyle:'solid',
                borderColor:'black',
                borderWidth:'1px'
            },
            items:[{
                xtype:'panel',
                title:'모두'
            },{
                xtype:'panel',
                title: '하둡에코시스템'
            },{
                xtype:'panel',
                title:'통계'
            },{
                xtype:'panel',
                title:'데이터처리'
            },{
                xtype:'panel',
                title:'Ankus'

            },{
                xtype:'panel',
                title:'아파치 마하웃'
            },{
                xtype:'panel',
                title:'인메모리'
            },{
                xtype:'panel',
                title:'연동 및 통합'
            },{
                xtype:'panel',
                title:'Rules'
            },{
                xtype:'panel',
                title:'기타'
            }]
        },{

            xtype:'tabpanel',
            tabBar:{
                style:{
                    backgroundColor:'#F5F5F5'
                },
                height:35
            },

            height:383,
            width:300,
            bodyBorder:true,
            bodyStyle:{
                borderStyle:'solid',
                borderColor:'black',
                borderWidth:'1px'
            },
            style:{
                borderStyle:'solid',
                borderColor:'black',
                borderWidth:'1px'
            },
            items: [{
                title: '<text style="color:black">&ensp;Workflow explorer</text>'

            },{
                title: '<text style="color:black;font-size:small">&ensp;Workflow variables</text>'
            }]

        }]
    }]
});