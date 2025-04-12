sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    let Today, CreateNum;

    return Controller.extend("project1.controller.CreateOrder", {
        onInit: function () {
            const myRoute = this.getOwnerComponent().getRouter().getRoute("CreateOrder");
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
        },

        onMyRoutePatternMatched: function (oEvent) {
            this.onClearField();
            
            const oArgs = oEvent.getParameter("arguments");
            CreateNum = oArgs.num;

            let now = new Date();
            Today = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, '0')
                + "-" + now.getDate().toString().padStart(2, '0');

            this.getView().byId("ReqNum").setText(CreateNum);
            this.getView().byId("ReqDate").setText(Today);
        },

        onCreate: async function () {
            let temp = new JSONModel(this.temp).oData;
            temp.request_product = this.byId("ReqGood").getValue();
            temp.request_quantity = parseInt(this.byId("ReqQty").getValue());
            temp.requestor = this.byId("Requester").getValue();
            temp.request_reason = this.byId("ReqReason").getValue();
            temp.request_number = parseInt(CreateNum);
            temp.request_state = "B";
            temp.request_date = Today;
            temp.request_estimated_price = parseInt(this.byId("ReqPrice").getValue());

            await fetch("/odata/v4/request/Request", {
                method: "POST",
                body: JSON.stringify(temp),
                headers: {
                    "Content-Type": "application/json;IEEE754Compatible=true"
                }
            });

            this.onBack();
        },

        onClearField: function () {
            this.getView().byId("ReqGood").setValue("");
            this.getView().byId("ReqQty").setValue("");
            this.getView().byId("Requester").setValue("");
            this.getView().byId("ReqPrice").setValue("");
            this.getView().byId("ReqReason").setValue("");
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("Request");
        }
    });
});
