/**
 * Native Android Toast extension for Sencha Touch 2.3.x+.
 *
 * Author: Barry Loh
 * Version: 1.0
 * Copyright (c) 2015 Barry Loh 
 *
 * Follow project on GitHub: https://github.com/ ...
 *
 *
 * < Incl license here >
 * 
 * Steps:
 * 1. At Application level, include 'BA.Toast' in 'requires'.
 * 2. Create an instance of this class, specify parameters and call .show() method.
 *
 * Example usage:
 * Ext.create('BA.Toast', {
 		message: '',
   		toastDuration: 2000,
   		doAction: {
			text: '',
			tap: function() {
				console.log('This button is tapped!');
			}
   		}
   });
 *
 */

 Ext.define('BA.Toast', {
 	extend: 'Ext.Sheet',
 	alias: 'widget.ba-toast',

 	config: {
		// Default duration of Toast message to long duration. Value can be either in:
	 	// (String) - short / long
	 	// (Integer) - milliseconds
	 	toastDuration: 3500,

	 	// Set the toast message to this property.
	 	message: '',

	 	// Specify the undo function.
 		// By specifying the undo function, it'll automatically show the undo button.
 		doAction: {},

		/*
		 * Private constant variables being used.
		 * Please do not change!
		 */

		// Set to float at the bottom of screen with some whitespace below. 
	 	// Space can be changed if needed.
		bottom: 15,

		// Set default animation of toast to fade in and fade out.
		// Its either animation or slide in.. gotta find a way to do both? 
		hideAnimation: 'fadeOut',
		showAnimation: 'fadeIn',

		shortDuration: 'SHORT',
		longDuration: 'LONG',
		shortDurationTS: 2000,
		longDurationTS: 3500,

		followup: '',
		transitionDuration: 350,

		// Other configuration and layout of the toast.
		fullscreen: true,
		modal: false,
		centered: false,
		stretchX: true,
		hidden: true,
		enter: 'bottom',
		exit: 'bottom',
		cls: 'ba-toast',
		layout: {
			type: 'hbox',
			align: 'center',
			pack: 'center'
		},
		items: [
			{	
				xtype: 'label',
				flex: 1,
				cls: 'ba-toast-msg',
				itemId: 'txtMessage',
			},
			{
				xtype: 'button',
				itemId: 'btnAction',
				hidden: true,
				ui: 'plain',
				cls: 'ba-toast-action-btn',
				pressedCls: 'null',
			}
		],
		listeners: [
			{
				fn: 'onToastInit',
				event: 'fullscreen'
			},
			{
				fn: 'onToastShow',
				event: 'show'
			},
			{
				fn: 'onToastHide',
				event: 'hide'
			},
			{
				fn: 'onBtnActionTap',
				event: 'tap',
				delegate: '#btnAction'
			}
		]
	},

	constructor: function(config) {
		this.callParent(arguments);

		return this;
	},

	/**
	* From the 'message' parameter set in config, calling this function will set the message of the toast.
	*/
 	setToastMessage: function() {
 		this.getComponent('txtMessage').setHtml(this.getMessage());
	},

	/**
	 * Hide to show the animation and destroy the component
	 * @isInstant - to remove Toast instantly with disregard to timeout. Initiated when undo button is tap
	 *
	 */
	removeToast: function(isInstant) {
		var me = this;

	 	// If clicked on undo, the toast is usually needed to be removed instantly. Set this flag to true
	 	// to hide this toast instantly from the view.
	 	if (isInstant) {
	 		me.hideToast(me);
	 		return;
	 	}

	 	// Initialize variable to obtain duration.
		var toastDur = me.getToastDuration();

		// Obtain the toast duration. Check if value set is string/number.
		switch (typeof toastDur) {
			case 'string':
				if (toastDur.trim().toUpperCase() === me.getShortDuration())     toastDur = me.getShortDurationTS();
				else if (toastDur.trim().toUpperCase() === me.getLongDuration()) toastDur = me.getLongDurationTS();
				break;

		case 'number':
				break;

		// If value is not set or undefined, default to a long duration.
		default:
			toastDur = me.getLongDurationTS();
				break;
		}

		// Starts the countdown to hide the toast.
		setTimeout(function() {
			me.hideToast(me);
		}, toastDur);
	},

	/**
	* Whenever it is time, or (instant), the toast should be hidden from the screen.
	* @t This toast instance.
	*/
	hideToast: function(t) {
		t.hide();

		// Check and create if any follow up is present.
		t.createFollowupToast(t);	
	},

	/**
	* Before showing the action button, check whether parameters are supplied.
	* Needed the 'text' and 'tap' parameter in the 'doAction' object.
	*/
	showActionButton: function() {
		// Obtain the 'doAction' object.
		var actionObj = this.getDoAction();

		// If obth parameters are supplied, show the action button and set the text.
		if (actionObj.text && actionObj.tap) {
			this.getComponent('btnAction').setText(actionObj.text);
			this.getComponent('btnAction').show();
		}
	},

	/**
	* When the toast instance is about to be hidden and destroyed, it is then checked for any follow ups.
	* If there is a follow up, allow a transition duratino for the animation to play and then show the 
	* follow up toast.
	* @t This toast instance.
	*/
	createFollowupToast: function(t) {
		if (t.getFollowup()) {
			setTimeout(function() {
				Ext.getCmp(t.getFollowup()).show();
			}, t.getTransitionDuration());
		}
	},

	/**
	* Event is fired whenever toast component is initiated.
	* @t This toast instance.
	*/
	onToastInit: function(t) {
		// Set message to the toast.
		t.setToastMessage();

		// Show undo button if specified.
		t.showActionButton();

		// Query for all toast components in the viewport.
		var toasts = Ext.ComponentQuery.query('ba-toast');

		// Since this toast instance is already added, there should be a minimum of one component
		// per call. Hence, if there's only one, show the toast like there's nobody business.
		if (toasts.length === 1) {
			t.show();
			return;
		}

		// Else, obtain the last-created toast (that is still being shown on the screen), add some
		// details for that toast to call the follow up toast.
		var showingToast = toasts[toasts.length - 2];
		showingToast.setFollowup(t.getId());
	},

	/**
	 * Show event listener for the toast component.
	 */
	onToastShow: function() {
		// Initiates countdown.
		this.removeToast();
	},

	/**
	* Hide event listener for the toast component.
	* @t This toast instance.
	*/
	onToastHide: function(t) {
		// Remove the toast component from the Viewport to preserve the DOM.
		Ext.Viewport.remove(t);
	},

	/**
	* When the action button is clicked, execute the function created in the doAction object.
	* @b Undo button instance.
	*/
	onBtnActionTap: function(b) {
		var obj = this.getDoAction();

		if (obj.tap && typeof obj.tap === 'function') obj.tap();

		// Immediately remove this toast.
		this.removeToast(true);
	}

 });