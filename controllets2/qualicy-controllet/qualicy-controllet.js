import '../shared/jquery/jquery-3.3.1.min.js'
import '../shared/DataTables/DataTables-1.10.18/js/jquery.dataTables.min.js'

import localizationManager from './static/js/localization/localizationManager.js'
import TypeAndMetatypeConfigFactory from './static/js/TypeAndMetatypeConfigFactory_qualicyLibrary.js'
import DataChecker from './static/js/DataChecker_qualicyLibrary.js'
import PrivacyReportViewBuilder from './static/js/PrivacyReportViewBuilder_qualicyLibrary.js'
import TableManager from './static/js/tableManager.js'

export default class QualicyControllet extends HTMLElement {

    constructor() {
        super();
        this.currentDocument = document.querySelector(`link[href*="qualicy-controllet"]`).import;
        this.baseUri = this.currentDocument.baseURI.substring(0, this.currentDocument.baseURI.lastIndexOf("/") + 1);
        this.shadow_root = this.attachShadow({mode: 'open'});
    }

    template() {
        const template = this.currentDocument.querySelector('#qualicy-controllet');
        return template.content.cloneNode(true);
    }

    async connectedCallback() {
        let template = this.template();

        this.load_script([{
            template: template,
            baseURI: this.baseUri
        }]);

        this.shadow_root.appendChild(template);

        // localization
        const LM = new localizationManager();
        LM.setUserLanguage(this.getAttribute("localization"));
        // console.log(LM.translate("column"));

        //data initialization
        this.data = JSON.parse(decodeURIComponent(this.getAttribute("data")));
        this.data_url = this.getAttribute("data-url");

        if(this.data.length == 0)
            this.data = this.initializeData();

        this.manageTabs();
        this.modalInitialization();

        //datatable inizialization
        let ranking_table = this.shadow_root.querySelector('#ranking-list-datatable');
        let menu = this.shadow_root.querySelector('#qualicy-menu');
        this.qualicyModal= this.shadow_root.querySelector('#qualicy-modal');
        this.columnStatsModal= this.shadow_root.querySelector('#columnStats-modal');
        this.tableManager = new TableManager(ranking_table, menu, this.qualicyModal, this.columnStatsModal);

        window.onload = async function() {
            this.tableManager.initDataTable(this.data, this.data_url);
            await this.computeStatistics();
            this.extractNullCells();
            this.extractDatatypeMismatches();
            this.extractMetaDatatypeMismatches();
            this.extractMissingMetaDatatypes();
            this.renderStatistics();
            this.tableManager.redrawDataTable();
        }.bind(this);
    }

    attributeChangedCallback() {
        console.log('attributeChangedCallback');
    }

    disconnectedCallback() {
        //todo - remove event listeners?
        this.shadow_root.innerHTML = '';
    }

    manageTabs(){
        let tabLinks = this.shadow_root.querySelectorAll('.qualicy-tab button');
        for(let i=0; i<tabLinks.length; i++){
            let tab = tabLinks[i];
            let _self = this;
            tab.addEventListener('click', function(e){
                _self.openTab(e, tab.getAttribute('href'));
            });
        }

        tabLinks[0].click();
    }

