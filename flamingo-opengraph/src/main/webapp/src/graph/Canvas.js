/**
 * OpenGraph 캔버스 클래스
 *
 * @class
 * @requires OG.common.*
 * @requires OG.geometry.*
 * @requires OG.shape.*
 * @requires OG.renderer.*
 * @requires OG.handler.*
 * @requires OG.layout.*
 * @requires raphael-2.1.0
 *
 * @example
 * var canvas = new OG.Canvas('canvas', [1000, 800], 'white', 'url(./images/grid.gif)');
 *
 * var circleShape = canvas.drawShape([100, 100], new OG.CircleShape(), [100, 100]);
 * var ellipseShape = canvas.drawShape([300, 200], new OG.EllipseShape('label'), [100, 50]);
 *
 * var edge = canvas.connect(circleShape, ellipseShape);
 *
 * @param {HTMLElement|String} container 컨테이너 DOM element or ID
 * @param {Number[]} containerSize 컨테이너 Width, Height
 * @param {String} backgroundColor 캔버스 배경색
 * @param {String} backgroundImage 캔버스 배경이미지
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 */
OG.graph.Canvas = function (container, containerSize, backgroundColor, backgroundImage) {

    this._CONFIG = {
        /**
         * 연결된 두 오브젝트의 소속에 따른 연결선 스타일 변화 여부
         */
        CHECK_BRIDGE_EDGE: true,
        /**
         * 스틱 가이드 생성 여부
         */
        STICK_GUIDE: true,
        /**
         * 슬라이더
         */
        SLIDER: null,
        /**
         * 서버 수신 데이터 처리중
         */
        REMOTE_PERFORMED_DURING: false,
        /**
         * 리모트 데피니션
         */
        REMOTE_IDENTIFIER: null,
        /**
         * 리모트 모드
         */
        REMOTEABLE: false,
        /**
         * 리모트 모드 수정권한
         */
        REMOTE_EDITABLE: false,
        /**
         * 리모트 모드 마스터모드
         */
        REMOTE_ISMASTER: false,
        /**
         * 히스토리 인덱스
         */
        HISTORY_INDEX: 0,
        /**
         * 히스토리 저장소
         */
        HISTORY: [],
        /**
         * 히스토리 저장 횟수
         */
        HISTORY_SIZE: 100,

        /**
         * 확대/축소 슬라이더
         */
        USE_SLIDER: true,

        /**
         * 클릭선택 가능여부
         */
        SELECTABLE: true,

        /**
         * 마우스드래그선택 가능여부
         */
        DRAG_SELECTABLE: true,

        /**
         * 이동 가능여부
         */
        MOVABLE: true,
        MOVABLE_: {
            GEOM: true,
            TEXT: true,
            HTML: true,
            IMAGE: true,
            EDGE: true,
            GROUP: true
        },

        /**
         * 리사이즈 가능여부
         */
        RESIZABLE: true,
        RESIZABLE_: {
            GEOM: true,
            TEXT: true,
            HTML: true,
            IMAGE: true,
            EDGE: true,
            GROUP: true
        },

        /**
         * 연결 가능여부
         */
        CONNECTABLE: true,

        /**
         * Self 연결 가능여부
         */
        SELF_CONNECTABLE: true,

        /**
         * 가이드에 자기자신을 복사하는 컨트롤러 여부.
         */
        CONNECT_CLONEABLE: true,

        /**
         * 드래그하여 연결시 연결대상 있는 경우에만 Edge 드로잉 처리 여부
         */
        CONNECT_REQUIRED: true,

        /**
         * 드래그하여 연결시 그룹을 건너뛸때 스타일 변경 여부
         */
        CONNECT_STYLE_CHANGE: true,
        CONNECT_STYLE_CHANGE_: {
            GEOM: true,
            TEXT: true,
            HTML: true,
            IMAGE: true,
            EDGE: true,
            GROUP: true
        },

        /**
         * 가이드에 삭제 컨트롤러 여부
         */
        DELETABLE: true,
        DELETABLE_: {
            GEOM: true,
            TEXT: true,
            HTML: true,
            IMAGE: true,
            EDGE: true,
            GROUP: true
        },

        /**
         * 라벨 수정여부
         */
        LABEL_EDITABLE: true,
        LABEL_EDITABLE_: {
            GEOM: true,
            TEXT: true,
            HTML: true,
            IMAGE: true,
            EDGE: true,
            GROUP: true
        },

        /**
         * 그룹핑 가능여부
         */
        GROUP_DROPABLE: true,

        /**
         * 최소화 가능여부
         */
        GROUP_COLLAPSIBLE: true,

        /**
         * 이동, 리사이즈 드래그시 MOVE_SNAP_SIZE 적용 여부
         */
        DRAG_GRIDABLE: true,

        /**
         * 핫키 가능여부
         */
        ENABLE_HOTKEY: true,

        /**
         * 핫키 : UNDO REDO 키 가능여부
         */
        ENABLE_HOTKEY_CTRL_Z: true,

        /**
         * 핫키 : DELETE 삭제 키 가능여부
         */
        ENABLE_HOTKEY_DELETE: true,

        /**
         * 핫키 : Ctrl+A 전체선택 키 가능여부
         */
        ENABLE_HOTKEY_CTRL_A: true,

        /**
         * 핫키 : Ctrl+C 복사 키 가능여부
         */
        ENABLE_HOTKEY_CTRL_C: true,

        /**
         * 핫키 : Ctrl+V 붙여넣기 키 가능여부
         */
        ENABLE_HOTKEY_CTRL_V: true,

        /**
         * 핫키 : Ctrl+D 복제하기 키 가능여부
         */
        ENABLE_HOTKEY_CTRL_D: true,

        /**
         * 핫키 : Ctrl+G 그룹 키 가능여부
         */
        ENABLE_HOTKEY_CTRL_G: true,

        /**
         * 핫키 : Ctrl+U 언그룹 키 가능여부
         */
        ENABLE_HOTKEY_CTRL_U: true,

        /**
         * 핫키 : 방향키 가능여부
         */
        ENABLE_HOTKEY_ARROW: true,

        /**
         * 핫키 : Shift + 방향키 가능여부
         */
        ENABLE_HOTKEY_SHIFT_ARROW: true,

        /**
         * 마우스 우클릭 메뉴 가능여부
         */
        ENABLE_CONTEXTMENU: true,

        /**
         * 캔버스 스케일(리얼 사이즈 : Scale = 1)
         */
        SCALE: 1,

        /**
         * 캔버스 최소 스케일
         */
        SCALE_MIN: 0.1,

        /**
         * 캔버스 최대 스케일
         */
        SCALE_MAX: 10,

        /**
         * Edge 꺽은선 패딩 사이즈
         */
        EDGE_PADDING: 20,

        /**
         * 라벨의 패딩 사이즈
         */
        LABEL_PADDING: 5,

        /**
         * 라벨 에디터(textarea)의 디폴트 width
         */
        LABEL_EDITOR_WIDTH: 500,

        /**
         * 라벨 에디터(textarea)의 디폴트 height
         */
        LABEL_EDITOR_HEIGHT: 16,

        /**
         * 시작, 끝점 라벨의 offsetTop 값
         */
        FROMTO_LABEL_OFFSET_TOP: 15,

        /**
         * Move & Resize 용 가이드 선 콘트롤 Rect 사이즈
         */
        GUIDE_LINE_SIZE: 20,
        /**
         * Move & Resize 용 가이드 선 콘트롤 마진 사이즈
         */
        GUIDE_LINE_MARGIN: 10,

        /**
         * Move & Resize 용 가이드 콘트롤 Rect 사이즈
         */
        GUIDE_RECT_SIZE: 8,

        /**
         * Move & Resize 용 가이드 가로, 세로 최소 사이즈
         */
        GUIDE_MIN_SIZE: 18,

        /**
         * Collapse & Expand 용 가이드 Rect 사이즈
         */
        COLLAPSE_SIZE: 10,

        /**
         * Shape Move & Resize 시 이동 간격
         */
        MOVE_SNAP_SIZE: 8,

        /**
         * 터미널 cross 사이즈
         */
        TERMINAL_SIZE: 5,

        /**
         * Shape 복사시 패딩 사이즈
         */
        COPY_PASTE_PADDING: 20,

        /**
         * Fit Canvas 시 패딩 사이즈
         */
        FIT_CANVAS_PADDING: 20,

        /**
         * 캔버스 영역 자동 확장 여부
         */
        AUTO_EXTENSIONAL: true,

        /**
         * 캔버스 영역 자동 확장시 증가 사이즈
         */
        AUTO_EXTENSION_SIZE: 100,

        /**
         * 캔버스 배경색
         */
        CANVAS_BACKGROUND: "#f9f9f9",

        /**
         * 이미지 url 정보
         */
        IMAGE_USER: "http://processcodi.com/images/opengraph/User.png",
        IMAGE_SEND: "http://processcodi.com/images/opengraph/Send.png",
        IMAGE_RECEIVE: "http://processcodi.com/images/opengraph/Receive.png",
        IMAGE_MANUAL: "http://processcodi.com/images/opengraph/Manual.png",
        IMAGE_SERVICE: "http://processcodi.com/images/opengraph/Service.png",
        IMAGE_RULE: "http://processcodi.com/images/opengraph/BusinessRule.png",
        IMAGE_SCRIPT: "http://processcodi.com/images/opengraph/Script.png",
        IMAGE_MAPPER: "http://processcodi.com/images/opengraph/mapper.png",
        IMAGE_WEB: "http://processcodi.com/images/opengraph/w_services.png",

        /**
         * Edge 선 자동마춤 각도 최소값
         */
        TRIM_EDGE_ANGLE_SIZE: 170,
        /**
         * Edge 선 이동딜레이 거리
         */
        EDGE_MOVE_DELAY_SIZE: 14,

        /**
         * swimLane 리사이즈 최소 폭
         */
        LANE_MIN_SIZE: 50,

        /**
         * swimLane 확장 기본 폭
         */
        LANE_DEFAULT_SIZE: 100,

        /**
         * swimLane, pool 생성 기본 가로,세로
         */
        POOL_DEFAULT_SIZE: [300, 200],

        /**
         * 그룹 하위 shape 와 그룹사이의 여유폭
         */
        GROUP_INNER_SAPCE: 10,

        /**
         * 라벨 최소 크기(IE)
         */
        LABEL_MIN_SIZE: 100,

        /**
         * 라벨 최대 크기(IE)
         */
        LABEL_MAX_SIZE: 300,

        /**
         * 디폴트 스타일 정의
         */
        DEFAULT_STYLE: {
            SHAPE: {cursor: "default"},
            GEOM: {
                stroke: "black",
                "fill-r": ".5",
                "fill-cx": ".5",
                "fill-cy": ".5",
                fill: "white",
                "fill-opacity": 0,
                "label-position": "center"
            },
            TEXT: {stroke: "none", "text-anchor": "middle"},
            HTML: {"label-position": "bottom", "text-anchor": "middle", "vertical-align": "top"},
            IMAGE: {"label-position": "bottom", "text-anchor": "middle", "vertical-align": "top"},
            EDGE: {
                stroke: "black",
                fill: "none",
                "fill-opacity": 0,
                "stroke-width": 1.5,
                "stroke-opacity": 1,
                "edge-type": "plain",
                "arrow-start": "none",
                "arrow-end": "block",
                "stroke-dasharray": "",
                "label-position": "center",
                "stroke-linejoin": "round",
                cursor: "pointer"
            },
            EDGE_SHADOW: {
                stroke: "#00FF00",
                fill: "none",
                "fill-opacity": 0,
                "stroke-width": 1,
                "stroke-opacity": 1,
                "arrow-start": "none",
                "arrow-end": "none",
                "stroke-dasharray": "- ",
                "edge-type": "plain",
                cursor: "pointer"
            },
            EDGE_HIDDEN: {
                stroke: "white",
                fill: "none",
                "fill-opacity": 0,
                "stroke-width": 10,
                "stroke-opacity": 0,
                cursor: "pointer"
            },
            GROUP: {
                stroke: "black",
                fill: "none",
                "fill-opacity": 0,
                "label-position": "bottom",
                "text-anchor": "middle",
                "vertical-align": "top"
            },
            GROUP_HIDDEN: {stroke: "black", fill: "white", "fill-opacity": 0, "stroke-opacity": 0, cursor: "move"},
            GROUP_SHADOW: {
                stroke: "white",
                fill: "none",
                "fill-opacity": 0,
                "stroke-width": 15,
                "stroke-opacity": 0,
                cursor: "pointer"
            },
            GROUP_SHADOW_MAPPER: {
                stroke: "white",
                fill: "none",
                "fill-opacity": 0,
                "stroke-width": 1,
                "stroke-opacity": 0,
                cursor: "pointer"
            },
            GUIDE_BBOX: {
                stroke: "#00FF00",
                fill: "white",
                "fill-opacity": 0,
                "stroke-dasharray": "- ",
                "shape-rendering": "crispEdges",
                cursor: "move"
            },
            GUIDE_UL: {
                stroke: "#03689a",
                fill: "#03689a",
                "fill-opacity": 0.5,
                cursor: "nwse-resize",
                "shape-rendering": "crispEdges"
            },
            GUIDE_UR: {
                stroke: "#03689a",
                fill: "#03689a",
                "fill-opacity": 0.5,
                cursor: "nesw-resize",
                "shape-rendering": "crispEdges"
            },
            GUIDE_LL: {
                stroke: "#03689a",
                fill: "#03689a",
                "fill-opacity": 0.5,
                cursor: "nesw-resize",
                "shape-rendering": "crispEdges"
            },
            GUIDE_LR: {
                stroke: "#03689a",
                fill: "#03689a",
                "fill-opacity": 0.5,
                cursor: "nwse-resize",
                "shape-rendering": "crispEdges"
            },
            GUIDE_LC: {
                stroke: "#03689a",
                fill: "#03689a",
                "fill-opacity": 0.5,
                cursor: "ew-resize",
                "shape-rendering": "crispEdges"
            },
            GUIDE_UC: {
                stroke: "black",
                fill: "#03689a",
                "fill-opacity": 0.5,
                cursor: "ns-resize",
                "shape-rendering": "crispEdges"
            },
            GUIDE_RC: {
                stroke: "black",
                fill: "#03689a",
                "fill-opacity": 0.5,
                cursor: "ew-resize",
                "shape-rendering": "crispEdges"
            },
            GUIDE_LWC: {
                stroke: "black",
                fill: "#03689a",
                "fill-opacity": 0.5,
                cursor: "ns-resize",
                "shape-rendering": "crispEdges"
            },
            GUIDE_FROM: {stroke: "black", fill: "#00FF00", cursor: "move", "shape-rendering": "crispEdges"},
            GUIDE_TO: {stroke: "black", fill: "#00FF00", cursor: "move", "shape-rendering": "crispEdges"},
            GUIDE_CTL_H: {stroke: "black", fill: "#00FF00", cursor: "ew-resize", "shape-rendering": "crispEdges"},
            GUIDE_CTL_V: {stroke: "black", fill: "#00FF00", cursor: "ns-resize", "shape-rendering": "crispEdges"},
            GUIDE_SHADOW: {stroke: "black", fill: "none", "stroke-dasharray": "- ", "shape-rendering": "crispEdges"},
            GUIDE_LINE: {
                stroke: "black",
                fill: "none",
                "fill-opacity": 0,
                "stroke-width": 1.2,
                "stroke-opacity": 1,
                "stroke-dasharray": "",
                "arrow-end": "block",
                "stroke-linejoin": "round",
                cursor: "pointer"
            },
            GUIDE_LINE_ESSENSIA: {
                stroke: "black",
                fill: "none",
                "fill-opacity": 0,
                "stroke-width": 1.2,
                "stroke-opacity": 1,
                "stroke-dasharray": "",
                "arrow-start": "diamond",
                "arrow-end": "none",
                "stroke-linejoin": "round",
                cursor: "pointer"
            },
            GUIDE_VIRTUAL_EDGE: {
                stroke: "black",
                fill: "none",
                "fill-opacity": 0,
                "stroke-width": 1,
                "stroke-opacity": 1,
                "stroke-dasharray": "- ",
                "stroke-linejoin": "round",
                "arrow-start": "none",
                "arrow-end": "none"
            },
            GUIDE_LINE_AREA: {
                stroke: "#ffffff",
                fill: "#ffffff",
                "fill-opacity": 0.1,
                "stroke-width": 1,
                "stroke-opacity": 0.2,
                cursor: "pointer"
            },
            GUIDE_RECT_AREA: {
                stroke: "black",
                fill: "#ffffff",
                "fill-opacity": 0,
                "stroke-width": 1,
                "stroke-opacity": 1,
                cursor: "pointer"
            },
            RUBBER_BAND: {stroke: "#0000FF", opacity: 0.2, fill: "#0077FF"},
            DROP_OVER_BBOX: {stroke: "#0077FF", fill: "none", opacity: 0.3, "shape-rendering": "crispEdges"},
            LABEL: {"font-size": 12, "font-color": "black", "fill": "white"},
            LABEL_EDITOR: {
                position: "absolute",
                overflow: "visible",
                resize: "none",
                "text-align": "center",
                display: "block",
                padding: 0
            },
            COLLAPSE: {
                stroke: "black",
                fill: "none",
                "fill-opacity": 0,
                cursor: "pointer",
                "shape-rendering": "crispEdges"
            },
            COLLAPSE_BBOX: {stroke: "none", fill: "none", "fill-opacity": 0},
            BUTTON: {
                stroke: "#9FD7FF",
                fill: "white",
                "fill-opacity": 0,
                cursor: "pointer",
                "shape-rendering": "crispEdges"
            },
            CONNECT_GUIDE_EVENT_AREA: {
                stroke: "#ffffff",
                fill: "none",
                "fill-opacity": 0,
                "stroke-width": 20,
                "stroke-opacity": 0
            },
            CONNECT_GUIDE_BBOX: {
                stroke: "#00FF00",
                fill: "none",
                "stroke-dasharray": "- ",
                "shape-rendering": "crispEdges"
            },
            CONNECT_GUIDE_BBOX_EXPEND: 10,
            CONNECT_GUIDE_SPOT_CIRCLE: {
                r: 7,
                stroke: "#A6A6A6",
                "stroke-width": 1,
                fill: "#FFE400",
                "fill-opacity": 0.5,
                cursor: "pointer"
            },
            CONNECT_GUIDE_SPOT_RECT: {
                stroke: "#A6A6A6",
                "stroke-width": 1,
                fill: "#FFE400",
                "fill-opacity": 0.2,
                cursor: "ns-resize",
                w: 20,
                h: 10
            },
            CONNECTABLE_HIGHLIGHT: {
                "stroke-width": 2
            },
            NOT_CONNECTABLE_HIGHLIGHT: {
                fill: "#FAAFBE",
                "fill-opacity": 0.5
            }
        }
    };

    this._RENDERER = container ? new OG.RaphaelRenderer(container, containerSize, backgroundColor, backgroundImage, this._CONFIG) : null;
    this._RENDERER._CANVAS = this;
    this._HANDLER = new OG.EventHandler(this._RENDERER, this._CONFIG);
    this._CONTAINER = OG.Util.isElement(container) ? container : document.getElementById(container);
};

