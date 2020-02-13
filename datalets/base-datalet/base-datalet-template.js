export const DataletBaseTemplateLightDom = `
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css">
`;

export const DataletBaseTemplate = `
    
    <!-- CSS DEPENDENCY -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css">
    <link rel="stylesheet" type="text/css" href="./static/css/base-datalet.css"/>
    <link rel="stylesheet" type="text/css" href="./static/css/baloon.min.css">

    <div id="datalet_container">
        <div id="base_datalet_loader"></div>
    </div>

    <div id="base_datalet_container">

        <div class="base_row">
            <div id="datalet_title"></div>
            <div id="menu" class="menu">
                <div id="export_menu" data-balloon-pos="up"><i class="fas fa-download"></i></div>
                <div id="link" data-balloon-pos="up"><i class="fas fa-link"></i></div>
                <div id="embed" data-balloon-pos="up"><i class="fas fa-code"></i></div>
                <div id="fullscreen" data-balloon-pos="up"><i class="fas fa-expand"></i></div>
            </div>
        </div>
        <div class="base_row">
            <div id="datalet_description"></div>
            <div id="social" class="social">
                <div id="facebook" class="facebook"><i class="fab fa-facebook-square"></i></div>
                <div id="twitter" class="twitter"><i class="fab fa-twitter-square"></i></div>
            </div>
        </div>
        <div class="base_row">
            <div id="datalet_source">
                <div id="data_source_container"><span id="data_source_span"></span> <a id="data_source" target="_blank" data-balloon-pos="up" data-balloon-length="medium"></a></div>
                <div id="data_link_container"><span id="data_link_span"></span> <a id="data_link" target="_blank" data-balloon-pos="up" data-balloon-length="medium">dataset</a></div>
                <div id="live" class="" data-balloon-pos="up"></div>
                <div id="proxy" class="proxy" data-balloon-pos="up">PROXY</div>
                <div id="ajax_error"></div>
            </div>
        </div>

        <div id="routetopa" class="routetopa">
            <a href="http://www.routetopa.eu/" target="_blank">ROUTE-TO-PA</a>
            <!--<a href="http://www.routetopa.eu/" target="_blank"><img id="rtpalogo" src="./static/images/rtpalogo.png">-->
        </div>

        <div id="save_as-placeholder" class="placeholder">
            <div id="save_as-container" class="container">
                <div id="save_as-close" class="close">&times;</div>
                <div class="action" id="img-action"><i class="fas fa-file-image"></i> <span id="save_as_image"></span> </div>
                <div class="action" id="doc-action"><i class="fas fa-file-alt"></i> <span id="save_as_doc"></span> </div>
                <div class="action" id="csv-action"><i class="fas fa-file-csv"></i> <span id="save_as_full_dataset"></span></div>
                <div class="action" id="csv_filtered-action"><i class="fas fa-filter"></i> <span id="save_as_filtered_dataset"></span></div>
                <div class="action" id="myspace-action"><i class="fas fa-space-shuttle"></i> <span id="save_in"></span> <span id="myspace"></span></div><!--fa-user-astronaut-->
            </div>
        </div>

    </div>

    <div id="fullscreen-placeholder" class="placeholder">
        <div id="fullscreen-container" class="container">
            <div id="fullscreen-close" class="close">&times;</div>
        </div>
    </div>

    <div id="img-placeholder" class="placeholder">
        <div id="img-container" class="container">
            <div id="img-close" class="close">&times;</div>
            <div id="img-preview"></div>
            <div class="export_options">
                <span id="label_width"></span> <input id="preview_width" placeholder="100%" type="number" />
                <span id="label_height"></span> <input id="preview_height" placeholder="100%" type="number" />
                <span id="label_presets"></span> <select id="preview_set_default">
                    <option value="custom">Custom</option>
                    <option class="facebook" value="facebook">&#xf082; Facebook</option>
                    <option class="twitter" value="twitter">&#xf081; Twitter</option>
                    <option class="linkedin" value="linkedin">&#xf08c; LinkedIn</option>
                    <option class="instagram" value="instagram">&#xf16d; Instagram</option>
                    <option class="pinterest" value="pinterest">&#xf0d3; Pinterest</option>
                </select>
                <button id="preview_export"><i class="fas fa-download"></i> <span id="label_download"></span></button>
            </div>
        </div>
    </div>
`;