/**
 * BPMN : Subprocess Activity Shape
 *
 * @class
 * @extends OG.shape.GroupShape
 * @requires OG.common.*
 * @requires OG.geometry.*
 *
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 * @private
 */
OG.shape.bpmn.A_Subprocess = function (label) {
    OG.shape.bpmn.A_Subprocess.superclass.call(this);

    this.label = label;
    this.SHAPE_ID = 'OG.shape.bpmn.A_Subprocess';
    this.GROUP_COLLAPSIBLE = false;
    this.HaveButton = true;
    this.status = "None";
    this.inclusion = false;
};
OG.shape.bpmn.A_Subprocess.prototype = new OG.shape.GeomShape();
OG.shape.bpmn.A_Subprocess.superclass = OG.shape.GeomShape;
OG.shape.bpmn.A_Subprocess.prototype.constructor = OG.shape.bpmn.A_Subprocess;
OG.A_Subprocess = OG.shape.bpmn.A_Subprocess;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.bpmn.A_Subprocess.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }
    this.CONNECTABLE = true;


    this.geom = new OG.geometry.Rectangle([0, 0], 100, 100);
    this.geom.style = new OG.geometry.Style({
        "stroke-width": 1.2,
        'r': 6,
        fill: '#FFFFFF - #FFFFCC',
        'fill-opacity': 1
    });

    return this.geom;
};