OG.graph.Canvas.prototype = {
    setRemoteDuring: function (during) {
        this._CONFIG.REMOTE_PERFORMED_DURING = during;
    },
    getRemoteDuring: function () {
        return this._CONFIG.REMOTE_PERFORMED_DURING;
    },
    setIdentifier: function (identifier) {
        this._CONFIG.REMOTE_IDENTIFIER = identifier;
    },
    getIdentifier: function () {
        return this._CONFIG.REMOTE_IDENTIFIER;
    },
    getRemotable: function () {
        return this._CONFIG.REMOTEABLE;
    },
    setRemotable: function (remotable) {
        this._CONFIG.REMOTEABLE = remotable;
    },
    setRemoteEditable: function (editable) {
        this._CONFIG.REMOTE_EDITABLE = editable;
    },
    getRemoteEditable: function () {
        return this._CONFIG.REMOTE_EDITABLE;
    },
    setRemoteIsMaster: function (isMaster) {
        this._CONFIG.REMOTE_ISMASTER = isMaster;
    },
    getRemoteIsMaster: function () {
        return this._CONFIG.REMOTE_ISMASTER;
    },
    setCurrentCanvas: function (canvas) {
        this._RENDERER.setCanvas(canvas);
    },
    /**
     * Canvas 의 설정값을 초기화한다.
     *
     * <pre>
     * - selectable         : 클릭선택 가능여부(디폴트 true)
     * - dragSelectable     : 마우스드래그선택 가능여부(디폴트 true)
     * - movable            : 이동 가능여부(디폴트 true)
     * - resizable          : 리사이즈 가능여부(디폴트 true)
     * - connectable        : 연결 가능여부(디폴트 true)
     * - selfConnectable    : Self 연결 가능여부(디폴트 true)
     * - connectCloneable   : 드래그하여 연결시 대상 없을 경우 자동으로 Shape 복사하여 연결 처리 여부(디폴트 true)
     * - connectRequired    : 드래그하여 연결시 연결대상 있는 경우에만 Edge 드로잉 처리 여부(디폴트 true)
     * - labelEditable      : 라벨 수정여부(디폴트 true)
     * - groupDropable      : 그룹핑 가능여부(디폴트 true)
     * - collapsible        : 최소화 가능여부(디폴트 true)
     * - enableHotKey       : 핫키 가능여부(디폴트 true)
     * - enableContextMenu  : 마우스 우클릭 메뉴 가능여부(디폴트 true)
     * - autoExtensional    : 캔버스 자동 확장 기능(디폴트 true)
     * - useSlider          : 확대축소 슬라이더 사용 여부
     * - stickGuide         : 스틱 가이드 표시 여부
     * - checkBridgeEdge    : 연결된 두 오브젝트의 소속에 따른 연결선 스타일 변화 여부
     * </pre>
     *
     * @param {Object} config JSON 포맷의 configuration
     */
    initConfig: function (config) {
        if (config) {
            this._CONFIG.REMOTEABLE = config.remoteable === undefined ? this._CONFIG.REMOTEABLE : config.remoteable;
            this._CONFIG.SELECTABLE = config.selectable === undefined ? this._CONFIG.SELECTABLE : config.selectable;
            this._CONFIG.DRAG_SELECTABLE = config.dragSelectable === undefined ? this._CONFIG.DRAG_SELECTABLE : config.dragSelectable;
            this._CONFIG.MOVABLE = config.movable === undefined ? this._CONFIG.MOVABLE : config.movable;
            this._CONFIG.RESIZABLE = config.resizable === undefined ? this._CONFIG.RESIZABLE : config.resizable;
            this._CONFIG.CONNECTABLE = config.connectable === undefined ? this._CONFIG.CONNECTABLE : config.connectable;
            this._CONFIG.SELF_CONNECTABLE = config.selfConnectable === undefined ? this._CONFIG.SELF_CONNECTABLE : config.selfConnectable;
            this._CONFIG.CONNECT_CLONEABLE = config.connectCloneable === undefined ? this._CONFIG.CONNECT_CLONEABLE : config.connectCloneable;
            this._CONFIG.CONNECT_REQUIRED = config.connectRequired === undefined ? this._CONFIG.CONNECT_REQUIRED : config.connectRequired;
            this._CONFIG.LABEL_EDITABLE = config.labelEditable === undefined ? this._CONFIG.LABEL_EDITABLE : config.labelEditable;
            this._CONFIG.GROUP_DROPABLE = config.groupDropable === undefined ? this._CONFIG.GROUP_DROPABLE : config.groupDropable;
            this._CONFIG.GROUP_COLLAPSIBLE = config.collapsible === undefined ? this._CONFIG.GROUP_COLLAPSIBLE : config.collapsible;
            this._CONFIG.ENABLE_HOTKEY = config.enableHotKey === undefined ? this._CONFIG.ENABLE_HOTKEY : config.enableHotKey;
            this._CONFIG.ENABLE_CONTEXTMENU = config.enableContextMenu === undefined ? this._CONFIG.ENABLE_CONTEXTMENU : config.enableContextMenu;
            this._CONFIG.AUTO_EXTENSIONAL = config.autoExtensional === undefined ? this._CONFIG.AUTO_EXTENSIONAL : config.autoExtensional;
            this._CONFIG.USE_SLIDER = config.useSlider === undefined ? this._CONFIG.USE_SLIDER : config.useSlider;
            this._CONFIG.STICK_GUIDE = config.stickGuide === undefined ? this._CONFIG.STICK_GUIDE : config.stickGuide;
            this._CONFIG.CHECK_BRIDGE_EDGE = config.checkBridgeEdge === undefined ? this._CONFIG.CHECK_BRIDGE_EDGE : config.checkBridgeEdge;
        }

        this._HANDLER.setDragSelectable(this._CONFIG.SELECTABLE && this._CONFIG.DRAG_SELECTABLE);
        this._HANDLER.setEnableHotKey(this._CONFIG.ENABLE_HOTKEY);
        if (this._CONFIG.ENABLE_CONTEXTMENU) {
            this._HANDLER.enableRootContextMenu();
            this._HANDLER.enableShapeContextMenu();
        }

        this.CONFIG_INITIALIZED = true;
    },

    /**
     * 랜더러를 반환한다.
     *
     * @return {OG.RaphaelRenderer}
     */
    getRenderer: function () {
        return this._RENDERER;
    },

    /**
     * 컨테이너 DOM element 를 반환한다.
     *
     * @return {HTMLElement}
     */
    getContainer: function () {
        return this._CONTAINER;
    },

    /**
     * 이벤트 핸들러를 반환한다.
     *
     * @return {OG.EventHandler}
     */
    getEventHandler: function () {
        return this._HANDLER;
    },

    /**
     * 확대 축소 슬라이더를 설치한다.
     */
    addSlider: function (option) {
        var me = this;
        var slider;
        var sliderBarWrapper;
        var sliderText;
        var sliderBar;
        var sliderImageWrapper;
        var sliderImage;
        var sliderNavigator;
        var onNavigatorMove;
        var sliderParent;
        var expandBtn;
        var container = me._CONTAINER;

        if (!option.slider) {
            return;
        }
        if (!option.slider.length) {
            return;
        }
        slider = option.slider;
        slider.css({
            width: option.width + 'px'
        });
        slider.dialog({
                title: option.title ? option.title : "Zoom",
                position: option.position ? option.position : {my: "right top", at: "right top", of: container},
                height: option.height ? option.height : 300,
                width: option.width ? option.width : 250,
                dialogClass: "no-close",
                appendTo: option.appendTo ? option.appendTo : '#' + container.id,
                resize: function (event, ui) {
                    me.updateNavigatior();
                }
            }
        );

        //클로즈버튼 이벤트를 collape,expand 이벤트로..
        sliderParent = slider.parent();
        expandBtn = sliderParent.find('.ui-dialog-titlebar-close');
        expandBtn.html('<span class="ui-button-icon-primary ui-icon ui-icon-circle-minus"></span>');
        expandBtn.append();
        expandBtn.unbind('click');
        expandBtn.bind('click', function () {
            //접혀있는 상태라면
            if ($(this).data('collape')) {
                var height = $(this).data('collape');
                sliderParent.height(height);
                slider.show();
                $(this).data('collape', false);
            }
            //접혀있지 않은 상태라면
            else {
                $(this).data('collape', sliderParent.height());
                slider.hide();
                sliderParent.height(40);
            }
        });

        sliderBarWrapper = $('<div class="scaleSliderWrapper"></div>');
        sliderBarWrapper.css({
            position: 'relative',
            width: '100%'
        });

        sliderText = $('<div class="scaleSliderText"></div>');
        sliderBar = $('<input type="range" min="25" max="400" class="scaleSlider"/>');
        sliderBar.bind('change', function () {
            me.updateSlider($(this).val());
        });
        sliderBar.bind('input', function () {
            me.updateSlider($(this).val());
        });
        sliderBar.css({
            position: 'relative',
            'writing-mode': 'bt-lr', /* IE */
            'width': '100%',
            'height': '8px'
        });

        sliderImageWrapper = $('<div class="sliderImageWrapper"></div>');
        sliderImageWrapper.css({
            position: 'absolute',
            top: '50px',
            bottom: '5px',
            left: '5px',
            right: '5px',
            'overflow-x': 'hidden',
            'overflow-y': 'auto'
        });
        sliderImage = $('<img class="sliderImage" src=""/>');
        sliderImage.css({
            position: 'absolute',
            top: '0px',
            left: '0px'
        });
        sliderImage.attr("width", "100%");
        sliderImage.attr('id', container.id + 'sliderImage');

        sliderNavigator = $('<div class="sliderNavigator">' +
            '<div style="position: absolute;top: 2px;left: 2px;bottom: 2px;right: 2px;border: 2px solid #3e77ff;"></div>' +
            '</div>');
        sliderNavigator.css({
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '100px',
            height: '100px',
            background: 'transparent'
        });

//네비게이터가 이동되었을경우의 이벤트
        onNavigatorMove = function () {
            var svg, svgW, svgH, imgW, imgH, xRate, yRate, xOffset, yOffset, sliderX, sliderY;
            svg = me._RENDERER.getRootElement();
            imgW = sliderImage.width();
            imgH = sliderImage.height();
            svgW = $(svg).attr('width');
            svgH = $(svg).attr('height');
            xRate = imgW / svgW;
            yRate = imgH / svgH;
            if (xRate > 1) {
                xRate = 1;
            }
            if (yRate > 1) {
                yRate = 1;
            }
            xOffset = sliderNavigator.offset().left - sliderImage.offset().left;
            if (xOffset < 0) {
                xOffset = 0;
            }
            yOffset = sliderNavigator.offset().top - sliderImage.offset().top;
            if (yOffset < 0) {
                yOffset = 0;
            }
            sliderX = xOffset * ( 1 / xRate);
            sliderY = yOffset * ( 1 / yRate);
            container.scrollLeft = sliderX;
            container.scrollTop = sliderY;
        };

        $(container).unbind('scroll');
        $(container).bind('scroll', function (event) {
            if (sliderNavigator.data('drag')) {
                return;
            }
            me.updateNavigatior();
        });

        sliderImage.click(function (event) {
            var eX, eY, nX, nY;
            eX = event.pageX - sliderImage.offset().left;
            eY = event.pageY - sliderImage.offset().top;
            nX = eX - (sliderNavigator.width() / 2);
            nY = eY - (sliderNavigator.height() / 2);
            if (nX < 0) {
                nX = 0;
            }
            if (nY < 0) {
                nY = 0;
            }
            if ((nX + sliderNavigator.width()) > sliderImage.width()) {
                nX = sliderImage.width() - sliderNavigator.width();
            }
            if ((nY + sliderNavigator.height()) > sliderImage.height()) {
                nY = sliderImage.height() - sliderNavigator.height();
            }
            sliderNavigator.css({
                "left": nX + 'px',
                "top": nY + 'px'
            });
            onNavigatorMove();
        });

        sliderNavigator.draggable({
            containment: "#" + container.id + 'sliderImage',
            scroll: false,
            start: function (event) {
                sliderNavigator.data('drag', true);
            },
            drag: function (event) {
                onNavigatorMove();
            },
            stop: function (event) {
                onNavigatorMove();
                sliderNavigator.data('drag', false);
            }
        });

        slider.append(sliderBarWrapper);
        sliderBarWrapper.append(sliderText);
        sliderBarWrapper.append(sliderBar);

        slider.append(sliderImageWrapper);
        sliderImageWrapper.append(sliderImage);
        sliderImageWrapper.append(sliderNavigator);

//캔버스 삭제시 슬라이더도 삭제
        $(container).on("remove", function () {
            me.removeSlider();
        });

//기존에 등록된 슬라이더 삭제
        if (this._CONFIG.SLIDER) {
            me.removeSlider();
        }

//슬라이더를 캔버스에 등록
        this._CONFIG.SLIDER = slider;

//슬라이더 업데이트
        this.updateSlider(this._CONFIG.SCALE * 100);
    },
    updateNavigatior: function () {
        var me = this;
        var svg = me._RENDERER.getRootElement();
        var svgWidth, svgHeight, vx, vy, xRate, yRate, xImgRate, yImgRate;
        var slider = this._CONFIG.SLIDER;
        var sliderImage = slider.find('.sliderImage');
        var sliderNavigator = slider.find('.sliderNavigator');
        var container = me._CONTAINER;

        svgWidth = $(svg).attr('width');
        svgHeight = $(svg).attr('height');
        vx = container.scrollLeft;
        vy = container.scrollTop;
        xRate = $(container).width() / svgWidth;
        yRate = $(container).height() / svgHeight;
        if (xRate > 1) {
            xRate = 1;
        }
        if (yRate > 1) {
            yRate = 1;
        }
        xImgRate = sliderImage.width() / svgWidth;
        yImgRate = sliderImage.height() / svgHeight;

        sliderNavigator.width(sliderImage.width() * xRate);
        sliderNavigator.height(sliderImage.height() * yRate);
        sliderNavigator.css({
            left: (vx * xImgRate) + 'px',
            top: (vy * yImgRate) + 'px'
        })
    }
    ,
    updateSlider: function (val) {
        var me = this;
        if (!this._CONFIG.SLIDER) {
            return;
        }
        if (!val) {
            val = this._CONFIG.SCALE * 100;
        }

        var slider = this._CONFIG.SLIDER;
        var sliderText = slider.find('.scaleSliderText');
        var sliderBar = slider.find('.scaleSlider');
        var sliderImage = slider.find('.sliderImage');
        var sliderNavigator = slider.find('.sliderNavigator');

        sliderText.html(val);
        sliderBar.val(val);
        me._RENDERER.setScale(val / 100);

        var svg = me._RENDERER.getRootElement();
        var svgData = new XMLSerializer().serializeToString(svg);
        var srcURL = "data:image/svg+xml;utf-8," + svgData;
        sliderImage.attr('src', srcURL);

        me.updateNavigatior();
    }
    ,
    /**
     * 확대 축소 슬라이더를 삭제한다.
     */
    removeSlider: function () {
        if (this._CONFIG.SLIDER) {
            this._CONFIG.SLIDER.dialog("destroy");
            this._CONFIG.SLIDER.remove();
        }
    }
    ,

    /**
     * Shape 을 캔버스에 위치 및 사이즈 지정하여 드로잉한다.
     *
     * @example
     * canvas.drawShape([100, 100], new OG.CircleShape(), [50, 50], {stroke:'red'});
     *
     * @param {Number[]} position 드로잉할 위치 좌표(중앙 기준)
     * @param {OG.shape.IShape} shape Shape
     * @param {Number[]} size Shape Width, Height
     * @param {OG.geometry.Style|Object} style 스타일 (Optional)
     * @param {String} id Element ID 지정 (Optional)
     * @param {String} parentId 부모 Element ID 지정 (Optional)
     * @param {Boolean} preventDrop Lane, Pool 생성 drop 모드 수행 방지
     * @return {Element} Group DOM Element with geometry
     */
    drawShape: function (position, shape, size, style, id, parentId, preventDrop) {

        var element = this._RENDERER.drawShape(position, shape, size, style, id, preventDrop);

        if (position && (shape.TYPE === OG.Constants.SHAPE_TYPE.EDGE)) {
            element = this._RENDERER.move(element, position);
        }

        if (parentId && this._RENDERER.getElementById(parentId)) {
            this._RENDERER.appendChild(element, parentId);
        }

        if (!this.CONFIG_INITIALIZED) {
            this.initConfig();
        }

        this._HANDLER.setClickSelectable(element, this._HANDLER._isSelectable(element.shape));
        this._HANDLER.setMovable(element, this._HANDLER._isMovable(element.shape));
        this._HANDLER.setGroupDropable(element);
        this._HANDLER.setConnectGuide(element, this._HANDLER._isConnectable(element.shape));

        if (this._HANDLER._isLabelEditable(element.shape)) {
            this._HANDLER.enableEditLabel(element);
        }

        if (element.shape.HaveButton) {   // + 버튼을 만들기 위해서
            this._HANDLER.enableButton(element);
        }

        if (this._CONFIG.GROUP_COLLAPSIBLE && element.shape.GROUP_COLLAPSIBLE) {
            this._HANDLER.enableCollapse(element);
        }

        if (!id) {
            this._RENDERER.addHistory();
        }
        this.updateSlider();
        return element;
    }
    ,

    /**
     * Transfomer Shape 을 캔버스에 위치 및 사이즈 지정하여 드로잉한다.
     *
     * @example
     * canvas.drawTransformer([100, 100], 'label' ['str1','str2'],['out']);
     *
     * @param {Number[]} position 드로잉할 위치 좌표(중앙 기준)
     * @param {String} label Label
     * @param {String[]} inputs 인풋에 위치할 리스트
     * @param {String[]} outputs 아웃풋에 위치할 리스트
     * @param {String} id Element ID 지정 (Optional)
     * @return {Element} Group DOM Element with geometry
     */
    drawTransformer: function (position, label, inputs, outputs, drawData, id) {
        var me = this, shape, element, style, envelope, i, toShape, fromShape, toElement, fromElement, textShape, textElement;
        shape = new OG.shape.Transformer(label);

        if (!Array.isArray(inputs) || !Array.isArray(outputs)) {
            return null;
        }
        var lines = Math.max(inputs.length, outputs.length);
        element = me.drawShape(position, shape, [120, 30 + (lines * 25)], style, id);

        envelope = element.shape.geom.getBoundary();

        $.each(inputs, function (idx, input) {
            textShape = new OG.shape.bpmn.M_Text(input);
            textElement = me.drawShape([envelope.getUpperLeft().x + 35, envelope.getUpperLeft().y + (idx * 25) + 40], textShape, [50, 20]);
            element.appendChild(textElement);
            toShape = new OG.shape.To();
            toElement = me.drawShape([envelope.getUpperLeft().x + 15, envelope.getUpperLeft().y + (idx * 25) + 40], toShape, [5, 5], {"r": 5});
            element.appendChild(toElement);
            var data = JSON.parse(JSON.stringify(drawData));
            data['type'] = 'input';
            data['name'] = input;
            data['parentId'] = element.id;
            me.setCustomData(toElement, data);
        });

        $.each(outputs, function (idx, output) {
            textShape = new OG.shape.bpmn.M_Text(output);
            textElement = me.drawShape([envelope.getUpperRight().x - 35, envelope.getUpperRight().y + (idx * 25) + 40], textShape, [50, 20]);
            element.appendChild(textElement);
            fromShape = new OG.shape.From();
            fromElement = me.drawShape([envelope.getUpperRight().x - 15, envelope.getUpperRight().y + (idx * 25) + 40], fromShape, [5, 5], {"r": 5});
            element.appendChild(fromElement);
            var data = JSON.parse(JSON.stringify(drawData));
            data['type'] = 'output';
            data['name'] = output;
            data['parentId'] = element.id;
            me.setCustomData(fromElement, data);
        });

        if (!id) {
            this._RENDERER.addHistory();
        }
    }
    ,

    setExceptionType: function (element, exceptionType) {
        this._HANDLER.setExceptionType(element, exceptionType);
    }
    ,

    setInclusion: function (element, inclusion) {
        this._HANDLER.setInclusion(element, inclusion);
    }
    ,

    /**
     * Shape 의 스타일을 변경한다.
     *
     * @param {Element} shapeElement Shape DOM element
     * @param {Object} style 스타일
     */
    setShapeStyle: function (shapeElement, style) {
        this._RENDERER.setShapeStyle(shapeElement, style);
    }
    ,

    /**
     * Shape 의 선 연결 커스텀 컨트롤러를 설정한다.
     *
     * @param {Element} shapeElement Shape DOM element
     * @param {Array} textList 텍스트 리스트
     */
    setTextListInController: function (shapeElement, textList) {
        this._RENDERER.setTextListInController(shapeElement, textList);
    }
    ,

    /**
     * Shape 의 선 연결 커스텀 컨트롤러를 가져온다.
     *
     * @param {Element} shapeElement Shape DOM element
     */
    getTextListInController: function (shapeElement) {
        this._RENDERER.getTextListInController(shapeElement);
    }
    ,

    /**
     * Shape 의 Label 을 캔버스에 위치 및 사이즈 지정하여 드로잉한다.
     *
     * @param {Element|String} shapeElement Shape DOM element or ID
     * @param {String} text 텍스트
     * @param {OG.geometry.Style|Object} style 스타일
     * @return {Element} DOM Element
     * @override
     */
    drawLabel: function (shapeElement, text, style) {
        return this._RENDERER.drawLabel(shapeElement, text, style);
    }
    ,

    /**
     * Shape 의 연결된 Edge 를 redraw 한다.(이동 또는 리사이즈시)
     *
     * @param {Element} element
     */
    redrawConnectedEdge: function (element) {
        this._RENDERER.redrawConnectedEdge(element);
    }
    ,

    /**
     * 연결된 터미널의 vertices 를 초기화한다.
     *
     * @param {Element} edge Edge Shape
     * @return {Element} 연결된 Edge 엘리먼트
     * @override
     */
    reconnect: function (edge) {
        return this._RENDERER.reconnect(edge);
    }
    ,

    /**
     * 두개의 Shape 을 Edge 로 연결한다.
     *
     * @param {Element} fromElement from Shape Element
     * @param {Element} toElement to Shape Element
     * @param {OG.geometry.Style|Object} style 스타일
     * @param {String} label Label
     * @param fromP fromElement 와 연결될 터미널 좌표 [x,y](optional)
     * @param toP toElement 와 연결될 터미널 좌표 [x,y](optional)
     * @param preventTrigger 참 일 경우 이벤트 발생을 방지
     * @param id 연결선의 아이디
     * @returns {*|Element}
     */
    connect: function (fromElement, toElement, style, label, fromP, toP, preventTrigger, id) {
        var fromTerminal, toTerminal, edge, fromPosition, toPosition;

        if (fromP) {
            fromTerminal = this._RENDERER.createTerminalString(fromElement, fromP);
        } else {
            fromTerminal = this._RENDERER.createDefaultTerminalString(fromElement);
        }

        if (toP) {
            toTerminal = this._RENDERER.createTerminalString(toElement, toP);
        } else {
            toTerminal = this._RENDERER.createDefaultTerminalString(toElement);
        }

        fromPosition = this._RENDERER._getPositionFromTerminal(fromTerminal);
        fromPosition = [fromPosition.x, fromPosition.y];
        toPosition = this._RENDERER._getPositionFromTerminal(toTerminal);
        toPosition = [toPosition.x, toPosition.y];

        // draw edge
        edge = this._RENDERER.drawShape(null, new OG.EdgeShape(fromPosition, toPosition), null, style, id);
        edge = this._RENDERER.trimEdgeDirection(edge, fromElement, toElement);

        // connect
        edge = this._RENDERER.connect(fromTerminal, toTerminal, edge, style, label, preventTrigger);

        if (edge) {
            this._HANDLER.setClickSelectable(edge, edge.shape.SELECTABLE);
            this._HANDLER.setMovable(edge, edge.shape.SELECTABLE && edge.shape.MOVABLE);
            this._HANDLER.setConnectGuide(edge, this._HANDLER._isConnectable(edge.shape));
            if (edge.shape.LABEL_EDITABLE) {
                this._HANDLER.enableEditLabel(edge);
            }
        }
        this.updateSlider();
        return edge;
    }
    ,

    /**
     * 두개의 터미널 아이디로 부터 얻어진 Shape를 Edge 로 연결한다.
     *
     * @param {String} fromTerminal from Terminal Id
     * @param {String} toTerminal to Terminal Id
     * @param {OG.geometry.Style|Object} style 스타일
     * @param {String} label Label
     * @return {String} id 부여 할 아이디
     * @return {String} shapeId shapeId
     * @return {OG.geometry} geom Edge geometry
     */
    connectWithTerminalId: function (fromTerminal, toTerminal, style, label, id, shapeId, geom) {
        var vertices, edge, fromPosition, toPosition, fromto, shape;

        fromPosition = this._RENDERER._getPositionFromTerminal(fromTerminal);
        fromPosition = [fromPosition.x, fromPosition.y];

        toPosition = this._RENDERER._getPositionFromTerminal(toTerminal);
        toPosition = [toPosition.x, toPosition.y];

        if (!geom) {
            vertices = [fromPosition, toPosition];
        } else {
            vertices = geom.vertices;
        }

        fromto = JSON.stringify(vertices[0]) + ',' + JSON.stringify(vertices[vertices.length - 1]);
        shape = eval('new ' + shapeId + '(' + fromto + ')');
        if (label) {
            shape.label = label;
        }

        if (geom) {
            if (geom.type === OG.Constants.GEOM_NAME[OG.Constants.GEOM_TYPE.POLYLINE]) {
                geom = new OG.geometry.PolyLine(geom.vertices);
                shape.geom = geom;
            } else if (geom.type === OG.Constants.GEOM_NAME[OG.Constants.GEOM_TYPE.CURVE]) {
                geom = new OG.geometry.Curve(geom.controlPoints);
                shape.geom = geom;
            }
        }
        edge = this.drawShape(null, shape, null, style, id, null, false);

        // connect
        edge = this._RENDERER.connect(fromTerminal, toTerminal, edge, style, label, true);

        if (edge) {
            this._HANDLER.setClickSelectable(edge, edge.shape.SELECTABLE);
            this._HANDLER.setMovable(edge, edge.shape.SELECTABLE && edge.shape.MOVABLE);
            this._HANDLER.setConnectGuide(edge, this._HANDLER._isConnectable(edge.shape));
            if (edge.shape.LABEL_EDITABLE) {
                this._HANDLER.enableEditLabel(edge);
            }
        }
        this.updateSlider();
        return edge;
    }
    ,

    /**
     * 연결속성정보를 삭제한다. Edge 인 경우는 라인만 삭제하고, 일반 Shape 인 경우는 연결된 모든 Edge 를 삭제한다.
     *
     * @param {Element} element
     */
    disconnect: function (element) {
        this._RENDERER.disconnect(element);
    }
    ,

    /**
     * 주어진 Shape 들을 그룹핑한다.
     *
     * @param {Element[]} elements
     * @return {Element} Group Shape Element
     */
    group: function (elements) {
        var group = this._RENDERER.group(elements);

        // enable event
        this._HANDLER.setClickSelectable(group, group.shape.SELECTABLE);
        this._HANDLER.setMovable(group, group.shape.SELECTABLE && group.shape.MOVABLE);
        if (group.shape.LABEL_EDITABLE) {
            this._HANDLER.enableEditLabel(group);
        }

        return group;
    }
    ,

    /**
     * 주어진 그룹들을 그룹해제한다.
     *
     * @param {Element[]} groupElements
     * @return {Element[]} ungrouped Elements
     */
    ungroup: function (groupElements) {
        return this._RENDERER.ungroup(groupElements);
    }
    ,

    /**
     * 주어진 Shape 들을 그룹에 추가한다.
     *
     * @param {Element} groupElement
     * @param {Element[]} elements
     */
    addToGroup: function (groupElement, elements) {
        this._RENDERER.addToGroup(groupElement, elements);
    }
    ,

    /**
     * 주어진 Shape 이 그룹인 경우 collapse 한다.
     *
     * @param {Element} element
     */
    collapse: function (element) {
        this._RENDERER.collapse(element);
    }
    ,

    /**
     * 주어진 Shape 이 그룹인 경우 expand 한다.
     *
     * @param {Element} element
     */
    expand: function (element) {
        this._RENDERER.expand(element);
    }
    ,

    /**
     * 드로잉된 모든 오브젝트를 클리어한다.
     */
    clear: function () {
        this._RENDERER.clear();
    }
    ,

    /**
     * Shape 을 캔버스에서 관련된 모두를 삭제한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    removeShape: function (element) {
        this._RENDERER.removeShape(element);
    }
    ,

    /**
     * 하위 엘리먼트만 제거한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    removeChild: function (element) {
        this._RENDERER.removeChild(element);
    }
    ,

    /**
     * ID에 해당하는 Element 의 Move & Resize 용 가이드를 제거한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    removeGuide: function (element) {
        this._RENDERER.removeGuide(element);
    }
    ,

    /**
     * 모든 Move & Resize 용 가이드를 제거한다.
     */
    removeAllGuide: function () {
        this._RENDERER.removeAllGuide();
    }
    ,

    /**
     * 랜더러 캔버스 Root Element 를 반환한다.
     *
     * @return {Element} Element
     */
    getRootElement: function () {
        return this._RENDERER.getRootElement();
    }
    ,

    /**
     * 랜더러 캔버스 Root Group Element 를 반환한다.
     *
     * @return {Element} Element
     */
    getRootGroup: function () {
        return this._RENDERER.getRootGroup();
    }
    ,

    /**
     * 주어진 지점을 포함하는 Top Element 를 반환한다.
     *
     * @param {Number[]} position 위치 좌표
     * @return {Element} Element
     */
    getElementByPoint: function (position) {
        return this._RENDERER.getElementByPoint(position);
    }
    ,

    /**
     * 주어진 Boundary Box 영역에 포함되는 Shape(GEOM, TEXT, IMAGE) Element 를 반환한다.
     * 모든 vertices를 포함한 엘리먼트를 반환한다.
     *
     * @param {OG.geometry.Envelope} envelope Boundary Box 영역
     * @return {Element[]} Element
     */
    getElementsByBBox: function (envelope) {
        return this._RENDERER.getElementsByBBox(envelope);
    }
    ,

    /**
     * 엘리먼트에 속성값을 설정한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Object} attribute 속성값
     */
    setAttr: function (element, attribute) {
        this._RENDERER.setAttr(element, attribute);
    }
    ,

    /**
     * 엘리먼트 속성값을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {String} attrName 속성이름
     * @return {Object} attribute 속성값
     */
    getAttr: function (element, attrName) {
        return this._RENDERER.getAttr(element, attrName);
    }
    ,

    /**
     * ID에 해당하는 Element 를 최상단 레이어로 이동한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    toFront: function (element) {
        this._RENDERER.toFront(element);
    }
    ,

    /**
     * ID에 해당하는 Element 를 최하단 레이어로 이동한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    toBack: function (element) {
        this._RENDERER.toBack(element);
    }
    ,

    /**
     * ID에 해당하는 Element 를 앞으로 한단계 이동한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    bringForward: function (element) {
        this._RENDERER.bringForward(element);
    },

    /**
     * ID에 해당하는 Element 를 뒤로 한단계 이동한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    sendBackward: function (element) {
        this._RENDERER.sendBackward(element);
    },

    /**
     * 랜더러 캔버스의 사이즈(Width, Height)를 반환한다.
     *
     * @return {Number[]} Canvas Width, Height
     */
    getCanvasSize: function () {
        return this._RENDERER.getCanvasSize();
    }
    ,

    /**
     * 랜더러 캔버스의 사이즈(Width, Height)를 변경한다.
     *
     * @param {Number[]} size Canvas Width, Height
     */
    setCanvasSize: function (size) {
        this._RENDERER.setCanvasSize(size);
    }
    ,

    /**
     * 랜더러 캔버스의 사이즈(Width, Height)를 실제 존재하는 Shape 의 영역에 맞게 변경한다.
     *
     * @param {Number[]} minSize Canvas 최소 Width, Height
     * @param {Boolean} fitScale 주어진 minSize 에 맞게 fit 여부(Default:false)
     */
    fitCanvasSize: function (minSize, fitScale) {
        this._RENDERER.fitCanvasSize(minSize, fitScale);
    }
    ,

    /**
     * 새로운 View Box 영역을 설정한다. (ZoomIn & ZoomOut 가능)
     *
     * @param {Number[]} position 위치 좌표(좌상단 기준)
     * @param {Number[]} size Canvas Width, Height
     * @param {Boolean} isFit Fit 여부
     */
    setViewBox: function (position, size, isFit) {
        this._RENDERER.setViewBox(position, size, isFit);
    }
    ,

    /**
     * Scale 을 반환한다. (리얼 사이즈 : Scale = 1)
     *
     * @return {Number} 스케일값
     */
    getScale: function () {
        return this._RENDERER.getScale();
    }
    ,

    /**
     * Scale 을 설정한다. (리얼 사이즈 : Scale = 1)
     *
     * @param {Number} scale 스케일값
     */
    setScale: function (scale) {
        this._RENDERER.setScale(scale);
    }
    ,

    /**
     * ID에 해당하는 Element 를 캔버스에서 show 한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    show: function (element) {
        this._RENDERER.show(element);
    }
    ,

    /**
     * ID에 해당하는 Element 를 캔버스에서 hide 한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    hide: function (element) {
        this._RENDERER.hide(element);
    }
    ,

    /**
     * Source Element 를 Target Element 아래에 append 한다.
     *
     * @param {Element|String} srcElement Element 또는 ID
     * @param {Element|String} targetElement Element 또는 ID
     * @return {Element} Source Element
     */
    appendChild: function (srcElement, targetElement) {
        return this._RENDERER.appendChild(srcElement, targetElement);
    }
    ,

    /**
     * Source Element 를 Target Element 이후에 insert 한다.
     *
     * @param {Element|String} srcElement Element 또는 ID
     * @param {Element|String} targetElement Element 또는 ID
     * @return {Element} Source Element
     */
    insertAfter: function (srcElement, targetElement) {
        return this._RENDERER.insertAfter(srcElement, targetElement);
    }
    ,

    /**
     * Source Element 를 Target Element 이전에 insert 한다.
     *
     * @param {Element|String} srcElement Element 또는 ID
     * @param {Element|String} targetElement Element 또는 ID
     * @return {Element} Source Element
     */
    insertBefore: function (srcElement, targetElement) {
        return this._RENDERER.insertBefore(srcElement, targetElement);
    }
    ,

    /**
     * 해당 Element 를 가로, 세로 Offset 만큼 이동한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Number[]} offset [가로, 세로]
     * @return {Element} Element
     */
    move: function (element, offset) {
        return this._RENDERER.move(element, offset);
    }
    ,

    /**
     * 주어진 중심좌표로 해당 Element 를 이동한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Number[]} position [x, y]
     * @return {Element} Element
     */
    moveCentroid: function (element, position) {
        return this._RENDERER.moveCentroid(element, position);
    }
    ,

    /**
     * 중심 좌표를 기준으로 주어진 각도 만큼 회전한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Number} angle 각도
     * @return {Element} Element
     */
    rotate: function (element, angle) {
        return this._RENDERER.rotate(element, angle);
    }
    ,

    /**
     * 상, 하, 좌, 우 외곽선을 이동한 만큼 리사이즈 한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Number[]} offset [상, 하, 좌, 우] 각 방향으로 + 값
     * @return {Element} Element
     */
    resize: function (element, offset) {
        return this._RENDERER.resize(element, offset);
    }
    ,

    /**
     * 중심좌표는 고정한 채 Bounding Box 의 width, height 를 리사이즈 한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Number[]} size [Width, Height]
     * @return {Element} Element
     */
    resizeBox: function (element, size) {
        return this._RENDERER.resizeBox(element, size);
    }
    ,

    /**
     * 노드 Element 를 복사한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Element} Element
     */
    clone: function (element) {
        return this._RENDERER.clone(element);
    }
    ,

    /**
     * ID에 해당하는 Element 의 바운더리 영역을 리턴한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {OG.geometry.Envelope} Envelope 영역
     */
    getBoundary: function (element) {
        return this._RENDERER.getBoundary(element);
    },

    /**
     * ID로 Node Element 를 반환한다.
     *
     * @param {String} id
     * @return {Element} Element
     */
    getElementById: function (id) {
        return this._RENDERER.getElementById(id);
    }
    ,

    /**
     * Shape 타입에 해당하는 Node Element 들을 반환한다.
     *
     * @param {String} shapeType Shape 타입(GEOM, HTML, IMAGE, EDGE, GROUP), Null 이면 모든 타입
     * @param {String} excludeType 제외 할 타입
     * @return {Element[]} Element's Array
     */
    getElementsByType: function (shapeType, excludeType) {
        return this._RENDERER.getElementsByType(shapeType, excludeType);
    }
    ,

    /**
     * Shape ID에 해당하는 Node Element 들을 반환한다.
     *
     * @param {String} shapeId Shape ID
     * @return {Element[]} Element's Array
     */
    getElementsByShapeId: function (shapeId) {
        var root = this.getRootGroup();
        return $(root).find("[_type=SHAPE][_shape_id='" + shapeId + "']");
    }
    ,

    /**
     * Edge 엘리먼트와 연결된 fromShape, toShape 엘리먼트를 반환한다.
     *
     * @param {Element|String} edgeElement Element 또는 ID
     * @return {Object}
     */
    getRelatedElementsFromEdge: function (edgeElement) {
        var me = this,
            edge = OG.Util.isElement(edgeElement) ? edgeElement : this.getElementById(edgeElement),
            getShapeFromTerminal = function (terminal) {
                if (terminal) {
                    return me._RENDERER.getElementById(terminal.substring(0, terminal.indexOf(OG.Constants.TERMINAL)));
                } else {
                    return null;
                }
            };


        if ($(edge).attr('_shape') === OG.Constants.SHAPE_TYPE.EDGE) {
            return {
                from: getShapeFromTerminal($(edgeElement).attr('_from')),
                to: getShapeFromTerminal($(edgeElement).attr('_to'))
            };
        } else {
            return {
                from: null,
                to: null
            };
        }
    }
    ,
    /**
     * 부모 엘리먼트를 반환한다. 부모가 루트일때는 반환하지 않는다.
     *
     * @param {Element} Element  엘리먼트
     * @return {Element} Element  엘리먼트
     */
    getParent: function (element) {
        return this._RENDERER.getParent(element);
    },

    /**
     * 그룹의 하위 엘리먼트를 반환한다.
     *
     * @param {Element} element  엘리먼트
     * @returns {Array} Elements
     */
    getChilds: function (element) {
        return this._RENDERER.getChilds(element);
    },

    /**
     * 캔버스의 모든 Shape 들을 리턴
     *
     * @return {Array} Elements
     */
    getAllShapes: function () {
        return this._RENDERER.getAllShapes();
    },

    /**
     * 캔버스의 모든 Edge를 리턴
     *
     * @return {Array} Edge Elements
     */
    getAllEdges: function () {
        return this._RENDERER.getAllEdges();
    },

    /**
     * 해당 엘리먼트의 BoundingBox 영역 정보를 반환한다.
     *
     * @param {Element|String} element
     * @return {Object} {width, height, x, y, x2, y2}
     */
    getBBox: function (element) {
        return this._RENDERER.getBBox(element);
    }
    ,

    /**
     * 부모노드기준으로 캔버스 루트 엘리먼트의 BoundingBox 영역 정보를 반환한다.
     *
     * @return {Object} {width, height, x, y, x2, y2}
     */
    getRootBBox: function () {
        return this._RENDERER.getRootBBox();
    }
    ,

    /**
     * 부모노드기준으로 캔버스 루트 엘리먼트의 실제 Shape 이 차지하는 BoundingBox 영역 정보를 반환한다.
     *
     * @return {Object} {width, height, x, y, x2, y2}
     */
    getRealRootBBox: function () {
        return this._RENDERER.getRealRootBBox();
    }
    ,

    /**
     * SVG 인지 여부를 반환한다.
     *
     * @return {Boolean} svg 여부
     */
    isSVG: function () {
        return this._RENDERER.isSVG();
    }
    ,

    /**
     * VML 인지 여부를 반환한다.
     *
     * @return {Boolean} vml 여부
     */
    isVML: function () {
        return this._RENDERER.isVML();
    }
    ,

    /**
     * 주어진 Shape 엘리먼트에 커스텀 데이타를 저장한다.
     *
     * @param {Element|String} shapeElement Shape DOM Element or ID
     * @param {Object} data JSON 포맷의 Object
     */
    setCustomData: function (shapeElement, data) {
        var element = OG.Util.isElement(shapeElement) ? shapeElement : document.getElementById(shapeElement);
        element.data = data;
    }
    ,

    /**
     * 주어진 Shape 엘리먼트에 저장된 커스텀 데이터를 반환한다.
     *
     * @param {Element|String} shapeElement Shape DOM Element or ID
     * @return {Object} JSON 포맷의 Object
     */
    getCustomData: function (shapeElement) {
        var element = OG.Util.isElement(shapeElement) ? shapeElement : document.getElementById(shapeElement);
        return element.data;
    }
    ,

    /**
     * 주어진 Shape 엘리먼트에 확장 커스텀 데이타를 저장한다.
     *
     * @param {Element|String} shapeElement Shape DOM Element or ID
     * @param {Object} data JSON 포맷의 Object
     */
    setExtCustomData: function (shapeElement, data) {
        var element = OG.Util.isElement(shapeElement) ? shapeElement : document.getElementById(shapeElement);
        element.dataExt = data;
    }
    ,

    /**
     * 주어진 Shape 엘리먼트에 저장된 확장 커스텀 데이터를 반환한다.
     *
     * @param {Element|String} shapeElement Shape DOM Element or ID
     * @return {Object} JSON 포맷의 Object
     */
    getExtCustomData: function (shapeElement) {
        var element = OG.Util.isElement(shapeElement) ? shapeElement : document.getElementById(shapeElement);
        return element.dataExt;
    }
    ,

    /**
     *    Canvas 에 그려진 Shape 들을 OpenGraph XML 문자열로 export 한다.
     *
     * @return {String} XML 문자열
     */
    toXML: function () {
        return OG.Util.jsonToXml(this.toJSON());
    }
    ,

    /**
     * Canvas 에 그려진 Shape 들을 OpenGraph JSON 객체로 export 한다.
     *
     * @return {Object} JSON 포맷의 Object
     */
    toJSON: function () {
        var CANVAS = this,
            rootBBox = this._RENDERER.getRootBBox(),
            rootGroup = this._RENDERER.getRootGroup(),
            jsonObj = {
                opengraph: {
                    '@width': rootBBox.width,
                    '@height': rootBBox.height,
                    cell: []
                }
            },
            childShape, i, cellMap;

        cellMap = {};

        childShape = function (node) {
            $(node).find("[_type=SHAPE]").each(function (idx, item) {
                // push cell to array
                var shape = item.shape,
                    style = item.shape.geom.style.map,
                    geom = shape.geom,
                    envelope = geom.getBoundary(),
                    cell = {},
                    vertices,
                    from,
                    to,
                    prevShapeIds,
                    nextShapeIds;

                cell['@id'] = $(item).attr('id');
                if ($(item).parent().attr('id') === $(node).attr('id')) {
                    cell['@parent'] = $(node).attr('id');
                } else {
                    cell['@parent'] = $(item).parent().attr('id');
                }
                cell['@shapeType'] = shape.TYPE;
                cell['@shapeId'] = shape.SHAPE_ID;
                cell['@x'] = envelope.getCentroid().x;
                cell['@y'] = envelope.getCentroid().y;
                cell['@width'] = envelope.getWidth();
                cell['@height'] = envelope.getHeight();
                if (style) {
                    cell['@style'] = escape(OG.JSON.encode(style));
                }

                if (shape.TYPE === OG.Constants.SHAPE_TYPE.EDGE) {
                    if ($(item).attr('_from')) {
                        cell['@from'] = $(item).attr('_from');
                    }
                    if ($(item).attr('_to')) {
                        cell['@to'] = $(item).attr('_to');
                    }
                } else {
                    prevShapeIds = CANVAS.getPrevShapeIds(item);
                    nextShapeIds = CANVAS.getNextShapeIds(item);
                    if (prevShapeIds.length > 0) {
                        cell['@from'] = prevShapeIds.toString();
                    }
                    if (nextShapeIds.length > 0) {
                        cell['@to'] = nextShapeIds.toString();
                    }
                }

                if ($(item).attr('_fromedge')) {
                    cell['@fromEdge'] = $(item).attr('_fromedge');
                }
                if ($(item).attr('_toedge')) {
                    cell['@toEdge'] = $(item).attr('_toedge');
                }
                if (shape.label) {
                    cell['@label'] = escape(shape.label);
                }
                if (shape.fromLabel) {
                    cell['@fromLabel'] = escape(shape.fromLabel);
                }
                if (shape.toLabel) {
                    cell['@toLabel'] = escape(shape.toLabel);
                }
                if (shape.angle && shape.angle !== 0) {
                    cell['@angle'] = shape.angle;
                }
                if (shape instanceof OG.shape.ImageShape) {
                    cell['@value'] = shape.image;
                } else if (shape instanceof OG.shape.HtmlShape) {
                    cell['@value'] = escape(shape.html);
                } else if (shape instanceof OG.shape.TextShape) {
                    cell['@value'] = escape(shape.text);
                } else if (shape instanceof OG.shape.EdgeShape) {
                    vertices = geom.getVertices();
                    cell['@value'] = '';
                    for (i = 0; i < vertices.length; i++) {
                        cell['@value'] = cell['@value'] + vertices[i];
                        if (i < vertices.length - 1) {
                            cell['@value'] = cell['@value'] + ','
                        }
                    }
                }
                if (geom) {
                    cell['@geom'] = escape(geom.toString());
                }
                if (item.data) {
                    cell['@data'] = escape(OG.JSON.encode(item.data));
                }
                if (item.dataExt) {
                    cell['@dataExt'] = escape(OG.JSON.encode(item.dataExt));
                }
                if (shape.LoopType) {
                    cell['@loopType'] = shape.LoopType;
                }
                if (shape.TaskType) {
                    cell['@taskType'] = shape.TaskType;
                }
                if (shape.exceptionType) {
                    cell['@exceptionType'] = shape.exceptionType;
                }

                cell['@childs'] = [];
                jsonObj.opengraph.cell.push(cell);

                // gathering Cell Map
                cellMap[cell["@id"]] = cell;
            });
        };

        if (rootGroup.data) {
            jsonObj.opengraph['@data'] = escape(OG.JSON.encode(rootGroup.data));
        }
        if (rootGroup.dataExt) {
            jsonObj.opengraph['@dataExt'] = escape(OG.JSON.encode(rootGroup.dataExt));
        }

        //root check
        childShape(rootGroup, true);

        return jsonObj;
    }
    ,

    /**
     * OpenGraph XML 문자열로 부터 Shape 을 드로잉한다.
     *
     * @param {String| Element} xml XML 문자열 또는 DOM Element
     * @return {Object} {width, height, x, y, x2, y2}
     */
    loadXML: function (xml) {
        if (!OG.Util.isElement(xml)) {
            xml = OG.Util.parseXML(xml);
        }
        return this.loadJSON(OG.Util.xmlToJson(xml));
    }
    ,

    alignLeft: function () {
        this._RENDERER.alignLeft();
    }
    ,

    alignRight: function () {
        this._RENDERER.alignRight();
    }
    ,

    alignTop: function () {
        this._RENDERER.alignTop();
    }
    ,

    alignBottom: function () {
        this._RENDERER.alignBottom();
    }
    ,

    /**
     * JSON 객체로 부터 Shape 을 드로잉한다.
     *
     * @param {Object} json JSON 포맷의 Object
     * @return {Object} {width, height, x, y, x2, y2}
     */
    loadJSON: function (json) {
        var canvasWidth, canvasHeight, rootGroup,
            minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE,
            i, cell, shape, id, parent, shapeType, shapeId, x, y, width, height, style, geom, from, to,
            fromEdge, toEdge, label, fromLabel, toLabel, angle, value, data, dataExt, element, loopType, taskType, swimlane;

        this._RENDERER.clear();

        if (json && json.opengraph && json.opengraph.cell && OG.Util.isArray(json.opengraph.cell)) {
            canvasWidth = json.opengraph['@width'];
            canvasHeight = json.opengraph['@height'];

            data = json.opengraph['@data'];
            dataExt = json.opengraph['@dataExt'];
            if (data) {
                rootGroup = this.getRootGroup();
                rootGroup.data = OG.JSON.decode(unescape(data));
            }
            if (dataExt) {
                rootGroup = this.getRootGroup();
                rootGroup.dataExt = OG.JSON.decode(unescape(dataExt));
            }

            cell = json.opengraph.cell;
            for (i = 0; i < cell.length; i++) {
                id = cell[i]['@id'];
                parent = cell[i]['@parent'];
                swimlane = cell[i]['@swimlane'];
                shapeType = cell[i]['@shapeType'];
                shapeId = cell[i]['@shapeId'];
                x = parseInt(cell[i]['@x'], 10);
                y = parseInt(cell[i]['@y'], 10);
                width = parseInt(cell[i]['@width'], 10);
                height = parseInt(cell[i]['@height'], 10);
                style = unescape(cell[i]['@style']);
                geom = unescape(cell[i]['@geom']);

                from = cell[i]['@from'];
                to = cell[i]['@to'];
                fromEdge = cell[i]['@fromEdge'];
                toEdge = cell[i]['@toEdge'];
                label = cell[i]['@label'];
                fromLabel = cell[i]['@fromLabel'];
                toLabel = cell[i]['@toLabel'];
                angle = cell[i]['@angle'];
                value = cell[i]['@value'];
                data = cell[i]['@data'];
                dataExt = cell[i]['@dataExt'];
                loopType = cell[i]['@loopType'];
                taskType = cell[i]['@taskType'];

                label = label ? unescape(label) : label;

                minX = (minX > (x - width / 2)) ? (x - width / 2) : minX;
                minY = (minY > (y - height / 2)) ? (y - height / 2) : minY;
                maxX = (maxX < (x + width / 2)) ? (x + width / 2) : maxX;
                maxY = (maxY < (y + height / 2)) ? (y + height / 2) : maxY;

                switch (shapeType) {
                    case OG.Constants.SHAPE_TYPE.GEOM:
                    case OG.Constants.SHAPE_TYPE.GROUP:
                        shape = eval('new ' + shapeId + '()');
                        if (label) {
                            shape.label = label;
                        }
                        element = this.drawShape([x, y], shape, [width, height], OG.JSON.decode(style), id, parent, false);
                        if (element.shape instanceof OG.shape.bpmn.A_Task) {
                            element.shape.LoopType = loopType;
                            element.shape.TaskType = taskType;
                        }
                        break;
                    case OG.Constants.SHAPE_TYPE.EDGE:
                        var list = JSON.parse('[' + value + ']');
                        var fromto = JSON.stringify(list[0]) + ',' + JSON.stringify(list[list.length - 1]);
                        shape = eval('new ' + shapeId + '(' + fromto + ')');
                        if (label) {
                            shape.label = label;
                        }
                        if (fromLabel) {
                            shape.fromLabel = unescape(fromLabel);
                        }
                        if (toLabel) {
                            shape.toLabel = unescape(toLabel);
                        }
                        if (geom) {
                            geom = OG.JSON.decode(geom);
                            if (geom.type === OG.Constants.GEOM_NAME[OG.Constants.GEOM_TYPE.POLYLINE]) {
                                geom = new OG.geometry.PolyLine(geom.vertices);
                                shape.geom = geom;
                            } else if (geom.type === OG.Constants.GEOM_NAME[OG.Constants.GEOM_TYPE.CURVE]) {
                                geom = new OG.geometry.Curve(geom.controlPoints);
                                shape.geom = geom;
                            }
                        }
                        element = this.drawShape(null, shape, null, OG.JSON.decode(style), id, parent, false);
                        break;
                    case OG.Constants.SHAPE_TYPE.HTML:
                        shape = eval('new ' + shapeId + '()');
                        if (value) {
                            shape.html = unescape(value);
                        }
                        if (label) {
                            shape.label = label;
                        }
                        element = this.drawShape([x, y], shape, [width, height, angle], OG.JSON.decode(style), id, parent, false);
                        break;
                    case OG.Constants.SHAPE_TYPE.IMAGE:
                        shape = eval('new ' + shapeId + '(\'' + value + '\')');
                        if (label) {
                            shape.label = label;
                        }
                        element = this.drawShape([x, y], shape, [width, height, angle], OG.JSON.decode(style), id, parent, false);
                        break;
                    case OG.Constants.SHAPE_TYPE.TEXT:
                        shape = eval('new ' + shapeId + '()');
                        if (value) {
                            shape.text = unescape(value);
                        }
                        element = this.drawShape([x, y], shape, [width, height, angle], OG.JSON.decode(style), id, parent, false);
                        break;
                }

                if (from) {
                    $(element).attr('_from', from);
                }
                if (to) {
                    $(element).attr('_to', to);
                }
                if (fromEdge) {
                    $(element).attr('_fromedge', fromEdge);
                }
                if (toEdge) {
                    $(element).attr('_toedge', toEdge);
                }

                if (data) {
                    element.data = OG.JSON.decode(unescape(data));
                }
                if (dataExt) {
                    element.dataExt = OG.JSON.decode(unescape(dataExt));
                }
            }

            this.setCanvasSize([canvasWidth, canvasHeight]);

            return {
                width: maxX - minX,
                height: maxY - minY,
                x: minX,
                y: minY,
                x2: maxX,
                y2: maxY
            };
        }

        return {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            x2: 0,
            y2: 0
        };
    }
    ,

    /**
     * 캔버스 undo.
     */
    undo: function () {
        this._RENDERER.undo();
    }
    ,

    /**
     * 캔버스 redo.
     */
    redo: function () {
        this._RENDERER.redo();
    }
    ,

    /**
     * 연결된 이전 Edge Element 들을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Element[]} Previous Element's Array
     */
    getPrevEdges: function (element) {
        return this._RENDERER.getPrevEdges(element);
    }
    ,

    /**
     * 연결된 이후 Edge Element 들을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Element[]} Previous Element's Array
     */
    getNextEdges: function (element) {
        return this._RENDERER.getNextEdges(element);
    }
    ,

    /**
     * 연결된 이전 노드 Element 들을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Element[]} Previous Element's Array
     */
    getPrevShapes: function (element) {
        return this._RENDERER.getPrevShapes(element);
    }
    ,

    /**
     * 연결된 이전 노드 Element ID들을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {String[]} Previous Element Id's Array
     */
    getPrevShapeIds: function (element) {
        return this._RENDERER.getPrevShapeIds(element);
    }
    ,

    /**
     * 연결된 이후 노드 Element 들을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Element[]} Previous Element's Array
     */
    getNextShapes: function (element) {
        return this._RENDERER.getNextShapes(element);
    }
    ,

    /**
     * 연결된 이후 노드 Element ID들을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {String[]} Previous Element Id's Array
     */
    getNextShapeIds: function (element) {
        return this._RENDERER.getNextShapeIds(element);
    }
    ,

    /**
     * Shape 이 처음 Draw 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, shapeElement)
     */
    onDrawShape: function (callbackFunc) {
        $(this.getRootElement()).bind('drawShape', function (event, shapeElement) {
            callbackFunc(event, shapeElement);
        });
    }
    ,

    /**
     * Undo 되었을때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event)
     */
    onUndo: function (callbackFunc) {
        $(this.getRootElement()).bind('undo', function (event) {
            callbackFunc(event);
        });
    }
    ,

    /**
     * Redo 되었을때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event)
     */
    onRedo: function (callbackFunc) {
        $(this.getRootElement()).bind('redo', function (event) {
            callbackFunc(event);
        });
    }
    ,

    /**
     * Lane 이 divide 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, dividedLane)
     */
    onDivideLane: function (callbackFunc) {
        $(this.getRootElement()).bind('divideLane', function (event, dividedLane) {
            callbackFunc(event, dividedLane);
        });
    }
    ,

    /**
     * 라벨이 Draw 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, shapeElement, labelText)
     */
    onDrawLabel: function (callbackFunc) {
        $(this.getRootElement()).bind('drawLabel', function (event, shapeElement, labelText) {
            callbackFunc(event, shapeElement, labelText);
        })
    }
    ,

    /**
     * 라벨이 Change 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, shapeElement, afterText, beforeText)
     */
    onLabelChanged: function (callbackFunc) {
        $(this.getRootElement()).bind('labelChanged', function (event, shapeElement, afterText, beforeText) {
            callbackFunc(event, shapeElement, afterText, beforeText);
        });
    }
    ,

    /**
     * 라벨이 Change 되기전 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, shapeElement, afterText, beforeText)
     */
    onBeforeLabelChange: function (callbackFunc) {
        $(this.getRootElement()).bind('beforeLabelChange', function (event) {
            if (callbackFunc(event, event.element, event.afterText, event.beforeText) === false) {
                event.stopPropagation();
            }
        });
    }
    ,

    /**
     * Shape 이 Redraw 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, shapeElement)
     */
    onRedrawShape: function (callbackFunc) {
        $(this.getRootElement()).bind('redrawShape', function (event, shapeElement) {
            callbackFunc(event, shapeElement);
        });
    }
    ,

    /**
     * Shape 이 Remove 될 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, shapeElement)
     */
    onRemoveShape: function (callbackFunc) {
        $(this.getRootElement()).bind('removeShape', function (event, shapeElement) {
            callbackFunc(event, shapeElement);
        });
    }
    ,

    /**
     * Shape 이 Rotate 될 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, element, angle)
     */
    onRotateShape: function (callbackFunc) {
        $(this.getRootElement()).bind('rotateShape', function (event, element, angle) {
            callbackFunc(event, element, angle);
        });
    }
    ,

    /**
     * Shape 이 Move 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, shapeElement, offset)
     */
    onMoveShape: function (callbackFunc) {
        $(this.getRootElement()).bind('moveShape', function (event, shapeElement, offset) {
            callbackFunc(event, shapeElement, offset);
        });
    }
    ,

    /**
     * Shape 이 Resize 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, shapeElement, offset)
     */
    onResizeShape: function (callbackFunc) {
        $(this.getRootElement()).bind('resizeShape', function (event, shapeElement, offset) {
            callbackFunc(event, shapeElement, offset);
        });
    }
    ,

    /**
     * Shape 이 Connect 되기전 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, edgeElement, fromElement, toElement)
     */
    onBeforeConnectShape: function (callbackFunc) {
        $(this.getRootElement()).bind('beforeConnectShape', function (event) {
            if (callbackFunc(event, event.edge, event.fromShape, event.toShape) === false) {
                event.stopPropagation();
            }
        });
    }
    ,

    /**
     * Shape 이 Remove 되기전 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, element)
     */
    onBeforeRemoveShape: function (callbackFunc) {
        $(this.getRootElement()).bind('beforeRemoveShape', function (event) {
            if (callbackFunc(event, event.element) === false) {
                event.stopPropagation();
            }
        });
    }
    ,

    /**
     * Shape 이 Connect 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, edgeElement, fromElement, toElement)
     */
    onConnectShape: function (callbackFunc) {
        $(this.getRootElement()).bind('connectShape', function (event, edgeElement, fromElement, toElement) {
            callbackFunc(event, edgeElement, fromElement, toElement);
        });
    }
    ,

    /**
     * Shape 이 Disconnect 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, edgeElement, fromElement, toElement)
     */
    onDisconnectShape: function (callbackFunc) {
        $(this.getRootElement()).bind('disconnectShape', function (event, edgeElement, fromElement, toElement) {
            callbackFunc(event, edgeElement, fromElement, toElement);
        });
    }
    ,

    /**
     * Shape 이 Grouping 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, groupElement)
     */
    onGroup: function (callbackFunc) {
        $(this.getRootElement()).bind('group', function (event, groupElement) {
            callbackFunc(event, groupElement);
        });
    }
    ,

    /**
     * Shape 이 UnGrouping 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, ungroupedElements)
     */
    onUnGroup: function (callbackFunc) {
        $(this.getRootElement()).bind('ungroup', function (event, ungroupedElements) {
            callbackFunc(event, ungroupedElements);
        });
    }
    ,

    /**
     * Group 이 Collapse 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, element)
     */
    onCollapsed: function (callbackFunc) {
        $(this.getRootElement()).bind('collapsed', function (event, element) {
            callbackFunc(event, element);
        });
    }
    ,

    /**
     * Group 이 Expand 되었을 때의 이벤트 리스너
     *
     * @param {Function} callbackFunc 콜백함수(event, element)
     */
    onExpanded: function (callbackFunc) {
        $(this.getRootElement()).bind('expanded', function (event, element) {
            callbackFunc(event, element);
        });
    }
}
;
OG.graph.Canvas.prototype.constructor = OG.graph.Canvas;
OG.Canvas = OG.graph.Canvas;