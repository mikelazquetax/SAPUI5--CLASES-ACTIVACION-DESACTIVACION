

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Filter,FilterOperator) {
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

                //Nos declaramos en local(sin necesidad de fichero json) un nuevo objeto JSON para 
                //controlar la visibilidad de los botones ACTIVAR Y DESCARGAR

                let oJSONModelVisibilidad = new sap.ui.model.json.JSONModel({
                    visibleBtnActivar: false,
                    visibleBtnDescargar:false

                })

                //Bindeamos el objeto modelo JSON de visibilidad de botones en la vista
                oView.setModel(oJSONModelVisibilidad, "jsonVisibilidad")


                let oJSONModelTextoBotones = new sap.ui.model.json.JSONModel({
                    texto: "Desactivar"
                })

                oView.setModel(oJSONModelTextoBotones, "jsonTextoBotones")

            },
//Funcion de Filtro//
            filtrar: function(){
                this.getView().byId("btnActivate").setText("Desactivar")
                //Cogemos todos los datos del modelo de años
                var allData = this.getView().getModel("jsonYears").getData()

                //Nos declaramos un array para recoger el valor de año por el que se filtra
                var arrayFiltros = []
                //Si el filtro is not initial, entonces hacemos el push al array utilizando el metodo Filter
                if(allData.yearKey !== ""){
                    arrayFiltros.push(new Filter("Year", FilterOperator.EQ, allData.yearKey))
                }
                //Obtenemos en la variable listado la tabla de clases
                let listado = this.getView().byId("tableClases")
                //Bindeamos los items, es decir, las clases que obtenemos directamente del json
                let binding = listado.getBinding("items")

                //Aplicamos el método filter filtrando por el array que recoge el año escogido.
                binding.filter(arrayFiltros)


                //Cuando filtramos, queremos que aparezcan los botones de activar y descargar

                if(allData.yearKey !== ""){
                var oJSONModeloVisibilidad = this.getView().getModel("jsonVisibilidad")
                oJSONModeloVisibilidad.setProperty("/visibleBtnActivar", true)
                oJSONModeloVisibilidad.setProperty("/visibleBtnDescargar", true)
                }
            },
//Funcion de Limpieza del Filtro//
            clearfiltrar: function(){
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
            onActivate: function(){
                var model = this.getView().getModel("jsonClases")

                var allData = model.getData()

                var yearFiltrado = this.getView().byId("slYear").getSelectedKey()
                var textoBoton = this.getView().byId("btnActivate").getText();

                 if(textoBoton == "Desactivar"){
                     textoBoton = "Activar"
                 }else{
                     textoBoton = "Desactivar"
                 };
               /*   this.getView().byId("btnActivate").setText(textoBoton) */

                let index = 0
                    allData.Clases.forEach((clase)=>{
                        
                        if(clase.Year === yearFiltrado && textoBoton == "Activar"){
                            
                            model.setProperty(`/Clases/${index}/Active`, 'No')
                        }else if(clase.Year === yearFiltrado && textoBoton == "Desactivar"){
                            model.setProperty(`/Clases/${index}/Active`, 'Si')
                        }
                        index = index + 1
                    });
                    this.getView().byId("btnActivate").setText(textoBoton)
                    textoBoton = " "
            /*     model.setProperty('/Clases/3/Active', "No") */
            }

        });
    });
