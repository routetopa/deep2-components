import '../shared/jquery/jquery-3.3.1.min.js'
import '../shared/datatable/datatables.js'
import Qualicy from './static/js/qualicy.js'
import Qualicy2 from './static/js/qualicy2.js'

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

        this.data = JSON.parse(this.getAttribute("data"));
        this.data_url = this.getAttribute("data-url");

        // 1
        let ranking_table = this.shadow_root.querySelector('#ranking-list-datatable');
        let q = new Qualicy(ranking_table);

        q.initDataTable(this.data, this.data_url);

        // 2
        Qualicy2.ciao();

        // 3
        this.ciao2();
    }

    attributeChangedCallback() {
        console.log('attributeChangedCallback');
    }

    disconnectedCallback() {
        //todo - remove event listeners?
        this.shadow_root.innerHTML = '';
    }

    /* LOGIC */

    ciao2() {
        alert("ciao2");
    }

};

const FrozenQualicyControllet = Object.freeze(QualicyControllet);
window.customElements.define('qualicy-controllet', FrozenQualicyControllet);