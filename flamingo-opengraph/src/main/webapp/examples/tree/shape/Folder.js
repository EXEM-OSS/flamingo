OG.shape.Folder = function (label) {
    OG.shape.Folder.superclass.call(this, 'tree/shape/folder.svg', label);

    this.SHAPE_ID = 'OG.shape.Folder';
    this.LABEL_EDITABLE = false;
    this.label = label;
    this.CONNECTABLE = false;
    this.DELETABLE = false;
};
OG.shape.Folder.prototype = new OG.shape.ImageShape();
OG.shape.Folder.superclass = OG.shape.ImageShape;
OG.shape.Folder.prototype.constructor = OG.shape.Folder;
OG.Folder = OG.shape.Folder;