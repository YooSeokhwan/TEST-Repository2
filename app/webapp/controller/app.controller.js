sap.ui.define([
    "sap/ui/core/mvc/Controller",
], (Controller, ) => {
    "use strict";

    return Controller.extend("project1.controller.app", {
        
        onRequest: function() {
            this.getOwnerComponent().getRouter().navTo("request");
            console.log("onRequest called")
        },
        
        onHome: function() {
            this.getOwnerComponent().getRouter().navTo("home");
        }
    });
});