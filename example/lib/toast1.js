/*
 * Toast extension for Sencha Touch 2.3.x+
 * Performs like in native Android
 *
 * Author: Barry Loh
 * Version: 1.0
 * Copyright (c) 2014 Barry Loh 
 *
 * Follow project on GitHub: https://github.com/ ...
 *
 * TODO: What if a toast message is already shown? Queue it!
 *
 * < Incl license here >
 *
 * Example usage:
 * var toast = Ext.create('widget.ux-toast', {
   		toastDuration: 2000,
   		doUndo: function() {
			alert('Undo button is pressed')
   		}
   });

   toast.setMessage('Toast this bread!');
   toast.show();
 *
 */

 Ext.define('Ext.ux.window.Toast', {
 	extend: 'Ext.Sheet',
 	alias: 'widget.ux-toast',

 	config: {
 		// Specify the undo function 
 		doUndo: function() {},

		// Default duration of Toast message to long duration. Value can be either in:
	 	// (String) - short / long
	 	// (Integer) - milliseconds
	 	toastDuration: 3500,

	 	// Set to float bottom of screen with some whitespace below
 		// Can be changed if needed
		bottom: 30,

		// Set default animation of toast to fade in and fade out
		hideAnimation: 'fadeOut',
		showAnimation: 'fadeIn',

		// Private. Do not override!
		durationShort: 'SHORT',
		durationLong: 'LONG',
		width: '100%',
		modal: false,
		centered: false,
		hidden: true,
		layout: {
			type: 'hbox',
			align: 'center',
			pack: 'center'
		},
		items: [
			{
				xtype: 'container',
				//cls: 'ux-bl-toast',
				cls: 'toast',
				itemId: 'toastContainer',
				maxWidth: '80%',
				layout: {
					type: 'hbox',
					align: 'center',
					pack: 'center'
				},
				items: [
					{
						xtype: 'label',

						flex: 1,
						cls: 'defaultSubContent',
						// cls: 'ux-toast-msg',
						html: 'Action perfomed.',
						itemId: 'txtMsg',
						margin: '0 8 0 0'
					},
					{
						xtype: 'button',
						cls: 'toast-undo-btn',
						// cls: 'ux-toast-undo-btn',
						hidden: true,
						itemId: 'btnUndo',
						ui: 'plain',
						iconCls: 'toast-ico-undo',
						// iconCls: 'ux-toast-ico-undo',
						pressedCls: 'x-toast-undo-btn-pressing',
						// pressedCls: 'ux-toast-undo-btn-pressing',
						text: 'UNDO'
					}
				]
			}
		],
		listeners: [
			{
				fn: 'onToastShow',
				event: 'show'
			},
			{
				fn: 'onBtnUndoTap',
				event: 'tap',
				delegate: '#btnUndo'
			}
		]
	},

	constructor: function(config) {
		this.callParent(config);

		return this;
	},

	/* 
	 * Set message text of toast
	 * @msg
	 *
	 */
	setMessage: function(msg) {
		this.down('#txtMsg').setHtml(msg);
	},

	/*
	 * Show undo button. When showing undo button, set a permanent width to Toast
	 *
	 */
	 showUndo: function() {
	 	this.down('#btnUndo').show();
	 	this.down('#toastContainer').setWidth('80%');
	 },

	 /*
	  * Hide to show the animation and destroy the component
	  * @isInstant - to remove Toast instantly with disregard to timeout. Initiated when undo button is tap
	  *
	  */
	 removeToast: function(isInstant) {
	 	var me = this;

	 	// Destroy component once hidden
	 	me.on('hide', function(c) {
	 		c.destroy();
	 	});

	 	if (isInstant) {
	 		me.hide();
	 	}
	 	else {
	 		var toast_duration;

	 		// Obtain the toast duration
	 		// Check if value set is string/number/etc and obtain the appropriate value
	 		switch (typeof me.toastDuration) {
	 			case 'string':
	 				if (me.toastDuration.toUpperCase() === me.durationShort) toast_duration = 2000;
	 				else if (me.toastDuration.toUpperCase() === me.durationLong) toast_duration = 3500;
	 				break;

 				case 'number':
 					console.log('is number');
 					toast_duration = me.toastDuration;
	 				break;

 				default:
 					console.log('is default');
 					toast_duration = 3500;
	 				break;
	 		}

	 		console.log(me.toastDuration);
	 		console.log(toast_duration)

	 		// Create a timeout function 
	 		setTimeout(function() {
	 			me.hide();
	 		}, toast_duration);
	 	}

	 },

	/*
	 *
	 */
	onToastShow: function(c) {
		this.removeToast();
	},

	/*
	 *
	 */
	onBtnUndoTap: function(b) {
		if (this.doUndo) {
			this.doUndo();
			this.removeToast(true);
		}
	}

 });