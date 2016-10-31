/**
 * Rectangle Shape
 *
 * @class
 * @extends OG.shape.GeomShape
 * @requires OG.common.*, OG.geometry.*
 *
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 */
OG.shape.Area = function (lable) {
    OG.shape.Area.superclass.call(this, lable);

    this.SHAPE_ID = 'OG.shape.Area';
    this.LABEL_EDITABLE = false;
    this.RESIZABLE = false;
    this.MOVABLE = false;
    this.SELECTABLE = false;

    this.CONNECT_CLONEABLE = false;
    this.CONNECTABLE = false;
    this.DELETABLE = false;
};
OG.shape.Area.prototype = new OG.shape.VerticalLaneShape();
OG.shape.Area.superclass = OG.shape.VerticalLaneShape;
OG.shape.Area.prototype.constructor = OG.shape.Area;
OG.Area = OG.shape.Area;