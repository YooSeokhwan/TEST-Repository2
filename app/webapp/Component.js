sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/Device",
    "project1/model/models"
], (UIComponent, JSONModel, ResourceModel, Device, models) => {
    "use strict";

    return UIComponent.extend("project1.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ],
            "rootView": {
                "viewName": "project1.view.App",
                "type": "XML",
                "id": "app",
                manifest: "json"
            }
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            let oData = {
                recipient : {
                    name : "World"
                }
            };

            let oModel = new JSONModel(oData);
            this.setModel(oModel);

            let i18nModel = new ResourceModel({
                bundleName: "project1.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");
        }
    });
});