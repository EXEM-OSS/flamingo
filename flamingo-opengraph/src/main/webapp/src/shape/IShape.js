/**
 * 도형, 텍스트, 이미지 등의 드로잉 될 Object 의 정보를 저장하는 Shape 정보 최상위 인터페이스
 *
 * @class
 * @requires OG.common.*
 * @requires OG.geometry.*
 *
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 */
OG.shape.IShape = function () {
	/**
	 * Shape 유형(GEOM, TEXT, HTML, IMAGE, EDGE, GROUP)
	 * @type String
	 */
	this.TYPE = null;

	/**
	 * Shape 을 구분하는 Shape ID(Shape 클래스명과 일치)
	 * @type String
	 */
	this.SHAPE_ID = null;

	/**
	 * Shape 모양을 나타내는 공간기하객체(Geometry)
	 * @type OG.geometry.Geometry
	 */
	this.geom = null;

	/**
	 * Shape 라벨 텍스트
	 * @type String
	 */
	this.label = null;

	/**
	 * Shape 의 Collapse 여부
	 * @type Boolean
	 */
	this.isCollapsed = false;

//	 이벤트 속성
	/**
	 * 선택 가능여부
	 * @type Boolean
	 */
	this.SELECTABLE = true;

	/**
	 * 이동 가능여부
	 * @type Boolean
	 */
	this.MOVABLE = true;

	/**
	 * 리사이즈 가능여부
	 * @type Boolean
	 */
	this.RESIZABLE = true;

	/**
	 * 연결 가능여부
	 * @type Boolean
	 */
	this.CONNECTABLE = true;

	/**
	 * From 연결 가능여부 (From(Shape) => To)
	 * @type Boolean
	 */
	this.ENABLE_FROM = true;

	/**
	 * To 연결 가능여부 (From => To(Shape))
	 * @type Boolean
	 */
	this.ENABLE_TO = true;

	/**
	 * Self 연결 가능여부
	 * @type Boolean
	 */
	this.SELF_CONNECTABLE = false;

	/**
	 * 가이드에 자기자신을 복사하는 컨트롤러 여부.
	 * @type Boolean
	 */
	this.CONNECT_CLONEABLE = true;

	/**
	 * 드래그하여 연결시 연결대상 있는 경우에만 Edge 드로잉 처리 여부
	 * @type Boolean
	 */
	this.CONNECT_REQUIRED = true;

	/**
	 * 드래그하여 연결시 그룹을 건너뛸때 스타일 변경 여부
	 * @type Boolean
	 */
	this.CONNECT_STYLE_CHANGE = true;

	/**
	 * 가이드에 삭제 컨트롤러 여부
	 * @type Boolean
	 */
	this.DELETABLE = true;

	/**
	 * 라벨 수정여부
	 * @type Boolean
	 */
	this.LABEL_EDITABLE = true;


	this.exceptionType = '';
};
OG.shape.IShape.prototype = {

	/**
	 * 드로잉할 Shape 를 생성하여 반환한다.
	 *
	 * @return {*} Shape 정보
	 * @abstract
	 */
	createShape: function () {
		throw new OG.NotImplementedException("OG.shape.IShape.createShape");
	},

	/**
	 * Shape 을 복사하여 새로인 인스턴스로 반환한다.
	 *
	 * @return {OG.shape.IShape} 복사된 인스턴스
	 * @abstract
	 */
	clone: function () {
		throw new OG.NotImplementedException("OG.shape.IShape.clone");
	},
	addEve : function(){
	},

	// (void) 특수한 컨트롤을 생성하기 위한 함수
	drawCustomControl: function(){
	}
};
OG.shape.IShape.prototype.constructor = OG.shape.IShape;
OG.IShape = OG.shape.IShape;