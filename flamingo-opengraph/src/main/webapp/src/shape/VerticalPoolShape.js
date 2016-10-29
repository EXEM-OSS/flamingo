/**
 * Vertical Pool Shape
 *
 * @class
 * @extends OG.shape.GroupShape
 * @requires OG.common.*
 * @requires OG.geometry.*
 *
 * @param {String} label 라벨
 */
OG.shape.VerticalPoolShape = function (label) {
    OG.shape.VerticalPoolShape.superclass.call(this, label);

    this.SHAPE_ID = 'OG.shape.VerticalPoolShape';
    this.CONNECTABLE = true;
    this.GROUP_COLLAPSIBLE = false;
};
OG.shape.VerticalPoolShape.prototype = new OG.shape.GroupShape();
OG.shape.VerticalPoolShape.superclass = OG.shape.GroupShape;
OG.shape.VerticalPoolShape.prototype.constructor = OG.shape.VerticalPoolShape;
OG.VerticalPoolShape = OG.shape.VerticalPoolShape;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.VerticalPoolShape.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Rectangle([0, 0], 100, 100);
    this.geom.style = new OG.geometry.Style({
        'label-direction': 'horizontal',
        'vertical-align' : 'top',
        'fill': '#ffffff',
        'fill-opacity': 0
    });

    return this.geom;
};