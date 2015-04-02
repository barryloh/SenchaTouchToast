# Sencha Touch Toast
---

## About

---
This plugin aims to recreate the Toast notification from Android to be used in Sencha Touch apps. This plugin allows the Toast to be called multiple times like in Android and it will get queued. Also, it allows for a custom action button on the Toast, e.g. *UNDO*.

## Compatibility

---
These plugin have been tested working with **Sencha Touch 2.3.1**.

## Getting Started
---
At the **Application** level, you'll need to add the required class to be loaded automatically.

	Ext.Application({
		requires: [ 'BA.Toast' , .. ],
		..
	});

At anytime needed, you can create a Toast instance by simply creating the class. Also include **toast.js** and **toast.css** into your app.

## Usage
---

To show a **simple** toast:

	Ext.create('BA.Toast', {
		message: 'This is a toast',
		toastDuration: 'SHORT'
	});

To show a toast with an **undo action button**:

	Ext.create('BA.Toast', {
		message: 'Toast that allows undo',
		toastDuration: 2500,
		doAction: {
			text: 'Undo',
			tap: function() {
				console.log('Perform undo function here');
				// Other code here..
			}
		}
	});
	
## Documentation
---
Parameter     | Value
:------------ | :----
message<br><br>       | A **string** to display on the toast. Pick something real short and sweet!
toastDuration<br><br><br><br><br><br><br><br><br><br> | Duration of how long to show the Toast. Value can be set either in:<br><ul><li>**String**<ul><li>*SHORT* or *short*</li><li>*LONG* or *long*</ul></li><li>**Integer**<ul><li>Range from 0 to 10000</li></ul></li></ul><br>`Defaults to long duration`
doAction<br><br><br><br><br><br><br> | An **object** that *must* have two fields:<ul><li>**text**<br>A one-word string to display for the button</li><li>**tap**<br>A function to be executed once it is tapped on. Besides hiding the Toast immediately.</li></ul>

## FAQ
---

#### 1. The Toast looks boring!
In *toast.css*, feel free to edit the 3 classes tied to the toast, message and action button.

#### 2. How many lines of text does the Toast supports?
Only **one** line of text as the message.

#### 3. Can I show more than one Toast at a time?
Unforunately that is not the right behaviour. Creating the class instance multiple times will queue the Toasts to display one after another.


## Screenshots
---

*Coming soon.*

## Changelog
---
* Version 1.0
	* *Release:* April 2, 2015.
	* First release.

