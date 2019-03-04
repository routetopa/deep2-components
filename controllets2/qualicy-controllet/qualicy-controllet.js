import '../shared/jquery/jquery-3.3.1.min.js'
import '../shared/datatable/datatables.js'
import TypeAndMetatypeConfigFactory from './static/js/TypeAndMetatypeConfigFactory_qualicyLibrary.js'
import DataChecker from './static/js/DataChecker_qualicyLibrary.js'
import PrivacyReportViewBuilder from './static/js/PrivacyReportViewBuilder_qualicyLibrary.js'
import Test_qualicy from './static/js/test_qualicy.js'
import TableManager from './static/js/tableManager.js'
import Test_qualicy2 from './static/js/test_qualicy2.js'

export default class QualicyControllet extends HTMLElement {

    constructor() {
        super();
        this.currentDocument = document.querySelector(`link[href*="qualicy-controllet"]`).import;
        this.shadow_root = this.attachShadow({mode: 'open'});
    }

    template()
    {
        const template = this.currentDocument.querySelector('#qualicy-controllet');
        return template.content.cloneNode(true);
    }

    connectedCallback() {
        let template = this.template();
        this.shadow_root.appendChild(template);

        let coll = this.shadow_root.querySelectorAll('.collapsible');
        let i;

        for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                let content = this.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }

        //data initialization
        this.data = JSON.parse(this.getAttribute("data"));
        this.data_url = this.getAttribute("data-url");

        if(this.data.length == 0){
            this.data = this.initializeData();
        }

        //datatable inizialization
        let ranking_table = this.shadow_root.querySelector('#ranking-list-datatable');
        let menu = this.shadow_root.querySelector('#qualicy-menu');
        this.tableManager = new TableManager(ranking_table, menu);

        this.tableManager.initDataTable(this.data, this.data_url);

        this.computeStatistics();
        this.renderStatistics();

    }

    attributeChangedCallback() {
        console.log('attributeChangedCallback');
    }

    disconnectedCallback() {
        //todo - remove event listeners?
        this.shadow_root.innerHTML = '';
    }

    /* LOGIC */

    initializeData(){
        let output = null;
        $.ajax({
            url: this.data_url,
            async: false,
            dataType: "json",
            success: function(data){
                output =  data.result.records;
            },
            error: function(){}
        });
        return output;
    }

    computeStatistics(){

        if (this.data.length == 0) {
            return;
        }

        const _fieldkeys = Object.keys(this.data[0]).map( (val) => { return { name: val } });
        //console.log(_fieldkeys)

        const typeAndMetatypeFactory = new TypeAndMetatypeConfigFactory();
        const datachecker = new DataChecker(typeAndMetatypeFactory);

        //Datatype and metadatatype inference
        let evaLogs = datachecker.askForEvaluation(this.data, _fieldkeys);
        //console.log(evaLogs);

        //Summarize datatype and metadatatype inference
        let viewBuilder = new PrivacyReportViewBuilder();
        let reportView = viewBuilder.buildDatatypeAndMetatype(evaLogs);
        console.log(reportView);

        //typos and contentPrivacyBreaches
        this.typos = [];
        this.contentPrivacyBreaches = [];

        reportView.DATASET.forEach((colArrs, idx) => {
            colArrs.forEach((value) => {

                if(value.metatype === typeAndMetatypeFactory.DATATYPES.DT_UNKNOWN){
                    if(value.datatype === typeAndMetatypeFactory.DATATYPES.DT_TEXT){
                        //check if a type is unrecognized because of a typo
                        var corrections = datachecker.detectTyposErrorsCorrections(value.value);
                        if(corrections.length>0){
                            value.style = "border: 1px solid #FF0000; padding: 3px 12px;";
                            var message = "";
                            for(var i in corrections){
                                message += corrections[i].correction + "->" + corrections[i].datatype.name + "<br>";
                            }
                            value.tooltiptext = message;

                            this.typos.push(value);
                        }else{
                            var contentPrivacyBreaches = datachecker.testContentPrivacyBreaches(value.value);
                            if(contentPrivacyBreaches.length>0){

                                value.style = "border: 1px solid #00FF00; padding: 3px 12px;";
                                var message = "";
                                for(var i in contentPrivacyBreaches){
                                    message += contentPrivacyBreaches[i].datatype.name + ": "+ contentPrivacyBreaches[i].match + "<br>";
                                }
                                value.tooltiptext = message;

                                this.contentPrivacyBreaches.push(value);
                            }
                        }
                    }
                }
            });
        });

        console.log(this.typos);
        console.log(this.contentPrivacyBreaches)

        //structuralprivacybreaches
        let reportColumnStats= viewBuilder.buildColumnStats(evaLogs);

        let schema = {};
        for(let column_name in reportColumnStats.types){
            if(reportColumnStats.types[column_name].subtype!==null){
                if(!schema.hasOwnProperty(reportColumnStats.types[column_name].subtype))
                    schema[reportColumnStats.types[column_name].subtype] = [];
                schema[reportColumnStats.types[column_name].subtype].push(column_name);
            }
            else if(reportColumnStats.types[column_name].type!==null){
                if(!schema.hasOwnProperty(reportColumnStats.types[column_name].type))
                    schema[reportColumnStats.types[column_name].type] = [];
                schema[reportColumnStats.types[column_name].type].push(column_name);
            }
        }
        this.structuralPrivacyBreaches = datachecker.testStructuralPrivacyBreaches(schema);
        console.log(this.structuralPrivacyBreaches);

    }

    renderStatistics(){
        this.tableManager.fillInTypoStats(this.typos);
    }
};

const FrozenQualicyControllet = Object.freeze(QualicyControllet);
window.customElements.define('qualicy-controllet', FrozenQualicyControllet);