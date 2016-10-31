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
 */
OG.shape.SpotShape = function (label) {
	OG.shape.SpotShape.superclass.call(this);

	this.SHAPE_ID = 'OG.shape.SpotShape';
	this.label = label;
};
OG.shape.SpotShape.prototype = new OG.shape.GeomShape();
OG.shape.SpotShape.superclass = OG.shape.GeomShape;
OG.shape.SpotShape.prototype.constructor = OG.shape.SpotShape;
OG.SpotShape = OG.shape.SpotShape;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.SpotShape.prototype.createShape = function () {
	if (this.geom) {
		return this.geom;
	}

	this.geom = new OG.geometry.Circle([10, 10], 10);
	return this.geom;
};