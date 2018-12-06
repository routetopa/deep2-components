import {importModule} from '../lib/vendors/import_polyfill/import_polyfill.js'

export default class BaseDatalet extends HTMLElement
{
    constructor(component)
    {
        // If you define a constructor, always call super() first as it is required by the CE spec.
        super();

        this.component = component;
        this.currentDocument = document.querySelector(`link[href*="${this.component}"]`).import;
        this.baseUri = this.currentDocument.baseURI.substring(0, this.currentDocument.baseURI.lastIndexOf("/") + 1);
        this.dynamic_import_support = this.get_dynamic_import();

        // Create a Shadow DOM using our template
        this.shadow_root = this.attachShadow({mode: 'open'}); // con mode open è possibile accedere agli elementi DOM all'interno dello shadow DOM
    }

    connectedCallback()
    {
        this.data_url = this.getAttribute("data-url");
        this.selected_fields = this.getAttribute("selectedfields");
        this.filters = this.getAttribute("filters");
        this.aggregators = this.getAttribute("aggregators");
        this.orders = this.getAttribute("orders");
        this.datalettitle = this.getAttribute("datalettitle");
        this.description = this.getAttribute("description");
        this.cache = this.getAttribute("data");

        const base_document = document.querySelector(`link[href*="${this.component}"]`).import.querySelector('link[rel="import"]').import;
        const base_template = base_document.querySelector('#base-datalet');
        const base_instance = base_template.content.cloneNode(true); // clona (con true anche i figli) il template
        const base_datalet_baseUri = base_document.baseURI.substring(0, base_document.baseURI.lastIndexOf("/") + 1);

        //GET DERIVED CLASS TEMPLATE
        let template = this.template();

        //APPEND SCRIPTS
        this.load_script([{template: base_instance, baseURI: base_datalet_baseUri}, {
            template: template,
            baseURI: this.baseUri
        }]);

        //APPEND TEMPLATE TO SHADOW ROOT
        this.shadow_root.appendChild(this.replace_img_path(template));
        this.shadow_root.appendChild(this.replace_img_path(base_instance, base_datalet_baseUri));

        //SET BEHAVIOUR
        this.handle_behaviour();

        //ADD DATALET INFO AND LISTENER
        this.add_datalet_info();
        this.add_listeners();

        //SET EXPORT MENU
        this.set_export_menu();
    }

    attributeChangedCallback()
    {
        console.log('attributeChangedCallback');
    }

    disconnectedCallback()
    {
        console.log('disconnectedCallback');
    }

    async set_behaviours(module, config)
    {
        config = config || [0, 0, 0, 0];
        let modules = [];

        try
        {
            for (let i = 0; i < module.length; i++)
            {
                let m;

                if (typeof module[i] === 'string')
                    m = await this.import_module(module[i]);
                else
                    m = module[i];

                modules.push(m);
            }

            this.requestData   = modules[config[0]].requestData;
            this.selectData    = modules[config[1]].selectData;
            this.filterData    = modules[config[2]].filterData;
            this.transformData = modules[config[3]].transformData;

            this.work_cycle();

        } catch (e) {
            console.log(e);
        }
    }

    async work_cycle()
    {
        try
        {
            let data;

            if (!this.cache)
            {
                let json_results = await this.requestData(this.data_url);
                data = this.selectData(json_results, this.data_url);
                data = this.filterData(data, this.selected_fields, this.filters, this.aggregators, this.orders);
            } else {
                data = JSON.parse(this.cache);
            }

            this.render(this.transformData(data, this.selected_fields));

        } catch (e) {
            console.log(e);
        }
    }

    async import_module(url)
    {
        //TODO : something better than this [exclude define]
        let define = window.define;
        window.define = undefined;
        let mod = await this.dynamic_import_support(this.build_uri(url));
        window.define = define;
        return mod;
    }

    load_script(templates)
    {
        templates.forEach((t) => {
            let scripts = t.template.querySelectorAll('link, script'); //'script, link'

            for (let i = 0; i < scripts.length; i++) {
                let attribute = scripts[i].tagName === 'SCRIPT' ? 'src' : 'href';
                scripts[i].setAttribute(attribute, this.build_uri(scripts[i].getAttribute(attribute), t.baseURI));
            }
        });
    }

