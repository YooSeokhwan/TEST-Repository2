sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    
    return Controller.extend("project1.component.request.controller.Request_chart", {
        onInit: function () {
            var oData = {
                wait: 0,
                waitpercent: '',
                approve: 0,
                approvepercent: '',
                reject: 0,
                rejectpercent: ''
            };
            
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "state");
            console.log(this.getView().getModel("state").getData());
            this.onDataView();
        },

        onRequesthome: function () {
            this.getOwnerComponent().getRouter().navTo("Request_home");
        },

        onDataView: async function () {
            const view = this.getView();
            const oMonth = new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, '0');
        
            try {
                const Request = await $.ajax({
                    type: "get",
                    url: "/odata/v4/request/Request?$filter=contains(request_date,'" + oMonth + "')"
                });
        
                let RequestModel = new JSONModel(Request.value);
                view.setModel(RequestModel, "RequestModel");
        
                let data = RequestModel.getData(); // ✅ .getData() 사용
                let a = 0, b = 0, c = 0;
        
                data.forEach((item) => {
                    if (item.request_state === 'A') a++;
                    if (item.request_state === 'B') b++;
                    if (item.request_state === 'C') c++;
                });
        
                let total = data.length || 1;
                let stateModel = view.getModel("state");
        
                stateModel.setProperty("/approve", (a / total) * 100);
                stateModel.setProperty("/wait", (b / total) * 100);
                stateModel.setProperty("/reject", (c / total) * 100);
                stateModel.setProperty("/approvepercent", ((a / total) * 100).toFixed(0) + '%');
                stateModel.setProperty("/waitpercent", ((b / total) * 100).toFixed(0) + '%');
                stateModel.setProperty("/rejectpercent", ((c / total) * 100).toFixed(0) + '%');
        
                console.log("✅ chart state:", stateModel.getData());
        
            } catch (err) {
                console.error("❌ 데이터 불러오기 실패:", err);
            }
        },
        onAfterRendering: function () {
            console.log("== Chart state model:", this.getView().getModel("state").getData());
        }
    });
});
