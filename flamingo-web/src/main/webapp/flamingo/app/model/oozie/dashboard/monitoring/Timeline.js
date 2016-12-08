Ext.define('Flamingo.model.oozie.dashboard.monitoring.Timeline', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'id' },
        { name: 'content' },
        { name: 'start' },
        { name: 'end' },
        { name: 'className' },
        { name: 'group' }
    ]
});