    add_listeners()
    {
        let fullscreen_cb = this.fullscreen();

        this.shadow_root.querySelector('#base_datalet_link').addEventListener('click', (e) => {this.go_to_dataset(e)});
        this.shadow_root.querySelector('#fullscreen').addEventListener('click', fullscreen_cb);
        this.shadow_root.querySelector('#fullscreen_close').addEventListener('click', fullscreen_cb);
        this.shadow_root.querySelector('#export_menu').addEventListener('click', this.open_export_menu());
        this.shadow_root.querySelector('#link_lp').addEventListener('click', (e) => {this.create_link(e)});
        this.shadow_root.querySelector('#export_html').addEventListener('click', (e) => {this.export_html(e)});
        this.shadow_root.querySelector('#export_png').addEventListener('click', (e) => {this.export_png(e)});
        this.shadow_root.querySelector('#export_doc').addEventListener('click', (e) => {this.export_doc(e)});
        this.shadow_root.querySelector('#import_myspace').addEventListener('click', (e) => {this.import_myspace(e)});
        this.shadow_root.querySelector('#facebook').addEventListener('click', (e) => {this.share_on_fb(e)});
        this.shadow_root.querySelector('#twitter').addEventListener('click', (e) => {this.share_on_twitter(e)});
        this.shadow_root.querySelector('#googleplus').addEventListener('click', (e) => {this.share_on_google(e)});
    }

    add_datalet_info()
    {
        this.shadow_root.querySelector('#span_title').innerHTML = this.getAttribute("datalettitle");
        this.shadow_root.querySelector('#span_description').innerHTML = this.getAttribute("description");

        if (this.data_url) {
            let base_datalet_source = this.shadow_root.querySelector('#base_datalet_source');
            let base_datalet_link = this.shadow_root.querySelector('#base_datalet_link');
            let base_datalet_link_span = this.shadow_root.querySelector('#base_datalet_link_span');
            let base_datalet_source_link = this.shadow_root.querySelector('#base_datalet_source_link');

            let data_url_split = this.data_url.split("/");
            let urlSource = data_url_split[0] + "//" + data_url_split[2];

            base_datalet_source.innerHTML = urlSource;
            base_datalet_source.setAttribute("href", urlSource);

            if (this.data_url.indexOf("/cocreation/") > -1) {
                base_datalet_link.setAttribute("href", urlSource + "/cocreation/data-room-list");
            }
            else if (this.data_url.indexOf("/records/") > -1) {
                let i;
                if (this.data_url.indexOf("&") > -1)
                    i = this.data_url.indexOf("&");
                else
                    i = this.data_url.length;

                base_datalet_link.setAttribute("href", urlSource + "/explore/dataset/" + this.data_url.substring(this.data_url.indexOf("=") + 1, i));
            }
            // CKAN
            else if (this.data_url.indexOf("datastore_search?resource_id") > -1) {
            }
            // dkan and mysir --> ckan like
            else if (this.data_url.indexOf("datastore/search.json?resource_id") > -1) {
            }
            else {
                base_datalet_link_span.style.display = 'none';
            }

            if (this.data_url === "false")//decision-tree & ...
            {
                //this.hideFooter();
                base_datalet_source_link.style.display = 'none';
            }

        } else {
            //this.removeLoader();
        }

    }

    handle_behaviour()
    {
        throw new Error("Render method not implemented");
    }

    render()
    {
        throw new Error("Render method not implemented");
    }

    /* LISTENER */
    fullscreen()
    {
        let open = false;
        let fph = this.shadow_root.querySelector('#fullscreen_placeholder');

        return () => {
            if (!open) {
                let html_obj = this.get_html();
                let iframe = document.createElement('iframe');
                iframe.setAttribute("frameborder", "0");
                iframe.setAttribute("id", "fullscreen_container");
                iframe.setAttribute("srcdoc", html_obj.script + html_obj.style + html_obj.datalet_definition + html_obj.component);
                fph.appendChild(iframe);
                fph.style.display = 'block';
            } else {
                fph.removeChild(this.shadow_root.querySelector('#fullscreen_container'));
                fph.style.display = 'none';
            }

            open = !open;
        }
    }

    open_export_menu()
    {
        let open = false;

        return () => {
            if (!open)
                this.shadow_root.querySelector('#highcharts-contextmenu').style.display = 'block';
            else
                this.shadow_root.querySelector('#highcharts-contextmenu').style.display = 'none';

            open = !open;
        }
    }

    create_link()
    {
        this.show_export_panel();

        let datalet_id = this.get_datalet_id();
        let base_url = ODE.ow_url_home;
        let landing_page_url = base_url + 'datalet/' + datalet_id;

        this.set_export_area(landing_page_url);
    }

    set_export_menu()
    {
        if(typeof ODE === 'undefined' && typeof parent.ODE === 'undefined')
        {
            this.shadow_root.querySelector('#link_lp').style.display = 'none';
            this.shadow_root.querySelector('#export_my_space').style.display = 'none';
        }

        if(this.hasAttribute("disable_my_space"))
            this.shadow_root.querySelector('#export_my_space').style.display = 'none';

        if(this.hasAttribute("disable_html"))
            this.shadow_root.querySelector('#export_html').style.display = 'none';

        if(typeof this.export_to_img_doc !== 'undefined' && !this.export_to_img_doc)
        {
            this.shadow_root.querySelector('#export_png').style.display = 'none';
            this.shadow_root.querySelector('#export_doc').style.display = 'none';
        }

    }

