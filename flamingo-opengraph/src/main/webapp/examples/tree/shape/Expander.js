OG.shape.Expander = function (label) {
    OG.shape.Expander.superclass.call(this, 'tree/shape/expand.svg', label);

    this.SHAPE_ID = 'OG.shape.Expander';
    this.LABEL_EDITABLE = false;
    this.label = label;
    this.MOVABLE = false;
    this.CONNECTABLE = false;
    this.DELETABLE = false;
};
OG.shape.Expander.prototype = new OG.shape.ImageShape();
OG.shape.Expander.superclass = OG.shape.ImageShape;
OG.shape.Expander.prototype.constructor = OG.shape.Expander;
OG.Expander = OG.shape.Expander;