    openTab(evt, tabID) {
        // Declare all variables
        var i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = this.shadow_root.querySelectorAll(".qualicy-tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = this.shadow_root.querySelectorAll(".tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace("active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        this.shadow_root.querySelector('#'+tabID).style.display = "block";
        evt.currentTarget.className += " active";
    }

    modalInitialization(){
        let _self = this;

        this.shadow_root.querySelector('#qualicy-close-button').addEventListener('click', function(){
            $(_self.qualicyModal).removeClass('modal-open');
            $(_self.qualicyModal).addClass('modal-close');
        });

        this.shadow_root.querySelector('#columnStats-close-button').addEventListener('click', function(){
            $(_self.columnStatsModal).removeClass('modal-open');
            $(_self.columnStatsModal).addClass('modal-close');
        });
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

    async computeStatistics(){

        if (this.data.length == 0) {
            return;
        }

        const _fieldkeys = Object.keys(this.data[0]).map( (val) => { return { name: val } });
        //console.log(_fieldkeys)

        const typeAndMetatypeFactory = new TypeAndMetatypeConfigFactory();
        const datachecker = new DataChecker(typeAndMetatypeFactory);

        await typeAndMetatypeFactory.import_modules('it');

        //Datatype and metadatatype inference
        let evaLogs = datachecker.askForEvaluation(this.data, _fieldkeys);
        //console.log(evaLogs);

        //Summarize datatype and metadatatype inference
        let viewBuilder = new PrivacyReportViewBuilder();
        let reportView = viewBuilder.buildDatatypeAndMetatype(evaLogs);
        // console.log(reportView);

        //typos and contentPrivacyBreaches
        this.typos = [];
        this.contentPrivacyBreaches = [];

        reportView.DATASET.forEach((colArrs, idx) => {
            colArrs.forEach((value) => {

                if(value.metatype === typeAndMetatypeFactory.DATATYPES.DT_UNKNOWN){
                    if(value.datatype === typeAndMetatypeFactory.DATATYPES.DT_TEXT){
                        //check if a type is unrecognized because of a typo
                        let corrections = datachecker.detectTyposErrorsCorrections(value.value);
                        if(corrections.length>0){
                            /*
                            value.style = "border: 1px solid #FF0000; padding: 3px 12px;";

                            var message = "";
                            for(var i in corrections){
                                message += corrections[i].correction + "->" + corrections[i].datatype.name + "<br>";
                            }
                            value.tooltiptext = message;
                             */

                            value.typosCorrection = corrections;
                            this.typos.push(value);
                        }else{
                            let contentPrivacyBreaches = datachecker.testContentPrivacyBreaches(value.value);
                            if(contentPrivacyBreaches.length>0){
                                /*
                                value.style = "border: 1px solid #00FF00; padding: 3px 12px;";
                                var message = "";
                                for(var i in contentPrivacyBreaches){
                                    message += contentPrivacyBreaches[i].datatype.name + ": "+ contentPrivacyBreaches[i].match + "<br>";
                                }
                                value.tooltiptext = message;
                                 */

                                value.contentPrivacyBreaches = contentPrivacyBreaches;
                                this.contentPrivacyBreaches.push(value);
                            }
                        }
                    }
                }
            });
        });

        // console.log(reportView.DATASET);
        this.annotatedDataset = reportView.DATASET;

        // console.log(this.typos);
        // console.log(this.contentPrivacyBreaches)

        //structuralprivacybreaches
        this.reportColumnStats= viewBuilder.buildColumnStats(evaLogs);
        // console.log(this.reportColumnStats);

        let schema = {};
        for(let column_name in this.reportColumnStats.types){
            if(this.reportColumnStats.types[column_name].subtype!==null){
                if(!schema.hasOwnProperty(this.reportColumnStats.types[column_name].subtype))
                    schema[this.reportColumnStats.types[column_name].subtype] = [];
                schema[this.reportColumnStats.types[column_name].subtype].push(column_name);
            }
            else if(this.reportColumnStats.types[column_name].type!==null){
                if(!schema.hasOwnProperty(this.reportColumnStats.types[column_name].type))
                    schema[this.reportColumnStats.types[column_name].type] = [];
                schema[this.reportColumnStats.types[column_name].type].push(column_name);
            }
        }
        this.structuralPrivacyBreaches = datachecker.testStructuralPrivacyBreaches(schema);
        // console.log(this.structuralPrivacyBreaches);

    }

    extractNullCells(){
        this.nullCells = [];
        for(let column in this.reportColumnStats.types) {
            let columnTypes = this.reportColumnStats.types[column]._inferredTypes;

            if ("NULL_cells" in columnTypes) {
                this.nullCells = this.nullCells.concat(columnTypes["NULL_cells"]);
            }
        }
    }

    extractDatatypeMismatches(){

        this.datatypeMismatches = [];
        for(let column in this.reportColumnStats.COLUMN_STATS) {

            let columnInfo = this.reportColumnStats.COLUMN_STATS[column];

            if(columnInfo.datatypeConfidence < 1){

                let mismatchDatatypes = [];
                for (let typeName in this.reportColumnStats.types[column]._inferredTypes) {
                    if(typeName != columnInfo.datatype && !typeName.endsWith("_cells")){
                        mismatchDatatypes.push(typeName);
                    }
                }

                for (let typeIndex in mismatchDatatypes){
                    let typeName = mismatchDatatypes[typeIndex];
                    this.datatypeMismatches = this.datatypeMismatches.concat(this.reportColumnStats.types[column]._inferredTypes[typeName+"_cells"]);
                }
            }
        }
    }

    extractMetaDatatypeMismatches(){

        this.metadatatypeMismatches = [];
        for(let column in this.reportColumnStats.COLUMN_STATS) {

            let columnInfo = this.reportColumnStats.COLUMN_STATS[column];

            if(columnInfo.metadatatypeConfidence < 1){

                let mismatchMetaDatatypes = [];
                for (let typeName in this.reportColumnStats.types[column]._inferredSubTypes) {
                    if(typeName != columnInfo.metadatatype
                        && typeName != 'NULL'
                        && !typeName.endsWith("_cells")){
                            mismatchMetaDatatypes.push(typeName);
                    }
                }

                for (let typeIndex in mismatchMetaDatatypes){
                    let typeName = mismatchMetaDatatypes[typeIndex];
                    this.metadatatypeMismatches = this.metadatatypeMismatches.concat(this.reportColumnStats.types[column]._inferredSubTypes[typeName+"_cells"]);
                }
            }
        }
        // console.log(this.metadatatypeMismatches);
    }

    extractMissingMetaDatatypes(){
        this.missingMetadatatypes = [];
        for(let column in this.reportColumnStats.COLUMN_STATS) {
            let columnInfo = this.reportColumnStats.COLUMN_STATS[column];

            if(columnInfo.metadatatype == "UNKNOWN"){
                this.missingMetadatatypes = this.missingMetadatatypes.concat(this.reportColumnStats.types[column]._inferredSubTypes["UNKNOWN_cells"]);
            }
        }
        // console.log(this.missingMetadatatypes);
    }

    renderStatistics(){
        this.tableManager.fillInTypoStats(this.typos);
        this.tableManager.fillInDatatypeStats(this.nullCells, this.datatypeMismatches);
        this.tableManager.fillInMetaDatatypeStats(this.metadatatypeMismatches, this.missingMetadatatypes);
        this.tableManager.fillInContentPrivacyBreachesStats(this.contentPrivacyBreaches);
        this.tableManager.fillInStructuralPrivacyBreachesStats(this.structuralPrivacyBreaches);
        this.tableManager.fillInCellStats(this.annotatedDataset);
        this.tableManager.fillInColumnStats(this.reportColumnStats, this.structuralPrivacyBreaches);
    }

    // utilities

    load_script(templates) {
        templates.forEach((t) => {
            let scripts = t.template.querySelectorAll('link, script'); //'script, link'

            for (let i = 0; i < scripts.length; i++) {
                let attribute = scripts[i].tagName === 'SCRIPT' ? 'src' : 'href';
                scripts[i].setAttribute(attribute, this.build_uri(scripts[i].getAttribute(attribute), t.baseURI));
            }
        });
    }

    build_uri(resource, baseURI) {
        if (this.is_absolute_path(resource))
            return resource;

        return (baseURI || this.baseUri) + resource;
    }

    is_absolute_path(path) {
        return (path.indexOf('http') >= 0);
    }

    _resize() {
        this.tableManager.redrawDataTable();
    }
};

const FrozenQualicyControllet = Object.freeze(QualicyControllet);
window.customElements.define('qualicy-controllet', FrozenQualicyControllet);