    export_html()
    {
        this.show_export_panel();
        let html_obj = this.get_html();
        let datalet = (html_obj.script + html_obj.datalet_definition + html_obj.component);
        let iframe = document.createElement('iframe');
        iframe.setAttribute("style", "width:100%;height:100%;min-height:498px;padding:0;margin:0;border:0;");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("srcdoc", datalet);
        this.set_export_area(iframe.outerHTML);
    }

    async export_png()
    {
        let png = await this.create_image();

        let download = document.createElement('a');
        download.href = png;
        download.download = `${this.component}.png`;
        document.body.appendChild(download);
        download.click();
        document.body.removeChild(download);
    }

    create_image()
    {
        return new Promise((res, rej) => {
            let svg = this.shadow_root.querySelector('svg');
            let svgData = new XMLSerializer().serializeToString(svg);

            let canvas = document.createElement("canvas");
            let svgSize = svg.getBoundingClientRect();
            canvas.width = svgSize.width;
            canvas.height = svgSize.height;
            let ctx = canvas.getContext("2d");

            let img = document.createElement("img");
            img.setAttribute("src", "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))));

            img.onload = () => {
                ctx.drawImage(img, 0, 0); //ctx.drawImage(img, 0, 0, 800, 200); // RESIZE
                let png = canvas.toDataURL("image/png", 1); //formato, qualità
                res(png);
            }
        });
    }

    async export_doc()
    {
        if (this.data_url.indexOf("datastore_search?resource_id") > -1) {
            let docx = await this.import_module('../lib/vendors/docx/index.js');

            let url = this.data_url.replace("datastore_search?resource_id", "resource_show?id");

            let res = await this.ajax_request("GET", url, 'responseText', JSON.parse,
                [["Accept", "application/json, text/javascript, */*; q=0.01"]], null, null);

            const doc = new Document();

            doc.addParagraph(new Paragraph(`Datalet Name : ${this.component}`));
            doc.addParagraph(new Paragraph(`Dataset Creation Date : ${res.result.created}`));
            doc.addParagraph(new Paragraph(`Dataset Format : ${res.result.format}`));
            doc.addParagraph(new Paragraph(`Dataset Last Modified : ${res.result.last_modified}`));
            doc.addParagraph(new Paragraph(`Dataset Url : ${res.result.url}`));
            doc.addParagraph(new Paragraph(`Dataset API : ${this.data_url}`));
            doc.createImage(await this.create_image());

            const packer = new Packer();
            let blob = await packer.toBlob(doc);

            let downloadUrl = window.URL.createObjectURL(blob);
            let download = document.createElement("a");
            download.href = downloadUrl;
            download.download = `${this.component}.docx`;
            document.body.appendChild(download);
            download.click();
            document.body.removeChild(download);
        }

        /*const paragraph = new Paragraph(`Datalet name : ${this.component}`);
        const dateText = new TextRun("Github is the best").tab().bold();
        paragraph.addRun(dateText);*/
    }

    async import_myspace()
    {
        let params = {};

        for (let i = 0; i < this.attributes.length; i++)
            params[this.attributes[i].name] = this.attributes[i].value;

        let data = params["data"];
        delete params["fields"];
        delete params["data"];

        params = JSON.stringify(params);
        let post = 'component=' + this.component;
        post += '&params=' + encodeURIComponent(params);
        post += '&data=' + encodeURIComponent(data);

        let res = await this.ajax_request("POST", ODE.ajax_private_room_datalet, 'responseText', JSON.parse,
            [["Content-type", "application/x-www-form-urlencoded; charset=UTF-8"],
                ["Accept", "application/json, text/javascript, */*; q=0.01"],
                ["X-Requested-With", "XMLHttpRequest"]], null, post);

        if (res.status === "ok")
            alert("Datalet added to Myspace");
        else
            alert("Error");
    }

    share_on_fb()
    {
        let facebook_url = this.create_share_url();
        let url = 'https://www.facebook.com/dialog/share?app_id=' + ODE.fb_app_id + '&display=popup&href=' + facebook_url + '&redirect_uri=' + facebook_url;
        window.open(url, "", "width=800,height=300");
    }

    share_on_twitter()
    {
        let base_url = ODE.ow_url_home;
        let twitter_url = this.create_share_url();
        let twitter_text = encodeURI((this.datalettitle ? (this.datalettitle + ' ') : '') + (this.description ? this.description : ''));
        let url = 'https://twitter.com/intent/tweet?text=' + twitter_text + '&via=RouteToPA&url=' + twitter_url + '&original_referer=' + base_url;
        window.open(url, "", "width=800,height=300");
    }

    share_on_google()
    {
        let google_url = this.create_share_url();
        let url = 'https://plus.google.com/share?url=' + google_url;
        window.open(url, "", "width=350,height=500");
    }

    /* TOOLS */
    show_export_panel()
    {
        this.shadow_root.querySelector('#overlay').style.display = 'block';
    }

    set_export_area(val)
    {
        this.shadow_root.querySelector('#export_area').value = val;
    }

    get_datalet_id()
    {
        let parent = this.parentElement;

        while (!parent.hasAttribute("datalet-id"))
            parent = parent.parentElement;

        return parent.attributes["datalet-id"].value;
    }

    get_post_id()
    {
        let post_id = this.parentElement.id.match(/\d+/);
        return post_id ? post_id[0] : "";
    }

    ajax_request(method, path, response_obj, handle_response, requestHeader, responseType, data)
    {
        return new Promise((res, rej) => {
            requestHeader = requestHeader || [];
            data = data || {};

            let xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    if (handle_response)
                        res(handle_response(this[response_obj]));
                    else
                        res(this[response_obj]);
                }
            };

            xhr.open(method, path, true);

            for (let i = 0; i < requestHeader.length; i++)
                xhr.setRequestHeader(requestHeader[i][0], requestHeader[i][1]);

            if (responseType)
                xhr.responseType = responseType;

            xhr.send(data);
        });
    }

    async go_to_dataset(e)
    {
        e.preventDefault();

        let data_url = this.getAttribute("data-url");
        let base_datalet_link = this.shadow_root.querySelector('#base_datalet_link');

        if (data_url) {
            let urlSource = data_url.split("/")[0] + "//" + data_url.split("/")[2];

            if (data_url.indexOf("datastore_search?resource_id") > -1) {
                let response = await this.ajax_request("POST", data_url.replace("datastore_search?resource_id", "resource_show?id"), 'responseText', JSON.parse);

                if (response.package_id) {
                    base_datalet_link.setAttribute("href", urlSource + "/dataset/" + response.result.package_id + "/resource/" + response.result.id);
                    window.open(urlSource + "/dataset/" + response.result.package_id + "/resource/" + response.result.id, '_blank');
                } else {
                    base_datalet_link.setAttribute("href", response.result.url.substring(0, response.result.url.indexOf("/download")));
                    window.open(response.result.url.substring(0, response.result.url.indexOf("/download")), '_blank');
                }
            }
            else if (data_url.indexOf("datastore/search.json?resource_id") > -1) {
                base_datalet_link.setAttribute("href", urlSource);
                window.open(data_url, '_blank');
            }
        }
    }

    build_uri(resource, baseURI)
    {
        if (this.is_absolute_path(resource))
            return resource;

        return (baseURI || this.baseUri) + resource;
    }

    replace_img_path(innerHTML, baseURI)
    {
        [...innerHTML.querySelectorAll('img')].forEach((img) => {
            if (!this.is_absolute_path(img.attributes["src"].value))
                img.src = (baseURI || this.baseUri) + img.attributes["src"].value;
        });

        return innerHTML;
    }

    is_absolute_path(path)
    {
        return (path.indexOf('http') >= 0);
    }

    get_dynamic_import()
    {
        try {
            return new Function('url', 'return import(url)');
        } catch (err) {
            return importModule;
        }
    }

    get_html()
    {
        let script = `<script src="${this.baseUri}../lib/vendors/webcomponents_lite_polyfill/webcomponents-lite.js"></script>`;
        let style = `<style>html{height: 100%;} body{height: calc(100% - 16px); margin: 8px;} ${this.component}{--base-datalet-visibility: none; --datalet-container-size:100%}</style>`;
        let datalet_definition = `<link rel="import" href="${this.baseUri}${this.component}.html" />`;
        return {script: script, style: style, datalet_definition: datalet_definition, component: this.outerHTML};
    }

    create_share_url()
    {
        let datalet_id = this.get_datalet_id();
        let base_url = ODE.ow_url_home;
        return base_url + 'datalet/' + datalet_id;
    }

    thereis_jQuery()
    {
        return (typeof jQuery === 'function')
    }

    render_error(error_message)
    {
        //STAMPA A VIDEO ERRORE IN QUALCHE MODO
    }

    parse_error(error_message)
    {
        //PARSA ERRORE
    }

    merge_deep(target, ...sources)
    {
        if (!sources.length) return target;
        const source = sources.shift();

        if (this.is_object(target) && this.is_object(source)) {
            for (const key in source) {
                if (this.is_object(source[key])) {
                    if (!target[key]) Object.assign(target, {[key]: {}});
                    this.merge_deep(target[key], source[key]);
                } else {
                    Object.assign(target, {[key]: source[key]});
                }
            }
        }
        return this.merge_deep(target, ...sources);
    }

    is_object(item)
    {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }
};

