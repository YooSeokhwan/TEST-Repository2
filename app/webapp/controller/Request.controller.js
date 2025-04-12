sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter"
], function (Controller, formatter, Filter, FilterOperator, Fragment, Sorter) {
    "use strict";
    return Controller.extend("project1.controller.Request", {
        formatter: formatter,

        onSearch: function () {
            let ReqNum = this.byId("ReqNum").getValue();
            let ReqGood = this.byId("ReqGood").getValue();
            let Requester = this.byId("Requester").getValue();
            let ReqDateObj = this.byId("ReqDate").getDateValue();
            let ReqStatus = this.byId("ReqStatus").getSelectedKey();

            let ReqDate = "";
            if (ReqDateObj instanceof Date && !isNaN(ReqDateObj)) {
                const yyyy = ReqDateObj.getFullYear();
                const mm = (ReqDateObj.getMonth() + 1).toString().padStart(2, '0');
                const dd = ReqDateObj.getDate().toString().padStart(2, '0');
                ReqDate = `${yyyy}-${mm}-${dd}`;
            }

            const aFilter = [];

            if (ReqNum) aFilter.push(new Filter("ReqNum", FilterOperator.Contains, ReqNum));
            if (ReqGood) aFilter.push(new Filter("ReqGood", FilterOperator.Contains, ReqGood));
            if (Requester) aFilter.push(new Filter("Requester", FilterOperator.Contains, Requester));
            if (ReqDate) aFilter.push(new Filter("ReqDate", FilterOperator.Contains, ReqDate));
            if (ReqStatus) aFilter.push(new Filter("ReqStatus", FilterOperator.Contains, ReqStatus));

            const oTable = this.byId("RequestTable").getBinding("rows");
            oTable.filter(aFilter);
        },

        onReset: function () {
            this.byId("ReqNum").setValue("");
            this.byId("ReqGood").setValue("");
            this.byId("Requester").setValue("");
            this.byId("ReqDate").setValue("");
            this.byId("ReqStatus").setSelectedKey("");
            this.onSearch();
        },

        onSort: function () {
            if (!this.byId("SortDialog")) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "project1.view.fragment.sortDialog",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.open("filter");
                }.bind(this));
            } else {
                this.byId("SortDialog").open("filter");
            }
            this.onSearch();
        },

        onConfirmSortDialog: function (oEvent) {
            let mParams = oEvent.getParameters();
            let sPath = mParams.sortItem.getKey();
            let bDescending = mParams.sortDescending;
            let aSorters = [];

            aSorters.push(new Sorter(sPath, bDescending));
            let oBinding = this.byId("RequestTable").getBinding("rows");
            oBinding.sort(aSorters);
        },

        onCreateOrder : function () {
            this.getOwnerComponent().getRouter().navTo("CreateOrder");
        }
    });
});
