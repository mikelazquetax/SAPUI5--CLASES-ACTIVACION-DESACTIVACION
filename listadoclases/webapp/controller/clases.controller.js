

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/util/Export",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Export, ExportTypeCSV, MessageToast) {
        "use strict";

        return Controller.extend("listadoclases.listadoclases.controller.clases", {
            //Funcion Estandar para las instanciacion de la vista de Clases            
            onInit: function () {

                //obtenemos la vista
                let oView = this.getView()
                //Instanciamos el modelo de años y lo bindemos en la vista para que 
                //se pueda filtrar por años
                let oJSONModelYears = new sap.ui.model.json.JSONModel()
                oJSONModelYears.loadData("./localService/Years.json", false);
                oView.setModel(oJSONModelYears, "jsonYears")

                //Instanciamos el modelo de clases y los bindemos en la vista para que
                //se puedan pintar en la tabla de clases
                let oJSONModelClases = new sap.ui.model.json.JSONModel()
                oJSONModelClases.loadData("./localService/Clases.json", false);
                oView.setModel(oJSONModelClases, "jsonClases")

                let oJSONModelClasesD = new sap.ui.model.json.JSONModel()
                oJSONModelClasesD.loadData("./localService/SegmentClass.json", false);
                oView.setModel(oJSONModelClasesD, "jsonClasesD")


                //Nos declaramos en local(sin necesidad de fichero json) un nuevo objeto JSON para 
                //controlar la visibilidad de los botones ACTIVAR Y DESCARGAR

                let oJSONModelVisibilidad = new sap.ui.model.json.JSONModel({
                    visibleBtnActivar: false,
                    visibleBtnDescargar: false

                })

                //Bindeamos el objeto modelo JSON de visibilidad de botones en la vista
                oView.setModel(oJSONModelVisibilidad, "jsonVisibilidad")


                let oJSONModelTextoBotones = new sap.ui.model.json.JSONModel({
                    texto: "Desactivar"
                })

                oView.setModel(oJSONModelTextoBotones, "jsonTextoBotones")


                let oJSONModelArticuloBorrado = new sap.ui.model.json.JSONModel({
                    texto: "",
                    textoII: ""
                })

                oView.setModel(oJSONModelArticuloBorrado, "jsonArticuloBorrado")

            },
            //Funcion de Filtro//
            filtrar: function () {

                //Tenemos que volver a instanciar el modelo clases con los datos de BBDD ya que despues de pulsar descargar, el modelo cambia
                let oView = this.getView()
                let oJSONModelClases = new sap.ui.model.json.JSONModel()
                oJSONModelClases.loadData("./localService/SegmentClass.json", false);
                oView.setModel(oJSONModelClases, "jsonClasesD")



                this.getView().byId("btnActivate").setText("Desactivar")
                //Cogemos todos los datos del modelo de años
                var allData = this.getView().getModel("jsonYears").getData()

                //Nos declaramos un array para recoger el valor de año por el que se filtra
                var arrayFiltros = []
                //Si el filtro is not initial, entonces hacemos el push al array utilizando el metodo Filter
                if (allData.yearKey !== "") {
                    arrayFiltros.push(new Filter("Year", FilterOperator.EQ, allData.yearKey))
                }
                //Obtenemos en la variable listado la tabla de clases
                let listado = this.getView().byId("tableClases")
                //Bindeamos los items, es decir, las clases que obtenemos directamente del json
                let binding = listado.getBinding("items")

                //Aplicamos el método filter filtrando por el array que recoge el año escogido.
                var filtros = binding.filter(arrayFiltros)


                //Cuando filtramos, queremos que aparezcan los botones de activar y descargar

                if (allData.yearKey !== "") {
                    var oJSONModeloVisibilidad = this.getView().getModel("jsonVisibilidad")
                    oJSONModeloVisibilidad.setProperty("/visibleBtnActivar", true)
                    oJSONModeloVisibilidad.setProperty("/visibleBtnDescargar", true)

                    return filtros


                }
            },
            //Funcion de Limpieza del Filtro//
            clearfiltrar: function () {

                //Tenemos que volver a instanciar el modelo clases con los datos de BBDD ya que despues de pulsar descargar, el modelo cambia
                let oView = this.getView()
                let oJSONModelClases = new sap.ui.model.json.JSONModel()
                oJSONModelClases.loadData("./localService/SegmentClass.json", false);
                oView.setModel(oJSONModelClases, "jsonClasesD")



                var modeloNormal = this.getView().getModel("jsonYears")
                modeloNormal.setProperty("/yearKey", "")

                var arrayFiltros = []
                //Obtenemos en la variable listado la tabla de clases
                let listado = this.getView().byId("tableClases")
                //obtenemos los items, es decir, las clases que obtenemos directamente del json
                let binding = listado.getBinding("items")
                binding.filter(arrayFiltros)


                //Cuando limpiamos filtros, queremos que desaparezcan los botones de activar y descargar
                var oJSONModeloVisibilidad = this.getView().getModel("jsonVisibilidad")
                oJSONModeloVisibilidad.setProperty("/visibleBtnActivar", false)
                oJSONModeloVisibilidad.setProperty("/visibleBtnDescargar", false)

            },
            //Funcion para activar o desactivar las clases de un año
            onActivate: function () {
                var model = this.getView().getModel("jsonClasesD")

                var allData = model.getData()
                //obtenemos el año por el que previamente se ha filtrado
                var yearFiltrado = this.getView().byId("slYear").getSelectedKey()
                //Obtenemos el texto del boton
                var textoBoton = this.getView().byId("btnActivate").getText();

                if (textoBoton == "Desactivar") {
                    textoBoton = "Activar"
                } else {
                    textoBoton = "Desactivar"
                };


                let index = 0
                //hacemos loop al array de clases y si se cumple la condicion activamos o desactivamos
                allData.Clases.forEach((clase) => {

                    if (clase.Year === yearFiltrado && textoBoton == "Activar") {

                        model.setProperty(`/Clases/${index}/NOTACTIVE`, 'Y')
                        MessageToast.show(`Clases para el año ${yearFiltrado} DESACTIVADAS. Pulse Descargar para obtener csv`)
                    } else if (clase.Year === yearFiltrado && textoBoton == "Desactivar") {
                        model.setProperty(`/Clases/${index}/NOTACTIVE`, 'N')
                        MessageToast.show(`Clases para el año ${yearFiltrado} ACTIVADAS. Pulse Descargar para obtener csv`)
                    }
                    index = index + 1
                });
                this.getView().byId("btnActivate").setText(textoBoton)
                textoBoton = " "

            },

            //Funcion de descargar
            onDownload: function () {
                var model = this.getView().getModel("jsonClasesD")
                var allData = model.getData()



                var yearFiltrado = this.getView().byId("slYear").getSelectedKey()
                let allDataDown = {
                    "Clases":
                        [

                        ]
                }

                allData.Clases.forEach((clase) => {

                    if (clase.Year === yearFiltrado) {

                        allDataDown.Clases.push(clase)
                    }

                });
                model.setData(allDataDown)

                var yearFiltrado = this.getView().byId("slYear").getSelectedKey()


                var oExport = new Export({

                    exportType: new ExportTypeCSV({

                        fileExtension: "csv",
                        separatorChar: ","
                    }),

                    models: model,

                    rows: {
                        path: "/Clases"
                    },

                    columns: [{
                        name: "DMN_ID",
                        template: {
                            content: "{DMN_ID}"
                        }
                    }, {
                        name: "CPNT_TYP_ID",
                        template: {
                            content: "{CPNT_TYP_ID}"
                        }
                    }, {
                        name: "ACT_CPNT_ID",
                        template: {
                            content: "{ACT_CPNT_ID}"
                        }
                    }, {
                        name: "REV_DTE",
                        template: {
                            content: "{REV_DTE}"
                        }
                    }, {
                        name: "DESCRIPTION",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "SHORT_DESCRIPTION",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "SSG_SEG_NUM",
                        template: {
                            content: "{SSG_SEG_NUM}"
                        }
                    }, {
                        name: "SEG_DESC",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "START_TME",
                        template: {
                            content: "{START_TME}"
                        }
                    }, {
                        name: "END_TME",
                        template: {
                            content: "{END_TME}"
                        }
                    }, {
                        name: "FACILITY_ID",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "LOCN_ID1",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "INST_ID1",
                        template: {
                            content: "{INST_ID1}"
                        }
                    }, {
                        name: "SELF_ENRL",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "AUTO_FILL_ENRL",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "DISPLAY_IN_SCHD_TZ",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "TIMEZONE_ID",
                        template: {
                            content: "{TIMEZONE_ID}"
                        }
                    }, {
                        name: "DISPLAY_IN_SCHD_TZ",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "MIN_ENRL",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "MAX_ENRL",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "CONTACT",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "EMAIL_ADDR",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "PHON_NUM",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "FAX_NUM",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "ENRL_CUT_DTE",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "COMMENTS",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "CHGBCK_METHOD",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "COL_NUM99_VAL",
                        template: {
                            content: "{COL_NUM99_VAL}"
                        }
                    }, {
                        name: "COL_NUM1_VAL",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "COL_NUM3_VAL",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "COL_NUM4_VAL",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "COL_NUM5_VAL",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "EMAIL_INSTRUCTOR",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "EMAIL_STUDENT",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "EMAIL_SUPERVISOR",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "EMAIL_CONTACTS",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "USER_CAN_WAITLIST",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "SUPER_ENRL",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "APPROVAL_REQD",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "TAP_DEF_ID",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "NOTACTIVE",
                        template: {
                            content: "{NOTACTIVE}"
                        }
                    }, {
                        name: "INCLUDE_IN_GOVT_REPORTING",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "TRAINING_TYPE",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "LGL_ENTITY_2483_ID",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "ALLOW_EXCEPTIONS_WHEN_RCRD_LRN",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "WITHDRAW_TAP_DEF_ID",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "WITHDRAW_APPROVAL_REQD",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "CANCEL_POLICY_ID",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "WITHDRAW_CUTOFF_DTE",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "ENABLE_CANCEL_REASON",
                        template: {
                            content: ""
                        }
                    }, {
                        name: "WITHDRAW_SUP_ASSIGNED_SCHED!##!",
                        template: {
                            content: ""
                        }
                    }]

                });
                console.log(oExport);
                oExport.saveFile('scheduledoffering_data_renfeopera').catch(function (oError) {

                }).then(function () {
                    oExport.destroy();
                });

            },
            onDelete: function (evento) {
                var iconPressed = evento.getSource();
                var clasePulsado = iconPressed.getBindingContext("jsonClases").getPath().substr(8, 9)
                var clasesModel = this.getView().getModel("jsonClases");
                var data = clasesModel.getData()

                var idArtBorrado = data.Clases[clasePulsado].ItemID
                var idClassBorrada = data.Clases[clasePulsado].ClassID

                if(!this._oDialogClases){
                    this._oDialogClases = sap.ui.xmlfragment("listadoclases.listadoclases.fragment.Modal", this)
                    this.getView().addDependent(this._oDialogClases)
            }
                    this._oDialogClases.bindElement(idArtBorrado);
                   
                   
                    var oJSONModelArticuloBorrado = this.getView().getModel("jsonArticuloBorrado")
                    oJSONModelArticuloBorrado.setProperty("/texto", idArtBorrado)
                    oJSONModelArticuloBorrado.setProperty("/textoII", idClassBorrada)
                    this._oDialogClases.open()
    
                

                data.Clases.splice(clasePulsado, 1)

                clasesModel.refresh()

                var clasesDownloadModel = this.getView().getModel("jsonClasesD").getData()
                var oclaseExclude = {
                    "Clases": [

                    ]
                }


                clasesDownloadModel.Clases.forEach((clase) => {
                    if (clase.ACT_CPNT_ID !== idArtBorrado) {
                        oclaseExclude.Clases.push(clase)
                    }
                })
                this.getView().getModel("jsonClasesD").setData(oclaseExclude)
           
            

            },
            cerrarModal: function () {
                this._oDialogClases.close()
                
            }
        });
    });
