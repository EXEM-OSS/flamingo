var Tree = function (container) {
    this.Constants = {
        TYPE: {
            ACTIVITY: "activity",
            FOLDER: "folder",
            ED: "ed",
            EXPANDER: "expander",
            MAPPING: "mapping",

            /**
             * 자신으로 부터 익스팬더까지의 연결선
             */
            EXPANDER_FROM: "expanderFrom",

            /**
             * 자신으로부터 부모 객체의 익스팬더까지의 연결선
             */
            EXPANDER_TO: "expanderTo",

            /**
             * 매핑에 사용되는 연결선
             */
            MAPPING_EDGE: "mappingEdge",

            /**
             * 액티비티 연결선
             */
            ACTIVITY_REL: "activityRel"
        },
        POSITION: {
            MY: "my",
            MY_OUT: "my-out",
            MY_IN: "my-in",
            OTHER: "other",
            OTHER_OUT: "other-out",
            OTHER_MY: "other-my"
        },
        PREFIX: {
            EXPANDER: "-expander",
            EXPANDER_FROM: "-expanderFrom",
            EXPANDER_TO: "-expanderTo",
            MAPPING_EDGE: "-mappingEdge",
            MAPPING_LABEL: "-mapping-label",
            SELECTED_LABEL: "-selected-label",
            ACTIVITY_REL: "-activity-rel"
        }
    };
    this._CONFIG = {
        MOVE_SORTABLE: false,
        MAPPING_ENABLE: false,
        CREATE_FOLDER: false,
        CREATE_ED: false,
        PICK_ED: false,
        DELETABLE: false,
        SHOW_LABEL: true,
        DISPLAY_MARGIN: 50,
        CONTAINER_HEIGHT: 600,
        /**
         * 라벨 최소 크기(IE)
         */
        LABEL_MIN_SIZE: 200,

        /**
         * 라벨 최대 크기(IE)
         */
        LABEL_MAX_SIZE: 300,
        /**
         * 라벨 최대 글자 크기
         */
        LABEL_MAX_LENGTH: 8,
        AREA: {
            LEFT_SIZE_RATE: (5 / 12) - 0.002,
            RIGHT_SIZE_RATE: (7 / 12) + 0.002,
            ACTIVITY_SIZE: 100,
            BOTTOM_MARGIN: 50,
            TOP_MARGIN: 30,
            lAc: {
                label: 'Other Activity',
                display: false
            },
            lOut: {
                label: 'Other Output',
                display: false
            },
            rIn: {
                label: 'My Input',
                display: true
            },
            rAc: {
                label: 'My Activity',
                center: true,
                display: true
            },
            rOut: {
                label: 'My Output',
                display: true
            }
        },
        AREA_STYLE: {
            lAc: {
                'fill': 'RGB(246,246,246)',
                'fill-opacity': '1'
            },
            lOut: {
                'fill': 'RGB(246,246,246)',
                'fill-opacity': '1'
            },
            rIn: {
                'fill': 'RGB(255,255,255)',
            },
            rAc: {
                'fill': 'RGB(255,255,255)'
            },
            rOut: {
                'fill': 'RGB(246,246,246)',
                'fill-opacity': '1'
            }
        },
        SHAPE_SIZE: {
            COL_SIZE: 50,
            ACTIVITY_WIDTH: 50,
            ACTIVITY_HEIGHT: 50,
            ACTIVITY_LABEL_MARGIN: 20,
            ACTIVITY_MARGIN: 50,
            FOLDER_WIDTH: 40,
            FOLDER_HEIGHT: 40,
            FOLDER_MARGIN: 20,
            ED_WIDTH: 30,
            ED_HEIGHT: 30,
            ED_MARGIN: 24,
            EXPANDER_FROM_MARGIN: 10,
            EXPANDER_TO_MARGIN: 20,
            EXPANDER_WIDTH: 14,
            EXPANDER_HEIGHT: 14
        },
        DEFAULT_STYLE: {
            BLUR: "0.3",
            EDGE: "plain", //bezier || plain,
            MAPPING_EDGE: "bezier" //bezier || plain,
        }
    };

    /**
     * 인 데이터 그룹의 가상의 activity 와 targetActivity 사이의 가상 익스팬더 상황 데이터
     * @type {Array}
     * @private
     */
    this._INCOLLAPSE = [];
    this._STORAGE = {};
    this._VIEWDATA = {};
    this._CONTAINER = $('#' + container);
    this._CONTAINER.css({
        width: '100%',
        height: this._CONFIG.CONTAINER_HEIGHT + 'px',
        border: '1px solid #555'
    });
    // Canvas
    this.canvas = new OG.Canvas(container, [this._CONTAINER.width(), this._CONFIG.CONTAINER_HEIGHT], 'white');
    this.canvas._CONFIG.DEFAULT_STYLE.EDGE["edge-type"] = "plain";

    this.canvas.initConfig({
        selectable: true,
        dragSelectable: true,
        movable: true,
        resizable: false,
        connectable: true,
        selfConnectable: false,
        connectCloneable: false,
        connectRequired: true,
        labelEditable: false,
        groupDropable: true,
        collapsible: true,
        enableHotKey: true,
        enableContextMenu: false,
        useSlider: true,
        stickGuide: false,
        checkBridgeEdge: false
    });
    this.canvas._CONFIG.LABEL_MIN_SIZE = this._CONFIG.LABEL_MIN_SIZE;
    this.canvas._CONFIG.LABEL_MAX_SIZE = this._CONFIG.LABEL_MAX_SIZE;

    this._RENDERER = this.canvas._RENDERER;
    this._HANDLER = this.canvas._HANDLER;

    this.AREA = {
        lAc: null,
        lOut: null,
        rIn: null,
        rAc: null,
        rOut: null
    }
};
Tree.prototype = {
    init: function () {
        var me = this;

        //세로 방향 스크롤일 경우 렌더링을 재수행한다.
        var prevLeft = 0;
        me._CONTAINER.scroll(function () {
            var currentLeft = $(this).scrollLeft();
            if (prevLeft != currentLeft) {
                prevLeft = currentLeft;
            } else {
                me.renderViews();
            }
        });

        me.drawArea();
        me.render();
        me.bindEvent();
    },
    /**
     * Scale 을 반환한다. (리얼 사이즈 : Scale = 1)
     *
     * @return {Number} 스케일값
     */
    getScale: function () {
        return this.canvas.getScale();
    },

    /**
     * Scale 을 설정한다. (기본 사이즈 : Scale = 1)
     *
     * @param {Number} scale 스케일값
     */
    setScale: function (scale) {
        var me = this;
        var preSize = me.canvas.getCanvasSize();
        var preWidth = preSize[0];
        var preHeight = preSize[1];
        var preScrollLeft = me._CONTAINER.scrollLeft();
        var preScrollTop = me._CONTAINER.scrollTop();
        var preCenterX = preScrollLeft + (me._CONTAINER.width() / 2);
        var preCenterY = preScrollTop + (me._CONTAINER.height() / 2);

        this.canvas.setScale(scale);
        this.renderViews();

        var cuSize = me.canvas.getCanvasSize();
        var cuWidth = cuSize[0];
        var cuHeight = cuSize[1];
        var cuScrollLeft = me._CONTAINER.scrollLeft();
        var cuScrollTop = me._CONTAINER.scrollTop();

        var cuCenterX = preCenterX * (preWidth / cuWidth);
        var cuCenterY = preCenterY * (preHeight / cuHeight);

        var moveX = preCenterX - cuCenterX;
        var moveY = preCenterY - cuCenterY;
        me._CONTAINER.scrollLeft(cuScrollLeft + moveX);
        me._CONTAINER.scrollTop(cuScrollTop + moveY);

    },
    setShowLabel: function (show) {
        var me = this;
        var allShapes = me._RENDERER.getAllNotEdges();
        for (var i = 0, leni = allShapes.length; i < leni; i++) {
            if (allShapes[i].shape instanceof OG.Area) {
                //Nothing to do
            } else {
                me.canvas.removeShape(allShapes[i].id);
            }
        }
        if (show) {
            me._CONFIG.SHOW_LABEL = true;
        } else {
            me._CONFIG.SHOW_LABEL = false;
        }
        me.render();
    },
    /**
     * 기본 Area 를 생성한다.
     * lAc,lOut,rIn,rAc,rOut,Canvas
     */
    drawArea: function () {
        var me = this;
        var lacLabel = me._CONFIG.AREA.lAc.display ? me._CONFIG.AREA.lAc.label : undefined;
        var lOutLabel = me._CONFIG.AREA.lOut.display ? me._CONFIG.AREA.lOut.label : undefined;
        var rInLabel = me._CONFIG.AREA.rIn.display ? me._CONFIG.AREA.rIn.label : undefined;
        var rAcLabel = me._CONFIG.AREA.rAc.display ? me._CONFIG.AREA.rAc.label : undefined;
        var rOutLabel = me._CONFIG.AREA.rOut.display ? me._CONFIG.AREA.rOut.label : undefined;
        me.AREA.lAc = me.canvas.drawShape([0, 0], new OG.Area(lacLabel), [50, 50], {stroke: '#555', 'stroke-width': 2});
        me.AREA.lOut = me.canvas.drawShape([0, 0], new OG.Area(lOutLabel), [50, 50], {
            stroke: '#555',
            'stroke-width': 2
        });
        me.AREA.rIn = me.canvas.drawShape([0, 0], new OG.Area(rInLabel), [50, 50], {stroke: '#555', 'stroke-width': 2});
        me.AREA.rAc = me.canvas.drawShape([0, 0], new OG.Area(rAcLabel), [50, 50], {stroke: '#555', 'stroke-width': 2});
        me.AREA.rOut = me.canvas.drawShape([0, 0], new OG.Area(rOutLabel), [50, 50], {
            stroke: '#555',
            'stroke-width': 2
        });
        me.canvas.setShapeStyle(me.AREA.lAc, me._CONFIG.AREA_STYLE.lAc);
        me.canvas.setShapeStyle(me.AREA.lOut, me._CONFIG.AREA_STYLE.lOut);
        me.canvas.setShapeStyle(me.AREA.rIn, me._CONFIG.AREA_STYLE.rIn);
        me.canvas.setShapeStyle(me.AREA.rAc, me._CONFIG.AREA_STYLE.rAc);
        me.canvas.setShapeStyle(me.AREA.rOut, me._CONFIG.AREA_STYLE.rOut);
    },

    //========================================================================//
    //=============================Data apis==================================//
    //========================================================================//

    /**
     * 뷰 데이터를 불러온다.
     * @returns {Array}
     */
    loadViewData: function () {
        return this._VIEWDATA.views;
    },
    /**
     * 노드 데이터를 불러온다.
     * @returns {Array}
     */
    load: function () {
        var data = [];
        var me = this;
        for (var key in me._STORAGE) {
            data.push(me._STORAGE[key]);
        }
        return data;
    },
    /**
     * 노드 데이터를 필터링하여 불러온다.
     * @param filterData
     * @returns {Array}
     */
    loadByFilter: function (filterData) {
        var data = [];
        var me = this, key;
        for (key in me._STORAGE) {
            var toAdd = true;
            for (var filterKey in filterData) {
                //하나라도 필터 조건이 맞지 않다면 추가하지 않도록 한다.
                if (me._STORAGE[key][filterKey] != filterData[filterKey]) {
                    toAdd = false;
                }
            }
            if (toAdd) {
                data.push(me._STORAGE[key]);
            }
        }
        return data;
    },
    /**
     * 노드 데이터를 필터링 하여 삭제한다.
     * @param filterData
     */
    removeDataByFilter: function (filterData) {
        var me = this, key;
        for (key in me._STORAGE) {
            var toRemove = true;
            for (var filterKey in filterData) {
                //하나라도 필터 조건이 맞지 않다면 삭제하지 않도록 한다.
                if (me._STORAGE[key][filterKey] != filterData[filterKey]) {
                    toRemove = false;
                }
            }
            if (toRemove) {
                delete me._STORAGE[key];
            }
        }
        me._STORAGE = JSON.parse(JSON.stringify(me._STORAGE));
    },
    /**
     * 노드 데이터를 모두 삭제한다.
     * @param preventRender
     */
    clearData: function (preventRender) {
        this._STORAGE = {};
        if (!preventRender) {
            this.render();
        }
    },
    /**
     * 트리의 데이터를 주어진 prop 로 소트한다.
     * @param prop
     * @param positions
     * @param desc
     * @param preventRender
     */
    sortData: function (prop, positions, desc, preventRender) {
        var me = this, key, aType, bType, x, y;
        var list = [];

        //해당하는 포지션 정보를 담는다.
        if (!positions || !positions.length) {
            list = me.load();
        } else {
            for (var i = 0, leni = positions.length; i < leni; i++) {
                list = list.concat(me.loadByFilter({position: positions[i]}));
            }
        }

        list.sort(function (a, b) {
            if (!a[prop] && !b[prop]) {
                return 0;
            }
            if (!a[prop] && b[prop]) {
                return 1;
            }
            if (a[prop] && !b[prop]) {
                return -1;
            }
            aType = typeof(a[prop]).toLowerCase();
            bType = typeof(b[prop]).toLowerCase();
            //스트링 비교
            if (aType == 'string' && bType == 'string') {
                x = a[prop].toLowerCase();
                y = b[prop].toLowerCase();
                //순차 배열
                if (!desc) {
                    return x < y ? -1 : x > y ? 1 : 0;
                }
                //역순 배열
                else {
                    return x < y ? 1 : x > y ? -1 : 0;
                }
            }
            //넘버 비교
            else if (aType == 'number' && bType == 'number') {
                //순차 배열
                if (!desc) {
                    return a[prop] - b[prop];
                }
                //역순 배열
                else {
                    return b[prop] - a[prop];
                }
            }
            //그 외의 비교는 소트를 실행하지 않는다.
            else {
                return 0;
            }
        });
        var sorted = JSON.parse(JSON.stringify(list));

        //해당하는 포지션대로 업데이트 한다.
        if (!positions || !positions.length) {
            me.clearData(true);
        } else {
            for (var i = 0, leni = positions.length; i < leni; i++) {
                me.removeDataByFilter({position: positions[i]});
            }
        }
        me.updateData(sorted, preventRender);
    },
    /**
     * 데이터를 업데이트한다.
     * @param data
     * @param preventRender 업데이트 후 렌더링 방지 여부.
     */
    updateData: function (data, preventRender) {
        if (!data) {
            return;
        }
        var me = this;
        var copyObj;
        var checkEnablePosition = function (item) {
            if (item) {
                if (me.Constants.POSITION.OTHER == item['position']) {
                    return me._CONFIG.AREA.lAc.display;
                }
                if (me.Constants.POSITION.OTHER_OUT == item['position']) {
                    return me._CONFIG.AREA.lOut.display;
                }
                if (me.Constants.POSITION.MY_IN == item['position']) {
                    return me._CONFIG.AREA.rIn.display;
                }
                if (me.Constants.POSITION.MY == item['position']) {
                    return me._CONFIG.AREA.rAc.display;
                }
                if (me.Constants.POSITION.MY_OUT == item['position']) {
                    return me._CONFIG.AREA.rOut.display;
                }
            }
            return false;
        };
        if ($.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                if (checkEnablePosition(data[i])) {
                    copyObj = JSON.parse(JSON.stringify(data[i]));
                    if (copyObj.id) {
                        me._STORAGE[copyObj.id] = copyObj;
                    }
                }
            }
        } else {
            for (var key in data) {
                if (checkEnablePosition(data[key])) {
                    copyObj = JSON.parse(JSON.stringify(data[key]));
                    if (copyObj.id) {
                        me._STORAGE[copyObj.id] = copyObj;
                    }
                }
            }
        }
        if (!preventRender) {
            me.render();
        }
    },


    //========================================================================//
    //===========================Render apis==================================//
    //========================================================================//
    /**
     * 스토리지의 데이터를 기반으로 화면에 렌더링한다.
     */
    render: function () {
        this.createViewData();
        this.renderViews();
    },
    /**
     * 스토리지의 데이터를 기반으로 화면에 표현되야 하는 각 객체의 y 좌표를 생성한 ViewData 를 반환한다.
     * @returns {{totalHeight: number, views: Array, displayViews: Array}}
     */
    createViewData: function () {
        //아더 워크플로우 처리
        var me = this, y, root,
            otherActivities, myActivities,
            viewData = {
                totalHeight: 0,
                views: [],
                displayViews: []
            },
            lastViewBottom = 0,
            depthMap = {};
        /**
         * 주어진 객체의 좌표를 생성하여 viewData 에 저장하고, 객체에 자식이 있다면 함수를 반복수행한다.
         * @param object
         * @param depth
         * @param parentView
         * @param childFromParent
         */
        var getViewData = function (object, depth, parentView, childFromParent) {
            var bottom = 0;
            var expanderView = null;
            var expanderFromView = null;
            var expanderToView = null;
            //최초 depth 는 0 으로 지정.
            if (!depth) {
                depth = 0;
            }

            var child = me.selectChildById(object['id']);
            var view = {
                data: JSON.parse(JSON.stringify(object))
            };
            view.depth = depth;

            //자신과 같은 부모를 가지는 데이터들 중 자신이 첫 번째일 경우, 부모의 y 와 나의 y 를 동기화시킨다.
            //자신과 같은 부모를 가지는 데이터들 중 자신이 인덱스를 등록한다.
            var firstChild = false;
            if (childFromParent && childFromParent.length) {
                for (var i = 0, leni = childFromParent.length; i < leni; i++) {
                    if (childFromParent[0]['id'] == object['id']) {
                        view.index = i;
                        if (i == 0) {
                            firstChild = true;
                        }
                    }
                }
            }

            //액티비티일 경우
            if (object['type'] == me.Constants.TYPE.ACTIVITY) {
                y = firstChild ? parentView.y : lastViewBottom + (me._CONFIG.SHAPE_SIZE.ACTIVITY_HEIGHT / 2);
                bottom = y + (me._CONFIG.SHAPE_SIZE.ACTIVITY_HEIGHT / 2) + me._CONFIG.SHAPE_SIZE.ACTIVITY_MARGIN;
                view.y = y;
                view.width = me._CONFIG.SHAPE_SIZE.ACTIVITY_WIDTH;
                view.height = me._CONFIG.SHAPE_SIZE.ACTIVITY_HEIGHT;
                view.bottom = bottom;
                view.root = root;
                view.position = object['position'];
                view.id = object['id'];
                view.expand = object['expand'];
                view.type = object['type'];
                view.name = object['name'];
                view.color = object['color'];
                view.stroke = object['stroke'];
                view.tooltip = object['tooltip'];
            }

            //폴더일 경우
            if (object['type'] == me.Constants.TYPE.FOLDER) {
                y = firstChild ? parentView.y : lastViewBottom + (me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT / 2);
                bottom = y + (me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT / 2) + me._CONFIG.SHAPE_SIZE.FOLDER_MARGIN;
                view.y = y;
                view.width = me._CONFIG.SHAPE_SIZE.FOLDER_WIDTH;
                view.height = me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT;
                view.bottom = bottom;
                view.root = root;
                view.position = object['position'];
                view.id = object['id'];
                view.expand = object['expand'];
                view.type = object['type'];
                view.name = object['name'];
                view.color = object['color'];
                view.stroke = object['stroke'];
                view.tooltip = object['tooltip'];
            }

            //ed 일 경우
            if (object['type'] == me.Constants.TYPE.ED) {
                y = firstChild ? parentView.y : lastViewBottom + (me._CONFIG.SHAPE_SIZE.ED_HEIGHT / 2);
                bottom = y + (me._CONFIG.SHAPE_SIZE.ED_HEIGHT / 2) + me._CONFIG.SHAPE_SIZE.ED_MARGIN;
                view.y = y;
                view.width = me._CONFIG.SHAPE_SIZE.ED_WIDTH;
                view.height = me._CONFIG.SHAPE_SIZE.ED_HEIGHT;
                view.bottom = bottom;
                view.root = root;
                view.position = object['position'];
                view.id = object['id'];
                view.expand = object['expand'];
                view.type = object['type'];
                view.name = object['name'];
                view.color = object['color'];
                view.stroke = object['stroke'];
                view.tooltip = object['tooltip'];
            }

            //자식이 있을 경우 hasChild true
            if (child.length) {
                view.hasChild = true;
            }

            //자식이 있을 경우 expanderView 를 등록한다.
            if (child.length) {
                var expanderPosition = view.position;
                if (expanderPosition == me.Constants.POSITION.MY) {
                    expanderPosition = me.Constants.POSITION.MY_OUT
                }
                if (expanderPosition == me.Constants.POSITION.OTHER) {
                    expanderPosition = me.Constants.POSITION.OTHER_OUT
                }
                expanderView = {
                    id: view.id + me.Constants.PREFIX.EXPANDER,
                    y: view.y,
                    width: me._CONFIG.SHAPE_SIZE.EXPANDER_WIDTH,
                    height: me._CONFIG.SHAPE_SIZE.EXPANDER_HEIGHT,
                    bottom: view.y + (me._CONFIG.SHAPE_SIZE.EXPANDER_HEIGHT / 2),
                    root: view.root,
                    position: expanderPosition,
                    type: me.Constants.TYPE.EXPANDER,
                    depth: view.depth,
                    data: view.data,
                    index: view.index,
                    name: view.name
                }
            }
            //자식이 있을 경우 expanderFrom(자신으로부터 expander 까지 연결선) 를 등록한다.
            if (child.length) {
                var exFromPosition = view.position;
                if (exFromPosition == me.Constants.POSITION.MY) {
                    exFromPosition = me.Constants.POSITION.MY_OUT
                }
                if (exFromPosition == me.Constants.POSITION.OTHER) {
                    exFromPosition = me.Constants.POSITION.OTHER_OUT
                }
                expanderFromView = {
                    id: view.id + me.Constants.PREFIX.EXPANDER_FROM,
                    y: view.y,
                    bottom: view.y,
                    root: view.root,
                    position: exFromPosition,
                    type: me.Constants.TYPE.EXPANDER_FROM,
                    depth: view.depth,
                    data: view.data,
                    index: view.index,
                    transparent: true,
                    parentY: view.y,
                    name: view.name
                };
            }
            //부모가 있을 경우 expanderTo(부모 expander 로부터 자신 까지 연결선) 를 등록한다.
            if (parentView) {
                var exToPosition = view.position;
                if (exToPosition == me.Constants.POSITION.MY) {
                    exToPosition = me.Constants.POSITION.MY_OUT
                }
                if (exToPosition == me.Constants.POSITION.OTHER) {
                    exToPosition = me.Constants.POSITION.OTHER_OUT
                }
                expanderToView = {
                    id: view.id + me.Constants.PREFIX.EXPANDER_TO,
                    parentId: parentView.id,
                    y: view.y,
                    bottom: view.y,
                    root: view.root,
                    position: exToPosition,
                    type: me.Constants.TYPE.EXPANDER_TO,
                    depth: view.depth,
                    data: view.data,
                    index: view.index,
                    transparent: true,
                    parentY: parentView.y,
                    name: view.name
                };
            }

            //depthMap 에 등록한다.
            if (!depthMap[view.position]) {
                depthMap[view.position] = {}
            }
            if (!depthMap[view.position][view.depth]) {
                depthMap[view.position][view.depth] = []
            }
            depthMap[view.position][view.depth].push(view);

            //자신과 같은 포지션 중 depth 가 같은 리스트를 불러온다.
            //불러온 리스트중 자신보다 앞선 객체가 있다면, 객체의 bottom 기준으로 가상의 view 를 생성해본다.
            //가성의 view 의 bottom 이 실제 view bottom 보다 클 경우 가상의 view 의 y 와 bottom 으로 교체한다.
            var depthList = depthMap[view.position][view.depth];
            if (depthList.length > 1) {
                var vy, vBottom;
                var prevDepthView = depthList[depthList.length - 2];
                //액티비티일 경우
                if (object['type'] == me.Constants.TYPE.ACTIVITY) {
                    vy = prevDepthView.bottom + (me._CONFIG.SHAPE_SIZE.ACTIVITY_HEIGHT / 2);
                    vBottom = vy + (me._CONFIG.SHAPE_SIZE.ACTIVITY_HEIGHT / 2) + me._CONFIG.SHAPE_SIZE.ACTIVITY_MARGIN;
                }

                //폴더일 경우
                if (object['type'] == me.Constants.TYPE.FOLDER) {
                    vy = prevDepthView.bottom + (me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT / 2);
                    vBottom = vy + (me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT / 2) + me._CONFIG.SHAPE_SIZE.FOLDER_MARGIN;
                }

                //ed 일 경우
                if (object['type'] == me.Constants.TYPE.ED) {
                    vy = prevDepthView.bottom + (me._CONFIG.SHAPE_SIZE.ED_HEIGHT / 2);
                    vBottom = vy + (me._CONFIG.SHAPE_SIZE.ED_HEIGHT / 2) + me._CONFIG.SHAPE_SIZE.ED_MARGIN;
                }

                //가상 view 의 높이 비교 후 교체.
                if (vy && vBottom && vBottom > view.bottom) {
                    view.y = vy;
                    view.bottom = vBottom;
                    if (expanderView) {
                        expanderView.y = vy;
                        expanderView.bottom = vy + (me._CONFIG.SHAPE_SIZE.EXPANDER_HEIGHT / 2);
                    }
                    if (expanderFromView) {
                        expanderFromView.y = vy;
                        expanderFromView.parentY = vy;
                    }
                    if (expanderToView) {
                        expanderToView.y = vy;
                    }
                }
            }

            //자신의 bottom 을 lastViewBottom 에 등록한다.
            if (view.bottom) {
                lastViewBottom = view.bottom;
            }

            //뷰 데이터에 등록
            viewData.views.push(view);
            if (expanderView) {
                viewData.views.push(expanderView);
            }
            if (expanderFromView) {
                viewData.views.push(expanderFromView);
            }
            if (expanderToView) {
                viewData.views.push(expanderToView);
            }

            //expand 상태라면 자식의 수만큼 루프
            if (child.length && object.expand) {
                for (var c = 0, lenc = child.length; c < lenc; c++) {
                    //parentView 로 보내는 것이 실제 부모가 보내지는 것이 아니라 next 순서로 보내진다.
                    getViewData(child[c], depth + 1, view, child);
                }
            }
        };

        //1. 아더 액비티비 기준 시작
        lastViewBottom = me._CONFIG.AREA.TOP_MARGIN;
        otherActivities = me.selectActivityByPosition(this.Constants.POSITION.OTHER);
        for (var i = 0, leni = otherActivities.length; i < leni; i++) {
            root = otherActivities[i]['id'];
            getViewData(otherActivities[i]);
        }
        //2. 마이 액티비티 기준 시작
        lastViewBottom = me._CONFIG.AREA.TOP_MARGIN;
        myActivities = me.selectActivityByPosition(this.Constants.POSITION.MY);
        for (var i = 0, leni = myActivities.length; i < leni; i++) {
            root = myActivities[i]['id'];
            getViewData(myActivities[i]);
        }
        //3. 매핑 데이터 기준 시작
        var mapping, source, target, selected, sourceActivity, targetActivity, sourceActivityView, targetActivityView, sourceView, loaded = [], diffY;
        var mappings = me.selectMappings();
        var standaloneViewData;
        var rootMapping;
        var standaloneView;
        var totalInHeight;
        var nextActivity;
        var nextActivityView;
        var activityView, activityRelView;
        var targetOutDiff;
        var nextTargetActivities;
        var nextActivityIds;
        var isLoad;
        var currentDiffY;
        for (var i = 0, leni = mappings.length; i < leni; i++) {
            mapping = mappings[i];
            source = mapping['source'];
            target = mapping['target'];
            selected = mapping['selected'];
            sourceActivity = me.selectRootActivityById(source);
            targetActivity = me.selectById(target);

            //타켓 액티비티(마이 데이터 쪽) 만 존재할 경우
            if (!sourceActivity && targetActivity) {
                rootMapping = me.selectRootMapping(source, target);
                targetActivityView = me.selectViewById(viewData, targetActivity['id']);

                //loaded 에서 타켓 액티비티가 같은 것들의 sourceInHeight 를 높이 차에 더해준다.(타켓 액티비티 쪽에 여러 소스 액티비티가 겹칠 경우를 위함이다.)
                totalInHeight = 0;
                diffY = targetActivityView.y - (me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT / 2);
                for (var l = 0, lenl = loaded.length; l < lenl; l++) {
                    if (loaded[l].targetActivity == targetActivity['id']) {
                        diffY = diffY + loaded[l].sourceInHeight + me._CONFIG.SHAPE_SIZE.ACTIVITY_HEIGHT + me._CONFIG.SHAPE_SIZE.ACTIVITY_MARGIN;
                        totalInHeight = totalInHeight + loaded[l].sourceInHeight + me._CONFIG.SHAPE_SIZE.ACTIVITY_HEIGHT + me._CONFIG.SHAPE_SIZE.ACTIVITY_MARGIN;
                    }
                }

                isLoad = false;
                for (var l = 0, lenl = loaded.length; l < lenl; l++) {
                    if (loaded[l].sourceActivity == rootMapping['parentId'] &&
                        loaded[l].targetActivity == targetActivity['id']) {
                        isLoad = true;
                    }
                }
                //이미 매핑 그룹 뷰 생성을 수행한 매핑 일 경우
                if (isLoad) {
                    //Nothing to do
                }
                //처음 매핑 그룹 뷰 생성을 수행하는 매핑 일 경우
                else {
                    standaloneViewData = me.createStandaloneViewData(rootMapping, targetActivityView);
                    for (var s = 0, lens = standaloneViewData['views'].length; s < lens; s++) {
                        standaloneView = standaloneViewData['views'][s];
                        standaloneView.y = standaloneView.y + diffY;
                        if (standaloneView.parentY) {
                            if (standaloneView.type == me.Constants.TYPE.EXPANDER_FROM && standaloneView.depth == 0) {
                                standaloneView.parentY = targetActivityView.y;
                            } else {
                                standaloneView.parentY = standaloneView.parentY + diffY;
                            }
                        }
                        viewData.views.push(standaloneView);
                    }

                    //totalInHeight 갱신
                    totalInHeight = totalInHeight + standaloneViewData.totalHeight;

                    //targetActivityView 의 y 와 nextActivityView 의 y 차이를 구한다. => currentDiffY
                    //totalInHeight 와 currentDiffY 의 차이를 구한다. ==> targetOutDiff
                    //next 액티비티 뷰 및 그에 해당하는 in, out 의 뷰객체의 y 와 bottom 값을 targetOutDiff 만큼 늘린다.
                    nextActivity = me.selectNextActivity(targetActivity['id']);
                    if (nextActivity) {
                        nextActivityView = me.selectViewById(viewData, nextActivity['id']);
                        currentDiffY = nextActivityView.y - targetActivityView.y;
                        if (totalInHeight > currentDiffY) {
                            targetOutDiff = totalInHeight - currentDiffY;
                            nextTargetActivities = me.selectNextActivities(targetActivity['id']);
                            if (nextTargetActivities.length) {
                                nextActivityIds = [];
                                for (var n = 0, lenn = nextTargetActivities.length; n < lenn; n++) {
                                    nextActivityIds.push(nextTargetActivities[n]['id']);
                                }
                                for (var n = 0, lenn = viewData.views.length; n < lenn; n++) {
                                    if (nextActivityIds.indexOf(viewData.views[n]['root']) != -1) {
                                        viewData.views[n].y = viewData.views[n].y + targetOutDiff;
                                        viewData.views[n].bottom = viewData.views[n].bottom + targetOutDiff;
                                        if (viewData.views[n].parentY) {
                                            viewData.views[n].parentY = viewData.views[n].parentY + targetOutDiff;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //sourceInHeight 를 포함하여 읽어들인 리스트에 추가한다.
                    loaded.push({
                        sourceActivity: rootMapping['parentId'],
                        targetActivity: targetActivity['id'],
                        sourceInHeight: standaloneViewData.totalHeight
                    });
                }
            }

            else if (sourceActivity && targetActivity) {
                totalInHeight = 0;
                //소스 액티비티와 타겟 액티비티간의 높이 차를 구한다.
                //loaded 에서 타켓 액티비티가 같은 것들의 sourceInHeight 를 높이 차에 더해준다.(타켓 액티비티 쪽에 여러 소스 액티비티가 겹칠 경우를 위함이다.)
                sourceActivityView = me.selectViewById(viewData, sourceActivity['id']);
                targetActivityView = me.selectViewById(viewData, targetActivity['id']);
                diffY = targetActivityView.y - sourceActivityView.y;
                for (var l = 0, lenl = loaded.length; l < lenl; l++) {
                    if (loaded[l].sourceActivity != sourceActivity['id'] &&
                        loaded[l].targetActivity == targetActivity['id']) {
                        diffY = diffY + loaded[l].sourceInHeight + me._CONFIG.SHAPE_SIZE.ACTIVITY_HEIGHT + me._CONFIG.SHAPE_SIZE.ACTIVITY_MARGIN;
                        totalInHeight = totalInHeight + loaded[l].sourceInHeight + me._CONFIG.SHAPE_SIZE.ACTIVITY_HEIGHT + me._CONFIG.SHAPE_SIZE.ACTIVITY_MARGIN;
                    }
                }

                //타켓액티비티에 소스액티비티 및 hasMirror true 등록
                targetActivityView.hasMirror = true;
                targetActivityView.sourceActivityId = sourceActivity['id'];

                isLoad = false;
                for (var l = 0, lenl = loaded.length; l < lenl; l++) {
                    if (loaded[l].sourceActivity == sourceActivity['id'] &&
                        loaded[l].targetActivity == targetActivity['id']) {
                        isLoad = true;
                    }
                }
                //이미 미러링을 수행한 액티비티 일 경우
                if (isLoad) {
                    //뷰 데이터에서 id 가 source + '-mirror' 인 것을 찾는다.
                    for (var v = 0, lenv = viewData.views.length; v < lenv; v++) {
                        if (viewData.views[v]['id'] == source + '-' + targetActivity['id']) {
                            viewData.views[v].mapping = true;
                            viewData.views[v].selected = selected;
                            viewData.views[v].data = JSON.parse(JSON.stringify(mapping));
                        }
                    }
                }
                //처음 미러링을 수행하는 액티비티 일 경우
                else {
                    //뷰 데이터에서 root 가 sourceActivity 와 같은 것을 찾는다.
                    for (var v = 0, lenv = viewData.views.length; v < lenv; v++) {
                        if (viewData.views[v]['root'] == sourceActivity['id']) {
                            sourceView = viewData.views[v];
                            //오브젝트를 복사한다.
                            //복사할 오브젝트는 view 의 타입이 액티비티가 아닌것.
                            if (sourceView['type'] != me.Constants.TYPE.ACTIVITY) {
                                var targetView = JSON.parse(JSON.stringify(sourceView));
                                targetView.root = targetActivity['id'];
                                targetView.position = me.Constants.POSITION.MY_IN;
                                if (sourceView.type == me.Constants.TYPE.EXPANDER) {
                                    targetView.id = sourceView.data.id + '-' + targetActivity['id'] + me.Constants.PREFIX.EXPANDER;
                                } else if (sourceView.type == me.Constants.TYPE.EXPANDER_FROM) {
                                    targetView.id = sourceView.data.id + '-' + targetActivity['id'] + me.Constants.PREFIX.EXPANDER_FROM;
                                } else if (sourceView.type == me.Constants.TYPE.EXPANDER_TO) {
                                    targetView.id = sourceView.data.id + '-' + targetActivity['id'] + me.Constants.PREFIX.EXPANDER_TO;
                                } else {
                                    targetView.id = sourceView.data.id + '-' + targetActivity['id'];
                                }
                                if (sourceView.parentId) {
                                    targetView.parentId = sourceView.parentId;
                                }
                                targetView.bottom = sourceView.bottom + diffY;
                                targetView.y = sourceView.y + diffY;

                                //소스와 타켓을 등록한다.
                                targetView.source = sourceView['data']['id'];
                                targetView.target = targetActivity['id'];

                                //익스팬더를 제외한 객체는 blur 처리한다.
                                if (sourceView['type'] != me.Constants.TYPE.EXPANDER) {
                                    targetView.blur = true;
                                }

                                //sourceActivity 의 expanderFrom 은 blur 처리를 해제한다.
                                if (sourceView.id == sourceActivity['id'] + me.Constants.PREFIX.EXPANDER_FROM) {
                                    targetView.blur = false;
                                }

                                if (sourceView.parentY) {
                                    //액티비티와 익스팬더의 연결 처리 (EXPANDER_FROM)
                                    if (sourceView.type == me.Constants.TYPE.EXPANDER_FROM && sourceView.depth == 0) {
                                        targetView.parentY = targetActivityView.y;
                                    }
                                    //일반 parentY 처리.
                                    else {
                                        targetView.parentY = sourceView.parentY + diffY;
                                    }
                                }
                                //매핑 된 대상에는 mapping 과 selected 칼럼을 추가하고, 데이터를 매핑 데이터로 교체한다.
                                if (sourceView['data']['id'] == source) {
                                    targetView.mapping = true;
                                    targetView.selected = selected;
                                    targetView.data = JSON.parse(JSON.stringify(mapping));

                                    //소스의 expand 를 상속받는다.
                                    targetView.data.expand = sourceView.data.expand;
                                }
                                viewData.views.push(targetView);
                            }
                        }
                    }


                    //sourceActivityView 자식들 중 y 가 가장큰것을 구한다.
                    //가장 큰 y 와 sourceActivityView 의 y 차이를 구한다. ==> sourceInHeight
                    //targetActivityView 자식들 중 y 가 가장큰것을 구한다.
                    //가장 큰 y 와 targetActivityView 의 y 차이를 구한다. ==> targetOutHeight
                    //sourceInHeight 가 targetOutHeight 보다 클 경우,
                    //sourceInHeight 와 targetOutHeight 의 차이를 구한다. ==> targetOutDiff
                    //next 액티비티 뷰 및 그에 해당하는 in, out 의 뷰객체의 y 와 bottom 값을 targetOutDiff 만큼 늘린다.
                    var sourceRecursiveChild = me.selectRecursiveChildViewsById(viewData, sourceActivity['id']);
                    var sourceMaxY = me.selectMaxyFromViews(sourceRecursiveChild);
                    var sourceInHeight = sourceMaxY - sourceActivityView.y;
                    if (sourceInHeight < 0) {
                        sourceInHeight = 0;
                    }

                    //totalInHeight 갱신
                    totalInHeight = totalInHeight + sourceInHeight + me._CONFIG.SHAPE_SIZE.ACTIVITY_HEIGHT + me._CONFIG.SHAPE_SIZE.ACTIVITY_MARGIN;

                    //targetActivityView 의 y 와 nextActivityView 의 y 차이를 구한다. => currentDiffY
                    //totalInHeight 와 currentDiffY 의 차이를 구한다. ==> targetOutDiff
                    //next 액티비티 뷰 및 그에 해당하는 in, out 의 뷰객체의 y 와 bottom 값을 targetOutDiff 만큼 늘린다.
                    nextActivity = me.selectNextActivity(targetActivity['id']);
                    if (nextActivity) {
                        nextActivityView = me.selectViewById(viewData, nextActivity['id']);
                        currentDiffY = nextActivityView.y - targetActivityView.y;
                        if (totalInHeight > currentDiffY) {
                            targetOutDiff = totalInHeight - currentDiffY;
                            nextTargetActivities = me.selectNextActivities(targetActivity['id']);
                            if (nextTargetActivities.length) {
                                nextActivityIds = [];
                                for (var n = 0, lenn = nextTargetActivities.length; n < lenn; n++) {
                                    nextActivityIds.push(nextTargetActivities[n]['id']);
                                }
                                for (var n = 0, lenn = viewData.views.length; n < lenn; n++) {
                                    if (nextActivityIds.indexOf(viewData.views[n]['root']) != -1) {
                                        viewData.views[n].y = viewData.views[n].y + targetOutDiff;
                                        viewData.views[n].bottom = viewData.views[n].bottom + targetOutDiff;
                                        if (viewData.views[n].parentY) {
                                            viewData.views[n].parentY = viewData.views[n].parentY + targetOutDiff;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    //sourceInHeight 를 포함하여 읽어들인 리스트에 추가한다.
                    loaded.push({
                        sourceActivity: sourceActivity['id'],
                        targetActivity: targetActivity['id'],
                        sourceInHeight: sourceInHeight
                    });
                }
            }
        }

        //액티비티 간의 릴레이션 연결선 제작
        var nextActivityData;
        for (var i = 0, leni = viewData.views.length; i < leni; i++) {
            if (viewData.views[i].type == me.Constants.TYPE.ACTIVITY) {
                activityView = viewData.views[i];
                nextActivityData = me.selectNextActivity(activityView.id);
                if (nextActivityData) {
                    nextActivityView = me.selectViewById(viewData, nextActivityData.id);
                    activityRelView = {
                        id: activityView.id + me.Constants.PREFIX.ACTIVITY_REL,
                        parentId: nextActivityView.id,
                        y: activityView.y,
                        bottom: activityView.y,
                        root: activityView.root,
                        position: activityView.position == me.Constants.POSITION.OTHER ? me.Constants.POSITION.OTHER_OUT : me.Constants.POSITION.MY_OUT,
                        type: me.Constants.TYPE.ACTIVITY_REL,
                        depth: activityView.depth,
                        data: activityView.data,
                        index: activityView.index,
                        transparent: true,
                        parentY: nextActivityView.y
                    };
                    viewData.views.push(activityRelView);
                }
            }
        }

        var insertDuplicate = function (list, obj) {
            if (obj.source && obj.target) {
                var duplicate = false;
                for (var i = 0, leni = list.length; i < leni; i++) {
                    if (list[i].source == obj.source &&
                        list[i].target == obj.target) {
                        duplicate = true;
                        break;
                    }
                }
                if (!duplicate) {
                    list.push(obj);
                }
            }
        };

        //매핑 데이터들 중에서 자식이 없거나 expand 가 false 인 것들을 찾는다.
        var mappingConnects = [], mappingsChild, enableConnect, selfData;
        for (var i = 0, leni = mappings.length; i < leni; i++) {
            enableConnect = false;
            mapping = mappings[i];
            source = mapping['source'];
            target = mapping['target'];
            selfData = me.selectById(source);
            if (selfData) {
                mappingsChild = me.selectChildById(source);
                if (!mappingsChild || !mappingsChild.length) {
                    enableConnect = true;
                }
                if (!selfData.expand) {
                    enableConnect = true;
                }
                if (enableConnect) {
                    var connect = {
                        source: source,
                        target: target
                    };
                    insertDuplicate(mappingConnects, connect);
                }
            }
        }

        //blur 처리를 해제할 view 아이디 리스트를 구한다.
        var mappingHighlights = [];
        for (var i = 0, leni = mappings.length; i < leni; i++) {
            source = mappings[i]['source'];
            target = mappings[i]['target'];

            selfId = source + '-' + target;
            expanderFromId = selfId + me.Constants.PREFIX.EXPANDER_FROM;
            expanderToId = selfId + me.Constants.PREFIX.EXPANDER_TO;
            mappingHighlights.push(selfId);
            mappingHighlights.push(expanderFromId);
            mappingHighlights.push(expanderToId);
        }


        //view 에서 MY_IN 인 것에 한하여,
        //mappingHighlights 에 속한 것에 한하여 blur 처리를 해제한다.
        //mappingConnects 에 해당하는 view 가 있다면 해당 view 의 mirror 와 MAPPING_EDGE 를 생성한다.
        var selfId, expanderFromId, expanderToId, mappingView, parentView;
        for (var i = 0, leni = viewData.views.length; i < leni; i++) {
            var view = viewData.views[i];
            if (view.position == me.Constants.POSITION.MY_IN) {
                if (mappingHighlights.indexOf(view.id) != -1) {
                    view.blur = false;
                }
                for (var c = 0, lenc = mappingConnects.length; c < lenc; c++) {
                    source = mappingConnects[c]['source'];
                    target = mappingConnects[c]['target'];

                    selfId = source + '-' + target;
                    if (view.id == selfId) {
                        parentView = me.selectViewById(viewData, source);
                        if (parentView) {
                            mappingView = {
                                id: selfId + me.Constants.PREFIX.MAPPING_EDGE,
                                parentId: parentView.id,
                                y: view.y,
                                bottom: view.y,
                                root: view.root,
                                position: me.Constants.POSITION.OTHER_MY,
                                type: me.Constants.TYPE.MAPPING_EDGE,
                                depth: view.depth,
                                hasChild: parentView.hasChild,
                                data: JSON.parse(JSON.stringify(view.data)),
                                index: view.index,
                                transparent: true,
                                parentY: parentView.y
                            };
                            viewData.views.push(mappingView);
                        }
                    }
                }
            }
        }

        me._VIEWDATA = viewData;
        return viewData;
    },

    createStandaloneViewData: function (mapping, targetActivityView) {
        //주어진 매핑 데이터에 연관된 매핑으로 이루어진 독립된 공간을 계산하여 리턴한다.
        var me = this, y,
            viewData = {
                totalHeight: 0,
                views: [],
                displayViews: []
            },
            lastViewBottom = 0,
            depthMap = {};

        var getViewData = function (object, depth, parentView, childFromParent) {
            var bottom = 0;
            var expanderView = null;
            var expanderFromView = null;
            var expanderToView = null;
            //최초 depth 는 0 으로 지정.
            if (!depth) {
                depth = 0;
            }
            var sourceId = object.source;
            var targetId = object.target;

            //var child = me.selectChildById(object['id']);
            var childMapping = me.selectChildMapping(sourceId, targetId);
            var view = {
                data: JSON.parse(JSON.stringify(object))
            };
            view.depth = depth;

            //자신과 같은 부모를 가지는 데이터들 중 자신이 첫 번째일 경우, 부모의 y 와 나의 y 를 동기화시킨다.
            //자신과 같은 부모를 가지는 데이터들 중 자신이 인덱스를 등록한다.
            var firstChild = false;
            if (childFromParent && childFromParent.length) {
                for (var i = 0, leni = childFromParent.length; i < leni; i++) {
                    if (childFromParent[0]['id'] == object['id']) {
                        view.index = i;
                        if (i == 0) {
                            firstChild = true;
                        }
                    }
                }
            }

            //폴더일 경우
            if (object['sourceType'] == me.Constants.TYPE.FOLDER) {
                y = firstChild ? parentView.y : lastViewBottom + (me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT / 2);
                bottom = y + (me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT / 2) + me._CONFIG.SHAPE_SIZE.FOLDER_MARGIN;
                view.y = y;
                view.width = me._CONFIG.SHAPE_SIZE.FOLDER_WIDTH;
                view.height = me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT;
                view.bottom = bottom;
                view.root = targetId;
                view.position = me.Constants.POSITION.MY_IN;
                view.id = object['id'];
                view.expand = object['expand'];
                view.type = object['sourceType'];
                view.name = object['name'];
                view.source = sourceId;
                view.target = targetId;
                view.standalone = true;
                view.mapping = true;
                view.selected = object['selected'];
                view.color = object['color'];
                view.stroke = object['stroke'];
                view.tooltip = object['tooltip'];
            }

            //ed 일 경우
            if (object['sourceType'] == me.Constants.TYPE.ED) {
                y = firstChild ? parentView.y : lastViewBottom + (me._CONFIG.SHAPE_SIZE.ED_HEIGHT / 2);
                bottom = y + (me._CONFIG.SHAPE_SIZE.ED_HEIGHT / 2) + me._CONFIG.SHAPE_SIZE.ED_MARGIN;
                view.y = y;
                view.width = me._CONFIG.SHAPE_SIZE.ED_WIDTH;
                view.height = me._CONFIG.SHAPE_SIZE.ED_HEIGHT;
                view.bottom = bottom;
                view.root = targetId;
                view.position = me.Constants.POSITION.MY_IN;
                view.id = object['id'];
                view.expand = object['expand'];
                view.type = object['sourceType'];
                view.name = object['name'];
                view.source = sourceId;
                view.target = targetId;
                view.standalone = true;
                view.mapping = true;
                view.selected = object['selected'];
                view.color = object['color'];
                view.stroke = object['stroke'];
                view.tooltip = object['tooltip'];
            }

            //자식이 있을 경우 hasChild true
            if (childMapping.length) {
                view.hasChild = true;
            }

            //자식이 있을 경우 expanderView 를 등록한다.
            if (childMapping.length) {
                expanderView = {
                    id: view.id + me.Constants.PREFIX.EXPANDER,
                    y: view.y,
                    width: me._CONFIG.SHAPE_SIZE.EXPANDER_WIDTH,
                    height: me._CONFIG.SHAPE_SIZE.EXPANDER_HEIGHT,
                    bottom: view.y + (me._CONFIG.SHAPE_SIZE.EXPANDER_HEIGHT / 2),
                    root: view.root,
                    position: me.Constants.POSITION.MY_IN,
                    type: me.Constants.TYPE.EXPANDER,
                    depth: view.depth,
                    data: view.data,
                    index: view.index,
                    name: view.name,
                    source: view.source,
                    target: view.target,
                    standalone: true
                }
            }
            //자식이 있을 경우 expanderFrom(자신으로부터 expander 까지 연결선) 를 등록한다.
            if (childMapping.length) {
                expanderFromView = {
                    id: view.id + me.Constants.PREFIX.EXPANDER_FROM,
                    y: view.y,
                    bottom: view.y,
                    root: view.root,
                    position: me.Constants.POSITION.MY_IN,
                    type: me.Constants.TYPE.EXPANDER_FROM,
                    depth: view.depth,
                    data: view.data,
                    index: view.index,
                    transparent: true,
                    parentY: view.y,
                    name: view.name,
                    source: view.source,
                    target: view.target,
                    standalone: true
                };
            }
            //부모가 있을 경우 expanderTo(부모 expander 로부터 자신 까지 연결선) 를 등록한다.
            if (parentView) {
                expanderToView = {
                    id: view.id + me.Constants.PREFIX.EXPANDER_TO,
                    parentId: parentView.id,
                    y: view.y,
                    bottom: view.y,
                    root: view.root,
                    position: me.Constants.POSITION.MY_IN,
                    type: me.Constants.TYPE.EXPANDER_TO,
                    depth: view.depth,
                    data: view.data,
                    index: view.index,
                    transparent: true,
                    parentY: parentView.y,
                    name: view.name,
                    source: view.source,
                    target: view.target,
                    standalone: true
                };
            }
            //부모가 없을 경우 가상 expander 로부터 자신 까지 연결선을 등록한다.
            else {
                expanderToView = {
                    id: view.id + me.Constants.PREFIX.EXPANDER_TO,
                    parentId: targetActivityView.id,
                    y: view.y,
                    bottom: view.y,
                    root: view.root,
                    position: me.Constants.POSITION.MY_IN,
                    type: me.Constants.TYPE.EXPANDER_TO,
                    depth: view.depth,
                    data: view.data,
                    index: view.index,
                    transparent: true,
                    parentY: me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT / 2,
                    name: view.name,
                    source: view.source,
                    target: view.target,
                    standalone: true
                };
            }

            //depthMap 에 등록한다.
            if (!depthMap[view.position]) {
                depthMap[view.position] = {}
            }
            if (!depthMap[view.position][view.depth]) {
                depthMap[view.position][view.depth] = []
            }
            depthMap[view.position][view.depth].push(view);

            //자신과 같은 포지션 중 depth 가 같은 리스트를 불러온다.
            //불러온 리스트중 자신보다 앞선 객체가 있다면, 객체의 bottom 기준으로 가상의 view 를 생성해본다.
            //가성의 view 의 bottom 이 실제 view bottom 보다 클 경우 가상의 view 의 y 와 bottom 으로 교체한다.
            var depthList = depthMap[view.position][view.depth];
            if (depthList.length > 1) {
                var vy, vBottom;
                var prevDepthView = depthList[depthList.length - 2];

                //폴더일 경우
                if (object['type'] == me.Constants.TYPE.FOLDER) {
                    vy = prevDepthView.bottom + (me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT / 2);
                    vBottom = vy + (me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT / 2) + me._CONFIG.SHAPE_SIZE.FOLDER_MARGIN;
                }

                //ed 일 경우
                if (object['type'] == me.Constants.TYPE.ED) {
                    vy = prevDepthView.bottom + (me._CONFIG.SHAPE_SIZE.ED_HEIGHT / 2);
                    vBottom = vy + (me._CONFIG.SHAPE_SIZE.ED_HEIGHT / 2) + me._CONFIG.SHAPE_SIZE.ED_MARGIN;
                }

                //가상 view 의 높이 비교 후 교체.
                if (vy && vBottom && vBottom > view.bottom) {
                    view.y = vy;
                    view.bottom = vBottom;
                    if (expanderView) {
                        expanderView.y = vy;
                        expanderView.bottom = vy + (me._CONFIG.SHAPE_SIZE.EXPANDER_HEIGHT / 2);
                    }
                    if (expanderFromView) {
                        expanderFromView.y = vy;
                    }
                    if (expanderToView) {
                        expanderToView.y = vy;
                    }
                }
            }

            //자신의 bottom 을 lastViewBottom 에 등록한다.
            if (view.bottom) {
                lastViewBottom = view.bottom;
            }

            //뷰 데이터에 등록
            viewData.views.push(view);
            if (expanderView) {
                viewData.views.push(expanderView);
            }
            if (expanderFromView) {
                viewData.views.push(expanderFromView);
            }
            if (expanderToView) {
                viewData.views.push(expanderToView);
            }

            //expand 상태라면 자식의 수만큼 루프
            if (childMapping.length && object.expand) {
                for (var c = 0, lenc = childMapping.length; c < lenc; c++) {
                    //parentView 로 보내는 것이 실제 부모가 보내지는 것이 아니라 next 순서로 보내진다.
                    getViewData(childMapping[c], depth + 1, view, childMapping);
                }
            }
        };
        lastViewBottom = 0;

        //mapping.parentId 가 _INCOLLAPSE 에서 expand 처리 되어있는지 본다.
        var rootExpand = true;
        for (var i = 0, leni = me._INCOLLAPSE.length; i < leni; i++) {
            var incollapse = me._INCOLLAPSE[i];
            if (incollapse.sourceActivity == mapping.parentId &&
                incollapse.targetActivity == mapping.target) {
                if (incollapse.collapse) {
                    rootExpand = false;
                }
            }
        }
        //mapping.parentId 에 해당하는 가상의 expander를 생성한다.
        var expanderView = {
            id: mapping.parentId + '-' + mapping.target + me.Constants.PREFIX.EXPANDER,
            y: me._CONFIG.SHAPE_SIZE.FOLDER_HEIGHT / 2,
            width: me._CONFIG.SHAPE_SIZE.EXPANDER_WIDTH,
            height: me._CONFIG.SHAPE_SIZE.EXPANDER_HEIGHT,
            bottom: targetActivityView.y + (me._CONFIG.SHAPE_SIZE.EXPANDER_HEIGHT / 2),
            root: targetActivityView.id,
            position: me.Constants.POSITION.MY_IN,
            type: me.Constants.TYPE.EXPANDER,
            depth: 0,
            data: JSON.parse(JSON.stringify(mapping)),
            index: 0,
            name: targetActivityView.name,
            source: mapping.parentId,
            target: mapping.target,
            standalone: true,
            hasChild: true
        };
        expanderView.data.expand = rootExpand;
        viewData.views.push(expanderView);

        //mapping.parentId 에 해당하는 가상의 expanderFrom을 생성한다.
        var expanderFromView = {
            id: mapping.parentId + '-' + mapping.target + me.Constants.PREFIX.EXPANDER_FROM,
            y: expanderView.y,
            bottom: expanderView.y,
            root: targetActivityView.id,
            position: me.Constants.POSITION.MY_IN,
            type: me.Constants.TYPE.EXPANDER_FROM,
            depth: 0,
            data: JSON.parse(JSON.stringify(mapping)),
            index: 0,
            transparent: true,
            parentY: expanderView.y,
            name: targetActivityView.name,
            source: mapping.parentId,
            target: mapping.target,
            standalone: true,
            hasChild: true
        };
        expanderFromView.data.expand = rootExpand;
        viewData.views.push(expanderFromView);

        if (rootExpand) {
            //주어진 루트매핑 과 같은 parentId 를 쓰는 매핑을 구한다.
            var rootGroup = me.loadByFilter({
                type: me.Constants.TYPE.MAPPING,
                target: mapping.target,
                parentId: mapping.parentId
            });

            for (var i = 0, leni = rootGroup.length; i < leni; i++) {
                getViewData(rootGroup[i], 1);
            }
            viewData.totalHeight = lastViewBottom;
        }
        return viewData;
    },
    /**
     * viewData 중에서 실제로 화면에 표현되야 할 객체를 선정하고 각 x 좌표를 책정한다.
     * 선정된 객체들을 화면에 드로잉한다.
     */
    renderViews: function () {
        var me = this, boundary, depth, type;
        var viewData = me._VIEWDATA;

        //뷰 데이터중 bottom 값이 가장 큰 view 를 찾아 캔버스의 높이를 조정한다. => maxBottom
        var maxBottom = me.selectMaxBottomFromViews(viewData.views);
        if (maxBottom > me._CONFIG.CONTAINER_HEIGHT) {
            //me.canvas.setCanvasSize([canvasSize[0], maxBottom]);
        } else {
            maxBottom = me._CONFIG.CONTAINER_HEIGHT;
        }

        //뷰 데이터의 totalHeight 를 maxBottom 으로 등록한다.
        viewData.totalHeight = maxBottom;

        //캔버스의 현재 스크롤 위치를 바탕으로 나타내야 할 y 범위를 책정한다. => minY, maxY
        //뷰 데이터중 y 범위에 해당하는 것만을 추려낸다. => displayViews
        //뷰 데이터중 parentY 가 있다면, 경우의 수를 추가.
        // 1.parentY 가 스크롤 안에 있을경우
        // 2.y 가 minY 보다 작고 parentY 가 maxY 보다 클 경우
        // 3.parentY 가 minY 보다 작고 y 가 maxY 보다 클 경우
        var displayViews = [];
        var minY = (me._CONTAINER.scrollTop() - me._CONFIG.DISPLAY_MARGIN) * (1 / me.getScale());
        var maxY = (me._CONTAINER.scrollTop() + me._CONFIG.CONTAINER_HEIGHT + me._CONFIG.DISPLAY_MARGIN) * (1 / me.getScale());
        for (var i = 0, leni = viewData.views.length; i < leni; i++) {
            if (viewData.views[i].parentY) {
                var inside = false;
                if (viewData.views[i].y > minY && viewData.views[i].y < maxY) {
                    inside = true;
                }
                if (viewData.views[i].parentY > minY && viewData.views[i].parentY < maxY) {
                    inside = true;
                }
                if (viewData.views[i].y < minY && viewData.views[i].parentY > maxY) {
                    inside = true;
                }
                if (viewData.views[i].parentY < minY && viewData.views[i].y > maxY) {
                    inside = true;
                }
                if (inside) {
                    displayViews.push(viewData.views[i]);
                }
            } else {
                if (viewData.views[i].y > minY && viewData.views[i].y < maxY) {
                    displayViews.push(viewData.views[i]);
                }
            }
        }
        viewData.displayViews = displayViews;

        //캔버스에 현재 존재하는 객체중 y 범위에 해당하는 것을 추리고, 만약 displayViews 에 속해있지 않다면 삭제하도록 한다.
        var currentDisplayShapes = [];
        var allShapes = me._RENDERER.getAllNotEdges();
        for (var i = 0, leni = allShapes.length; i < leni; i++) {
            if (allShapes[i].shape instanceof OG.Area) {
                //Nothing to do
            } else {
                var y = allShapes[i].shape.geom.getBoundary().getCentroid().y;
                if (y > minY && y < maxY) {
                    currentDisplayShapes.push(allShapes[i]);
                }
            }
        }
        var allEdges = me._RENDERER.getAllEdges();
        for (var i = 0, leni = allEdges.length; i < leni; i++) {
            var y = allEdges[i].shape.geom.getVertices()[0].y;
            if (y > minY && y < maxY) {
                currentDisplayShapes.push(allEdges[i]);
            }
        }
        for (var i = 0, leni = currentDisplayShapes.length; i < leni; i++) {
            var existId = currentDisplayShapes[i].id;
            var toRemove = true;
            var haMapping = false;

            for (var c = 0, lenc = displayViews.length; c < lenc; c++) {
                if (displayViews[c].id == existId) {
                    toRemove = false;
                    if (displayViews[c].mapping) {
                        haMapping = true;
                    }
                    break;
                }
            }
            if (toRemove) {
                try {
                    //매핑 관련 라벨은 각 draw메소드에서 실행하도록 하기에 여기서는 삭제하지 않는다.
                    if (currentDisplayShapes[i].id.indexOf(me.Constants.PREFIX.MAPPING_LABEL) == -1 &&
                        currentDisplayShapes[i].id.indexOf(me.Constants.PREFIX.SELECTED_LABEL) == -1) {

                        //삭제할 엘리먼트의 매핑 라벨 엘리먼트가 있다면 함께 삭제한다.
                        me.canvas.removeShape(currentDisplayShapes[i]);
                        //if (me.canvas.getElementById(currentDisplayShapes[i].id + me.Constants.PREFIX.MAPPING_LABEL)) {
                        //    me.canvas.removeShape(currentDisplayShapes[i].id + me.Constants.PREFIX.MAPPING_LABEL);
                        //}
                        if (me.canvas.getElementById(currentDisplayShapes[i].id + me.Constants.PREFIX.SELECTED_LABEL)) {
                            me.canvas.removeShape(currentDisplayShapes[i].id + me.Constants.PREFIX.SELECTED_LABEL);
                        }
                    }
                } catch (e) {
                    //Nothing to do.
                }
            }
        }

        //reRangeAreaSize 를 통해 각 Area 의 영역을 책정한다.
        me.reRangeAreaSize(viewData);


        //추려낸 뷰 데이터 각각의 x 좌표를 Area 영역 기준으로 생성한다.
        var viewsByPosition = me.dividedViewsByPosition(displayViews);
        var otherViews = viewsByPosition[me.Constants.POSITION.OTHER];
        for (var i = 0, leni = otherViews.length; i < leni; i++) {
            otherViews[i].x = Math.round(me._CONFIG.AREA.ACTIVITY_SIZE / 2);
        }

        var otherOutViews = viewsByPosition[me.Constants.POSITION.OTHER_OUT];
        boundary = me._RENDERER.getBoundary(me.AREA.lOut);
        for (var i = 0, leni = otherOutViews.length; i < leni; i++) {
            type = otherOutViews[i].type;
            depth = otherOutViews[i].depth;
            if (type == me.Constants.TYPE.ACTIVITY || type == me.Constants.TYPE.FOLDER || type == me.Constants.TYPE.ED) {
                otherOutViews[i].x = me.getShapeCenterX(me.Constants.POSITION.OTHER_OUT, depth, boundary.getLeftCenter().x);
            }
            else if (type == me.Constants.TYPE.EXPANDER) {
                otherOutViews[i].x = me.getExpanderCenterX(me.Constants.POSITION.OTHER_OUT, depth, boundary.getLeftCenter().x);
            }
            else if (type == me.Constants.TYPE.EXPANDER_FROM) {
                otherOutViews[i].vertieces = me.getExpanderFromVertices(
                    me.Constants.POSITION.OTHER_OUT, depth, boundary.getLeftCenter().x, otherOutViews[i].parentY, otherOutViews[i].y);
            }
            else if (type == me.Constants.TYPE.EXPANDER_TO) {
                otherOutViews[i].vertieces = me.getExpanderToVertices(
                    me.Constants.POSITION.OTHER_OUT, depth, boundary.getLeftCenter().x, otherOutViews[i].parentY, otherOutViews[i].y);
            }
            else if (type == me.Constants.TYPE.ACTIVITY_REL) {
                otherOutViews[i].vertieces = me.getActivityRelVertices(
                    me.Constants.POSITION.OTHER_OUT, depth, boundary.getLeftCenter().x, otherOutViews[i].parentY, otherOutViews[i].y);
            }
        }

        var myInViews = viewsByPosition[me.Constants.POSITION.MY_IN];
        boundary = me._RENDERER.getBoundary(me.AREA.rIn);
        for (var i = 0, leni = myInViews.length; i < leni; i++) {
            type = myInViews[i].type;
            depth = myInViews[i].depth;

            if (type == me.Constants.TYPE.ACTIVITY || type == me.Constants.TYPE.FOLDER || type == me.Constants.TYPE.ED) {
                myInViews[i].x = me.getShapeCenterX(me.Constants.POSITION.MY_IN, depth, boundary.getRightCenter().x);
            }
            else if (type == me.Constants.TYPE.EXPANDER) {
                myInViews[i].x = me.getExpanderCenterX(me.Constants.POSITION.MY_IN, depth, boundary.getRightCenter().x);
            }
            else if (type == me.Constants.TYPE.EXPANDER_FROM) {
                myInViews[i].vertieces = me.getExpanderFromVertices(
                    me.Constants.POSITION.MY_IN, depth, boundary.getRightCenter().x, myInViews[i].parentY, myInViews[i].y);
            }
            else if (type == me.Constants.TYPE.EXPANDER_TO) {
                myInViews[i].vertieces = me.getExpanderToVertices(
                    me.Constants.POSITION.MY_IN, depth, boundary.getRightCenter().x, myInViews[i].parentY, myInViews[i].y);
            }
        }

        var myViews = viewsByPosition[me.Constants.POSITION.MY];
        boundary = me._RENDERER.getBoundary(me.AREA.rAc);
        for (var i = 0, leni = myViews.length; i < leni; i++) {
            myViews[i].x = Math.round(boundary.getLeftCenter().x + (me._CONFIG.AREA.ACTIVITY_SIZE / 2));
        }

        var myOutViews = viewsByPosition[me.Constants.POSITION.MY_OUT];
        boundary = me._RENDERER.getBoundary(me.AREA.rOut);
        for (var i = 0, leni = myOutViews.length; i < leni; i++) {
            type = myOutViews[i].type;
            depth = myOutViews[i].depth;
            if (type == me.Constants.TYPE.ACTIVITY || type == me.Constants.TYPE.FOLDER || type == me.Constants.TYPE.ED) {
                myOutViews[i].x = me.getShapeCenterX(me.Constants.POSITION.MY_OUT, depth, boundary.getLeftCenter().x);
            }
            else if (type == me.Constants.TYPE.EXPANDER) {
                myOutViews[i].x = me.getExpanderCenterX(me.Constants.POSITION.MY_OUT, depth, boundary.getLeftCenter().x);
            }
            else if (type == me.Constants.TYPE.EXPANDER_FROM) {
                myOutViews[i].vertieces = me.getExpanderFromVertices(
                    me.Constants.POSITION.MY_OUT, depth, boundary.getLeftCenter().x, myOutViews[i].parentY, myOutViews[i].y);
            }
            else if (type == me.Constants.TYPE.EXPANDER_TO) {
                myOutViews[i].vertieces = me.getExpanderToVertices(
                    me.Constants.POSITION.MY_OUT, depth, boundary.getLeftCenter().x, myOutViews[i].parentY, myOutViews[i].y);
            }
            else if (type == me.Constants.TYPE.ACTIVITY_REL) {
                myOutViews[i].vertieces = me.getActivityRelVertices(
                    me.Constants.POSITION.MY_OUT, depth, boundary.getLeftCenter().x, myOutViews[i].parentY, myOutViews[i].y);
            }
        }

        var mappingViews = viewsByPosition[me.Constants.POSITION.OTHER_MY];
        for (var i = 0, leni = mappingViews.length; i < leni; i++) {
            type = mappingViews[i].type;
            depth = mappingViews[i].depth;
            mappingViews[i].vertieces = me.getMappingEdgeVertices(
                depth,
                mappingViews[i].parentY,
                mappingViews[i].y,
                me._RENDERER.getBoundary(me.AREA.lOut).getLeftCenter().x,
                me._RENDERER.getBoundary(me.AREA.rIn).getRightCenter().x,
                mappingViews[i].hasChild
            );
        }

        var position, root, id, element, envelope, currentX, currentY, currentEndX, currentEndY,
            moveX, moveY, vertieces, currentVertieces, label;

        //화면에 뷰데이터를 그린다.
        for (var i = 0, leni = displayViews.length; i < leni; i++) {
            //파일구조를 드로잉한다.
            type = displayViews[i].type;
            position = displayViews[i].position;
            id = displayViews[i].id;
            root = displayViews[i].root;
            depth = displayViews[i].depth;
            element = me.canvas.getElementById(id);
            if (element) {
                //선 연결 도형이 아닌경우 도형을 이동시킨다.
                if (type != me.Constants.TYPE.EXPANDER_FROM &&
                    type != me.Constants.TYPE.EXPANDER_TO &&
                    type != me.Constants.TYPE.MAPPING_EDGE &&
                    type != me.Constants.TYPE.ACTIVITY_REL) {
                    envelope = me._RENDERER.getBoundary(element);
                    currentX = envelope.getCentroid().x;
                    currentY = envelope.getCentroid().y;
                    if (currentX != displayViews[i].x || currentY != displayViews[i].y) {
                        moveX = displayViews[i].x - envelope.getCentroid().x;
                        moveY = displayViews[i].y - envelope.getCentroid().y;

                        element.shape.geom.move(moveX, moveY);
                        me._RENDERER.redrawShape(element);
                    }
                }
                //선 연결 도형일 경우 vertices 의 0번째 요소와 마지막 요소를 비교후, x,y 의 차이만큼 이동시킨다.
                else {
                    currentVertieces = element.shape.geom.getVertices();
                    currentX = currentVertieces[0].x;
                    currentY = currentVertieces[0].y;
                    currentEndX = currentVertieces[currentVertieces.length - 1].x;
                    currentEndY = currentVertieces[currentVertieces.length - 1].y;
                    vertieces = displayViews[i].vertieces;
                    if (currentX != vertieces[0][0] || currentY != vertieces[0][1] ||
                        currentEndX != vertieces[vertieces.length - 1][0] ||
                        currentEndY != vertieces[vertieces.length - 1][1]) {
                        if (me.Constants.TYPE.MAPPING_EDGE == type) {
                            if (me._CONFIG.DEFAULT_STYLE.MAPPING_EDGE == 'bezier') {
                                me._RENDERER.drawEdge(new OG.BezierCurve(vertieces), element.shape.geom.style, element.id);
                            } else {
                                element.shape.geom.vertices = vertieces;
                                me._RENDERER.drawEdge(element.shape.geom, element.shape.geom.style, element.id);
                            }
                        } else {
                            if (me._CONFIG.DEFAULT_STYLE.EDGE == 'bezier') {
                                me._RENDERER.drawEdge(new OG.BezierCurve(vertieces), element.shape.geom.style, element.id);
                            } else {
                                element.shape.geom.vertices = vertieces;
                                me._RENDERER.drawEdge(element.shape.geom, element.shape.geom.style, element.id);
                            }
                        }
                    }
                }

                if (type == me.Constants.TYPE.EXPANDER) {
                    me.updateExpander(displayViews[i], element);
                } else if (type == me.Constants.TYPE.ACTIVITY) {
                    me.updateActivity(displayViews[i], element);
                } else if (type == me.Constants.TYPE.FOLDER) {
                    me.updateFolder(displayViews[i], element);
                } else if (type == me.Constants.TYPE.ED) {
                    me.updateEd(displayViews[i], element);
                } else if (type == me.Constants.TYPE.EXPANDER_FROM) {
                    me.updateExpanderLine(displayViews[i], element);
                } else if (type == me.Constants.TYPE.EXPANDER_TO) {
                    me.updateExpanderLine(displayViews[i], element);
                } else if (type == me.Constants.TYPE.ACTIVITY_REL) {
                    me.updateActivityRelLien(displayViews[i]);
                }

            } else {
                //새로 도형을 그린다.
                if (type == me.Constants.TYPE.ACTIVITY) {
                    me.drawActivity(displayViews[i]);
                } else if (type == me.Constants.TYPE.FOLDER) {
                    me.drawFolder(displayViews[i]);
                } else if (type == me.Constants.TYPE.ED) {
                    me.drawEd(displayViews[i]);
                } else if (type == me.Constants.TYPE.EXPANDER) {
                    me.drawExpander(displayViews[i]);
                } else if (type == me.Constants.TYPE.EXPANDER_FROM) {
                    me.drawExpanderLine(displayViews[i]);
                } else if (type == me.Constants.TYPE.EXPANDER_TO) {
                    me.drawExpanderLine(displayViews[i]);
                } else if (type == me.Constants.TYPE.MAPPING_EDGE) {
                    me.drawMappingLine(displayViews[i]);
                } else if (type == me.Constants.TYPE.ACTIVITY_REL) {
                    me.drawActivityRelLine(displayViews[i]);
                }
            }
        }
    },
    labelSubstring: function (label) {
        var length = this._CONFIG.LABEL_MAX_LENGTH;
        if (label) {
            if (label.length <= length) {
                return label;
            } else {
                return label.substring(0, length) + '..';
            }
        }
    },
    updateImageShapeStatus: function (view, element) {
        var me = this;
        var color = view['color'];
        var stroke = view['stroke'];

        /**
         * svg 의 path 들에 컬러와 stroke 를 적용시킨다.
         * @param $svg
         * @param color
         * @param stroke
         */
        var applyPathStyle = function ($svg, color, stroke) {
            $svg.find('path').each(function () {
                //컬러 입히기
                if (color) {
                    var ignoreColor = false;
                    if ($(this).attr('class')) {
                        if ($(this).attr('class').indexOf('ignoreColor') != -1) {
                            ignoreColor = true;
                        }
                    }
                    if (!ignoreColor) {
                        $(this).css('fill', color);
                    }
                }
                //라인 색 입히기
                if (stroke) {
                    var ignoreStroke = false;
                    if ($(this).attr('class')) {
                        if ($(this).attr('class').indexOf('ignoreStroke') != -1) {
                            ignoreStroke = true;
                        }
                    }
                    if (!ignoreStroke) {
                        $(this).css('stroke', stroke);
                    }
                }
            });
        };
        if (!color || color == 'none' || color == '') {
            color = undefined;
        }
        if (!stroke || stroke == 'none' || stroke == '') {
            stroke = undefined;
        }
        if (color || stroke) {
            var $img = $(element).find('image');
            var imgURL = $img.attr('href');
            var attributes = $img.prop("attributes");
            var $svg = $(element).find('svg');
            if (imgURL) {
                if ($svg.length && attributes) {
                    $.each(attributes, function () {
                        $svg.attr(this.name, this.value);
                    });
                    applyPathStyle($svg, color, stroke);

                    // Remove IMG
                    var rElement = me._RENDERER._getREleById(element.id);
                    if (rElement) {
                        var childNodes = rElement.node.childNodes;
                        for (var i = childNodes.length - 1; i >= 0; i--) {
                            if (childNodes[i].tagName == 'image') {
                                me._RENDERER._remove(me._RENDERER._getREleById(childNodes[i].id));
                            }
                        }
                    }
                } else if (attributes) {
                    $.get(imgURL, function (data) {
                        $svg = $(data).find('svg');
                        $svg = $svg.removeAttr('xmlns:a');

                        $.each(attributes, function () {
                            $svg.attr(this.name, this.value);
                        });
                        applyPathStyle($svg, color, stroke);

                        // Replace IMG with SVG
                        var rElement = me._RENDERER._getREleById(element.id);
                        if (rElement) {
                            var childNodes = rElement.node.childNodes;
                            for (var i = childNodes.length - 1; i >= 0; i--) {
                                if (childNodes[i].tagName == 'IMAGE') {
                                    me._RENDERER._remove(this._getREleById(childNodes[i].id));
                                }
                            }
                        }
                        $(element).append($svg);
                    }, 'xml');
                }
            }
        }
    },
    drawMappingLabel: function (view) {
        //var id = view.id + this.Constants.PREFIX.MAPPING_LABEL, size, offset, shape;
        //if (view.mapping) {
        //    size = [12, 14];
        //    offset = [view.x + 10, view.y - 19];
        //    shape = new OG.MLabel();
        //    this.canvas.drawShape(offset, shape, size, null, id);
        //}
        //
        //id = view.id + this.Constants.PREFIX.SELECTED_LABEL;
        //if (view.selected) {
        //    size = [12, 14];
        //    offset = [view.x - 2, view.y - 19];
        //    shape = new OG.SLabel();
        //    this.canvas.drawShape(offset, shape, size, null, id);
        //}
        var id = view.id + this.Constants.PREFIX.SELECTED_LABEL, size, offset, shape;
        if (view.selected) {
            size = [12, 14];
            offset = [view.x + 10, view.y - 19];
            shape = new OG.SLabel();
            this.canvas.drawShape(offset, shape, size, null, id);
        }
    },
    updateMappingLabel: function (view, element, customData) {
        //엘리먼트와 뷰의 위치가 바뀌었을 경우
        //엘리먼트와 뷰의 매핑이 틀릴경우
        //엘리먼트와 뷰의 셀렉트가 틀릴경우 매핑 라벨을 새로 그리도록 한다.
        var enableDraw = false;
        if (customData.x != view.x || customData.y != view.y) {
            enableDraw = true;
        }
        //if (customData.mapping != view.mapping) {
        //    enableDraw = true;
        //}
        if (customData.selected != view.selected) {
            enableDraw = true;
        }
        if (enableDraw) {
            this.canvas.setCustomData(element, JSON.parse(JSON.stringify(view)));

            //var id = view.id + this.Constants.PREFIX.MAPPING_LABEL, size, offset, shape;
            //if (!view.mapping) {
            //    if (this.canvas.getElementById(id)) {
            //        this.canvas.removeShape(id);
            //    }
            //}

            var id = view.id + this.Constants.PREFIX.SELECTED_LABEL;
            if (!view.selected) {
                if (this.canvas.getElementById(id)) {
                    this.canvas.removeShape(id);
                }
            }
            this.drawMappingLabel(view);
        }
    },
    updateActivity: function (view, element) {
        this.updateImageShapeStatus(view, element);
    },
    drawActivity: function (view) {
        var me = this;
        var shape = new OG.Activity(me._CONFIG.SHOW_LABEL ? me.labelSubstring(view.name) : undefined);
        //OTHER_OUT 포지션만 이동이 가능
        if (view.position != me.Constants.POSITION.MY) {
            shape.MOVABLE = false;
        }
        //MOVE_SORTABLE false 일경우 이동 불가
        if (!me._CONFIG.MOVE_SORTABLE) {
            shape.MOVABLE = false;
        }
        var element = me.canvas.drawShape([view.x, view.y], shape, [view.width, view.height], null, view.id);
        me.canvas.setCustomData(element, JSON.parse(JSON.stringify(view)));
        me.updateImageShapeStatus(view, element);
        me.bindDblClickEvent(element);
        me.bindTooltip(element);
        me.bindMappingHighLight(element);
    },
    updateFolder: function (view, element) {
        var customData = this.canvas.getCustomData(element);
        if (customData.blur != view.blur) {
            if (view.blur) {
                this.canvas.setShapeStyle(element, {"opacity": this._CONFIG.DEFAULT_STYLE.BLUR});
            } else {
                this.canvas.setShapeStyle(element, {"opacity": "1"});
            }
            this.canvas.setCustomData(element, JSON.parse(JSON.stringify(view)));
        }
        this.updateImageShapeStatus(view, element);
        this.updateMappingLabel(view, element, customData);
    },
    drawFolder: function (view) {
        var me = this;
        var shape = new OG.Folder(me._CONFIG.SHOW_LABEL ? me.labelSubstring(view.name) : undefined);
        //OTHER_OUT 포지션만 이동이 가능
        if (view.position != me.Constants.POSITION.OTHER_OUT) {
            shape.MOVABLE = false;
        }
        //MAPPING_ENABLE false 일경우 이동 불가
        if (!me._CONFIG.MAPPING_ENABLE) {
            shape.MOVABLE = false;
        }
        var element = me.canvas.drawShape([view.x, view.y], shape, [view.width, view.height], null, view.id);
        me.canvas.setCustomData(element, JSON.parse(JSON.stringify(view)));
        if (view.blur) {
            this.canvas.setShapeStyle(element, {"opacity": me._CONFIG.DEFAULT_STYLE.BLUR});
        }
        me.updateImageShapeStatus(view, element);

        me.drawMappingLabel(view, element);
        me.bindDblClickEvent(element);
        me.bindTooltip(element);
        me.bindMappingHighLight(element);
    },
    updateEd: function (view, element) {
        var customData = this.canvas.getCustomData(element);
        if (customData.blur != view.blur) {
            if (view.blur) {
                this.canvas.setShapeStyle(element, {"opacity": this._CONFIG.DEFAULT_STYLE.BLUR});
            } else {
                this.canvas.setShapeStyle(element, {"opacity": "1"});
            }
            this.canvas.setCustomData(element, JSON.parse(JSON.stringify(view)));
        }
        this.updateImageShapeStatus(view, element);
        this.updateMappingLabel(view, element, customData);
    },
    drawEd: function (view) {
        var me = this;
        var shape = new OG.Ed(me._CONFIG.SHOW_LABEL ? me.labelSubstring(view.name) : undefined);
        //OTHER_OUT 포지션만 이동이 가능
        if (view.position != me.Constants.POSITION.OTHER_OUT) {
            shape.MOVABLE = false;
        }
        //MAPPING_ENABLE false 일경우 이동 불가
        if (!me._CONFIG.MAPPING_ENABLE) {
            shape.MOVABLE = false;
        }
        var element = me.canvas.drawShape([view.x, view.y], shape, [view.width, view.height], null, view.id);
        me.canvas.setCustomData(element, JSON.parse(JSON.stringify(view)));
        if (view.blur) {
            this.canvas.setShapeStyle(element, {"opacity": me._CONFIG.DEFAULT_STYLE.BLUR});
        }
        me.updateImageShapeStatus(view, element);

        me.drawMappingLabel(view, element);
        me.bindDblClickEvent(element);
        me.bindTooltip(element);
        me.bindMappingHighLight(element);
    },
    drawMappingLine: function (view) {
        if (view.vertieces) {
            var me = this;
            var edgeShape = new OG.EdgeShape([0, 0], [0, 0]);
            edgeShape.SELECTABLE = false;
            if (me._CONFIG.DEFAULT_STYLE.MAPPING_EDGE == "bezier") {
                edgeShape.geom = new OG.BezierCurve(view.vertieces);
            } else {
                edgeShape.geom = new OG.PolyLine(view.vertieces);
            }
            var element = me.canvas.drawShape(null, edgeShape, null, null, view.id);
            element.shape.CONNECTABLE = false;
            element.shape.DELETABLE = false;
            me.canvas.setShapeStyle(element, {"arrow-end": "none"});

            me.canvas.setShapeStyle(element, {"stroke-dasharray": "-"});
            me.canvas.setShapeStyle(element, {"opacity": "0.3"});
        }
    },
    /**
     * expander 선연결을 업데이트한다.
     * @param view
     * @param element
     */
    updateExpanderLine: function (view, element) {
        var customData = this.canvas.getCustomData(element);
        if (customData.blur != view.blur) {
            if (view.blur) {
                this.canvas.setShapeStyle(element, {"stroke-dasharray": "-"});
            } else {
                this.canvas.setShapeStyle(element, {"stroke-dasharray": "none"});
            }
            this.canvas.setCustomData(element, JSON.parse(JSON.stringify(view)));
        }
    },
    /**
     * view 데이터로부터 expander 선연결을 생성한다.
     * @param view
     */
    drawExpanderLine: function (view) {
        if (view.vertieces) {
            var me = this;
            var edgeShape = new OG.EdgeShape([0, 0], [0, 0]);
            if (me._CONFIG.DEFAULT_STYLE.EDGE == "bezier") {
                edgeShape.geom = new OG.BezierCurve(view.vertieces);
            } else {
                edgeShape.geom = new OG.PolyLine(view.vertieces);
            }
            var element = me.canvas.drawShape(null, edgeShape, null, null, view.id);
            me.canvas.setCustomData(element, JSON.parse(JSON.stringify(view)));
            element.shape.CONNECTABLE = false;
            element.shape.DELETABLE = false;

            me.canvas.setShapeStyle(element, {"arrow-end": "none"});
            if (view.blur) {
                me.canvas.setShapeStyle(element, {"stroke-dasharray": "-"});
            }
        }
    },
    updateActivityRelLien: function (view, element) {

    },
    drawActivityRelLine: function (view) {
        if (view.vertieces) {
            var me = this;
            var edgeShape = new OG.EdgeShape([0, 0], [0, 0]);
            edgeShape.geom = new OG.PolyLine(view.vertieces);
            var element = me.canvas.drawShape(null, edgeShape, null, null, view.id);
            me.canvas.setCustomData(element, JSON.parse(JSON.stringify(view)));
            element.shape.CONNECTABLE = false;
            element.shape.DELETABLE = false;
        }
    },
    /**
     * expander 를 업데이트한다.
     * @param view
     * @param element
     */
    updateExpander: function (view, element) {
        var href = $(element).find('image').attr('href');
        if (href) {
            if (view.data.expand && href != 'tree/shape/collapse.svg') {
                $(element).find('image').attr('href', 'tree/shape/collapse.svg');
            }
            else if (!view.data.expand && href != 'tree/shape/expand.svg') {
                $(element).find('image').attr('href', 'tree/shape/expand.svg');
            }
        }
    },
    /**
     * view 데이터로부터 expander 를 생성한다.
     * @param view
     */
    drawExpander: function (view) {
        var me = this;
        var element = me.canvas.drawShape([view.x, view.y], new OG.Expander(), [view.width, view.height], null, view.id);
        me.canvas.setCustomData(element, JSON.parse(JSON.stringify(view)));
        me.canvas.setShapeStyle(element, {cursor: "pointer"});

        if (view.data.expand) {
            $(element).find('image').attr('href', 'tree/shape/collapse.svg');
        } else {
            $(element).find('image').attr('href', 'tree/shape/expand.svg');
        }
        $(element).click(function () {

            //매핑 객체이면서 매핑 타켓이 아더에 존재하는 않는 경우 (가상 expander 일 경우)
            if (view.depth == 0 && view.data.type == 'mapping' && !me.selectById(view.data.source)) {
                var hasHistory = false;
                var historyIndex = 0;
                var collapse = false;
                for (var i = 0, leni = me._INCOLLAPSE.length; i < leni; i++) {
                    var inCollapse = me._INCOLLAPSE[i];
                    if (inCollapse.sourceActivity == view.source &&
                        inCollapse.targetActivity == view.target) {
                        hasHistory = true;
                        historyIndex = i;
                        if (inCollapse.collapse) {
                            collapse = true;
                        } else {
                            collapse = false;
                        }
                    }
                }
                if (hasHistory) {
                    me._INCOLLAPSE.splice(historyIndex, 1);
                }
                var history = {
                    sourceActivity: view.source,
                    targetActivity: view.target,
                    collapse: collapse ? false : true
                };
                me._INCOLLAPSE.push(history);

                me.updateData([]);
            }
            //매핑 객체이면서 매핑 타켓이 아더에 존재하는 경우
            else if (view.data.type == 'mapping' && me.selectById(view.data.source)) {
                var data = me.selectById(view.data.source);
                if (!data.expand) {
                    data.expand = true;
                } else {
                    data.expand = false;
                }
                me.updateData([data]);
            }
            //그 외의 경우
            else {
                var data = view.data;
                if (!data.expand) {
                    data.expand = true;
                } else {
                    data.expand = false;
                }
                me.updateData([data]);
            }
        });
    },
    /**
     * expander 도형의 센터를 구한다.
     * @param position
     * @param depth
     * @param standardX
     * @returns {*}
     */
    getExpanderCenterX: function (position, depth, standardX) {
        var me = this;
        var centerX = me.getShapeCenterX(position, depth, standardX);
        var distance = 0;
        if (depth == 0) {
            centerX = standardX;
        } else {
            distance = (me._CONFIG.SHAPE_SIZE.COL_SIZE / 2) + me._CONFIG.SHAPE_SIZE.EXPANDER_FROM_MARGIN;
            if (position == me.Constants.POSITION.MY_OUT || position == me.Constants.POSITION.OTHER_OUT) {
                centerX = centerX + distance;
            } else {
                centerX = centerX - distance;
            }
        }
        return Math.round(centerX);
    },
    /**
     * 액티비티, 폴더, Ed 의 센터를 구한다.
     * @param position
     * @param depth
     * @param standardX
     * @returns {number}
     */
    getShapeCenterX: function (position, depth, standardX) {
        var me = this;
        var distance = 0;
        var centerX = 0;
        if (depth == 0) {
            distance = (me._CONFIG.AREA.ACTIVITY_SIZE / 2) * -1;
        } else {
            distance = depth * (me._CONFIG.SHAPE_SIZE.COL_SIZE + me._CONFIG.SHAPE_SIZE.EXPANDER_FROM_MARGIN + me._CONFIG.SHAPE_SIZE.EXPANDER_TO_MARGIN) -
                me._CONFIG.SHAPE_SIZE.EXPANDER_FROM_MARGIN - (me._CONFIG.SHAPE_SIZE.COL_SIZE / 2);
        }
        if (position == me.Constants.POSITION.MY_OUT || position == me.Constants.POSITION.OTHER_OUT) {
            centerX = standardX + distance;
        } else {
            centerX = standardX - distance;
        }
        return Math.round(centerX);
    },
    getMappingEdgeVertices: function (depth, parentY, myY, pStandardX, myStandardX, hasChild) {
        var me = this;
        var vertieces = [];
        var start = [];
        var end = [];

        if (hasChild) {
            start = [me.getExpanderCenterX(me.Constants.POSITION.OTHER_OUT, depth, pStandardX) + (me._CONFIG.SHAPE_SIZE.EXPANDER_WIDTH / 2), parentY];
            end = [me.getExpanderCenterX(me.Constants.POSITION.MY_IN, depth, myStandardX) - (me._CONFIG.SHAPE_SIZE.EXPANDER_WIDTH / 2), myY];
        } else {
            start = [me.getShapeCenterX(me.Constants.POSITION.OTHER_OUT, depth, pStandardX) + (me._CONFIG.SHAPE_SIZE.FOLDER_WIDTH / 2), parentY];
            end = [me.getShapeCenterX(me.Constants.POSITION.MY_IN, depth, myStandardX) - (me._CONFIG.SHAPE_SIZE.FOLDER_WIDTH / 2), myY];
        }
        vertieces = [
            [Math.round(start[0]), Math.round(start[1])],
            [Math.round((start[0] + end[0]) / 2), Math.round(start[1])],
            [Math.round((start[0] + end[0]) / 2), Math.round(end[1])],
            [Math.round(end[0]), Math.round(end[1])]
        ];
        return vertieces;
    },
    getActivityRelVertices: function (position, depth, standardX, parentY, myY) {
        var me = this;

        var centerX = standardX - me._CONFIG.AREA.ACTIVITY_SIZE / 2;
        var start;
        if (me._CONFIG.SHOW_LABEL) {
            start = [centerX, myY + (me._CONFIG.SHAPE_SIZE.ACTIVITY_HEIGHT / 2) + me._CONFIG.SHAPE_SIZE.ACTIVITY_LABEL_MARGIN];
        } else {
            start = [centerX, myY + (me._CONFIG.SHAPE_SIZE.ACTIVITY_HEIGHT / 2)];
        }
        var end = [centerX, parentY - 15];

        var vertieces = [
            [Math.round(start[0]), Math.round(start[1])],
            [Math.round(end[0]), Math.round(end[1])]
        ];
        return vertieces;
    },
    /**
     * Expander To 선의 vertices 를 구한다.
     * @param position
     * @param depth
     * @param standardX
     * @param parentY
     * @param myY
     * @returns {Array}
     */
    getExpanderToVertices: function (position, depth, standardX, parentY, myY) {
        var me = this;
        var distance = 0;
        var vertieces = [];
        var start = [];
        var end = [];

        var startDistance = me._CONFIG.SHAPE_SIZE.EXPANDER_WIDTH / 2;
        var endDistance = (me._CONFIG.SHAPE_SIZE.FOLDER_WIDTH / 2) * -1;
        //부모의 익스팬더 센터 X
        var parentExCenterX = me.getExpanderCenterX(position, depth - 1, standardX);

        //나의 도형 센터
        var myCenter = me.getShapeCenterX(position, depth, standardX);

        if (position == me.Constants.POSITION.MY_OUT || position == me.Constants.POSITION.OTHER_OUT) {
            start = [parentExCenterX + startDistance, parentY];
            end = [myCenter + endDistance, myY];
        } else {
            start = [parentExCenterX - startDistance, parentY];
            end = [myCenter - endDistance, myY];
        }
        vertieces = [
            [Math.round(start[0]), Math.round(start[1])],
            [Math.round((start[0] + end[0]) / 2), Math.round(start[1])],
            [Math.round((start[0] + end[0]) / 2), Math.round(end[1])],
            [Math.round(end[0]), Math.round(end[1])]
        ];
        return vertieces;
    },
    /**
     * Expander From 선의 vertices 를 구한다.
     * @param position
     * @param depth
     * @param standardX
     * @param parentY
     * @param myY
     * @returns {Array}
     */
    getExpanderFromVertices: function (position, depth, standardX, parentY, myY) {
        if (parentY != myY) {
            //myY = parentY;
        }
        var me = this;
        var distance = 0;
        var vertieces = [];
        var start = [];
        var end = [];
        if (position == me.Constants.POSITION.MY_OUT || position == me.Constants.POSITION.OTHER_OUT) {
            if (depth == 0) {
                start = [standardX - ((me._CONFIG.AREA.ACTIVITY_SIZE - me._CONFIG.SHAPE_SIZE.ACTIVITY_WIDTH) / 2), parentY];
                end = [standardX - (me._CONFIG.SHAPE_SIZE.EXPANDER_WIDTH / 2), myY];
            } else {
                distance = depth * (me._CONFIG.SHAPE_SIZE.COL_SIZE + me._CONFIG.SHAPE_SIZE.EXPANDER_FROM_MARGIN + me._CONFIG.SHAPE_SIZE.EXPANDER_TO_MARGIN) -
                    me._CONFIG.SHAPE_SIZE.EXPANDER_FROM_MARGIN - (me._CONFIG.SHAPE_SIZE.COL_SIZE / 2);
                start = [standardX + distance + (me._CONFIG.SHAPE_SIZE.FOLDER_WIDTH / 2), parentY];
                end = [standardX + distance + ((me._CONFIG.SHAPE_SIZE.COL_SIZE / 2) + me._CONFIG.SHAPE_SIZE.EXPANDER_FROM_MARGIN - (me._CONFIG.SHAPE_SIZE.EXPANDER_WIDTH / 2)), myY];
            }
        } else {
            if (depth == 0) {
                start = [standardX + ((me._CONFIG.AREA.ACTIVITY_SIZE - me._CONFIG.SHAPE_SIZE.ACTIVITY_WIDTH) / 2), parentY];
                end = [standardX + (me._CONFIG.SHAPE_SIZE.EXPANDER_WIDTH / 2), myY];
            } else {
                distance = depth * (me._CONFIG.SHAPE_SIZE.COL_SIZE + me._CONFIG.SHAPE_SIZE.EXPANDER_FROM_MARGIN + me._CONFIG.SHAPE_SIZE.EXPANDER_TO_MARGIN) -
                    me._CONFIG.SHAPE_SIZE.EXPANDER_FROM_MARGIN - (me._CONFIG.SHAPE_SIZE.COL_SIZE / 2);
                start = [standardX - distance - (me._CONFIG.SHAPE_SIZE.FOLDER_WIDTH / 2), parentY];
                end = [standardX - distance - ((me._CONFIG.SHAPE_SIZE.COL_SIZE / 2) + me._CONFIG.SHAPE_SIZE.EXPANDER_FROM_MARGIN - (me._CONFIG.SHAPE_SIZE.EXPANDER_WIDTH / 2)), myY];
            }
        }
        vertieces = [
            [Math.round(start[0]), Math.round(start[1])],
            [Math.round((start[0] + end[0]) / 2), Math.round(start[1])],
            [Math.round((start[0] + end[0]) / 2), Math.round(end[1])],
            [Math.round(end[0]), Math.round(end[1])]
        ];
        return vertieces;
    },
    /**
     * 주어진 views 를 포지션별로 분류하여 리턴한다.
     * @param displayViews
     * @returns {{}}
     */
    dividedViewsByPosition: function (displayViews) {
        var me = this;
        var dividedViewsByPosition = {};
        dividedViewsByPosition[me.Constants.POSITION.MY] = [];
        dividedViewsByPosition[me.Constants.POSITION.MY_IN] = [];
        dividedViewsByPosition[me.Constants.POSITION.MY_OUT] = [];
        dividedViewsByPosition[me.Constants.POSITION.OTHER] = [];
        dividedViewsByPosition[me.Constants.POSITION.OTHER_OUT] = [];
        dividedViewsByPosition[me.Constants.POSITION.OTHER_MY] = [];

        for (var i = 0, leni = displayViews.length; i < leni; i++) {
            if (displayViews[i]['position']) {
                if (displayViews[i]['position'] == me.Constants.POSITION.MY) {
                    dividedViewsByPosition[me.Constants.POSITION.MY].push(displayViews[i]);
                }
                if (displayViews[i]['position'] == me.Constants.POSITION.MY_IN) {
                    dividedViewsByPosition[me.Constants.POSITION.MY_IN].push(displayViews[i]);
                }
                if (displayViews[i]['position'] == me.Constants.POSITION.MY_OUT) {
                    dividedViewsByPosition[me.Constants.POSITION.MY_OUT].push(displayViews[i]);
                }
                if (displayViews[i]['position'] == me.Constants.POSITION.OTHER) {
                    dividedViewsByPosition[me.Constants.POSITION.OTHER].push(displayViews[i]);
                }
                if (displayViews[i]['position'] == me.Constants.POSITION.OTHER_OUT) {
                    dividedViewsByPosition[me.Constants.POSITION.OTHER_OUT].push(displayViews[i]);
                }
                if (displayViews[i]['position'] == me.Constants.POSITION.OTHER_MY) {
                    dividedViewsByPosition[me.Constants.POSITION.OTHER_MY].push(displayViews[i]);
                }
            }
        }
        return dividedViewsByPosition;
    },
    /**
     * 각 Area 의 크기를 책정하고 redraw 한다.
     * 캔버스의 사이즈를 재조정한다.
     * @param viewData
     */
    reRangeAreaSize: function (viewData) {
        //displayViews 중 각 영역의 최고 depth 를 바탕으로 Area 의 크기를 결정한다.
        // ==> 퍼포먼스를 위해 views 검색으로 바꾸도록 조정한다.
        var me = this;
        var boundary, upper, low, left, right, width;
        var containerWidth = me._CONTAINER.width();
        var containerHeight = me._CONFIG.CONTAINER_HEIGHT;

        //viewData 파라미터가 없으면 메모리의 viewData 를 참조한다.
        if (!viewData) {
            viewData = me._VIEWDATA;
        }

        var getAreaWidth = function (views) {
            var maxDepth = me.selectMaxDepthFromViews(views);
            return maxDepth *
                (me._CONFIG.SHAPE_SIZE.COL_SIZE + me._CONFIG.SHAPE_SIZE.EXPANDER_FROM_MARGIN + me._CONFIG.SHAPE_SIZE.EXPANDER_TO_MARGIN) -
                me._CONFIG.SHAPE_SIZE.EXPANDER_FROM_MARGIN + me._CONFIG.SHAPE_SIZE.EXPANDER_TO_MARGIN;
        };

        var viewsByPosition = me.dividedViewsByPosition(viewData['views']);
        var myInAreaWidth = getAreaWidth(viewsByPosition[me.Constants.POSITION.MY_IN]);
        var myOutAreaWidth = getAreaWidth(viewsByPosition[me.Constants.POSITION.MY_OUT]);
        var otherOutAreaWidth = getAreaWidth(viewsByPosition[me.Constants.POSITION.OTHER_OUT]);
        var totalHeight = viewData.totalHeight + me._CONFIG.AREA.BOTTOM_MARGIN;

        upper = 0;
        low = totalHeight;
        left = 0;
        right = me._CONFIG.AREA.lAc.display ? me._CONFIG.AREA.ACTIVITY_SIZE : 0;
        me.fitToBoundary(me.AREA.lAc, [upper, low, left, right]);

        boundary = me._RENDERER.getBoundary(me.AREA.lAc);
        left = left + boundary.getWidth();
        width = (containerWidth * me._CONFIG.AREA.LEFT_SIZE_RATE) - me._CONFIG.AREA.ACTIVITY_SIZE;
        width = width < otherOutAreaWidth ? otherOutAreaWidth : width;
        width = me._CONFIG.AREA.lOut.display ? width : 0;
        right = left + width;
        me.fitToBoundary(me.AREA.lOut, [upper, low, left, right]);

        boundary = me._RENDERER.getBoundary(me.AREA.lOut);
        left = left + boundary.getWidth();
        width = (containerWidth * me._CONFIG.AREA.LEFT_SIZE_RATE) - me._CONFIG.AREA.ACTIVITY_SIZE;
        width = width < myInAreaWidth ? myInAreaWidth : width;
        width = me._CONFIG.AREA.rIn.display ? width : 0;
        right = left + width;
        me.fitToBoundary(me.AREA.rIn, [upper, low, left, right]);

        boundary = me._RENDERER.getBoundary(me.AREA.rIn);
        left = left + boundary.getWidth();
        right = left + me._CONFIG.AREA.ACTIVITY_SIZE;
        right = me._CONFIG.AREA.rAc.display ? right : left;
        me.fitToBoundary(me.AREA.rAc, [upper, low, left, right]);

        boundary = me._RENDERER.getBoundary(me.AREA.rAc);
        left = left + boundary.getWidth();
        width = containerWidth - ((containerWidth * me._CONFIG.AREA.LEFT_SIZE_RATE) * 2);
        width = width < myOutAreaWidth ? myOutAreaWidth : width;
        width = me._CONFIG.AREA.rOut.display ? width : 0;
        right = left + width;
        me.fitToBoundary(me.AREA.rOut, [upper, low, left, right]);

        //센터 프로퍼티를 가진 Area 를 기준으로 재정렬한다.
        var areaList = [
            {area: me.AREA.lAc, center: me._CONFIG.AREA.lAc.center},
            {area: me.AREA.lOut, center: me._CONFIG.AREA.lOut.center},
            {area: me.AREA.rIn, center: me._CONFIG.AREA.rIn.center},
            {area: me.AREA.rAc, center: me._CONFIG.AREA.rAc.center},
            {area: me.AREA.rOut, center: me._CONFIG.AREA.rOut.center}
        ];
        var centerArea = null;
        for (var i = 0, leni = areaList.length; i < leni; i++) {
            if (areaList[i].center) {
                centerArea = areaList[i];
            }
        }
        if (centerArea) {
            boundary = me._RENDERER.getBoundary(centerArea.area);
            var moveX = 0;
            var leftX;
            var rightX;
            var centerX = boundary.getCentroid().x;
            if (centerX < containerWidth / 2) {
                moveX = containerWidth / 2 - centerX;
                for (var c = 0, lenc = areaList.length; c < lenc; c++) {
                    boundary = me._RENDERER.getBoundary(areaList[c].area);
                    leftX = boundary.getLeftCenter().x + moveX;
                    rightX = boundary.getRightCenter().x + moveX;
                    me.fitToBoundary(areaList[c].area, [upper, low, leftX, rightX]);
                }
                //캔버스 사이즈 조정
                right = right + moveX;
            }
        }

        //캔버스의 사이즈를 재조정한다.
        me.canvas.setCanvasSize([right * me.getScale(), totalHeight * me.getScale()]);
    }
    ,
    /**
     * 주어진 Boundary 영역 안으로 공간 기하 객체를 적용한다.(이동 & 리사이즈)
     *
     * @param element
     * @param offset[upper,low,left,right]
     * @return {element} 적용된 엘리먼트
     */
    fitToBoundary: function (element, offset) {
        var boundary = element.shape.geom.boundary,
            newUpper = boundary.getUpperCenter().y - offset[0],
            newLower = offset[1] - boundary.getLowerCenter().y,
            newLeft = boundary.getLeftCenter().x - offset[2],
            newRight = offset[3] - boundary.getRightCenter().x;
        this._RENDERER.resize(element, [newUpper, newLower, newLeft, newRight]);
        return element;
    }
    ,
    //========================================================================//
    //=========================Start Storage Query============================//
    //========================================================================//

    /**
     * 주어진 에어리어에 해당하는 액티비티 정보를 반환한다.
     * @param Area position
     * @returns {Array}
     */
    selectActivityByPosition: function (position) {
        return this.loadByFilter({
            type: this.Constants.TYPE.ACTIVITY,
            position: position
        });
    }
    ,
    /**
     * 주어진 id 의 액티비티의 next 액티비티를 구한다.
     * @param id
     * @returns {*}
     */
    selectNextActivity: function (id) {
        var me = this, nextActivity, activities = [];
        var activity = me.selectById(id);
        if (activity && activity['type'] == me.Constants.TYPE.ACTIVITY) {
            activities = me.loadByFilter({position: activity['position'], type: me.Constants.TYPE.ACTIVITY});
            for (var i = 0, leni = activities.length; i < leni; i++) {
                if (activities[i]['id'] == id) {
                    if (activities[i + 1]) {
                        nextActivity = activities[i + 1];
                    }
                }
            }
        }
        return nextActivity;
    }
    ,
    /**
     * 주어진 id 의 prev 액티비티를 구한다.
     * @param id
     * @returns {*}
     */
    selectPrevActivity: function (id) {
        var me = this, prevActivity;
        var activity = me.selectById(id);
        if (activity && activity['type'] == this.Constants.TYPE.ACTIVITY) {
            if (!me.emptyString(activity['prev'])) {
                prevActivity = me.selectById(activity['prev']);
            }
        }
        return prevActivity;
    }
    ,
    /**
     * 주어진 id 의 next 액티비티들을 구한다.
     * @param id
     * @returns {Array}
     */
    selectNextActivities: function (id) {
        var me = this, nextActivities = [];
        var activity = me.selectById(id);
        if (activity && activity['type'] == me.Constants.TYPE.ACTIVITY) {
            var activities = me.loadByFilter({position: activity['position'], type: me.Constants.TYPE.ACTIVITY});
            var myIndex = -1;
            for (var i = 0, leni = activities.length; i < leni; i++) {
                if (activities[i].id == activity.id) {
                    myIndex = i;
                }
            }
            if (myIndex > -1) {
                for (var i = 0, leni = activities.length; i < leni; i++) {
                    if (i > myIndex) {
                        nextActivities.push(activities[i]);
                    }
                }
            }
        }
        return nextActivities;
    }
    ,
    /**
     * 주어진 아이디의 자식 데이터를 반환한다.
     * @param id
     * @returns {Array}
     */
    selectChildById: function (id) {
        var objects = [];
        if (id) {
            var storage = this._STORAGE;
            for (var key in storage) {
                if (!this.emptyString(storage[key]['parentId']) && storage[key]['parentId'] == id && storage[key]['type'] != this.Constants.TYPE.MAPPING) {
                    objects.push(storage[key]);
                }
            }
        }
        return objects;
    }
    ,
    /**
     * 주어진 소스와 타켓 아이디를 가지는 매핑 데이터의 자식을 반환한다.
     * @param sourceId
     * @param targetId
     * @returns {Array}
     */
    selectChildMapping: function (sourceId, targetId) {
        var objects = [];
        if (!this.emptyString(sourceId)) {
            objects = this.loadByFilter({parentId: sourceId, target: targetId});
        }
        return objects;
    }
    ,
    /**
     * 주어진 소스와 타겟 아이디를 가지는 매핑 데이터의 자식을 재귀호출하여 반환한다.
     * @param sourceId
     * @param targetId
     * @returns {Array}
     */
    selectRecursiveChildMapping: function (sourceId, targetId) {
        var me = this, list = [];
        var findChild = function (sourceId, targetId) {
            var child = me.selectChildMapping(sourceId, targetId);
            for (var i = 0, leni = child.length; i < leni; i++) {
                list.push(child[i]);
                findChild(child[i]['source'], child[i]['target']);
            }
        };
        findChild(sourceId, targetId);
        return list;
    }
    ,
    /**
     * 주어진 아이디의 부모정보를 반환한다.
     * @param id
     * @returns {Object}
     */
    selectParentById: function (id) {
        var object = this.selectById(id);
        if (object) {
            var parentId = object['parentId'];
            if (!this.emptyString(parentId)) {
                return this.selectById(parentId);
            }
        }
    }
    ,
    selectParentMapping: function (sourceId, targetId) {
        var object = this.selectBySourceTarget(sourceId, targetId);
        if (object) {
            var parentSourceId = object['parentId'];
            if (!this.emptyString(parentSourceId)) {
                return this.selectBySourceTarget(parentSourceId, targetId);
            }
        }
    }
    ,
    /**
     * 주어진 아이디의 정보를 반환한다.
     * @param id
     * @returns {*}
     */
    selectById: function (id) {
        if (id) {
            return this._STORAGE[id];
        }
    }
    ,
    selectBySourceTarget: function (sourceId, targetId) {
        var mappings = this.loadByFilter({source: sourceId, target: targetId});
        if (!mappings || !mappings.length) {
            return null;
        } else {
            return mappings[0];
        }
    }
    ,
    /**
     * 매핑 데이터를 반환한다.
     * @returns {Array}
     */
    selectMappings: function () {
        var storage = this._STORAGE;
        var mappings = [];
        for (var key in storage) {
            if (storage[key]['type'] == this.Constants.TYPE.MAPPING) {
                mappings.push(storage[key]);
            }
        }
        return mappings;
    }
    ,
    /**
     * 주어진 아이디의 루트 액티비티 정보를 반환한다.
     * @param id
     * @returns {*}
     */
    selectRootActivityById: function (id) {
        var me = this;
        var root;
        var findParent = function (id) {
            var parent = me.selectParentById(id);
            if (parent) {
                findParent(parent['id']);
            } else {
                root = me.selectById(id);
                if (root && !root['type'] == me.Constants.TYPE.ACTIVITY) {
                    root = null;
                }
            }
        };
        findParent(id);
        return root;
    }
    ,
    /**
     * 매핑 데이터의 루트를 반환한다.
     * @param sourceId
     * @param targetId
     * @returns {*}
     */
    selectRootMapping: function (sourceId, targetId) {
        var me = this;
        var rootMapping;
        var findParent = function (sourceId) {
            var parent = me.selectParentMapping(sourceId, targetId);
            if (parent) {
                findParent(parent['source']);
            } else {
                rootMapping = me.selectBySourceTarget(sourceId, targetId);
            }
        };
        findParent(sourceId);
        return rootMapping;
    }
    ,
    /**
     * 주어진 아이디의 부모 일람을 재귀호출하여 반환한다.
     * @param id
     * @returns {Array}
     */
    selectRecursiveParentById: function (id) {
        var me = this, list = [];
        var findParent = function (id) {
            var parent = me.selectParentById(id);
            if (parent) {
                list.push(parent);
                findParent(parent['id']);
            }
        };
        findParent(id);
        return list;
    }
    ,
    /**
     * 주어진 아이디의 자식 데이터를 재귀호출하여 반환한다.
     * @param id
     * @returns {Array}
     */
    selectRecursiveChildById: function (id) {
        var me = this, list = [];
        var findChild = function (id) {
            var child = me.selectChildById(id);
            for (var i = 0, leni = child.length; i < leni; i++) {
                list.push(child[i]);
                findChild(child[i]['id']);
            }
        };
        findChild(id);
        return list;
    }
    ,
    /**
     * 주어진 아이디의 자식 데이터를 재귀호출하여, 더이상 자식이 없는 마지막 데이터일 경우의 리스트를 반환한다.
     * (자기 자신이 마지막 데이터일 경우 자기 자신을 포함하여)
     * @param id
     * @returns {Array}
     */
    selectRecursiveLastChildById: function (id) {
        var me = this, list = [];
        var findChild = function (id) {
            var child = me.selectChildById(id);
            if (!child.length) {
                var self = me.selectById(id);
                if (self) {
                    list.push(self);
                }
            } else {
                for (var i = 0, leni = child.length; i < leni; i++) {
                    findChild(child[i]['id']);
                }
            }
        };
        findChild(id);
        return list;
    }
    ,

    /**
     * 주어진 아이디에 해당하는 뷰 데이터를 반환한다.
     * @param viewData
     * @param id
     * @returns {*}
     */
    selectViewById: function (viewData, id) {
        var view;
        if (viewData && viewData['views'] && id) {
            for (var i = 0, leni = viewData['views'].length; i < leni; i++) {
                if (viewData['views'][i]['id'] == id) {
                    view = viewData['views'][i];
                    break;
                }
            }
        }
        return view;
    }
    ,
    /**
     * 주어진 필터 조건에 따라 뷰데이터를 반환한다.
     * @param viewData
     * @param filterData
     * @returns {Array}
     */
    selectViewByFilter: function (viewData, filterData) {
        var data = [];
        var view;
        if (viewData && viewData['views']) {
            for (var i = 0, leni = viewData['views'].length; i < leni; i++) {
                var toAdd = true;
                view = viewData['views'][i];
                for (var filterKey in filterData) {
                    //하나라도 필터 조건이 맞지 않다면 추가하지 않도록 한다.
                    if (view[filterKey] != filterData[filterKey]) {
                        toAdd = false;
                    }
                }
                if (toAdd) {
                    data.push(view);
                }
            }
        }
        return data;
    }
    ,
    /**
     * 주어진 아이디의 자식 뷰 데이터를 재귀호출하여 반환한다.
     * @param viewData
     * @param id
     * @returns {Array}
     */
    selectRecursiveChildViewsById: function (viewData, id) {
        var me = this, views = [], view, childIdList = [];
        if (viewData && id) {
            var child = me.selectRecursiveChildById(id);
            if (child && child.length) {
                for (var c = 0, lenc = child.length; c < lenc; c++) {
                    childIdList.push(child[c]['id']);
                }
                for (var i = 0, leni = viewData['views'].length; i < leni; i++) {
                    view = viewData['views'][i];
                    if (childIdList.indexOf(view['id']) != -1) {
                        views.push(view);
                    }
                }
            }
        }
        return views;
    }
    ,
    /**
     * 주어진 views 중 가장 큰 y 를 반환한다.
     * @param views
     * @returns {number}
     */
    selectMaxyFromViews: function (views) {
        var maxY = 0;
        for (var i = 0, leni = views.length; i < leni; i++) {
            if (views[i].y) {
                if (views[i].y > maxY) {
                    maxY = views[i].y;
                }
            }
        }
        return maxY;
    }
    ,
    /**
     * 주어진 views 중 가장 큰 depth 를 반환한다.
     * @param views
     * @returns {number}
     */
    selectMaxDepthFromViews: function (views) {
        var maxDepth = 0;
        for (var i = 0, leni = views.length; i < leni; i++) {
            if (views[i].depth) {
                if (views[i].depth > maxDepth) {
                    maxDepth = views[i].depth;
                }
            }
        }
        return maxDepth;
    }
    ,
    selectMaxBottomFromViews: function (views) {
        var maxBottom = 0;
        for (var i = 0, leni = views.length; i < leni; i++) {
            if (views[i].bottom) {
                if (views[i].bottom > maxBottom) {
                    maxBottom = views[i].bottom;
                }
            }
        }
        return maxBottom;
    }

    //========================================================================//
    //=================================Utils==================================//
    //========================================================================//
    ,
    /**
     * 주어진 스트링이 빈값인지를 확인한다.
     * @param value
     * @returns {boolean}
     */
    emptyString: function (value) {
        if (typeof value == 'undefined') {
            return true;
        }
        if (!value) {
            return true;
        }
        if (
            (value.length == 0)
            ||
            (value == "")
            ||
            (value.replace(/\s/g, "") == "")
            ||
            (!/[^\s]/.test(value))
            ||
            (/^\s*$/.test(value))
        ) {
            return true;
        }
        return false;
    }
    ,
    /**
     * 좌표값을 포함하는 가장 앞단의 엘리먼트를 반환한다.
     * @param point
     * @returns {*}
     */
    getElementByPoint: function (point) {
        var me = this;
        var elements = me._RENDERER.getAllNotEdges();
        var element;
        for (var i = 0, leni = elements.length; i < leni; i++) {
            if (elements[i].shape.geom.getBoundary().isContains(point)) {
                element = elements[i];
            }
        }
        return element;
    }
    ,
    /**
     * 무작위 랜덤 아이디 생성
     * @returns {string}
     */
    uuid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    ,

    //========================================================================//
    //=================================Event==================================//
    //========================================================================//
    bindEvent: function () {
        var me = this;
        if (me._CONFIG.MAPPING_ENABLE) {
            me.bindMappingEvent();
        }
        if (me._CONFIG.MOVE_SORTABLE) {
            me.bindActivityMove();
        }
        me.enableShapeContextMenu();
    }
    ,
    bindTooltip: function (element) {
        var me = this;
        var view = me.selectViewById(me._VIEWDATA, element.id);
        if (view) {
            var text = view.tooltip ? view.tooltip : view.name;
            var tooltip =
                $('<div class="og-tooltip ui-tooltip ui-widget ui-corner-all" id="' + element.id + '-tooltip">' +
                    '<div class="ui-tooltip-content">' + text + '</div>' +
                    '</div>');
            tooltip.css({
                position: 'absolute'
            });
            $(element).bind('mouseover', function (event) {
                $('.og-tooltip').remove();
                tooltip.css({
                    'top': event.pageY,
                    'left': event.pageX,
                    'background-color': '#333',
                    'color': 'whitesmoke',
                    'font-size': '12px'
                });
                $('body').append(tooltip);
            });
            $(element).bind('mouseout', function () {
                if (tooltip) {
                    tooltip.remove();
                }
            });
        }
    }
    ,
    bindDblClickEvent: function (element) {
        var me = this;
        $(element).unbind('dblclick');
        $(element).bind({
            'dblclick': function () {
                var id = element.id;
                var view = me.selectViewById(me._VIEWDATA, id);
                if (!view || !view.data) {
                    return;
                }
                //뷰 타입이 액티비티,폴더,ED 가 아닐경우 리턴
                if (view.type != me.Constants.TYPE.ACTIVITY &&
                    view.type != me.Constants.TYPE.FOLDER &&
                    view.type != me.Constants.TYPE.ED) {
                    return;
                }
                var data = me.selectById(view.data.id);
                if (!data) {
                    return;
                }
                me.onShowProperties(data, view);
            }
        });
    }
    ,
    bindMappingHighLight: function (element) {
        //나를 매핑으로 가져다 쓰는 것이 있는지 검색
        //매핑 자식들을 찾는다.
        var me = this;
        var edge;
        var allEdges;
        var mappings;
        var getChildMapping = function (elementId) {
            var childMapping = [];
            var highLightEdgeIds = [];
            var view = me.selectViewById(me._VIEWDATA, elementId);
            //미러가 아니고, 매핑요소인 것
            if (view && view.data && view.data.type == me.Constants.TYPE.MAPPING) {
                childMapping = me.selectRecursiveChildMapping(view.data['source'], view.data['target']);

                //자기자신도 추가한다.
                childMapping.push(view.data);
                for (var i = 0, leni = childMapping.length; i < leni; i++) {
                    highLightEdgeIds.push(childMapping[i].id + me.Constants.PREFIX.MAPPING_EDGE);
                }
            }
            //나를 가져다 쓰는 매핑요소의 검색
            else if (view && view.data) {
                if (view.type == me.Constants.TYPE.ACTIVITY ||
                    view.type == me.Constants.TYPE.FOLDER ||
                    view.type == me.Constants.TYPE.ED) {
                    mappings = me.loadByFilter({source: view.data.id});
                    for (var c = 0, lenc = mappings.length; c < lenc; c++) {
                        childMapping = me.selectRecursiveChildMapping(mappings[c]['source'], mappings[c]['target']);

                        //자기자신도 추가한다.
                        childMapping.push(mappings[c]);
                        for (var i = 0, leni = childMapping.length; i < leni; i++) {
                            highLightEdgeIds.push(childMapping[i].id + me.Constants.PREFIX.MAPPING_EDGE);
                        }
                    }

                }
            }
            return highLightEdgeIds;
        };
        $(element).bind('mouseover', function (event) {
            var edgeIds = getChildMapping(element.id);
            for (var c = 0, lenc = edgeIds.length; c < lenc; c++) {
                edge = me.canvas.getElementById(edgeIds[c]);
                if (edge) {
                    me.canvas.setShapeStyle(edge, {
                        "stroke": "RGB(66,139,202)",
                        "stroke-width": "3",
                        "stroke-dasharray": "",
                        "opacity": "0.7"
                    });
                }
            }
        });
        $(element).bind('mouseout', function () {
            allEdges = me._RENDERER.getAllEdges();
            for (var c = 0, lenc = allEdges.length; c < lenc; c++) {
                if (allEdges[c].id.indexOf(me.Constants.PREFIX.MAPPING_EDGE) != -1) {
                    me.canvas.setShapeStyle(allEdges[c], {
                        "stroke": "black",
                        "stroke-width": "1.5",
                        "stroke-dasharray": "-",
                        "opacity": "0.3"
                    });
                }
            }
        });
    }
    ,
    bindActivityMove: function () {
        var me = this;
        var eventX, eventY, targetEle, targetView, source, target, position, activityViews, area;
        me.canvas.onMoveShape(function (event, shapeElement, offset) {
            var view = me.selectViewById(me._VIEWDATA, shapeElement.id);
            if (view.type == me.Constants.TYPE.ACTIVITY) {
                position = view.position;
                eventX = shapeElement.shape.geom.getBoundary().getCentroid().x;
                eventY = shapeElement.shape.geom.getBoundary().getCentroid().y;
                activityViews = me.selectViewByFilter(me._VIEWDATA,
                    {
                        type: me.Constants.TYPE.ACTIVITY,
                        position: position
                    });

                var enableSort = true;
                //해당 에어리어 영역 인지 알아본다.
                area = position == me.Constants.POSITION.OTHER ? me.AREA.lAc : me.AREA.rAc;
                if (!area) {
                    enableSort = false;
                }
                if (!area.shape.geom.getBoundary().isContains([eventX, eventY])) {
                    enableSort = false;
                }
                //원래 상태로 원복
                shapeElement.shape.geom.move(-(offset[0]), -(offset[1]));
                me._RENDERER.redrawShape(shapeElement);

                if (!enableSort) {
                    return;
                }

                //activityViews 의 인덱스를 재정립한다.
                var sorted = [];
                for (var i = 0, leni = activityViews.length; i < leni; i++) {
                    var y = activityViews[i].y;
                    if (activityViews[i].id == view.id) {
                        y = eventY;
                        activityViews[i].y = y;
                    }
                    var pushed = false;
                    for (var c = 0, lenc = sorted.length; c < lenc; c++) {
                        //sorted 중에서 나의 y 가 더 작다면 중간에 삽입
                        if (sorted[c].y > y) {
                            sorted.splice(c, 0, activityViews[i]);
                            pushed = true;
                            break;
                        }
                    }
                    if (!pushed) {
                        sorted.push(activityViews[i]);
                    }
                }
                var activities = [];
                for (var i = 0, leni = sorted.length; i < leni; i++) {
                    var data = JSON.parse(JSON.stringify(me.selectById(sorted[i].id)));
                    if (data) {
                        activities.push(data);
                    }
                }
                //1.선 중복 버그 => 이것은.... 스탠드어론 객체 디스플레이가 남아있어서 일어나는 문제이다. ==> ok.
                //2.expander 미러된 쪽에서 안움직임. ==> ok.
                //부모 창 제어.done
                //선 하이라이트. done.

                //모니터 화면 만들 것. ok.
                //1. 같은 로직, 마이 데이터만 부른다.ok
                //2. 에어리어 부분의 디스에이블 처리 과정이 있어야 한다.ok

                //워크플로우 - 액티비티 관게를 표현할 그리드 창 만들기. OK
                //각 아이템마다, 말풍선은 넘버와 name 이 표기되면 된다. OK.
                //라벨 on / off 옵션 OK.
                //상단 정보창 접었다 핌 OK.

                //3.전체 크기 늘이기. ok
                //스테이터스 범례조건. ok

                //ed 개별 추가시 메소드 붙이기.ok
                //창 이동시에 사이즈 부모 창 재조절이 필요함.ok

                //모니터 팝업이 다이렉트로 뜰 경우 창 크기 제어하기.ok

                //액티비티 생성 체크 로직.ok
                //properties => details.ok

                //상단 기본정보창 워크플로우 정보 바인딩.ok
                //접을때 툴바 버튼 살리기.ok
                //매핑 또는 리프레쉬 시에 선 스타일 변경.ok
                //가상 expanderFrom 생성하기.ok
                //상단 검색 조건 이상하게 보이는 것.ok
                //툴바 아이콘 적용하기.ok
                //검증 메소드 추가하기.ok
                //IE 전환 살펴보기.ok
                //pick ed 화면 ed number, ed name 필드 추가하기.ok
                //expand 상태 기억하게 하기(aras 에서 데이터 업데이트 하기 전에 조치해야 함).ok
                //IE 라벨 살펴보기.ok
                //액티비티,ed,폴더 생성시 현재 유저 아이디 적용.ok
                //EDB 도트 확실하게 보이게 하기.(svg 다시 만들어 테스트).ok
                //줌 인 아웃시에 캔버스 사이즈도 변경하기.ok
                //줌 인의 기준이 현재 스크롤 상태에서 부터 확대하기.ok
                //Area 라벨 표기 하기.ok
                //스탠다드, 폴더 3레벨 까지 enable, 3레벨 일 경우는 ed 생성 불가.ok
                //프로젝트, 폴더 5레벨 까지 enable, 5레벨 일 경우는 ed 생성 불가.ok
                //계획일, 완료일, 수정일 소트(_first_start_date, _final_end_date, modified_date).ok
                //스테이터스 컬러 재조정하기.ok
                //셀릭트 패널 크기 줄이기.ok
                //툴팁 사람 이름 추가하기.ok
                //스테이터스 컬러 재조정하기.ok

                //스탠다드일때는 owner 이름 안보이게.ok
                //start,end 버튼 가리기.ok
                //모니터에 My Workflow 가리기.ok
                //데이터 리프레쉬 할때 포지션 배포가 섞임.ok

                //폴더 하나만 가진 액티비티 리스트가 있을 경우 선이 깨짐.ok
                //depth, ed 하나 늘리기.ok
                //m 라벨 지우기.ok
                //picked, 또는 Structure 불러올때 카운트 1 처리하기.ok
                //액티비티가 하나일때는 표현이 안되는 문제.ok
                //순서를 재정렬 하고 난 이후에는 콘텍스트가 안먹힘.ok
                //우클릭 했을때 포커싱이 같이 갈 수 있도록.ok
                //In의 루트 폴더 와 Activity 연결선 실선으로 바꾸기.ok

                //TODO
                //상단 창 더 줄이기.
                //부모창에 겹친 스크롤바 지우기.

                //before 이벤트
                var beforeActivityMove = me.onBeforeActivityMove(activities);
                if (typeof beforeActivityMove == 'boolean') {
                    if (!beforeActivityMove) {
                        return;
                    }
                }

                me.removeDataByFilter({
                    type: me.Constants.TYPE.ACTIVITY,
                    position: position
                });
                me.updateData(activities, true);
                me.render();

                me.onActivityMove(activities);
            }
        });
    }
    ,
    onBeforeActivityMove: function (activities) {
        console.log(activities);
    }
    ,
    onActivityMove: function (activities) {
        console.log(activities);
    }
    ,
    bindMappingEvent: function () {
        var me = this;
        var eventX, eventY, targetEle, targetView, source, target;
        me.canvas.onMoveShape(function (event, shapeElement, offset) {
            var view = me.selectViewById(me._VIEWDATA, shapeElement.id);
            if (view.position == me.Constants.POSITION.OTHER_OUT) {
                eventX = shapeElement.shape.geom.getBoundary().getCentroid().x;
                eventY = shapeElement.shape.geom.getBoundary().getCentroid().y;

                //원래 상태로 원복
                shapeElement.shape.geom.move(-(offset[0]), -(offset[1]));
                me._RENDERER.redrawShape(shapeElement);

                targetEle = me.getElementByPoint([eventX, eventY]);
                if (!targetEle) {
                    return;
                }
                targetView = me.selectViewById(me._VIEWDATA, targetEle.id);
                if (!targetView || targetView.position != me.Constants.POSITION.MY) {
                    return;
                }
                target = me.selectById(targetView.data.id);
                source = me.selectById(shapeElement.id);
                if (!target || !source) {
                    return;
                }

                //  selected 가 실제 사용자가 선택한 매핑요소이고,그 여파로 부모폴더(재귀호출) 과 자식들(재귀호출은) 레코드를 생성한다.

                //  폴더 매핑일 경우 부모 폴더의 selected 는 빈 스트링으로 처리한다.
                //  폴더 매핑일 경우 자식들의 폴더(재귀호출)은 selected ’S’ 처리한다.
                //
                //  Ed 매핑일 경우 ed 의 부모 폴더 하나만 selected S 처리한다.
                //  Ed 매핑일 경우 나머지 부모 폴더는 selected 빈 스트링 처리한다.


                //매핑 데이터 생성
                var parentData = me.selectParentById(source.id);
                var mappingData = {
                    id: source.id + '-' + target.id,
                    type: me.Constants.TYPE.MAPPING,
                    source: source.id,
                    sourceType: source.type,
                    target: target.id,
                    position: me.Constants.POSITION.MY_IN,
                    extData: {},
                    name: source.name,
                    parentId: parentData ? parentData.id : undefined
                };
                //폴더 드래그일 경우 폴더를 selected 처리.
                if (source.type == me.Constants.TYPE.FOLDER) {
                    mappingData.selected = true;
                }
                //드래그 된 대상 업데이트
                me.updateData([mappingData], true);

                //ED 드래그 일 경우 부모 폴더를 대상으로 선정과 동시에 selected 처리한다.
                var edDrag = false;
                var standardFolder;
                if (source.type == me.Constants.TYPE.ED) {
                    edDrag = true;
                    standardFolder = me.selectParentById(source.id);
                    if (standardFolder && standardFolder.type == me.Constants.TYPE.FOLDER) {
                        parentData = me.selectParentById(standardFolder.id);
                        mappingData = {
                            id: standardFolder.id + '-' + target.id,
                            type: me.Constants.TYPE.MAPPING,
                            source: standardFolder.id,
                            sourceType: source.type,
                            target: target.id,
                            position: me.Constants.POSITION.MY_IN,
                            extData: {},
                            name: source.name,
                            selected: true,
                            parentId: parentData ? parentData.id : undefined
                        };
                        me.updateData([mappingData], true);
                    }
                } else {
                    standardFolder = source;
                }

                //스탠다드 폴더의 하위객체를 모두 담도록 한다.
                var selectedTargetList = [];
                if (standardFolder && standardFolder.type == me.Constants.TYPE.FOLDER) {

                    selectedTargetList.push(standardFolder.id);

                    //자식들(재귀호출) 의 매핑데이터를 생성하고, 폴더는 selected 처리한다.
                    //ED 드래그일 경우는 자식들의 매핑데이터를 생성하지 않는다.
                    var child = me.selectRecursiveChildById(standardFolder.id);
                    var childMapping;
                    if (!edDrag) {
                        for (var i = 0, leni = child.length; i < leni; i++) {
                            //폴더일 경우 aras 로 보낸다.
                            if (child[i].type == me.Constants.TYPE.FOLDER) {
                                selectedTargetList.push(child[i].id);
                            }
                            parentData = me.selectParentById(child[i].id);
                            childMapping = {
                                id: child[i].id + '-' + target.id,
                                type: me.Constants.TYPE.MAPPING,
                                source: child[i].id,
                                sourceType: child[i].type,
                                target: target.id,
                                position: me.Constants.POSITION.MY_IN,
                                name: child[i].name,
                                extData: {},
                                parentId: parentData ? parentData.id : undefined
                            };
                            if (child[i].type == me.Constants.TYPE.FOLDER) {
                                childMapping.selected = true;
                            }
                            me.updateData([childMapping], true);
                        }
                    }

                    //부모들(재귀호출) 의 매핑데이터를 생성한다. 매핑데이터가 이미 있다면 추가하지 않는다.(selected 보존을 위해서이다.)
                    var parentMapping, existMapping;
                    var parents = me.selectRecursiveParentById(standardFolder.id);
                    for (var i = 0, leni = parents.length; i < leni; i++) {
                        if (parents[i].type == me.Constants.TYPE.FOLDER) {
                            parentData = me.selectParentById(parents[i].id);
                            parentMapping = {
                                id: parents[i].id + '-' + target.id,
                                type: me.Constants.TYPE.MAPPING,
                                source: parents[i].id,
                                sourceType: parents[i].type,
                                target: target.id,
                                position: me.Constants.POSITION.MY_IN,
                                name: parents[i].name,
                                extData: {},
                                parentId: parentData ? parentData.id : undefined
                            };
                            existMapping = me.loadByFilter({id: parents[i].id + '-' + target.id});
                            if (!existMapping || !existMapping.length) {
                                me.updateData([parentMapping], true);
                            }
                        }
                    }
                }

                var beforeMapping = me.onBeforeMapping(source, target, selectedTargetList);
                if (typeof beforeMapping == 'boolean') {
                    if (!beforeMapping) {
                        return;
                    }
                }

                me.render();
                me.onMapping(source, target, selectedTargetList);
            }
        });
    }
    ,
    deleteMapping: function (data, view) {
        //매핑 삭제 로직을 만든다.
        //자기자신을 삭제한다.
        //자식들에 대한 매핑을 삭제한다.
        //부모 일람중에, 부모의 자식들 중 매핑요소가 없다면 매핑을 삭제한다.
        var me = this;
        var source = data.source;
        var target = data.target;
        var sourceType = data.sourceType;
        var targetType = me.Constants.TYPE.ACTIVITY;
        var mappingId = source + '-' + target;

        //onBeforeDeleteMapping 이벤트 발생
        var beforeDelete = me.onBeforeDeleteMapping(source, sourceType, target, targetType);
        if (typeof beforeDelete == 'boolean') {
            if (!beforeDelete) {
                return;
            }
        }

        //자기 자신 삭제
        me.removeDataByFilter({id: mappingId});

        //자식들에 대한 매핑 삭제
        var child = me.selectRecursiveChildById(source);
        for (var i = 0, leni = child.length; i < leni; i++) {
            mappingId = child[i].id + '-' + target;
            me.removeDataByFilter({id: mappingId});
        }

        //부모에 대한 매핑 삭제
        var parentsChild;
        var parents = me.selectRecursiveParentById(source);
        for (var i = 0, leni = parents.length; i < leni; i++) {
            var hasChildMapping = false;
            mappingId = parents[i].id + '-' + target;
            parentsChild = me.selectChildById(parents[i].id);
            for (var c = 0, lenc = parentsChild.length; c < lenc; c++) {
                var parentChildMapping = me.loadByFilter({id: parentsChild[c].id + '-' + target});
                if (parentChildMapping && parentChildMapping.length) {
                    hasChildMapping = true;
                }
            }
            if (!hasChildMapping) {
                me.removeDataByFilter({id: mappingId});
            }
        }
        me.render();

        //onDeleteMapping  이벤트 발생
        me.onDeleteMapping(source, sourceType, target, targetType);
    }
    ,

    /**
     * Shape 에 마우스 우클릭 메뉴를 가능하게 한다.
     */
    enableShapeContextMenu: function () {
        // 3.Save
        //  중요. Save 시에, 데이터 변화 리스트중에서, 삭제에 관련한 항목을 먼저 실행 후, CRU 에 대한걸 처리하도록 한다.

        var me = this;
        $.contextMenu({
            position: function (opt, x, y) {
                opt.$menu.css({top: y + 10, left: x + 10});
            },
            selector: '#' + me._RENDERER.getRootElement().id + ' [_type=SHAPE]',
            build: function ($trigger, event) {
                var items = {};
                $(me._RENDERER.getContainer()).focus();
                var element = $trigger[0];
                var id = element.id;
                var view = me.selectViewById(me._VIEWDATA, id);

                if (!view || !view.data) {
                    return false;
                }
                //뷰 타입이 액티비티,폴더,ED 가 아닐경우 리턴
                if (view.type != me.Constants.TYPE.ACTIVITY &&
                    view.type != me.Constants.TYPE.FOLDER &&
                    view.type != me.Constants.TYPE.ED) {
                    return false;
                }
                var data = me.selectById(view.data.id);
                if (!data) {
                    return false;
                }
                me.selectedView = view;
                me.selectedData = data;

                //선택된 엘리먼트 셀렉트
                if ($(element).attr("_selected") === "true") {
                    me._HANDLER.deselectShape(element);
                    me._HANDLER.selectShape(element);
                } else {
                    me._HANDLER.selectShape(element);
                }


                //폴더,ED 생성 및 삭제
                if (view.position == me.Constants.POSITION.MY || view.position == me.Constants.POSITION.MY_OUT) {
                    var enableCreateEd = true;
                    var enableCreateFolder = true;
                    var enableDelete = true;
                    var child = me.selectChildById(data.id);

                    //하위에 폴더가 있으면 ED 를 만들 수 없다.
                    //하위에 ED 가 있으면 폴더를 만들 수 없다.
                    if (child && child.length) {
                        for (var i = 0, leni = child.length; i < leni; i++) {
                            if (child[i].type == me.Constants.TYPE.FOLDER) {
                                enableCreateEd = false;
                            }
                            if (child[i].type == me.Constants.TYPE.ED) {
                                enableCreateFolder = false;
                            }
                        }
                    }
                    //ED 는 폴더,ED 생성 금지.
                    if (data.type == me.Constants.TYPE.ED) {
                        enableCreateEd = false;
                        enableCreateFolder = false;
                    }

                    //액티비티는 ED 생성 금지
                    if (data.type == me.Constants.TYPE.ACTIVITY) {
                        enableCreateEd = false;
                    }

                    if (enableCreateEd && me._CONFIG.CREATE_ED) {
                        items.makeEd = me.makeEd();
                    }
                    if (enableCreateEd && me._CONFIG.PICK_ED) {
                        items.makePickEd = me.makePickEd();
                    }
                    if (enableCreateFolder && me._CONFIG.CREATE_FOLDER) {
                        items.makeFolder = me.makeFolder();
                    }
                    if (enableDelete && me._CONFIG.DELETABLE) {
                        items.makeDelete = me.makeDelete();
                    }
                }

                //선택한 ED를 Input 으로 쓰는 Workflow - Activity정보 표현
                if (view.position == me.Constants.POSITION.MY_OUT ||
                    view.position == me.Constants.POSITION.OTHER_OUT ||
                    view.position == me.Constants.POSITION.MY_IN) {
                    if (view.type == me.Constants.TYPE.ED) {
                        items.makeListRelation = me.makeListRelation();
                    }
                }

                //매핑 삭제
                if (view.position == me.Constants.POSITION.MY_IN && view.mapping && me._CONFIG.MAPPING_ENABLE) {
                    items.makeDeleteRelation = me.makeDeleteRelation();
                }

                //공통
                items.showProperties = me.makeShowProperties();
                return {
                    items: items
                };
            }
        });
    }
    ,
    makeShowProperties: function () {
        var me = this;
        return {
            name: 'details',
            icon: 'pick-ed',
            callback: function () {
                me.onShowProperties(me.selectedData, me.selectedView);
            }
        }
    }
    ,
    makeFolder: function () {
        var me = this;
        return {
            name: 'create folder',
            icon: 'create-folder',
            callback: function () {
                me.onMakeFolder(me.selectedData, me.selectedView);
            }
        }
    }
    ,
    makeEd: function () {
        var me = this;
        return {
            name: 'create ed',
            icon: 'create-ed',
            items: {
                cad: {
                    name: '2D & 3D Drawing',
                    icon: 'create-ed',
                    callback: function () {
                        me.onMakeEd(me.selectedData, me.selectedView, 'CAD');
                    }
                },
                dhi_c3d_output: {
                    name: '3D BOM',
                    icon: 'create-ed',
                    callback: function () {
                        me.onMakeEd(me.selectedData, me.selectedView, 'DHI_C3D_OUTPUT');
                    }
                },
                document: {
                    name: 'Document',
                    icon: 'create-ed',
                    callback: function () {
                        me.onMakeEd(me.selectedData, me.selectedView, 'Document');
                    }
                },
                dhi_intellisheet: {
                    name: 'Engineering Data',
                    icon: 'create-ed',
                    callback: function () {
                        me.onMakeEd(me.selectedData, me.selectedView, 'DHI_IntelliSheet');
                    }
                },
                dhi_ed_kdm: {
                    name: 'Key Data',
                    icon: 'create-ed',
                    callback: function () {
                        me.onMakeEd(me.selectedData, me.selectedView, 'DHI_ED_KDM');
                    }
                }
            }
        }
    }
    ,
    makePickEd: function () {
        var me = this;
        return {
            name: 'pick ed',
            icon: 'pick-ed',
            callback: function () {
                me.onPickEd(me.selectedData, me.selectedView);
            }
        }
    }
    ,
    makeDelete: function () {
        var me = this;
        return {
            name: 'delete',
            icon: 'delete-item',
            callback: function () {
                me.onDelete(me.selectedData, me.selectedView);
            }
        }
    }
    ,
    makeListRelation: function () {
        var me = this;
        return {
            name: 'list relation',
            icon: 'pick-ed',
            callback: function () {
                me.onListRelation(me.selectedData, me.selectedView);
            }
        }
    }
    ,
    makeDeleteRelation: function () {
        var me = this;
        return {
            name: 'delete relation',
            icon: 'delete-item',
            callback: function () {
                me.deleteMapping(me.selectedData, me.selectedView);
            }
        }
    }
    ,
    onShowProperties: function (data, view) {
        console.log(data, view);
    }
    ,
    onMakeFolder: function (data, view) {
        console.log(data, view);
    }
    ,
    onMakeEd: function (data, view, edType) {
        console.log(data, view, edType);
    }
    ,
    onPickEd: function (data, view) {
        console.log(data, view);
    }
    ,
    onDelete: function (data, view) {
        console.log(data, view);
    }
    ,
    onListRelation: function (data, view) {
        console.log(data, view);
    }
    ,
    /**
     * GUI 상에서 매핑이 되기 전의 핸들러
     * @param event
     * @param source
     * @param target
     * @returns {boolean}
     */
    onBeforeMapping: function (source, target, selectedTargetList) {
        console.log(source, target, selectedTargetList);
        return true;
    }
    ,
    /**
     * GUI 상에서 매핑이 이루어졌을 때 핸들러
     * @param event
     * @param mapping
     */
    onMapping: function (source, target, selectedTargetList) {
        console.log(source, target, selectedTargetList);
        return true;
    }
    ,
    onBeforeDeleteMapping: function (sourceId, sourceType, targetId, targetType) {
        console.log(sourceId, sourceType, targetId, targetType);
        return true;
    }
    ,

    onDeleteMapping: function (sourceId, sourceType, targetId, targetType) {
        console.log(sourceId, sourceType, targetId, targetType);
        return true;
    }

};
Tree.prototype.constructor = Tree;