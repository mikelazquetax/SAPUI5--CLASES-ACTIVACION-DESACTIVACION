/*global QUnit*/

sap.ui.define([
	"listadoclases/listadoclases/controller/clases.controller"
], function (Controller) {
	"use strict";

	QUnit.module("clases Controller");

	QUnit.test("I should test the clases controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
