Ext.define('Flamingo.view.oozie.dashboard.count.WorkflowTotalCount', {
    extend: 'Ext.panel.Panel',
    xtype: 'workflowtotalcount',

    layout: 'fit',

    //title: 'Workflow Total Status',
    defaultType: 'component',

    items: [{
        tpl: [
            '<div style="display:table; width: 100%; height: 100%">',
            '  <div class="dc_box" style="display:table-cell;vertical-align:middle;">',
            '     <ul class="flex-ul">',
            '         <li class="flex-size flex-small flex-width">' +
            '             <p class="mb10 flex-font-head-small">All</p>' +
            '             <p class="flex-square-xsmall-o flex-small {[this.getColorClass(values.appsAll, \'c07-border\')]} flex-font">{appsAll}</p>' +
            '         </li>',
            '         <li class="flex-size flex-small flex-width">' +
            '             <p class="mb10 flex-font-head-small">Succeeded</p>' +
            '             <p class="flex-square-xsmall-o flex-small {[this.getColorClass(values.appsSucceeded, \'c07-border\')]} flex-font">{appsSucceeded}</p>' +
            '         </li>',
            '         <li class="flex-size flex-small flex-width">' +
            '             <p class="mb10 flex-font-head-small">Failed</p>' +
            '             <p class="flex-square-xsmall-o flex-small {[this.getColorClass(values.appsFailed, \'c05-border\')]} flex-font">{appsFailed}</p>' +
            '         </li>',
            '         <li class="flex-size flex-small flex-width">' +
            '             <p class="mb10 flex-font-head-small">Killed</p>' +
            '             <p class="flex-square-xsmall-o flex-small {[this.getColorClass(values.appsKilled, \'c04-border\')]} flex-font">{appsKilled}</p>' +
            '         </li>',
            '         <li class="flex-size flex-small flex-width">' +
            '             <p class="mb10 flex-font-head-small">Suspended</p>' +
            '             <p class="flex-square-xsmall-o flex-small {[this.getColorClass(values.appsSuspended, \'c07-border\')]} flex-font">{appsSuspended}</p>' +
            '         </li>',
            '         <li class="flex-size flex-small flex-width">' +
            '             <p class="mb10 flex-font-head-small">Running</p>' +
            '             <p class="flex-square-xsmall-o flex-small {[this.getColorClass(values.appsRunning, \'c03-border\')]} flex-font">{appsRunning}</p>' +
            '         </li>',
            '         <li class="flex-size flex-small flex-width">' +
            '             <p class="mb10 flex-font-head-small">Prep</p>' +
            '             <p class="flex-square-xsmall-o flex-small {[this.getColorClass(values.appsPrep, \'c07-border\')]} flex-font">{appsPrep}</p>' +
            '         </li>',
            '     </ul>',
            '  </div>',
            '</div>',
            '<span class="gs-resize-handle gs-resize-handle-both"></span>',
            {
                getColorClass: function (value, color) {
                    return value > 0 ? color : 'c07-border';
                }
            }
        ],
        bind: {
            data: {
                appsRunning: '{workflow.RUNNING}',
                appsSucceeded: '{workflow.SUCCEEDED}',
                appsKilled: '{workflow.KILLED}',
                appsSuspended: '{workflow.SUSPENDED}',
                appsAll: '{workflow.ALL}',
                appsFailed: '{workflow.FAILED}',
                appsPrep: '{workflow.PREP}'
            }
        }
    }]
});