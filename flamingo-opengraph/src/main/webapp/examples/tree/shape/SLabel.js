OG.shape.SLabel = function () {
    OG.shape.SLabel.superclass.call(this, 'tree/shape/selected.svg');

    this.SHAPE_ID = 'OG.shape.SLabel';
    this.LABEL_EDITABLE = false;
    this.MOVABLE = false;
    this.CONNECTABLE = false;
    this.DELETABLE = false;
};
OG.shape.SLabel.prototype = new OG.shape.ImageShape();
OG.shape.SLabel.superclass = OG.shape.ImageShape;
OG.shape.SLabel.prototype.constructor = OG.shape.SLabel;
OG.SLabel = OG.shape.SLabel;