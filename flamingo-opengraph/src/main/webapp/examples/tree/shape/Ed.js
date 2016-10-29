OG.shape.Ed = function (label) {
    OG.shape.Ed.superclass.call(this, 'tree/shape/ed.svg', label);

    this.SHAPE_ID = 'OG.shape.Ed';
    this.LABEL_EDITABLE = false;
    this.label = label;
    this.CONNECTABLE = false;
    this.DELETABLE = false;
};
OG.shape.Ed.prototype = new OG.shape.ImageShape();
OG.shape.Ed.superclass = OG.shape.ImageShape;
OG.shape.Ed.prototype.constructor = OG.shape.Ed;
OG.Ed = OG.shape.Ed;