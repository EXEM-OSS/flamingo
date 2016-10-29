/**
 * BPMN : Link Intermediate Event Shape
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
OG.shape.bpmn.E_Intermediate_Link = function (label) {
	OG.shape.bpmn.E_Intermediate_Link.superclass.call(this);

	this.SHAPE_ID = 'OG.shape.bpmn.E_Intermediate_Link';
	this.label = label;
};
OG.shape.bpmn.E_Intermediate_Link.prototype = new OG.shape.bpmn.Event();
OG.shape.bpmn.E_Intermediate_Link.superclass = OG.shape.bpmn.Event;
OG.shape.bpmn.E_Intermediate_Link.prototype.constructor = OG.shape.bpmn.E_Intermediate_Link;
OG.E_Intermediate_Link = OG.shape.bpmn.E_Intermediate_Link;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.bpmn.E_Intermediate_Link.prototype.createShape = function () {

	if (this.geom) {
		return this.geom;
	}
	this.geom = new OG.geometry.Polygon([
		[0, 0],
		[80, 0],
		[100, 50],
		[80, 100],
		[0, 100],
		[20, 50]
	]);

	return this.geom;
};