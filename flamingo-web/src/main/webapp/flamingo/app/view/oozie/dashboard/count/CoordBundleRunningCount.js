Ext.define('Flamingo.view.oozie.dashboard.count.CoordBundleRunningCount', {
    extend: 'Ext.panel.Panel',
    xtype: 'coordbundlerunningcount',

    layout: 'fit',

    //title: 'Bundles & Coordinators',

    defaultType: 'component',

    items: [{
        tpl: [
            '<div style="display:table; width: 100%; height: 100%">',
            '  <div class="dc_box" style="display:table-cell;vertical-align:middle;">',
            '     <ul class="flex-ul">',
            '         <li class="flex-size flex-small flex-width">' +
            '             <p class="mb10 flex-font-head-small">Coordinator</p>' +
            '             <p class="flex-square-xsmall-o flex-small {[this.getColorClass(values.coordinator, \'c02-border\')]} flex-font">{coordinator}</p>' +
            '         </li>',
            '         <li class="flex-size flex-small flex-width">' +
            '             <p class="mb10 flex-font-head-small">Bundle</p>' +
            '             <p class="flex-square-xsmall-o flex-small {[this.getColorClass(values.bundle, \'c02-border\')]} flex-font">{bundle}</p>' +
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
                coordinator: '{oozie.coordinator}',
                bundle: '{oozie.bundle}'
            }
        }
    }]
});

