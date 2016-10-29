OG.shape.MLabel = function () {
    OG.shape.MLabel.superclass.call(this, 'tree/shape/mapping.svg');

    this.SHAPE_ID = 'OG.shape.MLabel';
    this.LABEL_EDITABLE = false;
    this.MOVABLE = false;
    this.CONNECTABLE = false;
    this.DELETABLE = false;
};
OG.shape.MLabel.prototype = new OG.shape.ImageShape();
OG.shape.MLabel.superclass = OG.shape.ImageShape;
OG.shape.MLabel.prototype.constructor = OG.shape.MLabel;
OG.MLabel = OG.shape.MLabel;