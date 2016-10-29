/**
 * BPMN : Task Activity Shape
 *
 * @class
 * @extends OG.shape.GeomShape
 * @requires OG.common.*
 * @requires OG.geometry.*
 *
 * @param {String} label 라벨 [Optional]
 * @author <a href="mailto:sppark@uengine.org">Seungpil Park</a>
 * @private
 */
OG.shape.bpmn.A_Task = function (label) {
    OG.shape.bpmn.A_Task.superclass.call(this);

    this.SHAPE_ID = 'OG.shape.bpmn.A_Task';
    this.label = label;
    this.CONNECTABLE = true;
    this.GROUP_COLLAPSIBLE = false;
    //this.HaveButton = true;
    this.LoopType = "None";
    this.TaskType = "None";
    this.status = "None";
    this.Events = [];

};
OG.shape.bpmn.A_Task.prototype = new OG.shape.GroupShape();
OG.shape.bpmn.A_Task.superclass = OG.shape.GroupShape;
OG.shape.bpmn.A_Task.prototype.constructor = OG.shape.bpmn.A_Task;
OG.A_Task = OG.shape.bpmn.A_Task;

/**
 * 드로잉할 Shape 을 생성하여 반환한다.
 *
 * @return {OG.geometry.Geometry} Shape 정보
 * @override
 */
OG.shape.bpmn.A_Task.prototype.createShape = function () {
    if (this.geom) {
        return this.geom;
    }

    this.geom = new OG.geometry.Rectangle([0, 0], 100, 100);
    this.geom.style = new OG.geometry.Style({
        //fill: 'r[(10, 10)]#FFFFFF-#FFFFCC',
        'fill-r': 1,
        'fill-cx': .1,
        'fill-cy': .1,
        "stroke-width": 1.2,
        fill: 'r(.1, .1)#FFFFFF-#FFFFCC',
        'fill-opacity': 1,
        r: '10'
    });

    return this.geom;
};