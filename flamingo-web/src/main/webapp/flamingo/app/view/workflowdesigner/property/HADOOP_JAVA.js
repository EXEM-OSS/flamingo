/*
 * Copyright 2012-2016 the Flamingo Community.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Java Property View
 *
 * @class
 * @extends Flamingo.view.workflowdesigner.property._NODE_HADOOP
 * @author <a href="mailto:fharenheit@gmail.com">Byoung Gon, Kim</a>
 */
Ext.define('Flamingo.view.workflowdesigner.property.HADOOP_JAVA', {
    extend: 'Flamingo.view.workflowdesigner.property._NODE_HADOOP',
    alias: 'widget.HADOOP_JAVA',

    requires: [
        'Flamingo.view.workflowdesigner.property._JarBrowserField',
        'Flamingo.view.workflowdesigner.property._ValueGrid',
        'Flamingo.view.workflowdesigner.property._JarGrid'
    ],

    width: 500,
    height: 300,

    items: [
        {
            title: 'Java',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: '_jarBrowserField',
                    fieldLabel: 'JAR Path',
                    emptyText: 'Dependency JAR',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    name: 'driver',
                    fieldLabel: 'Driver',
                    emptyText: 'Please specify the driver class.',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    name: 'javaOpts',
                    fieldLabel: 'JVM Options',
                    emptyText: '-Xmx300m -Xms300m',
                    allowBlank: true
                }
            ]
        },
        {
            title: 'Classpath',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: '_jarGrid',
                    title: 'Dependency (JAR)',
                    flex: 1
                }
            ]
        },
        {
            title: 'Command Parameter',
            xtype: 'form',
            border: false,
            autoScroll: true,
            defaults: {
                labelWidth: 100
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'displayfield',
                    height: 50,
                    value: 'Please enter command line parameters in separate lines.<br>For example, if you want to enter "hadoop jar <JAR> <DRIVER> -input /INPUT -output /OUTPUT," enter -input, /INPUT, -output, and /OUTPUT in different lines.'
                },
                {
                    xtype: '_valueGrid',
                    flex: 1
                }
            ]
        }
    ]
});