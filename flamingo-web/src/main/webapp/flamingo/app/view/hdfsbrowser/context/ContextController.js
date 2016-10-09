Ext.define('Flamingo.view.hdfsbrowser.context.ContextController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.hdfscontext',

    onMenuitemClick: function(item) {
        this.fireEvent(item.itemId);
    }
});