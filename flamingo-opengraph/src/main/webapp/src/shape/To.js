/**
 * SpotShape Shape
 *
 * @class
 * @extends OG.shape.GeomShape
 * @requires OG.common.*
 * @requires OG.geometry.*
 *
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 * @private
 */
OG.shape.To = function (label) {
	OG.shape.To.superclass.call(this);

	this.SHAPE_ID = 'OG.shape.To';
	this.label = label;
	this.MOVABLE = false;
	this.RESIZABLE = false;
	this.SELF_CONNECTABLE = false;
	this.CONNECT_CLONEABLE = false;
	this.LABEL_EDITABLE = false;
	this.DELETABLE = false;
	this.CONNECT_STYLE_CHANGE = false;
	this.ENABLE_FROM = false;
};
OG.shape.To.prototype = new OG.shape.GeomShape();
OG.shape.To.superclass = OG.shape.GeomShape;
OG.shape.To.prototype.constructor = OG.shape.To;
OG.To = OG.shape.To;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.To.prototype.createShape = function () {
	if (this.geom) {
		return this.geom;
	}

	this.geom = new OG.geometry.Circle([10, 10], 10);
	return this.geom;
};