/**
 * Horizontal Pool Shape
 *
 * @class
 * @extends OG.shape.GroupShape
 * @requires OG.common.*
 * @requires OG.geometry.*
 *
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 */
OG.shape.HorizontalPoolShape = function (label) {
    OG.shape.HorizontalPoolShape.superclass.call(this, label);

    this.SHAPE_ID = 'OG.shape.HorizontalPoolShape';
    this.label = label;
    this.CONNECTABLE = true;
    this.LoopType = 'None';
    this.GROUP_COLLAPSIBLE = false;
};
OG.shape.HorizontalPoolShape.prototype = new OG.shape.GroupShape();
OG.shape.HorizontalPoolShape.superclass = OG.shape.GroupShape;
OG.shape.HorizontalPoolShape.prototype.constructor = OG.shape.HorizontalPoolShape;
OG.HorizontalPoolShape = OG.shape.HorizontalPoolShape;


/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.HorizontalPoolShape.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Rectangle([0, 0], 100, 100);
    this.geom.style = new OG.geometry.Style({
        'label-direction': 'vertical',
        'vertical-align' : 'top',
        'fill' : '#ffffff',
        'fill-opacity': 0,
        'title-size' : 32
    });

    return this.geom;
};