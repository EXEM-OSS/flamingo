/**
 * 도형의 Style 과 Shape 정보를 통해 캔버스에 렌더링 기능을 정의한 인터페이스
 *
 * @class
 * @requires OG.common.*
 * @requires OG.geometry.*
 * @requires OG.shape.*
 *
 * @param {HTMLElement|String} container 컨테이너 DOM element or ID
 * @param {Number[]} containerSize 컨테이너 Width, Height
 * @param {String} backgroundColor 캔버스 배경색
 * @param {String} backgroundImage 캔버스 배경이미지
 * @param {Object} config Configuration
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 */
OG.renderer.IRenderer = function (container, containerSize, backgroundColor, backgroundImage, config) {
    this._CONFIG = null;
    this._PAPER = null;
    this._ROOT_GROUP = null;
    this._ETC_GROUP = null;
    this._ID_PREFIX = Math.round(Math.random() * 10000);
    this._LAST_ID = 0;
    this._ELE_MAP = new OG.HashMap();
};

OG.renderer.IRenderer.prototype = {

    /**
     * ID를 generate 한다.
     *
     * @return {String} ID
     * @private
     */
    _genId: function () {
        var id = "OG_" + this._ID_PREFIX + "_" + this._LAST_ID;
        this._LAST_ID++;
        return id;
    },

    /**
     * 시작좌표, 끝좌표를 연결하는 베지어 곡선의 콘트롤 포인트를 반환한다.
     *
     * @param {Number[]} from 시작좌표
     * @param {Number[]} to 끝좌표
     * @param {String} fromDirection 방향(E,W,S,N)
     * @param {String} toDirection 방향(E,W,S,N)
     * @return {Number[][]} [시작좌표, 콘트롤포인트1, 콘트롤포인트2, 끝좌표]
     * @private
     */
    _bezierCurve: function (from, to, fromDirection, toDirection) {
        var coefficient = 100, direction1 = [1, 0], direction2 = [-1, 0],
            distance, d1, d2, bezierPoints = [];

        distance = Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
        if (distance < coefficient) {
            coefficient = distance / 2;
        }

        switch (fromDirection.toLowerCase()) {
            case "e":
                direction1 = [1, 0];
                break;
            case "w":
                direction1 = [-1, 0];
                break;
            case "s":
                direction1 = [0, 1];
                break;
            case "n":
                direction1 = [0, -1];
                break;
            default:
                direction1 = [1, 0];
                break;
        }

        switch (toDirection.toLowerCase()) {
            case "e":
                direction2 = [1, 0];
                break;
            case "w":
                direction2 = [-1, 0];
                break;
            case "s":
                direction2 = [0, 1];
                break;
            case "n":
                direction2 = [0, -1];
                break;
            default:
                direction2 = [-1, 0];
                break;
        }

        // Calculating the direction vectors d1 and d2
        d1 = [direction1[0] * coefficient, direction1[1] * coefficient];
        d2 = [direction2[0] * coefficient, direction2[1] * coefficient];

        // Bezier Curve Poinsts(from, control_point1, control_point2, to)
        bezierPoints[0] = from;
        bezierPoints[1] = [from[0] + d1[0], from[1] + d1[1]];
        bezierPoints[2] = [to[0] + d2[0], to[1] + d2[1]];
        bezierPoints[3] = to;

        return bezierPoints;
    },

    /**
     * Edge Direction 을 보정한다.
     *
     * @param {Number[]} from 시작위치
     * @param {Number[]} to 끝위치
     * @return {String[]} edge-direction 보정된 edge-direction
     * @private
     */
    _adjustEdgeDirection: function (from, to) {
        var fromDrct, toDrct;
        var fromXY = {x: from[0], y: from[1]}, toXY = {x: to[0], y: to[1]};

        if (fromXY.x <= toXY.x && fromXY.y <= toXY.y) {
            if (Math.abs(toXY.x - fromXY.x) > Math.abs(toXY.y - fromXY.y)) {
                fromDrct = "e";
                toDrct = "w";
            } else {
                fromDrct = "s";
                toDrct = "n";
            }
        } else if (fromXY.x <= toXY.x && fromXY.y > toXY.y) {
            if (Math.abs(toXY.x - fromXY.x) > Math.abs(toXY.y - fromXY.y)) {
                fromDrct = "e";
                toDrct = "w";
            } else {
                fromDrct = "n";
                toDrct = "s";
            }
        } else if (fromXY.x > toXY.x && fromXY.y <= toXY.y) {
            if (Math.abs(toXY.x - fromXY.x) > Math.abs(toXY.y - fromXY.y)) {
                fromDrct = "w";
                toDrct = "e";
            } else {
                fromDrct = "s";
                toDrct = "n";
            }
        } else if (fromXY.x > toXY.x && fromXY.y > toXY.y) {
            if (Math.abs(toXY.x - fromXY.x) > Math.abs(toXY.y - fromXY.y)) {
                fromDrct = "w";
                toDrct = "e";
            } else {
                fromDrct = "n";
                toDrct = "s";
            }
        }

        return [fromDrct, toDrct];
    },

    /**
     * 터미널로부터 부모 Shape element 를 찾아 반환한다.
     *
     * @param {Element|String} terminal 터미널 Element or ID
     * @return {Element} Shape element
     * @private
     */
    _getShapeFromTerminal: function (terminal) {
        var element;
        if (terminal) {
            var shapeId = terminal.substring(0, terminal.indexOf(OG.Constants.TERMINAL));
            element = this.getElementById(shapeId);
        }
        return element;
    },

    /**
     * Shape 을 캔버스에 위치 및 사이즈 지정하여 드로잉한다.
     *
     * @example
     * renderer.drawShape([100, 100], new OG.CircleShape(), [50, 50], {stroke:'red'});
     *
     * @param {Number[]} position 드로잉할 위치 좌표(중앙 기준)
     * @param {OG.shape.IShape} shape Shape
     * @param {Number[]} size Shape Width, Height
     * @param {OG.geometry.Style|Object} style 스타일
     * @param {String} id Element ID 지정
     * @return {Element} Group DOM Element with geometry
     */
    drawShape: function (position, shape, size, style, id) {
        throw new OG.NotImplementedException();
    },

    /**
     * Geometry 를 캔버스에 드로잉한다.
     *
     * @param {OG.geometry.Geometry} geometry 기하 객체
     * @param {OG.geometry.Style|Object} style 스타일
     * @return {Element} Group DOM Element with geometry
     */
    drawGeom: function (geometry, style, id) {
        throw new OG.NotImplementedException();
    },

    /**
     * Text 를 캔버스에 위치 및 사이즈 지정하여 드로잉한다.
     * (스타일 'text-anchor': 'start' or 'middle' or 'end' 에 따라 위치 기준이 다름)
     *
     * @example
     * renderer.drawText([100, 100], 'Hello', null, {'text-anchor':'start'});
     *
     * @param {Number[]} position 드로잉할 위치 좌표(스타일 'text-anchor': 'start' or 'middle' or 'end' 에 따라 기준이 다름)
     * @param {String} text 텍스트
     * @param {Number[]} size Text Width, Height, Angle
     * @param {OG.geometry.Style|Object} style 스타일
     * @param {String} id Element ID 지정
     * @return {Element} DOM Element
     */
    drawText: function (position, text, size, style, id) {
        throw new OG.NotImplementedException();
    },

    /**
     * Image 를 캔버스에 위치 및 사이즈 지정하여 드로잉한다.
     *
     * @example
     * renderer.drawImage([100, 100], 'img.jpg', [50, 50]);
     *
     * @param {Number[]} position 드로잉할 위치 좌표(좌상단 기준)
     * @param {String} imgSrc 이미지경로
     * @param {Number[]} size Image Width, Height, Angle
     * @param {OG.geometry.Style|Object} style 스타일
     * @param {String} id Element ID 지정
     * @return {Element} DOM Element
     */
    drawImage: function (position, imgSrc, size, style, id) {
        throw new OG.NotImplementedException();
    },

    /**
     * 라인을 캔버스에 드로잉한다.
     *
     * @param {OG.geometry.Line} line 라인
     * @param {OG.geometry.Style|Object} style 스타일
     * @param {String} id Element ID 지정
     * @param {Boolean} isSelf 셀프 연결 여부
     * @return {Element} Group DOM Element with geometry
     */
    drawEdge: function (line, style, id, isSelf) {
        throw new OG.NotImplementedException();
    },

    /**
     * Shape 의 Label 을 캔버스에 위치 및 사이즈 지정하여 드로잉한다.
     *
     * @param {Element|String} shapeElement Shape DOM element or ID
     * @param {String} text 텍스트
     * @param {Object} style 스타일
     * @return {Element} DOM Element
     */
    drawLabel: function (shapeElement, text, style) {
        throw new OG.NotImplementedException();
    },

    /**
     * Edge 의 from, to Label 을 캔버스에 위치 및 사이즈 지정하여 드로잉한다.
     *
     * @param {Element|String} shapeElement Shape DOM element or ID
     * @param {String} text 텍스트
     * @param {String} type 유형(FROM or TO)
     * @return {Element} DOM Element
     */
    drawEdgeLabel: function (shapeElement, text, type) {
        throw new OG.NotImplementedException();
    },

    /**
     * Element 에 저장된 geom, angle, image, text 정보로 shape 을 redraw 한다.
     *
     * @param {Element} element Shape 엘리먼트
     * @param {String[]} excludeEdgeId redraw 제외할 Edge ID
     */
    redrawShape: function (element, excludeEdgeId) {
        throw new OG.NotImplementedException();
    },

    /**
     * Shape 의 연결된 Edge 를 redraw 한다.(이동 또는 리사이즈시)
     *
     * @param {Element} element
     */
    redrawConnectedEdge: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * 두개의 터미널을 연결하고, 속성정보에 추가한다.
     * @param {Element|Number[]} fromTerminal 시작점 (fromTerminal)
     * @param {Element|Number[]} toTerminal 끝점 (toTerminal)
     * @param {Element} edge Edge Shape
     * @param {OG.geometry.Style|Object} style 스타일
     * @param {String} label Label
     * @param {Boolean} preventTrigger 이벤트 트리거 발생 막기
     * @returns {Element} 연결된 Edge 엘리먼트
     */
    connect: function (fromTerminal, toTerminal, edge, style, label, preventTrigger) {
        throw new OG.NotImplementedException();
    },

    /**
     * 연결속성정보를 삭제한다. Edge 인 경우는 라인만 삭제하고, 일반 Shape 인 경우는 연결된 모든 Edge 를 삭제한다.
     *
     * @param {Element} element
     */
    disconnect: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Element 의 Edge 연결시 Drop Over 가이드를 드로잉한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    drawDropOverGuide: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Element 의 Move & Resize 용 가이드를 드로잉한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Object}
     */
    drawGuide: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Element 의 Move & Resize 용 가이드를 제거한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    removeGuide: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * 모든 Move & Resize 용 가이드를 제거한다.
     */
    removeAllGuide: function () {
        throw new OG.NotImplementedException();
    },


    /**
     * ID에 해당하는 Element 의 Connect Guide 를 제거한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    removeConnectGuide: function () {
        throw new OG.NotImplementedException();
    },

    /**
     * 캔버스의 모든 Connect Guide 를 제거한다.
     *
     */
    removeAllConnectGuide: function () {
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Element 이외의 모든 Connect Guide 를 제거한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    removeOtherConnectGuide: function () {
        throw new OG.NotImplementedException();
    },

    /**
     * 캔버스의 가상선을 삭제한다.
     */
    removeAllVirtualEdge: function () {
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Edge Element 의 Move & Resize 용 가이드를 드로잉한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Object}
     */
    drawEdgeGuide: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * Rectangle 모양의 마우스 드래그 선택 박스 영역을 드로잉한다.
     *
     * @param {Number[]} position 드로잉할 위치 좌표(좌상단)
     * @param {Number[]} size Text Width, Height, Angle
     * @param {OG.geometry.Style|Object} style 스타일
     * @return {Element} DOM Element
     */
    drawRubberBand: function (position, size, style) {
        throw new OG.NotImplementedException();
    },

    /**
     * Rectangle 모양의 마우스 드래그 선택 박스 영역을 제거한다.
     *
     * @param {Element} root first, rubberBand 정보를 저장한 엘리먼트
     */
    removeRubberBand: function (root) {
        throw new OG.NotImplementedException();
    },


    /**
     * ID에 해당하는 Element 의 Draggable 가이드를 드로잉한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Element}
     * @override
     */
    drawDraggableGuide: function (element) {
        throw new OG.NotImplementedException();
    },
    /**
     * ID에 해당하는 Element 의 Collapse 가이드를 드로잉한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Element}
     */
    drawCollapseGuide: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Element 의 Collapse 가이드를 제거한다.
     *
     * @param {Element} element
     */
    removeCollapseGuide: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * 주어진 Shape 들을 그룹핑한다.
     *
     * @param {Element[]} elements
     * @return {Element} Group Shape Element
     */
    group: function (elements) {
        throw new OG.NotImplementedException();
    },

    /**
     * 주어진 그룹들을 그룹해제한다.
     *
     * @param {Element[]} groupElements
     * @return {Element[]} ungrouped Elements
     */
    ungroup: function (groupElements) {
        throw new OG.NotImplementedException();
    },

    /**
     * 주어진 Shape 들을 그룹에 추가한다.
     *
     * @param {Element} groupElement
     * @param {Element[]} elements
     */
    addToGroup: function (groupElement, elements) {
        throw new OG.NotImplementedException();
    },

    /**
     * 주어진 Shape 이 그룹인 경우 collapse 한다.
     *
     * @param {Element} element
     */
    collapse: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * 주어진 Shape 이 그룹인 경우 expand 한다.
     *
     * @param {Element} element
     */
    expand: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * 드로잉된 모든 오브젝트를 클리어한다.
     */
    clear: function () {
        throw new OG.NotImplementedException();
    },

    /**
     * Shape 을 캔버스에서 관련된 모두를 삭제한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    removeShape: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Element 를 캔버스에서 제거한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    remove: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * 하위 엘리먼트만 제거한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    removeChild: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * 랜더러 캔버스 Root Element 를 반환한다.
     *
     * @return {Element} Element
     */
    getRootElement: function () {
        throw new OG.NotImplementedException();
    },

    /**
     * 랜더러 캔버스 Root Group Element 를 반환한다.
     *
     * @return {Element} Element
     */
    getRootGroup: function () {
        return this._ROOT_GROUP.node;
    },

    /**
     * 주어진 지점을 포함하는 Top Element 를 반환한다.
     *
     * @param {Number[]} position 위치 좌표
     * @return {Element} Element
     */
    getElementByPoint: function (position) {
        throw new OG.NotImplementedException();
    },

    /**
     * 주어진 Boundary Box 영역에 포함되는 Shape(GEOM, TEXT, IMAGE) Element 를 반환한다.
     * 모든 vertices를 포함한 엘리먼트를 반환한다.
     *
     * @param {OG.geometry.Envelope} envelope Boundary Box 영역
     * @return {Element[]} Element
     */
    getElementsByBBox: function (envelope) {
        var elements = [];
        $(this.getRootElement()).find("[_type=" + OG.Constants.NODE_TYPE.SHAPE + "]").each(function (index, element) {
            if (element.shape.geom && envelope.isContainsAll(element.shape.geom.getVertices())) {
                elements.push(element);
            }
        });

        return elements;
    },
    /**
     * 엘리먼트에 속성값을 설정한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Object} attribute 속성값
     */
    setAttr: function (element, attribute) {
        throw new OG.NotImplementedException();
    },

    /**
     * 엘리먼트 속성값을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {String} attrName 속성이름
     * @return {Object} attribute 속성값
     */
    getAttr: function (element, attrName) {
        throw new OG.NotImplementedException();
    },

    /**
     * Shape 의 스타일을 변경한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Object} style 스타일
     */
    setShapeStyle: function (element, style) {
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Element 를 최상단 레이어로 이동한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    toFront: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Element 를 최하단 레이어로 이동한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    toBack: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Element 를 앞으로 한단계 이동한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    bringForward: function(element){
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Element 를 뒤로 한단계 이동한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    sendBackward: function(element){
        throw new OG.NotImplementedException();
    },

    /**
     * 랜더러 캔버스의 사이즈(Width, Height)를 반환한다.
     *
     * @return {Number[]} Canvas Width, Height
     */
    getCanvasSize: function () {
        throw new OG.NotImplementedException();
    },

    /**
     * 랜더러 캔버스의 사이즈(Width, Height)를 변경한다.
     *
     * @param {Number[]} size Canvas Width, Height
     */
    setCanvasSize: function (size) {
        throw new OG.NotImplementedException();
    },

    /**
     * 랜더러 캔버스의 사이즈(Width, Height)를 실제 존재하는 Shape 의 영역에 맞게 변경한다.
     *
     * @param {Number[]} minSize Canvas 최소 Width, Height
     * @param {Boolean} fitScale 주어진 minSize 에 맞게 fit 여부(Default:false)
     */
    fitCanvasSize: function (minSize, fitScale) {
        throw new OG.NotImplementedException();
    },

    /**
     * 새로운 View Box 영역을 설정한다. (ZoomIn & ZoomOut 가능)
     *
     * @param {Number[]} position 위치 좌표(좌상단 기준)
     * @param {Number[]} size Canvas Width, Height
     * @param {Boolean} isFit Fit 여부
     */
    setViewBox: function (position, size, isFit) {
        throw new OG.NotImplementedException();
    },

    /**
     * Scale 을 반환한다. (리얼 사이즈 : Scale = 1)
     *
     * @return {Number} 스케일값
     */
    getScale: function () {
        throw new OG.NotImplementedException();
    },

    /**
     * Scale 을 설정한다. (리얼 사이즈 : Scale = 1)
     *
     * @param {Number} scale 스케일값
     */
    setScale: function (scale) {
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Element 를 캔버스에서 show 한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    show: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * ID에 해당하는 Element 를 캔버스에서 hide 한다.
     *
     * @param {Element|String} element Element 또는 ID
     */
    hide: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * Source Element 를 Target Element 아래에 append 한다.
     *
     * @param {Element|String} srcElement Element 또는 ID
     * @param {Element|String} targetElement Element 또는 ID
     * @return {Element} Source Element
     */
    appendChild: function (srcElement, targetElement) {
        throw new OG.NotImplementedException();
    },

    /**
     * Source Element 를 Target Element 이후에 insert 한다.
     *
     * @param {Element|String} srcElement Element 또는 ID
     * @param {Element|String} targetElement Element 또는 ID
     * @return {Element} Source Element
     */
    insertAfter: function (srcElement, targetElement) {
        throw new OG.NotImplementedException();
    },

    /**
     * Source Element 를 Target Element 이전에 insert 한다.
     *
     * @param {Element|String} srcElement Element 또는 ID
     * @param {Element|String} targetElement Element 또는 ID
     * @return {Element} Source Element
     */
    insertBefore: function (srcElement, targetElement) {
        throw new OG.NotImplementedException();
    },

    /**
     * 해당 Element 를 가로, 세로 Offset 만큼 이동한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Number[]} offset [가로, 세로]
     * @return {Element} Element
     */
    move: function (element, offset) {
        throw new OG.NotImplementedException();
    },

    /**
     * 주어진 중심좌표로 해당 Element 를 이동한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Number[]} position [x, y]
     * @return {Element} Element
     */
    moveCentroid: function (element, position) {
        throw new OG.NotImplementedException();
    },

    /**
     * 중심 좌표를 기준으로 주어진 각도 만큼 회전한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Number} angle 각도
     * @return {Element} Element
     */
    rotate: function (element, angle) {
        throw new OG.NotImplementedException();
    },

    /**
     * 상, 하, 좌, 우 외곽선을 이동한 만큼 리사이즈 한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Number[]} offset [상, 하, 좌, 우] 각 방향으로 + 값
     * @return {Element} Element
     */
    resize: function (element, offset) {
        throw new OG.NotImplementedException();
    },

    /**
     * 중심좌표는 고정한 채 Bounding Box 의 width, height 를 리사이즈 한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @param {Number[]} size [Width, Height]
     * @return {Element} Element
     */
    resizeBox: function (element, size) {
        throw new OG.NotImplementedException();
    },

    /**
     * 노드 Element 를 복사한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Element} Element
     */
    clone: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * ID로 Node Element 를 반환한다.
     *
     * @param {String} id
     * @return {Element} Element
     */
    getElementById: function (id) {
        throw new OG.NotImplementedException();
    },

    /**
     * Shape 타입에 해당하는 Node Element 들을 반환한다.
     *
     * @param {String} shapeType Shape 타입(GEOM, HTML, IMAGE, EDGE, GROUP), Null 이면 모든 타입
     * @param {String} excludeType 제외 할 타입
     * @return {Element[]} Element's Array
     */
    getElementsByType: function (shapeType, excludeType) {
        var root = this.getRootGroup();
        if (shapeType && excludeType) {
            return $(root).find("[_type=SHAPE][_shape=" + shapeType + "][_shape!=" + excludeType + "]");
        } else if (shapeType) {
            return $(root).find("[_type=SHAPE][_shape=" + shapeType + "]");
        } else if (excludeType) {
            return $(root).find("[_type=SHAPE][_shape!=" + excludeType + "]");
        } else {
            return $(root).find("[_type=SHAPE]");
        }
    },

    /**
     * 해당 엘리먼트의 BoundingBox 영역 정보를 반환한다.
     *
     * @param {Element|String} element
     * @return {Object} {width, height, x, y, x2, y2}
     */
    getBBox: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * 부모노드기준으로 캔버스 루트 엘리먼트의 BoundingBox 영역 정보를 반환한다.
     *
     * @return {Object} {width, height, x, y, x2, y2}
     */
    getRootBBox: function () {
        throw new OG.NotImplementedException();
    },

    /**
     * 부모노드기준으로 캔버스 루트 엘리먼트의 실제 Shape 이 차지하는 BoundingBox 영역 정보를 반환한다.
     *
     * @return {Object} {width, height, x, y, x2, y2}
     */
    getRealRootBBox: function () {
        var minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE,
            shapeElements = this.getElementsByType(), shape, envelope, upperLeft, lowerRight, i,
            rootBBox = {
                width: 0,
                height: 0,
                x: 0,
                y: 0,
                x2: 0,
                y2: 0
            };

        for (i = 0; i < shapeElements.length; i++) {
            shape = shapeElements[i].shape;
            if (shape && shape.geom) {
                envelope = shape.geom.getBoundary();
                upperLeft = envelope.getUpperLeft();
                lowerRight = envelope.getLowerRight();

                minX = minX > upperLeft.x ? upperLeft.x : minX;
                minY = minY > upperLeft.y ? upperLeft.y : minY;
                maxX = maxX < lowerRight.x ? lowerRight.x : maxX;
                maxY = maxY < lowerRight.y ? lowerRight.y : maxY;

                rootBBox = {
                    width: maxX - minX,
                    height: maxY - minY,
                    x: minX,
                    y: minY,
                    x2: maxX,
                    y2: maxY
                };
            }
        }

        return rootBBox;
    },

    /**
     * 캔버스의 컨테이너 DOM element 를 반환한다.
     *
     * @return {Element} 컨테이너
     */
    getContainer: function () {
        throw new OG.NotImplementedException();
    },


    /**
     * SVG 인지 여부를 반환한다.
     *
     * @return {Boolean} svg 여부
     */
    isSVG: function () {
        throw new OG.NotImplementedException();
    },

    /**
     * VML 인지 여부를 반환한다.
     *
     * @return {Boolean} vml 여부
     */
    isVML: function () {
        throw new OG.NotImplementedException();
    },

    /**
     * 연결된 이전 Edge Element 들을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Element[]} Previous Element's Array
     */
    getPrevEdges: function (element) {
        var prevEdgeIds = $(element).attr('_fromedge'),
            edgeArray = [],
            edgeIds, edge, i;

        if (prevEdgeIds) {
            edgeIds = prevEdgeIds.split(',');
            for (i = 0; i < edgeIds.length; i++) {
                edge = this.getElementById(edgeIds[i]);
                if (edge) {
                    edgeArray.push(edge);
                }
            }
        }

        return edgeArray;
    },

    /**
     * 연결된 이후 Edge Element 들을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Element[]} Previous Element's Array
     */
    getNextEdges: function (element) {
        var nextEdgeIds = $(element).attr('_toedge'),
            edgeArray = [],
            edgeIds, edge, i;

        if (nextEdgeIds) {
            edgeIds = nextEdgeIds.split(',');
            for (i = 0; i < edgeIds.length; i++) {
                edge = this.getElementById(edgeIds[i]);
                if (edge) {
                    edgeArray.push(edge);
                }
            }
        }

        return edgeArray;
    },

    /**
     * 연결된 이전 노드 Element 들을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Element[]} Previous Element's Array
     */
    getPrevShapes: function (element) {
        var prevEdges = this.getPrevEdges(element),
            shapeArray = [],
            prevShapeId, shape, i;

        for (i = 0; i < prevEdges.length; i++) {
            prevShapeId = $(prevEdges[i]).attr('_from');
            if (prevShapeId) {
                prevShapeId = prevShapeId.substring(0, prevShapeId.indexOf(OG.Constants.TERMINAL));
                shape = this.getElementById(prevShapeId);
                if (shape) {
                    shapeArray.push(shape);
                }
            }
        }

        return shapeArray;
    },

    /**
     * 연결된 이전 노드 Element ID들을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {String[]} Previous Element Id's Array
     */
    getPrevShapeIds: function (element) {
        var prevEdges = this.getPrevEdges(element),
            shapeArray = [],
            prevShapeId, i;

        for (i = 0; i < prevEdges.length; i++) {
            prevShapeId = $(prevEdges[i]).attr('_from');
            if (prevShapeId) {
                prevShapeId = prevShapeId.substring(0, prevShapeId.indexOf(OG.Constants.TERMINAL));
                shapeArray.push(prevShapeId);
            }
        }
        return shapeArray;
    },

    /**
     * 연결된 이후 노드 Element 들을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {Element[]} Previous Element's Array
     */
    getNextShapes: function (element) {
        var nextEdges = this.getNextEdges(element),
            shapeArray = [],
            nextShapeId, shape, i;

        for (i = 0; i < nextEdges.length; i++) {
            nextShapeId = $(nextEdges[i]).attr('_to');
            if (nextShapeId) {
                nextShapeId = nextShapeId.substring(0, nextShapeId.indexOf(OG.Constants.TERMINAL));
                shape = this.getElementById(nextShapeId);
                if (shape) {
                    shapeArray.push(shape);
                }
            }
        }

        return shapeArray;
    },

    /**
     * 연결된 이후 노드 Element ID들을 반환한다.
     *
     * @param {Element|String} element Element 또는 ID
     * @return {String[]} Previous Element Id's Array
     */
    getNextShapeIds: function (element) {
        var nextEdges = this.getNextEdges(element),
            shapeArray = [],
            nextShapeId, i;

        for (i = 0; i < nextEdges.length; i++) {
            nextShapeId = $(nextEdges[i]).attr('_to');
            if (nextShapeId) {
                nextShapeId = nextShapeId.substring(0, nextShapeId.indexOf(OG.Constants.TERMINAL));
                shapeArray.push(nextShapeId);
            }
        }

        return shapeArray;
    },

    /**
     * Node 엘리먼트의 커넥트 가이드 엘리먼트를 반환한다.
     *
     * @param {Element} Element  엘리먼트
     * @return {Array} Array Element
     */
    getConnectGuideElements: function (element) {
        throw new OG.NotImplementedException();
    },

    /**
     * 최상위 그룹 엘리먼트인지 반환한다.
     *
     * @param {Element} Element  엘리먼트
     * @return {boolean} true false
     */
    isTopGroup: function (element) {
        var parent = element.parentElement;
        if(!parent){
            parent = element.parentNode;
        }
        if (!element || !parent) {
            return false;
        }
        if (!element.shape instanceof OG.shape.GroupShape) {
            return false;
        }

        if (parent.id === this.getRootGroup().id) {
            return true;
        }
        return false;
    },

    /**
     * 부모 엘리먼트를 반환한다. 부모가 루트일때는 반환하지 않는다.
     *
     * @param {Element} element  엘리먼트
     * @return {Element} element  엘리먼트
     */
    getParent: function (element) {
        var parent = element.parentElement;
        if(!parent){
            parent = element.parentNode;
        }
        if (!element || !parent) {
            return null;
        }
        if (parent.id === this.getRootGroup().id) {
            return null;
        }
        return parent;
    },

    /**
     * 그룹의 하위 엘리먼트를 반환한다.
     *
     * @param {Element} element  엘리먼트
     * @returns {Array} Elements
     */
    getChilds: function (element) {
        var childShapes = [];
        if (!element || OG.Util.isIE() ? !element.childNodes : !element.children) {
            return childShapes;
        }
        $.each(OG.Util.isIE() ? element.childNodes : element.children, function (index, child) {
            if ($(child).attr("_type") === OG.Constants.NODE_TYPE.SHAPE) {
                childShapes.push(child);
            }
        });
        return childShapes;
    },

    /**
     * 그룹의 Shape 인지 반환한다. RootGroup 일 경우는 제외.
     *
     * @param {Element} element  엘리먼트
     * @return {boolean} true false
     */
    isGroup: function (element) {
        var parent = element.parentElement;
        if(!parent){
            parent = element.parentNode;
        }
        if (!element || !parent) {
            return false;
        }
        if (element.id === this.getRootGroup().id) {
            return false;
        }
        if (element.shape instanceof OG.shape.GroupShape) {
            return true;
        }
        return false;
    },

    /**
     * 캔버스의 모든 Shape 들을 리턴
     *
     * @return {Array} Elements
     */
    getAllShapes: function () {
        var elements = [];
        $(this.getRootElement()).find("[_type=" + OG.Constants.NODE_TYPE.SHAPE + "]").each(function (index, element) {
            elements.push(element);
        });
        return elements;
    },
    /**
     * 캔버스의 모든 Edge를 리턴
     *
     * @return {Array} Edge Elements
     */
    getAllEdges: function () {
        var edges = [];
        var elements = this.getAllShapes();
        $.each(elements, function (index, element) {
            if ($(element).attr("_shape") === OG.Constants.SHAPE_TYPE.EDGE) {
                edges.push(element);
            }
        });
        return edges;
    },
    /**
     * 캔버스의 모든 Edge 가 아닌 shpaes 를 리턴
     *
     * @return {Array} Edge Elements
     */
    getAllNotEdges: function () {
        var shpaes = [];
        var elements = this.getAllShapes();
        $.each(elements, function (index, element) {
            if ($(element).attr("_shape") !== OG.Constants.SHAPE_TYPE.EDGE) {
                shpaes.push(element);
            }
        })
        return shpaes;
    },
    /**
     * Edge 여부를 판단.
     *
     * @return {boolean} true false
     */
    isEdge: function (element) {
        return $(element).attr("_shape") === OG.Constants.SHAPE_TYPE.EDGE;
    },
    /**
     * Shape 여부를 판단.
     *
     * @return {boolean} true false
     */
    isShape: function (element) {
        return $(element).attr("_type") === OG.Constants.NODE_TYPE.SHAPE;
    },
    /**
     * 캔버스의 히스토리를 초기화한다.
     */
    initHistory: function(){
        throw new OG.NotImplementedException();
    },
    /**
     * 캔버스에 히스토리를 추가한다.
     */
    addHistory: function () {
        throw new OG.NotImplementedException();
    },
    /**
     * 캔버스의 Undo
     */
    undo: function(){
        throw new OG.NotImplementedException();
    },
    /**
     * 캔버스의 Redo
     */
    redo: function(){
        throw new OG.NotImplementedException();
    }
};
OG.renderer.IRenderer.prototype.constructor = OG.renderer.IRenderer;