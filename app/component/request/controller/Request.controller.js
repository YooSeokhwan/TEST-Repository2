sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel"
], function (Controller, formatter, Filter, FilterOperator, Fragment, Sorter, JSONModel) {
    "use strict";

    let totalNumber;

    return Controller.extend("project1.controller.Request", {
        formatter: formatter,

        onInit: function () {
            const myRoute = this.getOwnerComponent().getRouter().getRoute("Request");
            myRoute.attachPatternMatched(this.onMyRoutePatternMatched, this);
        },

        onMyRoutePatternMatched: async function () {
            this.onClearField();
            this.onDataView();
        },

        onDataView: function () {
            $.ajax({
                type: "get",
                url: "/odata/v4/request/Request"
            }).then(function (Request) {
                let RequestModel = new JSONModel(Request.value);
                this.getView().setModel(RequestModel, "RequestModel");
        
                totalNumber = Request.value.length;
                let TableIndex = "물품 요청 목록 ( " + totalNumber + " )";
                this.getView().byId("TableName").setText(TableIndex);
            }.bind(this));
        },

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

            if (ReqNum) aFilter.push(new Filter("request_number", FilterOperator.EQ, ReqNum));
            if (ReqGood) aFilter.push(new Filter("request_product", FilterOperator.Contains, ReqGood));
            if (Requester) aFilter.push(new Filter("requestor", FilterOperator.Contains, Requester));
            if (ReqDate) aFilter.push(new Filter("request_date", FilterOperator.Contains, ReqDate));
            if (ReqStatus) aFilter.push(new Filter("request_state", FilterOperator.Contains, ReqStatus));

            const oTable = this.byId("RequestTable").getBinding("rows");
            oTable.filter(aFilter);
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

        onCreateOrder: function () {
            let CreateOrder = this.getView().getModel("RequestModel").oData;
            let CreateOrderIndex = CreateOrder.length;
            let CreateNum = CreateOrder[CreateOrderIndex - 1].request_number + 1;
            this.getOwnerComponent().getRouter().navTo("CreateOrder", { num: CreateNum });
        },
        
        onClearField: function () {
            this.getView().byId("ReqNum").setValue("");
            this.getView().byId("ReqGood").setValue("");
            this.getView().byId("Requester").setValue("");
            this.getView().byId("ReqDate").setValue("");
            this.getView().byId("ReqStatus").setSelectedKey("");
        },

        onReset: function () {
            this.onClearField();
            this.onSearch();
        },

        onShowRejectReason: function (oEvent) {
            let SelectedNumID = oEvent.getParameters().id.slice(-2);
            let oBinding = this.getView().byId("RequestTable").getBinding("rows");
            let SelectedIndex = parseInt(SelectedNumID / 8);

            console.log(oEvent.getParameters().id);
            console.log(SelectedNumID);
            console.log(oBinding);
            console.log(SelectedIndex);

            if (isNaN(SelectedNumID)) {
                SelectedIndex = 0;
            }

            let RejectReason = oBinding.oList[SelectedIndex].request_reject_reason;

            let oView = this.getView();
            if (!this.nameDialog) {
                this.nameDialog = sap.ui.core.Fragment.load({
                    id: oView.getId(),
                    name: "project1.view.fragment.ShowRejectDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this.nameDialog.then(function (oDialog) {
                oDialog.open();
                oView.byId("RejectReasonCheck").setText(RejectReason);
            });
        },

        onCancelRejectReason: function () {
            this.byId("ShowRejectDialog").destroy();
            this.nameDialog = null;
        },

        onNavToDetail: function (oEvent) {
            let SelectedNum = oEvent.getParameters().row.mAggregations.cells[1].mProperties.text;
            this.getOwnerComponent().getRouter().navTo("OrderDetail", { num: SelectedNum});
            console.log(SelectedNum);
        },
        onDeleteOrder: async function () {
            let model = this.getView().getModel("RequestModel");
            let i;
            for (i = 0; i < totalNumber; i++) {
                let chk = '/' + i + '/CHK';
                if (model.getProperty(chk) === true) {
                    let key = '/' + i + '/request_number';
                    let request_number = model.getProperty(key);
                    await this.onDelete(request_number);
                }
            }
            this.onDataView();
        },
        
        onDelete: async function (key) {
            const url = `/odata/v4/request/Request(${Number(key)})`;
            console.log(">> Try delete:", url);
        
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json;IEEE754Compatible=true"
                }
            });
        
            if (!res.ok) {
                const msg = await res.text();
                console.error("Delete failed:", res.status, msg);
            } else {
                console.log("Delete success:", key);
            }
        }
    });
});
