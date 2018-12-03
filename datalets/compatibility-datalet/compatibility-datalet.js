//import BaseDatalet from '../base-datalet/base-datalet.js';

class CompatibilityDatalet extends HTMLElement
{
    constructor()
    {
        super();
        
        console.log('compatibility datalet constructor');
    }

    connectedCallback() {

        // Create a Shadow DOM using our template
        this.shadow_root = this.attachShadow({mode: 'open'}); // con mode open è possibile accedere agli elementi DOM all'interno dello shadow DOM
        var elem = document.createElement('div');
        elem.innerHTML = 'CIAO !!';
        this.shadow_root.appendChild(elem);

    }
}

const FrozenCompatibilityDatalet = Object.freeze(CompatibilityDatalet);
window.customElements.define('compatibility-datalet', FrozenCompatibilityDatalet);
