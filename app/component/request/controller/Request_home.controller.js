sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/ui/model/json/JSONModel"
], function (Controller, formatter, JSONModel) {
    "use strict";

    return Controller.extend("project1.component.request.controller.Request_home", {
        formatter: formatter,
        
        onInit: async function () {
            const myRoute = this.getOwnerComponent().getRouter().getRoute("Request_home");
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
        },
        
        onMyRoutePatternMatched: async function () {
            const Request = await $.ajax({
                type: "get",
                url: "/odata/v4/request/Request?$orderby=request_date desc&$filter=request_state eq 'B'&$top=3"
                });
                console.log("==> 데이터 응답:", Request); // ✅ 추가

                let RequestModel = new JSONModel(Request.value);
                console.log("==> 모델에 바인딩할 데이터:", Request.value); // ✅ 추가

                this.getView().setModel(RequestModel, "RequestModel");
        },
        
        onRequest_list: function () {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Request");
        },

        onRequest_chart: function() {
            const oChart = this.getOwnerComponent().getRouter();
            oChart.navTo("Request_chart")
            
        }
    });
});
