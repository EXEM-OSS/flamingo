/**
 * BPMN : Transformer Shape
 *
 * @class
 * @extends OG.shape.bpmn.A_Task
 * @requires OG.common.*
 * @requires OG.geometry.*
 * @requires OG.shape.bpmn.A_Task
 *
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 * @private
 */
OG.shape.Transformer = function (label) {
    OG.shape.Transformer.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.Transformer';
    this.label = label;
    this.CONNECTABLE = false;
    this.MOVABLE = true;
    this.RESIZABLE = false;
    this.SELF_CONNECTABLE = false;
    this.CONNECT_CLONEABLE = false;
    this.LABEL_EDITABLE = false;
}
OG.shape.Transformer.prototype = new OG.shape.GroupShape();
OG.shape.Transformer.superclass = OG.shape.GroupShape;
OG.shape.Transformer.prototype.constructor = OG.shape.Transformer;
OG.Transformer = OG.shape.Transformer;

OG.shape.Transformer.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Rectangle([0, 0], 100, 100);
    this.geom.style = new OG.geometry.Style({
        'label-direction': 'horizontal',
        'vertical-align' : 'top',
        fill: '#ffffff',
        'fill-opacity': 0
    });

    return this.geom;
};