var LN = {
    userLanguage: 'en'
};

LN.init = function() {
    try {
        if (typeof ODE !== 'undefined' && ODE && ODE.user_language)
            LN.userLanguage = ODE.user_language;
        else if (parent && typeof parent.ODE !== 'undefined' && parent.ODE && parent.ODE.user_language)
            LN.userLanguage = parent.ODE.user_language;
        else
            LN.userLanguage = (navigator.language || navigator.userLanguage).split('-')[0];

        if(['en', 'it', 'fr', 'nl', 'es', 'cn'].indexOf(LN.userLanguage) == -1)
            LN.userLanguage = 'en';
    } catch (e) {
        console.log(e);
    }
};

LN.setUserLanguage = function(ln) {
    LN.userLanguage = ln;
};

LN.translate = function(text, ul = LN.userLanguage) {
    // return ln[text+"_"+ul] ? ln[text+"_"+ul] : text+"_"+ul;
    if(ln[text+"_"+ul])
        return ln[text+"_"+ul];
    else if (ln[text+"_en"])
        return ln[text+"_en"];
    else
        return text+"_"+ul;
};

(function() {
    LN.init();
})();

let ln = [];

ln["localization"] = "en";

/******** EN ********/

//PAGE SLIDER

ln["slide1Title_en"] = "SELECT DATASET";
ln["slide1Subtitle_en"] = "Select a dataset from the list or copy and paste the url of dataset.";
ln["slide2Title_en"] = "SELECT DATA";
ln["slide2Subtitle_en"] = "Select the fields on the left. The table will show the values related to the selected fields.";
ln["slide3Title_en"] = "SELECT VISUALIZATION";
ln["slide3Subtitle_en"] = "Select a visualization, fill out inputs and options.";
ln["back_en"] = "BACK";
ln["forward_en"] = "FORWARD";
//splod
ln["SPLODslide1Title_en"] = "CREATE DATASET";
ln["SPLODslide1Subtitle_en"] = "Select an endpoint and create your dataset.";

//SELECT DATASET

ln["selectedUrl_en"] = "Selected url";
ln["wrongUrl_en"] = "Invalid url or data provider not supported yet.";

ln["providersDatasets_en"] = "FROM PROVIDERS";
ln["spodUsersDatasets_en"] = "FROM COCREATED";
ln["extendedDatasets_en"] = "FROM EXTENDED SEARCH";
ln["datasets_en"] = "DATASETS LIST";

ln["provider_en"] = "Provider";
ln["all_en"] = "All";
ln["allDescription_en"] = "Shows the datasets of all associated providers.";
ln["providerName_en"] = "Provider";
ln["providerNameDescription_en"] = "Shows only the datasets of the selected provider.";

//ln["view_en"] = "View";
//ln["list_en"] = "List";
//ln["listDescription_en"] = "Shows the datasets with a classic list.";
//ln["tree_en"] = "Tree";
//ln["treeDescription_en"] = "Shows the datasets with a tree map.";

//ln["search_en"] = "Search";
//ln["standard_en"] = "Standard";
//ln["standardDescription_en"] = "The search function works only on datasets names.";
//ln["extended_en"] = "Extended [NOT AVAILABLE]";
//ln["extendedDescription_en"] = "The search function works the entire contents of the datasets.";

ln["version_en"] = "Version";
ln["showLast_en"] = "Show last";
ln["showLastDescription_en"] = "Shows only the latest version of the datasets.";
ln["showAll_en"] = "Show all";
ln["showAllDescription_en"] = "Shows all versions of the datasets.";

//select-dataset-controllet
ln["datasetsInfo_en"] = "DATASET INFO";
ln["showing_en"] = "Showing";
ln["to_en"] = "to";
ln["of_en"] = "of";
ln["datasetsRows_en"] = "datasets";
ln["search_en"] = "Search";

//metadata
ln["room_en"] = "Room";
ln["resourceName_en"] = "Resource Name";
ln["resourceDescription_en"] = "Resource Description";
ln["users_en"] = "Users";

//SELECT DATA

//select-fields
ln["fields_en"] = "FIELDS";

//data-table
ln["selectedData_en"] = "SELECTED DATA";
ln["showing_en"] = "Showing";
ln["to_en"] = "to";
ln["of_en"] = "of";
ln["rows_en"] = "rows";
ln["type_en"] = "TYPE";
ln["warning_en"] = "WARNING";

//expert
ln["expert_en"] = "EXPERT MODE";
ln["filters_en"] = "FILTERS";
ln["groupBy_en"] = "GROUP BY";
ln["query_en"] = "QUERY";

//filters
ln["filterField_en"] = "Field";
ln["filterOperation_en"] = "Operation";
ln["filterValue_en"] = "Value";

ln["disableFilters_en"] = "DISABLE FILTERS";
ln["enableFilters_en"] = "ENABLE FILTERS";

ln["=_en"] = "=";   //is equal to
ln["!=_en"] = "not =";  //is not equal to
ln[">_en"] = ">";   //is greater than
ln[">=_en"] = ">="; //is greater than or equal to
ln["<_en"] = "<";   //is less than
ln["<=_en"] = "<="; //is less than or equal to
ln["contains_en"] = "contains";
ln["notContains_en"] = "not contains";
ln["start_en"] = "start with";
ln["notStart_en"] = "does not start with";
ln["ends_en"] = "ends with";
ln["notEnds_en"] = "does not ends with";
ln["isNotNull_en"] = "is not null";
ln["isNull_en"] = "is null";

//aggregators
ln["GROUP BY_en"] = "GROUP BY";
ln["CALCULATE_en"] = "CALCULATE";
ln["Calculate_en"] = "Calculate";
ln["aggregatorField_en"] = "Field";

ln["disableGroupBy_en"] = "DISABLE GROUP BY";
ln["enableGroupBy_en"] = "ENABLE GROUP BY";

ln["COUNT_en"] = "COUNT of";
ln["SUM_en"] = "SUM of";
ln["MIN_en"] = "MIN of";
ln["MAX_en"] = "MAX of";
ln["AVG_en"] = "AVG of";
ln["FIRST_en"] = "FIRST of";
ln["LAST_en"] = "LAST of";

//SELECT VISUALIZATION

ln["addDatalet_en"] = "ADD";
ln["modifyDatalet_en"] = "MODIFY";

//datalet-preview
ln["previewTab_en"] = "DATALET PREVIEW";
ln["infoTab_en"] = "DATALET INFO";

//select-inputs
ln["baseInfo_en"] = "BASE INFO";
ln["inputs_en"] = "INPUTS";
ln["options_en"] = "OPTIONS";

//vslider
ln["search_en"] = "Search";

ln["datatable_en"] = "Table";
ln["barchart_en"] = "Bar Chart";
ln["columnchart_en"] = "Column Chart";
ln["areachart_en"] = "Area Chart";
ln["linechart_en"] = "Line Chart";
ln["heatmap_en"] = "Heat Map";
ln["piechart_en"] = "Pie Chart";
ln["pyramidchart_en"] = "Pyramid Chart";
ln["funnelchart_en"] = "Funnel Chart";
ln["wordcloud_en"] = "Word Cloud";
ln["spiderchart_en"] = "Spider Chart";
ln["polarchart_en"] = "Polar Chart";
ln["scatterchart_en"] = "Scatter Chart";
ln["bubblechart_en"] = "Bubble Chart";
ln["treemap_en"] = "Tree Map";
ln["timeline_en"] = "Timeline";
ln["mediaslider_en"] = "Media Slider";
ln["leafletjs_en"] = "Map";
ln["leafletjs-geojson_en"] = "Geojson Map";
ln["audioslider_en"] = "Audio Slider";
ln["italymap_en"] = "Italy Map";
ln["europemap_en"] = "European Map"

ln["datatableDescription_en"] = "A table is a means of arranging data in rows and columns.";
ln["barchartDescription_en"] = "A bar chart is a chart that presents grouped data with rectangular bars plotted horizontally with lengths proportional to the values that they represent.";
ln["columnchartDescription_en"] = "A column chart is a chart that presents grouped data with rectangular bars plotted vertically with lengths proportional to the values that they represent.";
ln["areachartDescription_en"] = "An area chart is a chart which displays graphically quantitive data. The area between axis and line are emphasized with colors and textures. Commonly one compares with the area chart two or more quantities.";
ln["linechartDescription_en"] = "A line chart is chart which displays information as a series of data points called 'markers' connected by straight line segments. A line chart is often used to visualize a trend in data over intervals of time.";
ln["heatmapDescription_en"] = "A heat map is a graphical representation of data where the individual values contained in a matrix are represented as colors.";
ln["piechartDescription_en"] = "A pie chart is a circular statistical graphic, which is divided into slices to illustrate numerical proportion. In the pie chart, the arc length of each slice, and consequently its central angle and area, is proportional to the quantity it represents.";
ln["scatterchartDescription_en"] = "A scatter chart is a type of plot or mathematical diagram using Cartesian coordinates to display values for typically two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis.";
ln["bubblechartDescription_en"] = "A bubble chart is a type of chart that displays three dimensions of data. Each entity with its triplet (v1, v2, v3) of associated data is plotted as a disk that expresses two of the vi values through the disk's xy location and the third through its size.";
ln["treemapDescription_en"] = "A tree map is a chart for displaying hierarchical data by using nested rectangles.";
ln["timelineDescription_en"] = "The timeline is an interactive visualization chart to visualize data in time. The data items can take place on a single date, or have a start and end date (a range). You can freely move and zoom in the timeline. The time scale on the axis is adjusted automatically, and supports scales ranging from milliseconds to years.";
ln["mediasliderDescription_en"] = "The mediaslider is a slider of media.";
ln["leafletjsDescription_en"] = " ";
ln["leafletjs-geojsonDescription_en"] = " ";
ln["italymapDescription_en"] = " ";
ln["audiosliderDescription_en"] = " ";
ln["italymapDescription_en"] = " ";

//inputs
ln["title_en"] = "Title"
ln["description_en"] = "Description";

ln["required_en"] = "Required";

ln["sortAscending_en"] = "SORTED ASCENDING";
ln["sortDescending_en"] = "SORTED DESCENDING";
ln["unsort_en"] = "UNSORTED";

//--> "_" not allowed!
ln["TITLE_en"] = "TITLE";
ln["DESCRIPTION_en"] = "DESCRIPTION";
ln["XAxis_en"] = "X-AXIS";
ln["YAxis_en"] = "Y-AXIS";
ln["NumericXAxis_en"] = "X-AXIS";
ln["NumericYAxis_en"] = "Y-AXIS";
ln["Column_en"] = "COLUMN";
ln["Level_en"] = "LEVEL";
ln["SliceLabels_en"] = "LABEL";
ln["SliceSizes_en"] = "SIZE";
ln["StartDate_en"] = "START DATE";
ln["EndDate_en"] = "END DATE";
ln["EventTitle_en"] = "EVENT TITLE";
ln["EventDescription_en"] = "EVENT DESCRIPTION";
ln["MediaUrl_en"] = "MEDIA URL";
ln["Background_en"] = "BACKGROUND";
ln["MediaTitle_en"] = "MEDIA TITLE";
ln["MediaDescription_en"] = "MEDIA DESCRIPTION";
ln["Latitude_en"] = "LATITUDE";
ln["Longitude_en"] = "LONGITUDE";
ln["BalloonContent_en"] = "BALLOON CONTENT";
ln["GEOJSON_en"] = "GEOJSON";
ln["GEOJSONContent_en"] = "GEOJSON CONTENT";
ln["BubbleContent_en"] = "BUBBLE CONTENT";
ln["BubbleSize_en"] = "BUBBLE SIZE";
ln["Categories_en"] = "CATEGORY";
ln["AudioUrl_en"] = "AUDIO URL";
ln["AudioTiming_en"] = "AUDIO TIMING";
ln["ImageUrl_en"] = "IMAGE URL";
ln["AudioDescription_en"] = "AUDIO DESCRIPTION";
ln["Area_en"] = "AREA";
ln["Value_en"] = "VALUE";
ln["TooltipContent_en"] = "TOOLTIP CONTENT";

ln["TITLEDescription_en"] = "The datalet title.";
ln["DESCRIPTIONDescription_en"] = "The datalet description.";
ln["XAxisDescription_en"] = "The x-axis.";
ln["YAxisDescription_en"] = "The y-axis.";
ln["NumericXAxisDescription_en"] = "The x-axis.";
ln["NumericYAxisDescription_en"] = "The y-axis.";
ln["ColumnDescription_en"] = "The column of the table.";
ln["LevelDescription_en"] = "The level of the tree map.";
ln["SliceLabelsDescription_en"] = "The label of the slices.";
ln["SliceSizesDescription_en"] = "The size of the slices.";
ln["StartDateDescription_en"] = "The start date of the event. A string representing an RFC2822 or ISO 8601 date (e.g. 2015-03-25, 03/25/2015, Mar 25 2015, 25 Mar 2015, Wednesday March 25 2015) or a single number rapresenting the year (e.g. 2017, 7, -150) or a roman number rapresenting centuries using 'bc', 'b.c.', 'bce' or 'b.c.e.' to discern Before Christ/Before Common Era centuries (e.g. IV, X bce, III b.c). Other formats may be used, but results may be unexpected.";
ln["EndDateDescription_en"] = "The end date of the event (see start date).";
ln["EventTitleDescription_en"] = "The title of the event.";
ln["EventDescriptionDescription_en"] = "The description of the event.";
ln["MediaUrlDescription_en"] = "The url of the media.";
ln["BackgroundDescription_en"] = "The fully-qualified URL pointing to an image which will be used as the background or a CSS color, in hexadecimal (e.g. #0f9bd1) or a valid CSS color keyword.";
ln["MediaTitleDescription_en"] = "The title of the media.";
ln["MediaDescriptionDescription_en"] = "The description of the media.";
ln["LatitudeDescription_en"] = "The latitude of locations.";
ln["LongitudeDescription_en"] = "The longitude of locations.";
ln["BalloonContentDescription_en"] = "The content of balloons.";
ln["GEOJSONDescription_en"] = "The GeoJSON data.";
ln["GEOJSONContentDescription_en"] = "The content of GeoJSON.";
ln["BubbleContentDescription_en"] = "The content of bubbles.";
ln["BubbleSizeDescription_en"] = "The size of bubbles.";
ln["CategoriesDescription_en"] = "The category that splits the y-axis values. If selected only the first selected y-axis will be considered.";
ln["AudioUrlDescription_en"] = " ";
ln["AudioTimingDescription_en"] = " ";
ln["ImageUrlDescription_en"] = "";
ln["AudioDescriptionDescription_en"] = " ";
ln["AreaDescription_en"] = " ";
ln["ValueDescription_en"] = " ";
ln["TooltipContentDescription_en"] = " ";

//options
ln["x-axis-label_en"] = "X Axis Label";
ln["y-axis-label_en"] = "Y Axis Label";
ln["suffix_en"] = "Tooltip Suffix";
ln["legend_en"] = "Legend";
ln["data-labels_en"] = "Show Data Labels";
ln["stack_en"] = "Stack";
ln["theme_en"] = "Theme";
ln["donut_en"] = "Donut";
ln["date-format_en"] = "Date Format";
ln["animation_en"] = "Animation";
ln["animationDescription_en"]= "Choose an animation for the catalog.";

ln["map_en"] = "Map";
ln["1_italyRegion_en"] = "Italy - Regions";
ln["2_italyProvince_en"] = "Italy - Province";
ln["3_campaniaProvince_en"] = "Campania - Province";
ln["4_campaniaMunicipality_en"] = "Campania - Municipality";

ln["true_en"] = "Yes";
ln["false_en"] = "No";
ln["bottom_en"] = "Yes: Bottom";
ln["topRight_en"] = "Yes: Top Right";
ln["normal_en"] = "Yes: Normal";
ln["percent_en"] = "Yes: Percent";
ln["themeBase_en"] = "Base";
ln["themeDarkGreen_en"] = "Dark Green";
ln["themeDarkBlue_en"] = "Dark Blue";
ln["themeDarkUnica_en"] = "Dark Unika";
ln["themeGray_en"] = "Gray";
ln["themeGrid_en"] = "Grid";
ln["themeGridLight_en"] = "Grid Light";
ln["themeSandSignika_en"] = "Sand Signika";
ln["themeSkies_en"] = "Skies";
ln["MDY_en"] = "Month-Day-Year";
ln["DMY_en"] = "Day-Month-Year";
ln["random_en"] = "Random";
ln["simpleFade_en"] = "Simple Fade";
ln["curtainTopLeft_en"] = "Curtain Top Left";
ln["curtainTopRight_en"] = "Curtain Top Right";
ln["curtainBottomLeft_en"] = "Curtain Bottom Left";
ln["curtainBottomRight_en"] = "Curtain Bottom Right";
ln["curtainSliceLeft_en"] = "Curtain Slice Left";
ln["curtainSliceRight_en"] = "Curtain Slice Right";
ln["blindCurtainTopLeft_en"] = "Blind Curtain Top Left";
ln["blindCurtainTopRight_en"] = "Blind Curtain Top Right";
ln["blindCurtainBottomLeft_en"] = "Blind Curtain Bottom Left";
ln["blindCurtainBottomRight_en"] = "Blind Curtain Bottom Right";
ln["blindCurtainSliceBottom_en"] = "Blind Curtain Slice Bottom";
ln["blindCurtainSliceTop_en"] = "Blind Curtain Slice Top";
ln["stampede_en"] = "Stampede";
ln["mosaic_en"] = "Mosaic";
ln["mosaicReverse_en"] = "Mosaic Reverse";
ln["mosaicRandom_en"] = "Mosaic Random";
ln["mosaicSpiral_en"] = "Mosaic Spiral";
ln["mosaicSpiralReverse_en"] = "Mosaic Spiral Reverse";
ln["topLeftBottomRight_en"] = "Top Left Bottom Right";
ln["bottomRightTopLeft_en"] = "Bottom Right Top Left";
ln["bottomLeftTopRight_en"] = "Bottom Left Top Right";
//ln["bottomLeftTopRight_en"] = "Bottom Left Top Right";
ln["scrollLeft_en"] = "Scroll Left";
ln["scrollRight_en"] = "Scroll Right";
ln["scrollHorz_en"] = "Scroll Horz";
ln["scrollBottom_en"] = "Scroll Bottom";
ln["scrollTop_en"] = "Scroll Top";

ln["x-axis-labelDescription_en"] = "The x-axis label.";
ln["y-axis-labelDescription_en"] = "The y-axis label.";
ln["suffixDescription_en"] = "The suffix added to data labels in the tooltip.";
ln["legendDescription_en"] = "The legend position.";
ln["data-labelsDescription_en"] = "Show/hide data labels.";
ln["themeDescription_en"] = "The theme affects the appearance and colors of the chart.";
ln["stackDescription_en"] = "The stack type.";
ln["donutDescription_en"] = "Pie will become Donut! :) (or viceversa).";
ln["mapDescription_en"] = "Maps for provinces and regions of Italy and Maps for provinces and municipalities in the Campania Region.";

ln["layer_en"] = "Layer";
ln["layerDescription_en"] = "Choose a layer";

ln["OpenStreetMap_en"] = "OpenStreetMap";
ln["OpenTopoMap_en"] = "Topographic Map";
ln["Esri.WorldImagery_en"] = "Imagery Map";
ln["Esri.WorldStreetMap_en"] = "World Street Map";
ln["Esri.DeLorme_en"] = "DeLorme Topographic Map";
ln["Esri.WorldTopoMap_en"] = "Topographic Map";
ln["Esri.OceanBasemap_en"] = "Ocean Base Map";
ln["Esri.NatGeoWorldMap_en"] = "National Geographic Map";
ln["Esri.WorldGrayCanvas_en"] = "Gray Map";
ln["Stamen.Watercolor_en"] = "Watercolor Map";
ln["NASAGIBS.ViirsEarthAtNight2012_en"] = "Night Lights Map";

//Quick guide
ln["Next_en"] = "Next";
ln["Back_en"] = "Back";
ln["Skip_en"] = "Skip";
ln["Done_en"] = "Done";

ln["step1_en"] = "Welcome. This is the step of the datalet creator wizard.";
ln["step2_en"] = "First, please select a dataset from the featured list.";
ln["step3_en"] = "Or, you can search by title the dataset in the featured list.";
ln["step4_en"] = "Or, you can enter a public dataset URL.";
ln["step5_en"] = "You can take a look at the metadata of the chosen dataset.";
ln["step6_en"] = "If the selected dataset is valid, the arrow will be colored and you can go to the next step";
ln["step7_en"] = "Welcome. This is the step to select data";
ln["step8_en"] = "Select the columns contain the data you want to display or on which to apply filters or groupings. If you are undecided, click on the \"Fields\" heading to select them all.";
ln["step9_en"] = "This area will show a preview of selected columns.";
ln["step10_en"] = "You can apply filters and / or groupings to the dataset, by clicking on the right.";
ln["step11_en"] = "Once your selection is done, click the arrow to proceed to the next step.";
ln["step12_en"] = "Welcome. This is the step for visualizing data.";
ln["step13_en"] = "Search or select the type of datalet you want to create.";
ln["step14_en"] = "Please select columns containing data to be visualized. Almost every datalet require you to fill at least the first two fields in order to show a preview.";
ln["step15_en"] = "Use the “Options” area to customize the visualization by adding labels or changing the visual theme.";
ln["step16_en"] = "Give a title and, optionally, a description.";
ln["step17_en"] = "Once you have selected the minimum number of columns required by the selected datalet, this area will show a preview. The preview is refreshed whenever you change any setting in this screen.";
ln["step18_en"] = "Select this tab for information on the selected graph (input values, options).";
ln["step19_en"] = "If you are satisfied of the visualization, you can share the datalet by clicking the “Add” button.";

/******** IT ********/

//PAGE SLIDER

ln["slide1Title_it"] = "SELEZIONA UN DATASET";
ln["slide1Subtitle_it"] = "Seleziona un dataset dall'elenco oppure copia-incolla l'url di un dataset.";
ln["slide2Title_it"] = "SELEZIONA I DATI";
ln["slide2Subtitle_it"] = "Seleziona i campi sulla sinistra. La tabella mostrer\u00e0 i valori relativi ai campi selezionati";
ln["slide3Title_it"] = "SELEZIONA LA VISUALIZZAZIONE";
ln["slide3Subtitle_it"] = "Seleziona una visualizzazione, compila i campi e le opzioni.";
ln["back_it"] = "INDIETRO";
ln["forward_it"] = "AVANTI";
//splod
ln["SPLODslide1Title_it"] = "CREA UN DATASET";
ln["SPLODslide1Subtitle_it"] = "Seleziona un endpoint e crea il tuo dataset.";

//SELECT DATASET

ln["selectedUrl_it"] = "Url selezionato";
ln["wrongUrl_it"] = "Url non valido o provider dati non ancora supportato.";

ln["providersDatasets_it"] = "DATASET DEI PROVIDER";
ln["spodUsersDatasets_it"] = "DATASET COCREATI";
ln["extendedDatasets_it"] = "RICERCA ESTESA";
ln["datasets_it"] = "LISTA DEI DATASET";

ln["provider_it"] = "Provider";
ln["all_it"] = "Tutti";
ln["allDescription_it"] = "Mostra i dataset di tutti i provider associati..";
ln["providerName_it"] = "Provider";
ln["providerNameDescription_it"] = "Mostra solo i dataset del provider selezionato.";

ln["search_it"] = "Ricerca";
ln["standard_it"] = "Standard";
ln["standardDescription_it"] = "La ricerca funziona solo sui nommi dei dataset.";
ln["extended_it"] = "Extended [NOT AVAILABLE]";
ln["extendedDescription_it"] = "La ricerca funziona sull'intero contenuto dei dataset;.";

ln["version_it"] = "Version";
ln["showLast_it"] = "Mostra l'ultima";
ln["showLastDescription_it"] = "Mostra solo l'ultima versione dei dataset.";
ln["showAll_it"] = "Mostra tutti";
ln["showAllDescription_it"] = "Mostra tutte le versioni dei dataset.";

//select-dataset-controllet
ln["datasetsInfo_it"] = "INFORMAZIONI SUL DATASET";
ln["showing_it"] = "Mostrati";
ln["to_it"] = "a";
ln["of_it"] = "di";
ln["datasetsRows_it"] = "dataset";
ln["search_it"] = "Ricerca";

//metadata
ln["room_it"] = "Stanza";
ln["resourceName_it"] = "Nome Risorsa";
ln["resourceDescription_it"] = "Descrizione Risorsa";
ln["users_it"] = "Utenti";

//SELECT DATA

//select-fields
ln["fields_it"] = "CAMPI";

//data-table
ln["selectedData_it"] = "DATI SELEZIONATI";
ln["showing_it"] = "Mostrati";
ln["to_it"] = "a";
ln["of_it"] = "di";
ln["rows_it"] = "righe";
ln["type_it"] = "TIPO";
ln["warning_it"] = "ATTENZIONE";

//expert
ln["expert_it"] = "MODALITA' ESPERTO";
ln["filters_it"] = "FILTRI";
ln["groupBy_it"] = "RAGGRUPPA PER";
ln["query_it"] = "INTERROGARE";

//filters
ln["filterField_it"] = "Campo";
ln["filterOperation_it"] = "Operazione";
ln["filterValue_it"] = "Valore";

ln["disableFilters_it"] = "DISABILITA FILTRI";
ln["enableFilters_it"] = "ABILITA FILTRI";

ln["=_it"] = "=";   //is equal to
ln["!=_it"] = "non =";  //is not equal to
ln[">_it"] = ">";   //is greater than
ln[">=_it"] = ">="; //is greater than or equal to
ln["<_it"] = "<";   //is less than
ln["<=_it"] = "<="; //is less than or equal to
ln["contains_it"] = "contiene";
ln["notContains_it"] = "non contiene";
ln["start_it"] = "inizia con";
ln["notStart_it"] = "non inizia con";
ln["ends_it"] = "termina con";
ln["notEnds_it"] = "non termina con";
ln["isNotNull_it"] = "non \u00e8 nullo";
ln["isNull_it"] = "\u00e8 nullo";

//aggregators
ln["GROUP BY_it"] = "RAGGRUPPA PER";
ln["CALCULATE_it"] = "CALCOLA";
ln["Calculate_it"] = "Calcola";
ln["aggregatorField_it"] = "Campo";

ln["disableGroupBy_it"] = "DISABILITA RAGGRUPPAMENTO ";
ln["enableGroupBy_it"] = "ABILITA RAGGRUPPAMENTO";

ln["COUNT_it"] = "CONTA";
ln["SUM_it"] = "SOMMA di";
ln["MIN_it"] = "MINIMO di";
ln["MAX_it"] = "MASSIMO di";
ln["AVG_it"] = "MEDIA di";
ln["FIRST_it"] = "PRIMO di";
ln["LAST_it"] = "ULTIMO di";

//SELECT VISUALIZATION

ln["addDatalet_it"] = "AGGIUNGI";
ln["modifyDatalet_it"] = "MODIFICA";

//datalet-preview
ln["previewTab_it"] = "ANTEPRIMA DATALET";
ln["infoTab_it"] = "DATALET INFO";

//select-inputs
ln["baseInfo_it"] = "INFO BASE";
ln["inputs_it"] = "INPUT";
ln["options_it"] = "OPZIONI";

//vslider
ln["search_it"] = "Cerca";

ln["datatable_it"] = "Tabella";
ln["barchart_it"] = "Grafico a barre";
ln["columnchart_it"] = "Istogramma";
ln["areachart_it"] = "Grafico ad area";
ln["linechart_it"] = "Grafico a linee";
ln["heatmap_it"] = "Mappa di calore";
ln["piechart_it"] = "Grafico a torta";
ln["pyramidchart_it"] = "Grafico a piramide";
ln["funnelchart_it"] = "Grafico a imbuto";
ln["wordcloud_it"] = "Nuvola di parole";
ln["spiderchart_it"] = "Grafico spider";
ln["polarchart_it"] = "Grafico polare";
ln["scatterchart_it"] = "Grafico a dispersione";
ln["bubblechart_it"] = "Diagramma a bolle";
ln["treemap_it"] = "Mappa ad albero";
ln["timeline_it"] = "Linea del tempo";
ln["mediaslider_it"] = "Media Slider";
ln["leafletjs_it"] = "Mappa";
ln["leafletjs-geojson_it"] = "Mappa Geojson";
ln["audioslider_it"] = "Audio Slider";
ln["italymap_it"] = "Mappa Italia";

ln["datatableDescription_it"] = "Una tabella \u00e8 un mezzo per organizzare i dati in righe e colonne.";
ln["barchartDescription_it"] = "Un grafico a barre \u00e8 un grafico che presenta dati raggruppati in barre rettangolari impostate orizzontalmente con la lunghezza proporzionale al valore rappresentato.";
ln["columnchartDescription_it"] = "Un istogramma \u00e8 un grafico raffigurante dati raggruppati in barre rettangolari impostate verticalmente con lunghezza proporzionale al valore rappresentato.";
ln["areachartDescription_it"] = "Un grafico ad area \u00e8 un grafico che mostra graficamente dati quantitativi. L'area tra le assi e la linea sono enfatizzate con colori e texture. Usualmente si compara il grafico ad area con due o pi\u00f9 quantit\u00e0.";
ln["linechartDescription_it"] = "Un grafico a linee \u00e8 un grafico che mostra le informazioni sottoforma di una serie di dati puntuali definiti 'markers' e collegati tra loro con segmenti di linee dritte. Il grafico a linee \u00e8 spesso utilizzato per visualizzare trend lungo un intervallo temporale.";
ln["heatmapDescription_it"] = "Una heat map \u00e8 una rappresentazione grafica di dati in cui i valori individuali contenuti in una matrice sono rappresentati con colori.";
ln["piechartDescription_it"] = "Un grafico a torta \u00e8 un grafico statistico e circolare che \u00e8 diviso in fette che mostrano la proporzione numerica. Nel grafico a torta la lunghezza dell'arco di ogni fetta, e di conseguenza il suo angolo al centro e l'area, \u00e8 proporzionato alla quantita che rappresenta.";
ln["scatterchartDescription_it"] = "Un grafico a dispersione \u00e8 un tipo di grafico o diagramma matematico che utilizza coordinate cartesiane per mostrare valori tipicamente per due variabili per un set di dati. I dati sono mostrati come un insieme di punti, ciascuno avente il valore di una variabile che ne determina la posizione sull'asse orizzontale e il valore dell'altra variabile ne determina la posizione sull'asse verticale.";
ln["bubblechartDescription_it"] = " Un diagramma a bolle \u00e8 un tipo di diagramma che mostra tre dimensioni dei dati. Ciascuna entit\u00e0 con la sua tripletta (v1,v2,v3) di dati associati viene impostata come un disco che esprime due dei valori di vi attraverso la localizzazione dell'xy del disco mentre la terza vi \u00e8 la dimensione del disco stessa.";
ln["treemapDescription_it"] = " Una mappa ad albero \u00e8 un diagramma per rappresentare dati gerarchicamente utilizzando rettangoli nidificati.";
ln["timelineDescription_it"] = "La linea del tempo \u00e8 una visualizzazione interattiva e permette di rappresentare i dati in ordine cronologico. Gli eventi possono avere luogo in una singola data oppure hanno una data di inizio e di fine (un intervallo). Puoi muovere e zoomare liberamente la timeline. La scala temporale sull'asse viene regolata automaticamente e supporta scale che vanno da millisecondi ad anni.";
ln["mediasliderDescription_it"] = "Il mediaslider \u00e8 un catalogo di immagini con titolo e descrizione.";
ln["leafletjsDescription_it"] = "Una mappa geografica interattiva che permette di inserire oltre alle coordinate geografiche, ulteriori informazioni (ad esempio, indirizzi, immagini etc.).";
ln["leafletjs-geojsonDescription_it"] = "Una mappa geografica interattiva che permette di inserire oltre alle coordinate geografiche, ulteriori informazioni (ad esempio, indirizzi, immagini etc.).";
ln["audiosliderDescription_it"] = "L'Audio Slider rappresenta un catalogo di dati in formato audio (mp3) e immagini.";
ln["italymapDescription_it"] = "La mappa Italia rappresenta una mappa colorata per province o regioni sia dell'Italia che della Regione Campania.";

//inputs
ln["title_it"] = "Titolo";
ln["description_it"] = "Descrizione";

ln["required_it"] = "Campo obbligatorio";

ln["sortAscending_it"] = "ORDINE CRESCENTE";
ln["sortDescending_it"] = "ORDINE DECRESCENTE";
ln["unsort_it"] = "NON ORDINATI";

ln["TITLE_it"] = "TITOLO";
ln["DESCRIPTION_it"] = "DESCRIZIONE";
ln["XAxis_it"] = "ETICHETTA";
ln["YAxis_it"] = "DATO";
ln["NumericXAxis_it"] = "ETICHETTA";
ln["NumericYAxis_it"] = "DATO";
ln["Column_it"] = "COLONNA";
ln["Level_it"] = "LIVELLO";
ln["SliceLabels_it"] = "ETICHETTA";
ln["SliceSizes_it"] = "DIMENSIONE";
ln["StartDate_it"] = "DATA D'INIZIO";
ln["EndDate_it"] = "DATA DI FINE";
ln["EventTitle_it"] = "TITOLO EVENTO";
ln["EventDescription_it"] = "DESCRIZIONE EVENTO";
ln["MediaUrl_it"] = "INDIRIZZO MEDIA";
ln["Background_it"] = "BACKGROUND";
ln["MediaTitle_it"] = "TITOLO MEDIA";
ln["MediaDescription_it"] = "DESCRIZIONE MEDIA";
ln["Latitude_it"] = "LATITUDINE";
ln["Longitude_it"] = "LONGITUDINE";
ln["BalloonContent_it"] = "CONTENUTO DEL BALLOON";
ln["GEOJSON_it"] = "GEOJSON";
ln["GEOJSONContent_it"] = "CONTENUTO DEL GEOJSON";
ln["BubbleContent_it"] = "CONTENUTO DELLA BOLLA";
ln["BubbleSize_it"] = "DIMENSIONE DELLA BOLLA";
ln["Categories_it"] = "CATEGORIA";
ln["AudioUrl_it"] = "INDIRIZZO AUDIO";
ln["AudioTiming_it"] = "AUDIO TIMING";
ln["ImageUrl_it"] = "INDIRIZZO  IMMAGINE";
ln["AudioDescription_it"] = "DESCRIZIONE AUDIO";
ln["Area_it"] = "AREA";
ln["Value_it"] = "VALORE";
ln["TooltipContent_it"] = "CONTENUTO DESCRIZIONE ETICHETTA";

ln["TITLEDescription_it"] = "Titolo  datalet";
ln["DESCRIPTIONDescription_it"] = "Descrizione datalet";
ln["XAxisDescription_it"] = "Etichetta";
ln["YAxisDescription_it"] = "Dato";
ln["NumericXAxisDescription_it"] = "Etchetta";
ln["NumericYAxisDescription_it"] = "Dato";
ln["ColumnDescription_it"] = "Colonna della tabella";
ln["LevelDescription_it"] = "Livello della mappa ad albero";
ln["SliceLabelsDescription_it"] = "Etichette delle fette";
ln["SliceSizesDescription_it"] = "Dimensione delle fette";
ln["StartDateDescription_it"] ="La data di inizio dell'evento: una stringa che rappresenta una data nel formato RFC2822 o ISO 8601 (ad esempio 2015-03-25, 25/03/2015, 25 marzo 2015, 25 marzo 2015, mercoled\u00ec 25 marzo 2015) o un numero singolo che rappresenta anno (per esempio 2017, 7, -150) o un numero romano che rappresenta secoli usando 'bc', 'b.c', 'b.c.e' o 'bce' per distinguire prima di Cristo / Prima dell'Era Comune (ad esempio IV, X bce, III b.c). Altri formati possono essere usati, ma i risultati possono essere inaspettati.";
ln["EndDateDescription_it"] = "La data di fine dell'evento (vedi data di inizio).";

ln["EndDateDescription_it"] = "La data di fine dell'evento (vedi data di inzio).";
ln["EventTitleDescription_it"] = "Il titolo dell'evento.";
ln["EventDescriptionDescription_it"] = "La descrizione dell'evento.";
ln["MediaUrlDescription_it"] = "L'indirizzo dell'immagine.";
ln["BackgroundDescription_it"] ="L'indirizzo (URL) completo che punta a un'immagine che verr\u00e0 utilizzata come sfondo o un colore gestito con le regole CSS (acronimo di Cascading Style Sheets, in italiano fogli di stile a cascata) (ad esempio red,aqua etc. ), nel formato  esadecimale (ad es. # 0f9bd1) o una parola chiave valida del colore gestito con CSS.";
ln["MediaTitleDescription_it"] = "Il titolo del media.";
ln["MediaDescriptionDescription_it"] = "La descrizione del media.";
ln["LatitudeDescription_it"] = "Latitudine della posizione";
ln["LongitudeDescription_it"] = "Longitudine della posizione";
ln["BalloonContentDescription_it"] = "Contenuto dei balloons";
ln["GEOJSONDescription_it"] = "Dati GeoJSON.";
ln["GEOJSONContentDescription_it"] = "Contenuto del GeoJSON.";
ln["BubbleContentDescription_it"] = "Contenuto delle bolle.";
ln["BubbleSizeDescription_it"] = "Dimensione delle bolle.";
ln["CategoriesDescription_it"] = "Categoria che separa l'asse y. Se selezionata, solo l'asse y scelta per prima sar\u00e0 considerata.";
ln["AudioUrlDescription_it"] = "Indirizzo audio (in formato mp3).";
ln["AudioTimingDescription_it"] = " ";
ln["ImageUrlDescription_it"] = " ";
ln["AudioDescriptionDescription_it"] = " ";
ln["AreaDescription_it"] = " ";
ln["ValueDescription_it"] = " ";
ln["TooltipContentDescription_it"] = " ";

//options
ln["x-axis-label_it"] = "Etichetta";
ln["y-axis-label_it"] = "Dato";
ln["suffix_it"] = "Descrizione etichette dati";
ln["legend_it"] = "Legenda";
ln["data-labels_it"] = "Mostra etichette dati";
ln["stack_it"] = "Pila";
ln["theme_it"] = "Tema";
ln["donut_it"] = "Ciambella";
ln["date-format_it"] = "Formato data";
ln["animation_it"] = "Animazione";
ln["animationDescription_it"]= "Elenco di animazione per il catalogo.";

ln["map_it"] = "Mappa";
ln["1_italyRegion_it"] = "Italia - Regioni";
ln["2_italyProvince_it"] = "Italia - Province";
ln["3_campaniaProvince_it"] = "Campania - Province";
ln["4_campaniaMunicipality_it"] = "Campania - Municipalit\u00e0";

ln["true_it"] = "Si";
ln["false_it"] = "No";
ln["bottom_it"] = "Si: in fondo";
ln["topRight_it"] = "Si: in alto a destra";
ln["normal_it"] = "Si: Normale";
ln["percent_it"] = "Si: Percentuale";
ln["themeBase_it"] = "Base";
ln["themeDarkGreen_it"] = "Verde Scuro";
ln["themeDarkBlue_it"] = "Blu Scuro";
ln["themeDarkUnica_it"] = "Scuro";
ln["themeGray_it"] = "Grigio";
ln["themeGrid_it"] = "Griglia";
ln["themeGridLight_it"] = "Griglia chiara";
ln["themeSandSignika_it"] = "Sabbia";
ln["themeSkies_it"] = "Cielo";
ln["MDY_it"] = "Mese-Giorno-Anno";
ln["DMY_it"] = "Giorno-Mese-Anno";
ln["random_it"] = "Random";
ln["simpleFade_it"] = "Dissolvenza semplice";
ln["curtainTopLeft_it"] = "Tendina a Sinistra in Alto";
ln["curtainTopRight_it"] = "Tendina a Destra in Alto";
ln["curtainBottomLeft_it"] = "Tendina in Basso a Sinistra";
ln["curtainBottomRight_it"] = "Tendina in Basso a Destra";
ln["curtainSliceLeft_it"] =  "Tendina a fetta a Sinistra";
ln["curtainSliceRight_it"] = "Tendina a fetta a Destra";
ln["blindCurtainTopLeft_it"] = "Veneziana a Sinistra in Alto";
ln["blindCurtainTopRight_it"] = "Veneziana a Destra in Alto";
ln["blindCurtainBottomLeft_it"] = "Veneziana in Basso a Sinistra";
ln["blindCurtainBottomRight_it"] = "Veneziana in Basso a Destra";
ln["blindCurtainSliceBottom_it"] = "Veneziana a fette in Basso";
ln["blindCurtainSliceTop_it"] = "Veneziana a fette in Alto";
ln["stampede_it"] = "Veloce";
ln["mosaic_it"] =  "Mosaico";
ln["mosaicReverse_it"] = "Mosaico al Contrario";
ln["mosaicRandom_it"] =  "Mosiaco Casuale";
ln["mosaicSpiral_it"] =  "Mosaico a Spirale";
ln["mosaicSpiralReverse_it"] = "Mosaico a Spirale inverso";
ln["topLeftBottomRight_it"] = "In Alto a Sinistra in Basso a Destra";
ln["bottomRightTopLeft_it"] = "In Basso a Destra in Alto a Sinistra";
ln["bottomLeftTopRight_it"] = "In Basso a Sinistra in Alto a Destra";
//ln["bottomLeftTopRight_it"] = "Bottom Left Top Right";
ln["scrollLeft_it"] = "Scorrere a Sinistra";
ln["scrollRight_it"] = "Scorrere a Destra";
ln["scrollHorz_it"] =  "Scorrere in Orizzontale";
ln["scrollBottom_it"] = "Scorrere in Basso";
ln["scrollTop_it"] = "Scorrere in Alto";

ln["x-axis-labelDescription_it"] = "Etichetta";
ln["y-axis-labelDescription_it"] = "Dato";
ln["suffixDescription_it"] = " Descrizione aggiunta alle etichette dati.";
ln["legendDescription_it"] = "Posizione legenda";
ln["data-labelsDescription_it"] = "Mostra/Nascondi etichette dati";
ln["themeDescription_it"] = "Il tema influenza l'aspetto e i colori del grafico.";
ln["stackDescription_it"] = "Tipologia di pila";
ln["donutDescription_it"] = "La torta si trasforma in ciambella! :) (o viceversa).";
ln["mapDescription_it"] = "Mappe per province e regioni dell'Italia e Mappe per province e municipalit\u00e0 della Regione Campania.";

ln["layer_it"] = "Layer";
ln["layerDescription_it"] = "Elenco di layer disponibili";

ln["OpenStreetMap_it"] = "OpenStreetMap";
ln["OpenTopoMap_it"] = "Mappa Topografica";
ln["Esri.WorldImagery_it"] = "Mappa Satellitare";
ln["Esri.WorldStreetMap_it"] = "Mappa Stradale";
ln["Esri.DeLorme_it"] =  "Mappa Topografica DeLorme";
ln["Esri.WorldTopoMap_it"] = "Mappa Topografica";
ln["Esri.OceanBasemap_it"] =  "Mappa Base Oceano";
ln["Esri.NatGeoWorldMap_it"] = "Mappa Geografica Nazionale";
ln["Esri.WorldGrayCanvas_it"] = "Mappa Grigia";
ln["Stamen.Watercolor_it"] =  "Mappa Acquerello";
ln["NASAGIBS.ViirsEarthAtNight2012_it"] = "Mappa con Luci Notturne";

//Quick guide
ln["step1_it"] = "Benvenuto. Questo è il passo della creazione di una datalet.";
ln["step2_it"] = "Prima di tutto deve selezionare un dataset dalla lista predefinita.";
ln["step3_it"] = "Puoi ricercare per titolo il dataset presente nella lista predefinita.";
ln["step4_it"] = "Oppure puoi inserire la URL di un dataset pubblico.";
ln["step5_it"] = "Puoi dare uno sguardo ai metadata del dataset scelto.";
ln["step6_it"] = "Se il dataset è valido, la freccia si colorerà e potrai andare al prossimo passo.";
ln["step7_it"] = "Benvenuto. Questo è il passo per selezionare i dati.";
ln["step8_it"] = "Seleziona le colonne contengono i dati che vuoi visualizzare o sui quali applicare filtri o raggruppamenti.Se sei indeciso, clicca sull’intestazione “Campi” per selezionarli tutti.";
ln["step9_it"] =  "Quest’area mostrerà un’anteprima delle colonne selezionate.";
ln["step10_it"] = "Puoi applicare i filtri e/o raggruppamenti al dataset, cliccando, in basso, a destra.";
ln["step11_it"] = "Una volta selezionate le colonne di tuo interesse, clicca sulla freccia per andare al prossimo passo.";
ln["step12_it"] = "Benvenuto. Questo è il passo per la visualizzazione dei dati.";
ln["step13_it"] = "Cerca o seleziona il tipo di datalet che vuoi creare.";
ln["step14_it"] = "Seleziona le colonne da usare per la visualizzazione. Quasi tutte le datalet richiedono di compilare almeno i primi due campi prima di mostrare un’anteprima.";
ln["step15_it"] = "L’area Opzioni ti permette di personalizzare la visualizzazione aggiungendo etichette o cambiando il tema grafico.";
ln["step16_it"] = "Dai un titolo alla datalet. Puoi anche aggiungere una descrizione.";
ln["step17_it"] = "Se hai selezionato il numero minimo di colonne richieste dalla datalet, quest’area ti mostrerà un’anteprima. Ogni volta che cambi qualcosa in questa schermata, l’anteprima della datalet sarà aggiornata.";
ln["step18_it"] = "Selezionare questa scheda per le informazioni relative al grafico selezionato (valori di input, opzioni).";
ln["step19_it"] = "Quando sei pronto, puoi pubblicare la datalet che hai creato cliccando su “Aggiungi”.";

ln["Next_it"] = "Prossimo";
ln["Back_it"] = "Indietro";
ln["Skip_it"] = "Salta";
ln["Done_it"] = "Fine";
/******** FR ********/
//PAGE SLIDER

ln["slide1Title_fr"] = "SÉLECTIONNER UN JEU DE DONNÉES";
ln["slide1Subtitle_fr"] = "Rechercher ou copier/coller l’url du jeu de données.";
ln["slide2Title_fr"] = "SÉLECTIONNER DONNÉES";
ln["slide2Subtitle_fr"] = "Sélectionner les champs sur la gauche. Le tableau présentera les valeurs liées aux champs sélectionnés.";
ln["slide3Title_fr"] = "SÉLECTIONNER UN MODE DE VISUALISATION";
ln["slide3Subtitle_fr"] = "Sélectionner une visualisation, compléter les données et les options.";
ln["back_fr"] = "BACK";
ln["forward_fr"] = "AVANT";
//splod
ln["SPLODslide1Title_fr"] = "CRÉER UN JEU DE DONNÉES";
ln["SPLODslide1Subtitle_fr"] = "Sélectionnez un endpoint et créez votre jeu de données.";

//SELECT DATASET

ln["selectedUrl_fr"] = "API URL sélectionné";
ln["wrongUrl_fr"] = "URL invalide ou fournisseur de données pas encore supporté.";

ln["providersDatasets_fr"] = "JEU DE DONNÉES";
ln["spodUsersDatasets_fr"] = "JEU DE DONNÉES CO-CRÉE";
ln["extendedDatasets_fr"] = "RECHERCHE AVANCÉE";
ln["datasets_fr"] = "LISTE DE DATASET";

ln["provider_fr"] = "Fournisseur";
ln["all_fr"] = "Montre tout";
ln["allDescription_fr"] = "Présentation de toutes les versions du jeu de données.";
ln["providerName_fr"] = "Montre la derni\u00e8re ";
ln["providerNameDescription_fr"] = "Derni\u00e8re version du jeu de données.";

ln["search_fr"] = "Rechercher";
ln["standard_fr"] = "Standard";
ln["standardDescription_fr"] = "La fonction de recherche ne fonctionne que sur des ensembles de données des noms.";
ln["extended_fr"] = "Extended [NON DISPONIBLE]";
ln["extendedDescription_fr"] = "La fonction de recherche fonctionne tout le contenu des ensembles de données.";

ln["version_fr"] = "Version";
ln["showLast_fr"] = "Montre la derni\u00e8re";
ln["showLastDescription_fr"] = "Indique que la derni\u00e8re version des ensembles de données.";
ln["showAll_fr"] = "Montre tout";
ln["showAllDescription_fr"] = "Montre toutes les versions des ensembles de données.";

//select-dataset-controllet
ln["datasetsInfo_fr"] = "INFORMATIONS SUR LE JEU DE DONNÉES";
ln["showing_fr"] = "Aperçu";
ln["to_fr"] = "\u00e0";
ln["of_fr"] = "de";
ln["datasetsRows_fr"] = "dataset";
ln["search_fr"] = "Rechercher";

//metadata
ln["room_fr"] = "Salle";
ln["resourceName_fr"] = "Nom du jeu de données";
ln["resourceDescription_fr"] = "Description du jeu de données";
ln["users_fr"] = "Utilisateurs";

//SELECT DATA

//select-fields
ln["fields_fr"] = "CHAMPS";

//data-table
ln["selectedData_fr"] = "DONNÉES SÉLECTIONNÉES";
ln["showing_fr"] = "Aperçu";
ln["to_fr"] = "\u00e0";
ln["of_fr"] = "de";
ln["rows_fr"] = "rangées";
ln["type_fr"] = "TYPE";
ln["warning_fr"] = "AVERTISSEMENT";

//expert
ln["expert_fr"] = "MODE EXPERT";
ln["filters_fr"] = "FILTRES";
ln["groupBy_fr"] = "GROUPE PAR";
ln["query_fr"] = "REQUÊTE";

//filters
ln["filterField_fr"] = "Champ";
ln["filterOperation_fr"] = "Opération";
ln["filterValue_fr"] = "Valeur";

ln["disableFilters_fr"] = "DÉSACTIVER LES FILTRES";
ln["enableFilters_fr"] = "ACTIVER LES FILTRES";

ln["=_fr"] = "=";   //est égal à
ln["!=_fr"] = "not =";  //n'est pas égal à
ln[">_fr"] = ">";   //est plus grand que
ln[">=_fr"] = ">="; //est plus grand ou égal à
ln["<_fr"] = "<";   //est inférieur à
ln["<=_fr"] = "<="; //est inférieur ou égal à
ln["contains_fr"] = "contient";
ln["notContains_fr"] = "ne contient pas";
ln["start_fr"] = "commence par";
ln["notStart_fr"] = "ne commence pas par";
ln["ends_fr"] = "se finit par";
ln["notEnds_fr"] = "ne se finit pas par";
ln["isNotNull_fr"] = "est not nul";
ln["isNull_fr"] = "est nul";

//aggregators
ln["GROUP BY_fr"] = "GROUPE PAR";
ln["CALCULATE_fr"] = "CALCULER";
ln["Calculate_fr"] = "Calculer";
ln["aggregatorField_fr"] = "Champ";

ln["disableGroupBy_fr"] = "DÉSACTIVER LE GROUPE PAR";
ln["enableGroupBy_fr"] = "ACTIVER LE GROUPE PAR";

ln["COUNT_fr"] = "COMPTE de";
ln["SUM_fr"] = "SOMME de";
ln["MIN_fr"] = "MIN de";
ln["MAX_fr"] = "MAX de";
ln["AVG_fr"] = "AVG de";
ln["FIRST_fr"] = "PREMIER de";
ln["LAST_fr"] = "DERNIER de";

//SELECT VISUALIZATION

ln["addDatalet_fr"] = "AJOUTER";
ln["modifyDatalet_fr"] = "MODIFIER";

//datalet-preview
ln["previewTab_fr"] = "APERÇU DU DATALET";
ln["infoTab_fr"] = "INFORMATIONS DU DATALET";

//select-inputs
ln["baseInfo_fr"] = "INFORMATIONS DE BASE";
ln["inputs_fr"] = "DONNÉES";
ln["options_fr"] = "OPTIONS";

//vslider
ln["search_fr"] = "Rechercher";

ln["datatable_fr"] = "Tableau";
ln["barchart_fr"] = "Diagramme 00e0 barres";
ln["columnchart_fr"] = "Histogramme";
ln["areachart_fr"] = "Diagramme de zone";
ln["linechart_fr"] = "Diagramme linéaire";
ln["heatmap_fr"] = "Carte Thermique";
ln["piechart_fr"] = "Diagramme Circulaire";
ln["pyramidchart_fr"] = "Pyramid Chart";
ln["funnelchart_fr"] = "Funnel Chart";
ln["wordcloud_fr"] = "Word Cloud";
ln["spiderchart_fr"] = "Spider Chart";
ln["polarchart_fr"] = "Polar Chart";
ln["scatterchart_fr"] = "Diagramme de dispersion";
ln["bubblechart_fr"] = "Diagramme 00e0 bulles";
ln["treemap_fr"] = "Carte d'arborescence";
ln["timeline_fr"] = "Timeline";
ln["mediaslider_fr"] = "Media Slider";
ln["leafletjs_fr"] = "Carte";
ln["leafletjs-geojson_fr"] = "Carte Geojson";
ln["audioslider_fr"] = "Audio Slider";
ln["italymap_fr"] = "Italy Map";
ln["europemap_fr"] = "European Map"

ln["datatableDescription_fr"] = "Un tableau est un moyen d'organiser les données dans des rangées et des colonnes.";
ln["barchartDescription_fr"] = "Un diagramme 00e0 barres est un graphique qui représente des données groupées au moyen de barres rectangulaires disposées horizontallement avec des longueurs proportionnelles aux valeurs qu'elles représentent.";
ln["columnchartDescription_fr"] = "Un histogramme est un graphique qui représente des données groupées au moyen de barres rectangulaires disposées verticallement avec des longueurs proportionnelles aux valeurs qu'elles représentent.";
ln["areachartDescription_fr"] = "Un diagramme de zone est un graphique qui propose des données quantitatives de mani\u00e8re graphique. La zone entre l'axe et la ligne est accentuée par des couleurs et des textures. En général, minimum deux données quantitatives sont utilisées pour être comparées dans ce genre de graphique.";
ln["linechartDescription_fr"] = "Un diagramme linéaire est un graphique qui propose des informations sous forme d'une série de points de données appelés des 'marqueurs', reliés entre eux pour former des lignes continues. Un diagramme linéaire est souvent utilisé pour visualiser une tendance dans les données en parall\u00e8le avec des périodes de temps données.";
ln["heatmapDescription_fr"] = "Une carte thermique est une représentation graphique de données dans laquelle les valeurs individuelles contenues dans une matrice sont représentées 00e0 l'aide de couleurs.";
ln["piechartDescription_fr"] = "Un diagramme circulaire est un graphique statistique qui est séparé en deux pour illustrer des proportions numériques. Dans un diagramme circulaire, la longueur de l'arc de chaque parties, et par conséquent son angle central et sa superficie, est proportionnelle 00e0 la quantité qu'elle représente.";
ln["scatterchartDescription_fr"] = "Un diagramme de dispersion est un type de graphique ou de diagramme mathématque qui utilise des coordonnées cartésiennes pour mettre en évidence des valeurs pour deux variables d'un jeu de données. Les données sont mises se traduisent par un regroupement de points, chacun ayant la valeur d'une variable déterminant la position sur l'axe horizontal et la valeur de l'autre variable qui détermine la position sur l'axe vertical.";
ln["bubblechartDescription_fr"] = "Un diagramme 00e0 bulles est un graphique qui propose des données 00e0 trois dimensions. Chaque entité avec ses triplets (v1, v2, v3) de données associées est agencée comme un disque qui exprime deux des valeurs vi au moyen de l'emplacement xy du disque ainsi que de la taille du troisi\u00e8me.";
ln["treemapDescription_fr"] = "Une arte d'arborescence est un graphique qui permet de visualiser les données hiérarchiques \u00e0 l'aide de rectangles imbriqués.";
ln["timelineDescription_fr"] = "The timeline is an interactive visualization chart to visualize data in time. The data items can take place on a single date, or have a start and end date (a range). You can freely move and zoom in the timeline. The time scale on the axis is adjusted automatically, and supports scales ranging from milliseconds to years.";
ln["mediasliderDescription_fr"] = "The mediaslider is a slider of media.";
ln["leafletjsDescription_fr"] = "";
ln["leafletjs-geojsonDescription_fr"] = "";
ln["audiosliderDescription_fr"] = "";
ln["italymapDescription_fr"] = "";

//inputs
ln["title_fr"] = "Titre";
ln["description_fr"] = "Description";

ln["required_fr"] = "Champ obligatoire";

ln["sortAscending_fr"] = "CLASSÉ DE MANIÈRE ASCENDANTE";
ln["sortDescending_fr"] = "CLASSÉ DE MANIÈRE DESCENDANTE";
ln["unsort_fr"] = "PAS CLASSÉ";

ln["TITLE_fr"] = "TITRE";
ln["DESCRIPTION_fr"] = "DESCRIPTION";
ln["XAxis_fr"] = "AXE DES X";
ln["YAxis_fr"] = "AXE DES Y";
ln["NumericXAxis_fr"] = "AXE DES X";
ln["NumericYAxis_fr"] = "AXE DES Y";
ln["Column_fr"] = "COLONNE";
ln["Level_fr"] = "NIVEAU";
ln["SliceLabels_fr"] = "LABEL";
ln["SliceSizes_fr"] = "TAILLE";
ln["StartDate_fr"] = "START DATE";
ln["EndDate_fr"] = "END DATE";
ln["EventTitle_fr"] = "EVENT TITLE";
ln["EventDescription_fr"] = "EVENT DESCRIPTION";
ln["MediaUrl_fr"] = "MEDIA URL";
ln["Background_fr"] = "BACKGROUND";
ln["MediaTitle_fr"] = "MEDIA TITLE";
ln["MediaDescription_fr"] = "MEDIA DESCRIPTION";
ln["Latitude_fr"] = "LATITUDE";
ln["Longitude_fr"] = "LONGITUDE";
ln["BalloonContent_fr"] = "CONTENU DE LA BULLE";
ln["GEOJSON_fr"] = "GEOJSON";
ln["GEOJSONContent_fr"] = "CONTENU GEOJSON";
ln["BubbleContent_fr"] = "CONTENU DE LA BULLE";
ln["BubbleSize_fr"] = "TAILLE DE LA BULLE";
ln["Categories_fr"] = "CATÉGORIE";
ln["AudioUrl_fr"] = "AUDIO URL";
ln["AudioTiming_fr"] = "AUDIO TIMING";
ln["ImageUrl_fr"] = "IMAGE URL";
ln["AudioDescription_fr"] = "AUDIO DESCRIPTION";
ln["Area_fr"] = "AREA";
ln["Value_fr"] = "VALUE";
ln["TooltipContent_fr"] = "TOOLTIP CONTENT";

ln["TITLEDescription_fr"] = "Titre du datalet.";
ln["DESCRIPTIONDescription_fr"] = "Description du datalet.";
ln["XAxisDescription_fr"] = "L'axe des x.";
ln["YAxisDescription_fr"] = "L'axe des y.";
ln["NumericXAxisDescription_fr"] = "L'axe des x.";
ln["NumericYAxisDescription_fr"] = "L'axe des y.";
ln["ColumnDescription_fr"] = "La colonne du tableau.";
ln["LevelDescription_fr"] = "Le niveau de la carte d'arborescence.";
ln["SliceLabelsDescription_fr"] = "Le label des parts.";
ln["SliceSizesDescription_fr"] = "La taille des parts.";
ln["StartDateDescription_fr"] = "The start date of the event. A string representing an RFC2822 or ISO 8601 date (e.g. 2015-03-25, 03/25/2015, Mar 25 2015, 25 Mar 2015, Wednesday March 25 2015) or a single number rapresenting the year (e.g. 2017, 7, -150) or a roman number rapresenting centuries using 'bc', 'b.c.', 'bce' or 'b.c.e.' to discern Before Christ/Before Common Era centuries (e.g. IV, X bce, III b.c). Other formats may be used, but results may be unexpected.";
ln["EndDateDescription_fr"] = "The end date of the event (see start date).";
ln["EventTitleDescription_fr"] = "The title of the event.";
ln["EventDescriptionDescription_fr"] = "The description of the event.";
ln["MediaUrlDescription_fr"] = "The url of the media.";
ln["BackgroundDescription_fr"] = "The fully-qualified URL pointing to an image which will be used as the background or a CSS color, in hexadecimal (e.g. #0f9bd1) or a valid CSS color keyword.";
ln["MediaTitleDescription_fr"] = "The title of the media.";
ln["MediaDescriptionDescription_fr"] = "The description of the media.";
ln["LatitudeDescription_fr"] = "La latitude des localisations.";
ln["LongitudeDescription_fr"] = "La longitude des localisations.";
ln["BalloonContentDescription_fr"] = "Le contenu des bulles.";
ln["GEOJSONDescription_fr"] = "Les données GeoJSON.";
ln["GEOJSONContentDescription_fr"] = "Le contenu de GeoJSON.";
ln["BubbleContentDescription_fr"] = "Le contenu des bulles.";
ln["BubbleSizeDescription_fr"] = "La taille des bulles.";
ln["CategoriesDescription_fr"] = "La catégorie qui sépare les valeurs de l'axe des x. Si sélectionné, seulement le premier axe des y sera considéré.";
ln["AudioUrlDescription_fr"] = " ";
ln["AudioTimingDescription_fr"] = " ";
ln["ImageUrlDescription_fr"] = " ";
ln["AudioDescriptionDescription_fr"] = " ";
ln["AreaDescription_fr"] = " ";
ln["ValueDescription_fr"] = " ";
ln["TooltipContentDescription_fr"] = " ";

//options
ln["x-axis-label_fr"] = "Label de l'Axe des X";
ln["y-axis-label_fr"] = "Label de l'Axe des Y";
ln["suffix_fr"] = "Suffixe d'aide";
ln["legend_fr"] = "Légende";
ln["data-labels_fr"] = "Montrer les labels de données";
ln["stack_fr"] = "Empiler";
ln["theme_fr"] = "Th\u00e8me";
ln["donut_fr"] = "Donut";
ln["date-format_fr"] = "DATE FORMAT";
ln["animation_fr"] = "Animation";
ln["animationDescription_fr"]= "Choose animation for the catalog.";

ln["map_fr"] = "Map";
ln["1_italyRegion_fr"] = "Italy - Regions";
ln["2_italyProvince_fr"] = "Italy - Province";
ln["3_campaniaProvince_fr"] = "Campania - Province";
ln["4_campaniaMunicipality_fr"] = "Campania - Municipality";

ln["layer_fr"] = "Layer";
ln["layerDescription_fr"] = "Choose a layer";




ln["true_fr"] = "Oui";
ln["false_fr"] = "Non";
ln["bottom_fr"] = "Oui: En Bas";
ln["topRight_fr"] = "Oui: En Haut \u00e0 Droite";
ln["normal_fr"] = "Oui: Normal";
ln["percent_fr"] = "Oui: Pourcentage";
ln["themeBase_fr"] = "Base";
ln["themeDarkGreen_fr"] = "Dark Green";
ln["themeDarkBlue_fr"] = "Dark Blue";
ln["themeDarkUnica_fr"] = "Dark Unika";
ln["themeGray_fr"] = "Gray";
ln["themeGrid_fr"] = "Grid";
ln["themeGridLight_fr"] = "Grid Light";
ln["themeSandSignika_fr"] = "Sand Signika";
ln["themeSkies_fr"] = "Skies";
ln["MDY_fr"] = "Month-Day-Year";
ln["DMY_fr"] = "Day-Month-Year";
ln["random_fr"] = "Random";
ln["simpleFade_fr"] = "Simple Fade";
ln["curtainTopLeft_fr"] = "Curtain Top Left";
ln["curtainTopRight_fr"] = "Curtain Top Right";
ln["curtainBottomLeft_fr"] = "Curtain Bottom Left";
ln["curtainBottomRight_fr"] = "Curtain Bottom Right";
ln["curtainSliceLeft_fr"] = "Curtain Slice Left";
ln["curtainSliceRight_fr"] = "Curtain Slice Right";
ln["blindCurtainTopLeft_fr"] = "Blind Curtain Top Left";
ln["blindCurtainTopRight_fr"] = "Blind Curtain Top Right";
ln["blindCurtainBottomLeft_fr"] = "Blind Curtain Bottom Left";
ln["blindCurtainBottomRight_fr"] = "Blind Curtain Bottom Right";
ln["blindCurtainSliceBottom_frn"] = "Blind Curtain Slice Bottom";
ln["blindCurtainSliceTop_fr"] = "Blind Curtain Slice Top";
ln["stampede_fr"] = "Stampede";
ln["mosaic_fr"] = "Mosaic";
ln["mosaicReverse_fr"] = "Mosaic Reverse";
ln["mosaicRandom_fr"] = "Mosaic Random";
ln["mosaicSpiral_fr"] = "Mosaic Spiral";
ln["mosaicSpiralReverse_fr"] = "Mosaic Spiral Reverse";
ln["topLeftBottomRight_fr"] = "Top Left Bottom Right";
ln["bottomRightTopLeft_fr"] = "Bottom Right Top Left";
ln["bottomLeftTopRight_fr"] = "Bottom Left Top Right";
//ln["bottomLeftTopRight_fr"] = "Bottom Left Top Right";
ln["scrollLeft_fr"] = "Scroll Left";
ln["scrollRight_fr"] = "Scroll Right";
ln["scrollHorz_fr"] = "Scroll Horz";
ln["scrollBottom_fr"] = "Scroll Bottom";
ln["scrollTop_fr"] = "Scroll Top";

ln["x-axis-labelDescription_fr"] = "Le label de l'axe des x.";
ln["y-axis-labelDescription_fr"] = "Le label de l'axe des y.";
ln["suffixDescription_fr"] = "Le suffixe ajouté aux labels des données dans l'aide.";
ln["legendDescription_fr"] = "La position de la légende.";
ln["data-labelsDescription_fr"] = "Montrer/cacher les labels de données.";
ln["themeDescription_fr"] = "Le th\u00e8me affecte l'apparence des couleurs du graphique.";
ln["stackDescription_fr"] = "Le type de regroupement.";
ln["donutDescription_fr"] = "La Tarte va devenir un Donut! :) (ou vice versa).";
ln["mapDescription_fr"] = "Maps for provinces and regions of Italy and Maps for provinces and municipalities in the Campania Region.";

ln["OpenStreetMap_fr"] = "OpenStreetMap";
ln["OpenTopoMap_fr"] = "Topographic Map";
ln["Esri.WorldImagery_fr"] = "Imagery Map";
ln["Esri.WorldStreetMap_fr"] = "World Street Map";
ln["Esri.DeLorme_fr"] = "DeLorme Topographic Map";
ln["Esri.WorldTopoMap_fr"] = "Topographic Map";
ln["Esri.OceanBasemap_fr"] = "Ocean Base Map";
ln["Esri.NatGeoWorldMap_fr"] = "National Geographic Map";
ln["Esri.WorldGrayCanvas_fr"] = "Gray Map";
ln["Stamen.Watercolor_fr"] = "Watercolor Map";
ln["NASAGIBS.ViirsEarthAtNight2012_fr"] = "Night Lights Map";

//Quick guide
//Quick guide
ln["Next_fr"] = "Next";
ln["Back_fr"] = "Back";
ln["Skip_fr"] = "Skip";
ln["Done_fr"] = "Done";

ln["step1_fr"] = "Welcome. This is the first step of the datalet creator wizard.";
ln["step2_fr"] = "First, please select a dataset from the featured list.";
ln["step3_fr"] = "Or, you can search by title the dataset in the featured list.";
ln["step4_fr"] = "Or, you can enter a public dataset URL.";
ln["step5_fr"] = "You can take a look at the metadata of the chosen dataset.";
ln["step6_fr"] = "If the selected dataset is valid, the arrow will be colored and you can go to the next step";
ln["step7_fr"] = "This is the data selection screen.";
ln["step8_fr"] = "Select the columns contain the data you want to display or on which to apply filters or groupings. If you are undecided, click on the \"Fields\" heading to select them all.";
ln["step9_fr"] = "This area will show a preview of selected columns.";
ln["step10_fr"] = "You can apply filters and / or groupings to the dataset, by clicking on the right.";
ln["step11_fr"] = "Once your selection is done, click the arrow to proceed to the next step.";
ln["step12_fr"] = "This is the visualization creation screen.";
ln["step13_fr"] = "Search or select the type of datalet you want to create.";
ln["step14_fr"] = "Please select columns containing data to be visualized. Almost every datalet require you to fill at least the first two fields in order to show a preview.";
ln["step15_fr"] = "Use the “Options” area to customize the visualization by adding labels or changing the visual theme.";
ln["step16_fr"] = "Give a title and, optionally, a description.";
ln["step17_fr"] = "Once you have selected the minimum number of columns required by the selected datalet, this area will show a preview. The preview is refreshed whenever you change any setting in this screen.";
ln["step18_fr"] = "Select this tab for information on the selected graph (input values, options).";
ln["step19_fr"] = "If you are satisfied of the visualization, you can share the datalet by clicking the “Add” button.";

/******** NL ********/

//PAGE SLIDER

ln["slide1Title_nl"] = "SELECT DATASET";
ln["slide1Subtitle_nl"] = "Select a dataset from the list or copy and paste the url of dataset.";
ln["slide2Title_nl"] = "SELECT DATA";
ln["slide2Subtitle_nl"] = "Select the fields on the left. The table will show the values related to the selected fields.";
ln["slide3Title_nl"] = "SELECT VISUALIZATION";
ln["slide3Subtitle_nl"] = "Select a visualization, fill out inputs and options.";
ln["back_nl"] = "BACK";
ln["forward_nl"] = "FORWARD";
//SPLOD
ln["SPLODslide1Title_nl"] = "CREATE DATASET";
ln["SPLODslide1Subtitle_nl"] = "Select an endpoint and create your dataset.";

//SELECT DATASET

ln["selectedUrl_nl"] = "Selected url";
ln["wrongUrl_nl"] = "Invalid url or data provider not supported yet.";

ln["providersDatasets_nl"] = "PROVIDERS DATASETS";
ln["spodUsersDatasets_nl"] = "COCREATED DATASETS";
ln["extendedDatasets_nl"] = "FROM EXTENDED SEARCH";
ln["datasets_nl"] = "DATASETS LIST";

ln["provider_nl"] = "Provider";
ln["all_nl"] = "All";
ln["allDescription_nl"] = "Shows the datasets of all associated providers.";
ln["providerName_nl"] = "Provider";
ln["providerNameDescription_nl"] = "Shows only the datasets of the selected provider.";

ln["search_nl"] = "Search";
ln["standard_nl"] = "Standard";
ln["standardDescription_nl"] = "The search function works only on datasets names.";
ln["extended_nl"] = "Extended [NOT AVAILABLE]";
ln["extendedDescription_nl"] = "The search function works the entire contents of the datasets.";

ln["version_nl"] = "Version";
ln["showLast_nl"] = "Show last";
ln["showLastDescription_nl"] = "Shows only the latest version of the datasets.";
ln["showAll_nl"] = "Show all";
ln["showAllDescription_nl"] = "Shows all versions of the datasets.";

//select-dataset-controllet
ln["datasetsInfo_nl"] = "DATASET INFO";
ln["showing_nl"] = "Showing";
ln["to_nl"] = "to";
ln["of_nl"] = "of";
ln["datasetsRows_nl"] = "dataset";
ln["search_nl"] = "Search";

//metadata
ln["room_nl"] = "Room";
ln["resourceName_nl"] = "Resource Name";
ln["resourceDescription_nl"] = "Resource Description";
ln["users_nl"] = "Users";

//SELECT DATA

//select-fields
ln["fields_nl"] = "FIELDS";

//data-table
ln["selectedData_nl"] = "SELECTED DATA";
ln["showing_nl"] = "Showing";
ln["to_nl"] = "to";
ln["of_nl"] = "of";
ln["rows_nl"] = "rows";
ln["type_nl"] = "TYPE";
ln["warning_nl"] = "WARNING";

//expert
ln["expert_nl"] = "EXPERT MODE";
ln["filters_nl"] = "FILTERS";
ln["groupBy_nl"] = "GROUP BY";
ln["query_nl"] = "QUERY";

//filters
ln["filterField_nl"] = "Field";
ln["filterOperation_nl"] = "Operation";
ln["filterValue_nl"] = "Value";

ln["disableFilters_nl"] = "DISABLE FILTERS";
ln["enableFilters_nl"] = "ENABLE FILTERS";

ln["=_nl"] = "=";   //is equal to
ln["!=_nl"] = "not =";  //is not equal to
ln[">_nl"] = ">";   //is greater than
ln[">=_nl"] = ">="; //is greater than or equal to
ln["<_nl"] = "<";   //is less than
ln["<=_nl"] = "<="; //is less than or equal to
ln["contains_nl"] = "contains";
ln["notContains_nl"] = "not contains";
ln["start_nl"] = "start with";
ln["notStart_nl"] = "does not start with";
ln["ends_nl"] = "ends with";
ln["notEnds_nl"] = "does not ends with";
ln["isNotNull_nl"] = "is not null";
ln["isNull_nl"] = "is null";

//aggregators
ln["GROUP BY_nl"] = "GROUP BY";
ln["CALCULATE_nl"] = "CALCULATE";
ln["Calculate_nl"] = "Calculate";
ln["aggregatorField_nl"] = "Field";

ln["disableGroupBy_nl"] = "DISABLE GROUP BY";
ln["enableGroupBy_nl"] = "ENABLE GROUP BY";

ln["COUNT_nl"] = "COUNT of";
ln["SUM_nl"] = "SUM of";
ln["MIN_nl"] = "MIN of";
ln["MAX_nl"] = "MAX of";
ln["AVG_nl"] = "AVG of";
ln["FIRST_nl"] = "FIRST of";
ln["LAST_nl"] = "LAST of";

//SELECT VISUALIZATION

ln["addDatalet_nl"] = "ADD";
ln["modifyDatalet_nl"] = "MODIFY";

//datalet-preview
ln["previewTab_nl"] = "DATALET PREVIEW";
ln["infoTab_nl"] = "DATALET INFO";

//select-inputs
ln["baseInfo_nl"] = "BASE INFO";
ln["inputs_nl"] = "INPUTS";
ln["options_nl"] = "OPTIONS";

//vslider
ln["search_nl"] = "Search";

ln["datatable_nl"] = "Table";
ln["barchart_nl"] = "Bar Chart";
ln["columnchart_nl"] = "Column Chart";
ln["areachart_nl"] = "Area Chart";
ln["linechart_nl"] = "Line Chart";
ln["heatmap_nl"] = "Heat Map";
ln["piechart_nl"] = "Pie Chart";
ln["pyramidchart_nl"] = "Pyramid Chart";
ln["funnelchart_nl"] = "Funnel Chart";
ln["wordcloud_nl"] = "Word Cloud";
ln["spiderchart_nl"] = "Spider Chart";
ln["polarchart_nl"] = "Polar Chart";
ln["scatterchart_nl"] = "Scatter Chart";
ln["bubblechart_nl"] = "Bubble Chart";
ln["treemap_nl"] = "Tree Map";
ln["timeline_nl"] = "Timeline";
ln["mediaslider_nl"] = "Media Slider";
ln["leafletjs_nl"] = "Map";
ln["leafletjs-geojson_nl"] = "Geojson Map";
ln["audioslider_nl"] = "Audio Slider";
ln["italymap_nl"] = "Italy Map";
ln["europemap_nl"] = "European Map"

ln["datatableDescription_nl"] = "A table is a means of arranging data in rows and columns.";
ln["barchartDescription_nl"] = "A bar chart is a chart that presents grouped data with rectangular bars plotted horizontally with lengths proportional to the values that they represent.";
ln["columnchartDescription_nl"] = "A column chart is a chart that presents grouped data with rectangular bars plotted vertically with lengths proportional to the values that they represent.";
ln["areachartDescription_nl"] = "An area chart is a chart which displays graphically quantitive data. The area between axis and line are emphasized with colors and textures. Commonly one compares with the area chart two or more quantities.";
ln["linechartDescription_nl"] = "A line chart is chart which displays information as a series of data points called 'markers' connected by straight line segments. A line chart is often used to visualize a trend in data over intervals of time.";
ln["heatmapDescription_nl"] = "A heat map is a graphical representation of data where the individual values contained in a matrix are represented as colors.";
ln["piechartDescription_nl"] = "A pie chart is a circular statistical graphic, which is divided into slices to illustrate numerical proportion. In the pie chart, the arc length of each slice, and consequently its central angle and area, is proportional to the quantity it represents.";
ln["scatterchartDescription_nl"] = "A scatter chart is a type of plot or mathematical diagram using Cartesian coordinates to display values for typically two variables for a set of data. The data is displayed as a collection of points, each having the value of one variable determining the position on the horizontal axis and the value of the other variable determining the position on the vertical axis.";
ln["bubblechartDescription_nl"] = "A bubble chart is a type of chart that displays three dimensions of data. Each entity with its triplet (v1, v2, v3) of associated data is plotted as a disk that expresses two of the vi values through the disk's xy location and the third through its size.";
ln["treemapDescription_nl"] = "A tree map is a chart for displaying hierarchical data by using nested rectangles.";
ln["timelineDescription_nl"] = "The timeline is an interactive visualization chart to visualize data in time. The data items can take place on a single date, or have a start and end date (a range). You can freely move and zoom in the timeline. The time scale on the axis is adjusted automatically, and supports scales ranging from milliseconds to years.";
ln["mediasliderDescription_nl"] = "The mediaslider is a slider of media.";
ln["leafletjsDescription_nl"] = "";
ln["leafletjs-geojsonDescription_nl"] = "";
ln["audiosliderDescription_nl"] = "";
ln["italymapDescription_nl"] = "";

//inputs
ln["title_nl"] = "Title"
ln["description_nl"] = "Description";

ln["required_nl"] = "Verplicht veld";

ln["sortAscending_nl"] = "SORTED ASCENDING";
ln["sortDescending_nl"] = "SORTED DESCENDING";
ln["unsort_nl"] = "UNSORTED";

ln["TITLE_nl"] = "TITLE";
ln["DESCRIPTION_nl"] = "DESCRIPTION";
ln["XAxis_nl"] = "X-AXIS";
ln["YAxis_nl"] = "Y-AXIS";
ln["NumericXAxis_nl"] = "X-AXIS";
ln["NumericYAxis_nl"] = "Y-AXIS";
ln["Column_nl"] = "COLUMN";
ln["Level_nl"] = "LEVEL";
ln["SliceLabels_nl"] = "LABEL";
ln["SliceSizes_nl"] = "SIZE";
ln["StartDate_nl"] = "START DATE";
ln["EndDate_nl"] = "END DATE";
ln["EventTitle_nl"] = "EVENT TITLE";
ln["EventDescription_nl"] = "EVENT DESCRIPTION";
ln["MediaUrl_nl"] = "MEDIA URL";
ln["Background_nl"] = "BACKGROUND";
ln["MediaTitle_nl"] = "MEDIA TITLE";
ln["MediaDescription_nl"] = "MEDIA DESCRIPTION";
ln["Latitude_nl"] = "LATITUDE";
ln["Longitude_nl"] = "LONGITUDE";
ln["BalloonContent_nl"] = "BALLOON CONTENT";
ln["GEOJSON_nl"] = "GEOJSON";
ln["GEOJSONContent_nl"] = "GEOJSON CONTENT";
ln["BubbleContent_nl"] = "BUBBLE CONTENT";
ln["BubbleSize_nl"] = "BUBBLE SIZE";
ln["Categories_nl"] = "CATEGORY";
ln["AudioUrl_nl"] = "AUDIO URL";
ln["AudioTiming_nl"] = "AUDIO TIMING";
ln["ImageUrl_nl"] = "IMAGE URL";
ln["AudioDescription_nl"] = "AUDIO DESCRIPTION";
ln["Area_nl"] = "AREA";
ln["Value_nl"] = "VALUE";
ln["TooltipContent_nl"] = "TOOLTIP CONTENT";

ln["TITLEDescription_nl"] = "The datalet title.";
ln["DESCRIPTIONDescription_nl"] = "The datalet description.";
ln["XAxisDescription_nl"] = "The x-axis.";
ln["YAxisDescription_nl"] = "The y-axis.";
ln["NumericXAxisDescription_nl"] = "The x-axis.";
ln["NumericYAxisDescription_nl"] = "The y-axis.";
ln["ColumnDescription_nl"] = "The column of the table.";
ln["LevelDescription_nl"] = "The level of the tree map.";
ln["SliceLabelsDescription_nl"] = "The label of the slices.";
ln["SliceSizesDescription_nl"] = "The size of the slices.";
ln["StartDateDescription_nl"] = "The start date of the event. A string representing an RFC2822 or ISO 8601 date (e.g. 2015-03-25, 03/25/2015, Mar 25 2015, 25 Mar 2015, Wednesday March 25 2015) or a single number rapresenting the year (e.g. 2017, 7, -150) or a roman number rapresenting centuries using 'bc', 'b.c.', 'bce' or 'b.c.e.' to discern Before Christ/Before Common Era centuries (e.g. IV, X bce, III b.c). Other formats may be used, but results may be unexpected.";
ln["EndDateDescription_nl"] = "The end date of the event (see start date).";
ln["EventTitleDescription_nl"] = "The title of the event.";
ln["EventDescriptionDescription_nl"] = "The description of the event.";
ln["MediaUrlDescription_nl"] = "The url of the media.";
ln["BackgroundDescription_nl"] = "The fully-qualified URL pointing to an image which will be used as the background or a CSS color, in hexadecimal (e.g. #0f9bd1) or a valid CSS color keyword.";
ln["MediaTitleDescription_nl"] = "The title of the media.";
ln["MediaDescriptionDescription_nl"] = "The description of the media.";
ln["LatitudeDescription_nl"] = "The latitude of locations.";
ln["LongitudeDescription_nl"] = "The longitude of locations.";
ln["BalloonContentDescription_nl"] = "The content of balloons.";
ln["GEOJSONDescription_nl"] = "The GeoJSON data.";
ln["GEOJSONContentDescription_nl"] = "The content of GeoJSON.";
ln["BubbleContentDescription_nl"] = "The content of bubbles.";
ln["BubbleSizeDescription_nl"] = "The size of bubbles.";
ln["CategoriesDescription_nl"] = "The category that splits the y-axis values. If selected only the first selected y-axis will be considered.";
ln["AudioUrlDescription_nl"] = " ";
ln["AudioTimingDescription_nl"] = " ";
ln["ImageUrlDescription_nl"] = " ";
ln["AudioDescriptionDescription_nl"] = " ";
ln["AreaDescription_nl"] = " ";
ln["ValueDescription_nl"] = " ";
ln["TooltipContentDescription_nl"] = " ";

//options
ln["x-axis-label_nl"] = "X Axis Label";
ln["y-axis-label_nl"] = "Y Axis Label";
ln["suffix_nl"] = "Tooltip Suffix";
ln["legend_nl"] = "Legend";
ln["data-labels_nl"] = "Show Data Labels";
ln["stack_nl"] = "Stack";
ln["theme_nl"] = "Theme";
ln["donut_nl"] = "Donut";
ln["date-format_nl"] = "DATE FORMAT";
ln["animation_nl"] = "Animatie";
ln["animationDescription_nl"]= "Choose animation for the catalog.";

ln["map_nl"] = "Map";
ln["1_italyRegion_nl"] = "Italy - Regions";
ln["2_italyProvince_nl"] = "Italy - Province";
ln["3_campaniaProvince_nl"] = "Campania - Province";
ln["4_campaniaMunicipality_nl"] = "Campania - Municipality";

ln["layer_nl"] = "Layer";
ln["layerDescription_nl"] = "Choose a layer";

ln["true_nl"] = "Yes";
ln["false_nl"] = "No";
ln["bottom_nl"] = "Yes: Bottom";
ln["topRight_nl"] = "Yes: Top Right";
ln["normal_nl"] = "Yes: Normal";
ln["percent_nl"] = "Yes: Percent";
ln["themeBase_nl"] = "Base";
ln["themeDarkGreen_nl"] = "Dark Green";
ln["themeDarkBlue_nl"] = "Dark Blue";
ln["themeDarkUnica_nl"] = "Dark Unika";
ln["themeGray_nl"] = "Gray";
ln["themeGrid_nl"] = "Grid";
ln["themeGridLight_nl"] = "Grid Light";
ln["themeSandSignika_nl"] = "Sand Signika";
ln["themeSkies_nl"] = "Skies";
ln["MDY_nl"] = "Month-Day-Year";
ln["DMY_nl"] = "Day-Month-Year";
ln["random_nl"] = "Random";
ln["simpleFade_nl"] = "Simple Fade";
ln["curtainTopLeft_nl"] = "Curtain Top Left";
ln["curtainTopRight_nl"] = "Curtain Top Right";
ln["curtainBottomLeft_nl"] = "Curtain Bottom Left";
ln["curtainBottomRight_nl"] = "Curtain Bottom Right";
ln["curtainSliceLeft_nl"] = "Curtain Slice Left";
ln["curtainSliceRight_nl"] = "Curtain Slice Right";
ln["blindCurtainTopLeft_nl"] = "Blind Curtain Top Left";
ln["blindCurtainTopRight_nl"] = "Blind Curtain Top Right";
ln["blindCurtainBottomLeft_nl"] = "Blind Curtain Bottom Left";
ln["blindCurtainBottomRight_nl"] = "Blind Curtain Bottom Right";
ln["blindCurtainSliceBottom_nl"] = "Blind Curtain Slice Bottom";
ln["blindCurtainSliceTop_nl"] = "Blind Curtain Slice Top";
ln["stampede_nl"] = "Stampede";
ln["mosaic_nl"] = "Mosaic";
ln["mosaicReverse_nl"] = "Mosaic Reverse";
ln["mosaicRandom_nl"] = "Mosaic Random";
ln["mosaicSpiral_nl"] = "Mosaic Spiral";
ln["mosaicSpiralReverse_nl"] = "Mosaic Spiral Reverse";
ln["topLeftBottomRight_nl"] = "Top Left Bottom Right";
ln["bottomRightTopLeft_nl"] = "Bottom Right Top Left";
ln["bottomLeftTopRight_nl"] = "Bottom Left Top Right";
//ln["bottomLeftTopRight_nl"] = "Bottom Left Top Right";
ln["scrollLeft_nl"] = "Scroll Left";
ln["scrollRight_nl"] = "Scroll Right";
ln["scrollHorz_nl"] = "Scroll Horz";
ln["scrollBottom_nl"] = "Scroll Bottom";
ln["scrollTop_nl"] = "Scroll Top";

ln["x-axis-labelDescription_nl"] = "The x-axis label.";
ln["y-axis-labelDescription_nl"] = "The y-axis label.";
ln["suffixDescription_nl"] = "The suffix added to data labels in the tooltip.";
ln["legendDescription_nl"] = "The legend position.";
ln["data-labelsDescription_nl"] = "Show/hide data labels.";
ln["themeDescription_nl"] = "The theme affects the appearance and colors of the chart.";
ln["stackDescription_nl"] = "The stack type.";
ln["donutDescription_nl"] = "Pie will become Donut! :) (or viceversa).";
ln["mapDescription_nl"] = "Maps for provinces and regions of Italy and Maps for provinces and municipalities in the Campania Region.";

ln["OpenStreetMap_nl"] = "OpenStreetMap";
ln["OpenTopoMap_nl"] = "Topographic Map";
ln["Esri.WorldImagery_nl"] = "Imagery Map";
ln["Esri.WorldStreetMap_nl"] = "World Street Map";
ln["Esri.DeLorme_nl"] = "DeLorme Topographic Map";
ln["Esri.WorldTopoMap_nl"] = "Topographic Map";
ln["Esri.OceanBasemap_nl"] = "Ocean Base Map";
ln["Esri.NatGeoWorldMap_nl"] = "National Geographic Map";
ln["Esri.WorldGrayCanvas_nl"] = "Gray Map";
ln["Stamen.Watercolor_nl"] = "Watercolor Map";
ln["NASAGIBS.ViirsEarthAtNight2012_nl"] = "Night Lights Map";

//Quick guide

//Quick guide
ln["Next_nl"] = "Next";
ln["Back_nl"] = "Back";
ln["Skip_nl"] = "Skip";
ln["Done_nl"] = "Done";

ln["step1_nl"] = "Welcome. This is the first step of the datalet creator wizard.";
ln["step2_nl"] = "First, please select a dataset from the featured list.";
ln["step3_nl"] = "Or, you can search by title the dataset in the featured list.";
ln["step4_nl"] = "Or, you can enter a public dataset URL.";
ln["step5_nl"] = "You can take a look at the metadata of the chosen dataset.";
ln["step6_nl"] = "If the selected dataset is valid, the arrow will be colored and you can go to the next step";
ln["step7_nl"] = "This is the data selection screen.";
ln["step8_nl"] = "Select the columns contain the data you want to display or on which to apply filters or groupings. If you are undecided, click on the \"Fields\" heading to select them all.";
ln["step9_nl"] = "This area will show a preview of selected columns.";
ln["step10_nl"] = "You can apply filters and / or groupings to the dataset, by clicking on the right.";
ln["step11_nl"] = "Once your selection is done, click the arrow to proceed to the next step.";
ln["step12_nl"] = "This is the visualization creation screen.";
ln["step13_nl"] = "Search or select the type of datalet you want to create.";
ln["step14_nl"] = "Please select columns containing data to be visualized. Almost every datalet require you to fill at least the first two fields in order to show a preview.";
ln["step15_nl"] = "Use the “Options” area to customize the visualization by adding labels or changing the visual theme.";
ln["step16_nl"] = "Give a title and, optionally, a description.";
ln["step17_nl"] = "Once you have selected the minimum number of columns required by the selected datalet, this area will show a preview. The preview is refreshed whenever you change any setting in this screen.";
ln["step18_nl"] = "Select this tab for information on the selected graph (input values, options).";
ln["step19_nl"] = "If you are satisfied of the visualization, you can share the datalet by clicking the “Add” button.";


/******** ES-es ********/

//PAGE SLIDER

ln["slide1Title_es-ES"] = "SELECIONA DATASET";
ln["slide1Subtitle_es-ES"] = "Selecciona un dataset de la lista o copia y pega la url del dataset.";
ln["slide2Title_es-ES"] = "SELECCIONA DATOS";
ln["slide2Subtitle_es-ES"] = "Selecciona los campos de la izquierda. La tabla mostrará los valores relacionados con los campos seleccionados.";
ln["slide3Title_es-ES"] = "SELECCIONA VISUALIZACIÓN";
ln["slide3Subtitle_es-ES"] = "Selecciona una visualización, llene entradas y opciones.";
ln["back_es-ES"] = "ATRAS";
ln["forward_es-ES"] = "ADELANTE";
//SPLOD
ln["SPLODslide1Title_es-ES"] = "CREAR EL DATASET";
ln["SPLODslide1Subtitle_es-ES"] = "Seleccione un endpoint y cree su dataset.";

//SELECT DATASET

ln["selectedUrl_es-ES"] = "Url seleccionada";
ln["wrongUrl_es-ES"] = "Url o proveedor de datos no soportado todavía.";

ln["providersDatasets_es-ES"] = "DESDE PROVEEDORES";
ln["spodUsersDatasets_es-ES"] = "DESDE COCREADOS";
ln["extendedDatasets_es-ES"] = "DESDE BÚSQUEDA";
ln["datasets_es-ES"] = "LISTA DE DATASETS";

ln["provider_es-ES"] = "Proveedor";
ln["all_es-ES"] = "Todos";
ln["allDescription_es-ES"] = "Muestra los conjuntos de datos de todos los proveedores asociados.";
ln["providerName_es-ES"] = "Proveedor";
ln["providerNameDescription_es-ES"] = "Muestra sólo los datasets del proveedor seleccionado.";


ln["version_es-ES"] = "Versión";
ln["showLast_es-ES"] = "Mostrar último";
ln["showLastDescription_es-ES"] = "Muestra sólo la última versión de los dataset.";
ln["showAll_es-ES"] = "Mostrar todos";
ln["showAllDescription_es-ES"] = "Muestra todas las versiones de los datasets.";

//select-dataset-controllet
ln["datasetsInfo_es-ES"] = "Información del DATASET";
ln["showing_es-ES"] = "Mostrando";
ln["to_es-ES"] = "a";
ln["of_es-ES"] = "de";
ln["datasetsRows_es-ES"] = "datasets";
ln["search_es-ES"] = "Búsqueda";

//metadata
ln["room_es-ES"] = "Sala";
ln["resourceName_es-ES"] = "Nombre del Recurso";
ln["resourceDescription_es-ES"] = "Descripción del Recurso";
ln["users_es-ES"] = "Usuarios";

//SELECT DATA

//select-fields
ln["fields_es-ES"] = "CAMPOS";

//data-table
ln["selectedData_es-ES"] = "DATOS SELECCIONADOS";
ln["showing_es-ES"] = "Mostrando";
ln["to_es-ES"] = "a";
ln["of_es-ES"] = "de";
ln["rows_es-ES"] = "filas";
ln["type_es-ES"] = "TIPO";
ln["warning_es-ES"] = "ADVERTENCIA";

//expert
ln["expert_es-ES"] = "MODO EXPERTO";
ln["filters_es-ES"] = "FILTROS";
ln["groupBy_es-ES"] = "AGRUPAR POR";
ln["query_es-ES"] = "CONSULTA";

//filters
ln["filterField_es-ES"] = "CAMPO";
ln["filterOperation_es-ES"] = "Operación";
ln["filterValue_es-ES"] = "Valor";

ln["disableFilters_es-ES"] = "DESHABILITAR LOS FILTROS";
ln["enableFilters_es-ES"] = "HABILITAR FILTROS";

ln["=_es-ES"] = "=";   //es igual a
ln["!=_es-ES"] = "not =";  //no es igual a
ln[">_es-ES"] = ">";   //es mayor que
ln[">=_es-ES"] = ">="; //es mayor que o igual a
ln["<_es-ES"] = "<";   //es menos que
ln["<=_es-ES"] = "<="; //es menos que o igual a
ln["contains_es-ES"] = "contiene";
ln["notContains_es-ES"] = "no contiene";
ln["start_es-ES"] = "empieza con";
ln["notStart_es-ES"] = "no empieza con";
ln["ends_es-ES"] = "termina con";
ln["notEnds_es-ES"] = "no termina con";
ln["isNotNull_es-ES"] = "no es nulo";
ln["isNull_es-ES"] = "es nulo";

//aggregators
ln["GROUP BY_es-ES"] = "AGRUPAR POR";
ln["CALCULATE_es-ES"] = "CALCULAR";
ln["Calculate_es-ES"] = "Calcular";
ln["aggregatorField_es-ES"] = "Campo";

ln["disableGroupBy_es-ES"] = "DESHABILITAR GRUPO POR";
ln["enableGroupBy_es-ES"] = "HABILITAR GRUPO POR";

ln["COUNT_es-ES"] = "CUENTA de";
ln["SUM_es-ES"] = "SUMA de";
ln["MIN_es-ES"] = "MIN de";
ln["MAX_es-ES"] = "MAX de";
ln["AVG_es-ES"] = "PROMEDIO de";
ln["FIRST_es-ES"] = "PRIMERO de";
ln["LAST_es-ES"] = "ÚLTIMO de";

//SELECT VISUALIZATION

ln["addDatalet_es-ES"] = "AÑADIR";
ln["modifyDatalet_es-ES"] = "MODIFICAR";

//datalet-preview
ln["previewTab_es-ES"] = "VISTA PREVIA DEL DATALET";
ln["infoTab_es-ES"] = "DATALET INFO";

//select-inputs
ln["baseInfo_es-ES"] = "INFORMACIÓN BASE";
ln["inputs_es-ES"] = "INPUTS";
ln["options_es-ES"] = "OPCIONES";

//vslider
ln["search_es-ES"] = "BUSCAR";

ln["datatable_es-ES"] = "Tabla";
ln["barchart_es-ES"] = "Gráfico de barras";
ln["columnchart_es-ES"] = "Gráfico de columnas";
ln["areachart_es-ES"] = "Gráfico de área";
ln["linechart_es-ES"] = "Gráfico de línea";
ln["heatmap_es-ES"] = "Mapa de calor";
ln["piechart_es-ES"] = "Gráfico circular";
ln["pyramidchart_es-ES"] = "Pyramid Chart";
ln["funnelchart_es-ES"] = "Funnel Chart";
ln["wordcloud_es-ES"] = "Word Cloud";
ln["spiderchart_es-ES"] = "Spider Chart";
ln["polarchart_es-ES"] = "Polar Chart";
ln["scatterchart_es-ES"] = "Gráfico de dispersión";
ln["bubblechart_es-ES"] = "Gráfico de burbujas";
ln["treemap_es-ES"] = "Mapa del árbol";
ln["timeline_es-ES"] = "Línea de tiempo";
ln["mediaslider_es-ES"] = "Deslizador de medios";
ln["leafletjs_es-ES"] = "Mapa";
ln["leafletjs-geojson_es-ES"] = "Mapa Geojson";
ln["audioslider_es-ES"] = "Audio Slider";
ln["italymap_es-ES"] = "Italy Map";
ln["europemap_es-ES"] = "European Map"

ln["datatableDescription_es-ES"] = "Una tabla es un medio de organizar datos en filas y columnas.";
ln["barchartDescription_es-ES"] = "Un gráfico de barras es un gráfico que presenta los datos agrupados con barras rectangulares trazadas horizontalmente con longitudes proporcionales a los valores que representan.";
ln["columnchartDescription_es-ES"] = "Un gráfico de columnas es un gráfico que presenta los datos agrupados con barras rectangulares trazadas verticalmente con longitudes proporcionales a los valores que representan.";
ln["areachartDescription_es-ES"] = "Un gráfico de área es un gráfico que muestra gráficamente datos cuantitativos. El área entre el eje y la línea se enfatiza con colores y texturas. Comúnmente uno compara con el gráfico de área dos o más cantidades.";
ln["linechartDescription_es-ES"] = "Un gráfico de líneas es un gráfico que muestra información como una serie de puntos de datos llamados marcadores conectados por segmentos de línea recta. Un gráfico de línea a menudo se utiliza para visualizar una tendencia en los datos a lo largo de intervalos de tiempo.";
ln["heatmapDescription_es-ES"] = "Un mapa de calor es una representación gráfica de datos donde los valores individuales contenidos en una matriz se representan como colores.";
ln["piechartDescription_es-ES"] = "Un gráfico de sectores es un gráfico estadístico circular, que se divide en porciones para ilustrar proporción numérica. En el gráfico circular, la longitud de arco de cada porción, y consecuentemente su ángulo central y área, es proporcional a la cantidad que representa.";
ln["scatterchartDescription_es-ES"] = "Un gráfico de dispersión es un tipo de diagrama o diagrama matemático que usa coordenadas cartesianas para mostrar valores para dos variables típicas para un dataset. Los datos se muestran como una colección de puntos, teniendo cada uno el valor de una variable que determina la posición en el eje horizontal y el valor de la otra variable que determina la posición en el eje vertical.";
ln["bubblechartDescription_es-ES"] = "Un gráfico de búrbujas es un tipo de gráfico que muestra tres dimensiones de datos. Cada entidad con su triplete (v1, v2, v3) de datos asociados se representa como un disco que expresa dos de los valores vi a través de la ubicación xy del disco y el tercero a través de su tamaño.";
ln["treemapDescription_es-ES"] = "Un mapa de árbol es un gráfico para mostrar datos jerárquicos usando rectángulos anidados.";
ln["timelineDescription_es-ES"] = "La línea de tiempo es un gráfico de visualización interactivo para visualizar los datos en el tiempo. Los elementos de datos pueden tener lugar en una única fecha o tener una fecha de inicio y finalización (un rango). Puede moverse libremente y ampliar la línea de tiempo. La escala de tiempo en el eje se ajusta automáticamente y admite escalas que van desde milisegundos a años.";
ln["mediasliderDescription_es-ES"] = "El mediaslider es un control deslizante de los medios.";
ln["leafletjsDescription_es-ES"] = "";
ln["leafletjs-geojsonDescription_es-ES"] = "";
ln["audiosliderDescription_es-ES"] = "";
ln["italymapDescription_es-ES"] = "";

//inputs
ln["title_es-ES"] = "Título"
ln["description_es-ES"] = "Descripción";

ln["required_es-ES"] = "Campo obligatorio";

ln["sortAscending_es-ES"] = "ORDENADO ASCENDENTEMENTE";
ln["sortDescending_es-ES"] = "ORDENADO DESCENDENTEMENTE";
ln["unsort_es-ES"] = "SIN ORDENAR";

//--> "_" not allowed!
ln["TITLE_es-ES"] = "TÍTULO";
ln["DESCRIPTION_es-ES"] = "DESCRIPCIÓN";
ln["XAxis_es-ES"] = "EJE-X";
ln["YAxis_es-ES"] = "EJE-Y";
ln["NumericXAxis_es-ES"] = "EJE-X";
ln["NumericYAxis_es-ES"] = "EJE-Y";
ln["Column_es-ES"] = "COLUMNA";
ln["Level_es-ES"] = "NIVEL";
ln["SliceLabels_es-ES"] = "NIVEL";
ln["SliceSizes_es-ES"] = "TAMAÑO";
ln["StartDate_es-ES"] = "FECHA DE INICIO";
ln["EndDate_es-ES"] = "FECHA FINAL";
ln["EventTitle_es-ES"] = "TITULO DEL EVENTO";
ln["EventDescription_es-ES"] = "DESCRIPCIÓN DEL EVENTO";
ln["MediaUrl_es-ES"] = "URL DEL MEDIO";
ln["Background_es-ES"] = "ANTECEDENTES";
ln["MediaTitle_es-ES"] = "TÍTULO DEL MEDIO";
ln["MediaDescription_es-ES"] = "DESCRIPCIÓN DEL MEDIO";
ln["Latitude_es-ES"] = "LATITUD";
ln["Longitude_es-ES"] = "LONGITUD";
ln["BalloonContent_es-ES"] = "CONTENIDO DEL GLOBO";
ln["GEOJSON_es-ES"] = "GEOJSON";
ln["GEOJSONContent_es-ES"] = "CONTENIDO DEL GEOJSON";
ln["BubbleContent_es-ES"] = "CONTENIDO DE LA BURBUJA";
ln["BubbleSize_es-ES"] = "TAMAÑO DE LA BURBUJA";
ln["Categories_es-ES"] = "CATEGORÍA";
ln["AudioUrl_es-ES"] = "AUDIO URL";
ln["AudioTiming_es-ES"] = "AUDIO TIMING";
ln["ImageUrl_es-ES"] = "IMAGE URL";
ln["AudioDescription_es-ES"] = "AUDIO DESCRIPTION";
ln["Area_es-ES"] = "AREA";
ln["Value_es-ES"] = "VALUE";
ln["TooltipContent_es-ES"] = "TOOLTIP CONTENT";

ln["TITLEDescription_es-ES"] = "El título del datalet.";
ln["DESCRIPTIONDescription_es-ES"] = "La descripción del datalet.";
ln["XAxisDescription_es-ES"] = "El eje-x.";
ln["YAxisDescription_es-ES"] = "El eje-y.";
ln["NumericXAxisDescription_es-ES"] = "El eje-x.";
ln["NumericYAxisDescription_es-ES"] = "El eje-y.";
ln["ColumnDescription_es-ES"] = "La columna de la tabla.";
ln["LevelDescription_es-ES"] = "El nivel del mapa de árbol.";
ln["SliceLabelsDescription_es-ES"] = "La etiqueta de las porciones.";
ln["SliceSizesDescription_es-ES"] = "El tamaño de las porciones.";
ln["StartDateDescription_es-ES"] = "La fecha de inicio del evento. Una cadena que representa una fecha RFC2822 o ISO 8601 (por ejemplo, 2015-03-25, 25/03/2015, 25 de marzo de 2015, 25 de marzo de 2015, miércoles 25 de marzo de 2015) o un número único que representa el año (por ejemplo, 2017, 7, 150) o un número romano representando siglos usando 'd. C', 'a. C.', para discernir antes de Cristo (por ejemplo, IV, X a. C.). Se pueden usar otros formatos, pero los resultados pueden ser inesperados.";
ln["EndDateDescription_es-ES"] = "La fecha de finalización del evento (ver fecha de inicio).";
ln["EventTitleDescription_es-ES"] = "El título del evento.";
ln["EventDescriptionDescription_es-ES"] = "La descripción del evento.";
ln["MediaUrlDescription_es-ES"] = "La url de los medios.";
ln["BackgroundDescription_es-ES"] = "La URL completa que apunta a una imagen que se utilizará como fondo o un color CSS, en hexadecimal (por ejemplo, # 0f9bd1) o una palabra clave de color CSS válida.";
ln["MediaTitleDescription_es-ES"] = "El título de los medios.";
ln["MediaDescriptionDescription_es-ES"] = "La descripción del medio.";
ln["LatitudeDescription_es-ES"] = "La latitud de las ubicaciones.";
ln["LongitudeDescription_es-ES"] = "La longitud de las ubicaciones.";
ln["BalloonContentDescription_es-ES"] = "El contenido de los globos.";
ln["GEOJSONDescription_es-ES"] = "Los datos GeoJSON.";
ln["GEOJSONContentDescription_es-ES"] = "El contenido de GeoJSON.";
ln["BubbleContentDescription_es-ES"] = "El contenido de las burbujas.";
ln["BubbleSizeDescription_es-ES"] = "El tamaño de las burbujas.";
ln["CategoriesDescription_es-ES"] = "Categoría que divide los valores del eje-x. Si es seleccionado, sólo el primer eje-y elejido será considerado..";
ln["AudioUrlDescription_es-ES"] = " ";
ln["AudioTimingDescription_es-ES"] = " ";
ln["ImageUrlDescription_es-ES"] = " ";
ln["AudioDescriptionDescription_es-ES"] = " ";
ln["AreaDescription_es-ES"] = " ";
ln["ValueDescription_es-ES"] = " ";
ln["TooltipContentDescription_es-ES"] = " ";

//options
ln["x-axis-label_es-ES"] = "Etiqueta del eje-x";
ln["y-axis-label_es-ES"] = "Etiqueta del eje-y";
ln["suffix_es-ES"] = "Sufijo de descripción de herramientas";
ln["legend_es-ES"] = "Leyenda";
ln["data-labels_es-ES"] = "Muestra las etiquitas de los datos";
ln["stack_es-ES"] = "Apilar";
ln["theme_es-ES"] = "Tema";
ln["donut_es-ES"] = "Dona";
ln["date-format_es-ES"] = "DATE FORMAT";
ln["animation_es-ES"] = "Animación";
ln["animationDescription_es-ES"]= "Choose animation for the catalog.";

ln["map_es-ES"] = "Map";
ln["1_italyRegion_es-ES"] = "Italy - Regions";
ln["2_italyProvince_es-ES"] = "Italy - Province";
ln["3_campaniaProvince_es-ES"] = "Campania - Province";
ln["4_campaniaMunicipality_es-ES"] = "Campania - Municipality";

ln["layer_es-ES"] = "Layer";
ln["layerDescription_es-ES"] = "Choose a layer";

ln["true_es-ES"] = "Sí";
ln["false_es-ES"] = "No";
ln["bottom_es-ES"] = "Sí: Abajo";
ln["topRight_es-ES"] = "Sí: arriba a la derecha";
ln["normal_es-ES"] = "Sí: Normal";
ln["percent_es-ES"] = "Sí: Porcentaje";
ln["themeBase_es-ES"] = "Base";
ln["themeDarkGreen_es-ES"] = "Verde oscuro";
ln["themeDarkBlue_es-ES"] = "Azul oscuro";
ln["themeDarkUnica_es-ES"] = "Unika oscuro";
ln["themeGray_es-ES"] = "Gris";
ln["themeGrid_es-ES"] = "Cuadrícula";
ln["themeGridLight_es-ES"] = "Cuadrícula clara";
ln["themeSandSignika_es-ES"] = "Signika arena";
ln["themeSkies_es-ES"] = "Cielos";
ln["MDY_es-ES"] = "Month-Day-Year";
ln["DMY_es-ES"] = "Day-Month-Year";
ln["random_es-ES"] = "Aleatorio";
ln["simpleFade_es-ES"] = "Esfumado sencillo";
ln["curtainTopLeft_es-ES"] = "Cortina Superior Izquierda";
ln["curtainTopRight_es-ES"] = "Cortina Superior Derecha";
ln["curtainBottomLeft_es-ES"] = "Cortina inferior izquierda";
ln["curtainBottomRight_es-ES"] = "Cortina inferior derecha";
ln["curtainSliceLeft_es-ES"] = "Porción de cortina izquierda";
ln["curtainSliceRight_es-ES"] = "Porción de cortina derecha";
ln["blindCurtainTopLeft_es-ES"] = "Cortina oscurecedora superior izquierda";
ln["blindCurtainTopRight_es-ES"] = "Cortina oscurecedora superior derecha";
ln["blindCurtainBottomLeft_es-ES"] = "Cortina oscurecedora inferior izquierda";
ln["blindCurtainBottomRight_es-ES"] = "Cortina oscurecedora inferior derecha";
ln["blindCurtainSliceBottom_es-ES"] = "Cortina oscurecedora porción inferior";
ln["blindCurtainSliceTop_es-ES"] = "Cortina oscurecedora porción superior";
ln["stampede_es-ES"] = "Estampida";
ln["mosaic_es-ES"] = "Mosaico";
ln["mosaicReverse_es-ES"] = "Mosaico Invertido";
ln["mosaicRandom_es-ES"] = "Mosaico Aleatorio";
ln["mosaicSpiral_es-ES"] = "Mosaico Espiral";
ln["mosaicSpiralReverse_es-ES"] = "Mosaico Espiral Invertido";
ln["topLeftBottomRight_es-ES"] = "Arriba a la Izquierda, Abajo a la Derecha";
ln["bottomRightTopLeft_es-ES"] = "Abajo a la Derecha, Arriba a la Izquierda";
ln["bottomLeftTopRight_es-ES"] = "Abajo a la Izquierda, Arriba a la Derecha";
//ln["bottomLeftTopRight_es-ES"] = "Abajo a la Izquierda, Arriba a la Derecha";
ln["scrollLeft_es-ES"] = "Desplazamiento hacia la Izquierda";
ln["scrollRight_es-ES"] = "Desplazamiento hacia la Derecha";
ln["scrollHorz_es-ES"] = "Desplazamiento Horz";
ln["scrollBottom_es-ES"] = "Desplazamiento hacia Abajo";
ln["scrollTop_es-ES"] = "Desplazamiento hacia arriba";

ln["x-axis-labelDescription_es-ES"] = "La etiqueta del eje-x.";
ln["y-axis-labelDescription_es-ES"] = "La etiqueta del eje-y.";
ln["suffixDescription_es-ES"] = "El sufijo agregado a las etiquetas de datos en la información de herramientas.";
ln["legendDescription_es-ES"] = "La posición de la leyenda.";
ln["data-labelsDescription_es-ES"] = "Mostrar/ocultar etiquetas de datos.";
ln["themeDescription_es-ES"] = "El tema afecta la apariencia y los colores del gráfico.";
ln["stackDescription_es-ES"] = "El tipo de pila.";
ln["donutDescription_es-ES"] = "¡El pay se convertirá en dona! :) (o viceversa).";
ln["mapDescription_es-ES"] = "Maps for provinces and regions of Italy and Maps for provinces and municipalities in the Campania Region.";

ln["OpenStreetMap_es-ES"] = "OpenStreetMap";
ln["OpenTopoMap_es-ES"] = "Topographic Map";
ln["Esri.WorldImagery_es-ES"] = "Imagery Map";
ln["Esri.WorldStreetMap_es-ES"] = "World Street Map";
ln["Esri.DeLorme_es-ES"] = "DeLorme Topographic Map";
ln["Esri.WorldTopoMap_es-ES"] = "Topographic Map";
ln["Esri.OceanBasemap_es-ES"] = "Ocean Base Map";
ln["Esri.NatGeoWorldMap_es-ES"] = "National Geographic Map";
ln["Esri.WorldGrayCanvas_es-ES"] = "Gray Map";
ln["Stamen.Watercolor_es-ES"] = "Watercolor Map";
ln["NASAGIBS.ViirsEarthAtNight2012_es-ES"] = "Night Lights Map";

//Quick guide
//Quick guide
ln["Next_es-ES"] = "Next";
ln["Back_es-ES"] = "Back";
ln["Skip_es-ES"] = "Skip";
ln["Done_es-ES"] = "Done";

ln["step1_es-ES"] = "Welcome. This is the first step of the datalet creator wizard.";
ln["step2_es-ES"] = "First, please select a dataset from the featured list.";
ln["step3_es-ES"] = "Or, you can search by title the dataset in the featured list.";
ln["step4_es-ES"] = "Or, you can enter a public dataset URL.";
ln["step5_es-ES"] = "You can take a look at the metadata of the chosen dataset.";
ln["step6_es-ES"] = "If the selected dataset is valid, the arrow will be colored and you can go to the next step";
ln["step7_es-ES"] = "This is the data selection screen.";
ln["step8_es-ES"] = "Select the columns contain the data you want to display or on which to apply filters or groupings. If you are undecided, click on the \"Fields\" heading to select them all.";
ln["step9_es-ES"] = "This area will show a preview of selected columns.";
ln["step10_es-ES"] = "You can apply filters and / or groupings to the dataset, by clicking on the right.";
ln["step11_es-ES"] = "Once your selection is done, click the arrow to proceed to the next step.";
ln["step12_es-ES"] = "This is the visualization creation screen.";
ln["step13_es-ES"] = "Search or select the type of datalet you want to create.";
ln["step14_es-ES"] = "Please select columns containing data to be visualized. Almost every datalet require you to fill at least the first two fields in order to show a preview.";
ln["step15_es-ES"] = "Use the “Options” area to customize the visualization by adding labels or changing the visual theme.";
ln["step16_es-ES"] = "Give a title and, optionally, a description.";
ln["step17_es-ES"] = "Once you have selected the minimum number of columns required by the selected datalet, this area will show a preview. The preview is refreshed whenever you change any setting in this screen.";
ln["step18_es-ES"] = "Select this tab for information on the selected graph (input values, options).";
ln["step19_es-ES"] = "If you are satisfied of the visualization, you can share the datalet by clicking the “Add” button.";

/** (Simplified) CN**/
//PAGE SLIDER - controllet

ln["slide1Title_cn"]="选择数据集";
ln["slide1Subtitle_cn"]="从列表中选择数据集，或复制粘贴数据集的网址";
ln["slide2Title_cn"]="选择数据";
ln["slide2Subtitle_cn"]="左侧区域进行选择，该列表将显示选定区域的相关值";
ln["slide3Title_cn"]="可视化选择";
ln["slide3Subtitle_cn"]="选择一种可视化，填写输入并完成选项";
ln["back_cn"]="返回";
ln["forward_cn"]="前往";

//splod
ln["SPLODslide1Title_cn"] = "CREATE DATASET";
ln["SPLODslide1Subtitle_cn"] = "Select an endpoint and create your dataset.";

//SELECT DATASET

ln["selectedUrl_cn"]="已选网址";
ln["wrongUrl_cn"]="无效的网址或目前尚不支持的数据提供方";

ln["providersDatasets_cn"]="来自提供方";
ln["spodUsersDatasets_cn"]="来自共同创造的";
ln["extendedDatasets_cn"]="来自进一步搜索";
ln["datasets_cn"]="数据集目录";

ln["provider_cn"]="提供方";
ln["all_cn"]="全部";
ln["allDescription_cn"]="显示所有关联提供方的数据集";
ln["providerName_cn"]="提供方";
ln["providerNameDescription_cn"]="仅显示所选提供方的数据集";

//ln["view_cn"]="视图";
//ln["list_cn"]="列表";
//ln["listDescription_cn"]="显示具有经典列表的数据集";
//ln["tree_cn"]="树状图";
//ln["treeDescription_cn"]="显示具有树状图的数据集";

//ln["search_cn"]="搜索";
//ln["standard_cn"]="标准";
//ln["standardDescription_cn"]="搜索功能只适用于搜索数据集名称";
//ln["extended_cn"]="广泛搜索【不适用】";
//ln["extendedDescription_cn"]="搜索功能可以查询数据集全部内容";

ln["version_cn"]="版本";
ln["showLast_cn"]="最后显示";
ln["showLastDescription_cn"]="仅显示数据集的最新版本";
ln["showAll_cn"]="全部显示";
ln["showAllDescription_cn"]="显示数据集的所有版本";

//select-dataset-controllet
ln["datasetsInfo_cn"]="数据集信息";
ln["showing_cn"]="显示";
ln["to_cn"]="到";
ln["of_cn"]="的";
ln["datasetsRows_cn"]="数据集";
ln["search_cn"]="搜索";

//metadata
ln["room_cn"]="空间";
ln["resourceName_cn"]="资源名称";
ln["resourceDescription_cn"]="资源描述";
ln["users_cn"]="用户";

//SELECT DATA

//select-fields
ln["fields_cn"]="区域";

//data-table
ln["selectedData_cn"]="已选数据";
ln["showing_cn"]="显示";
ln["to_cn"]="到";
ln["of_cn"]="的";
ln["rows_cn"]="列";
ln["type_cn"]="分类";
ln["warning_cn"]="提醒";

//expert
ln["expert_cn"]="专家模式";
ln["filters_cn"]="筛选";
ln["groupBy_cn"]="分组";
ln["query_cn"]="查询";

//filters
ln["filterField_cn"]="区域";
ln["filterOperation_cn"]="操作";
ln["filterValue_cn"]="评估";

ln["disableFilters_cn"]="无法筛选";
ln["enableFilters_cn"]="成功筛选";

ln["=_cn"]="等于";
ln["!=_cn"]="不等于";
ln[">=_cn"]="大于";
ln[">_cn"]="大于等于";
ln["<_cn"]="小于";
ln["<=_cn"]="小于等于";
ln["contains_cn"]="包含";
ln["notContains_cn"]="未包含";
ln["start_cn"]="开始";
ln["notStart_cn"]="未开始";
ln["ends_cn"]="结束";
ln["notEnds_cn"]="未结束";
ln["isNotNull_cn"]="不能空白";
ln["isNull_cn"]="空白";

//aggregators
ln["GROUP BY_cn"]="分组";
ln["CALCULATE_cn"]="计算";
ln["Calculate_cn"]="计算";
ln["aggregatorField_cn"]="区域";

ln["disableGroupBy_cn"]="无法分组";
ln["enableGroupBy_cn"]="成功分组";

ln["COUNT_cn"]="计数";
ln["SUM_cn"]="求和";
ln["MIN_cn"]="最小数";
ln["MAX_cn"]="最大数";
ln["AVG_cn"]="平均数";
ln["FIRST_cn"]="第一个";
ln["LAST_cn"]="最后一个";

//SELECT VISUALIZATION

ln["addDatalet_cn"]="添加";
ln["modifyDatalet_cn"]="修改";

//datalet-preview
ln["previewTab_cn"]="数据预览";
ln["infoTab_cn"]="数据信息";

//select-inputs
ln["baseInfo_cn"]="基础信息";
ln["inputs_cn"]="输入";
ln["options_cn"]="选择";

//vslider
ln["search_cn"]="搜索";

ln["datatable_cn"]="表格";
ln["barchart_cn"]="条形图";
ln["columnchart_cn"]="柱状图";
ln["areachart_cn"]="面积图";
ln["linechart_cn"]="折线图";
ln["heatmap_cn"]="热图";
ln["piechart_cn"]="饼状图";
ln["pyramidchart_cn"] = "Pyramid Chart";
ln["funnelchart_cn"] = "Funnel Chart";
ln["wordcloud_cn"] = "Word Cloud";
ln["spiderchart_cn"] = "Spider Chart";
ln["polarchart_cn"] = "Polar Chart";
ln["scatterchart_cn"]="散布图";
ln["bubblechart_cn"]="气泡图";
ln["treemap_cn"]="树状图";
ln["timeline_cn"]="时间轴";
ln["mediaslider_cn"]="媒体滑块";
ln["leafletjs_cn"]="地图";
ln["leafletjs-geojson_cn"]="Geojson地图";
ln["audioslider_cn"]="音频滑块";
ln["italymap_cn"]="意大利地图";

ln["datatableDescription_cn"]="表格是一种按行和列排列数据的方法";
ln["barchartDescription_cn"]="条形图是显示水平绘制的矩形条状的分组数据图，其长度与它们所代表的值成比例。";
ln["columnchartDescription_cn"]="柱状图是显示垂直绘制的矩形条形图的分组数据图，其长度与它们所代表的值成比例。";
ln["areachartDescription_cn"]="面积图是显示图形定量数据的图表，轴和线之间的区域用颜色和纹理强调。通常将两个甚至更多个面积图进行比较。";
ln["linechartDescription_cn"]="折线图是将信息显示为由直线段连接的称为“标记”的一系列数据点的图表，折线图通常用于一段时间内可视化数据趋势。";
ln["heatmapDescription_cn"]="热图是在矩形中用不同颜色表示数值的图表。";
ln["piechartDescription_cn"]="饼状图是将圆形统计图分成很多片来说明数字比例。饼状图中，每切片的弧长，弧长对应的中心角及每切片的面积，都与其代表的数值成比例。";
ln["scatterchartDescription_cn"]="散布图这种数据绘图（或数学图表），使用笛卡尔坐标显示一组有两个变量的数据值。使用点的集合显示数据，每个点都有两个值，可分别确定水平轴和垂直轴上的位置。";
ln["bubblechartDescription_cn"]="气泡图是一种显示三维数据的图表，具有关联数据的三元组（v1，v2，v3）被绘制成气泡，数据可以在气泡中显示，v1，v2分别代表x，y轴的位置，v3表示气泡的大小。";
ln["treemapDescription_cn"]="树状图是使用嵌套矩形显示分层数据的图表。";
ln["timelineDescription_cn"]="时间轴是一个从时间角度显示数据的交互式可视化图表。数据可以在一个时间点上展示，也可以在有开始到结束的时间范围中表示。时间轴可以被自由的放大和移动，且轴上的时间刻度会随之自动调整，其刻度单位支持从毫秒到年。";
ln["mediasliderDescription_cn"]="媒体滑块是媒体的滑块";
ln["leafletjsDescription_cn"]="";
ln["leafletjs-geojsonDescription_cn"]="";
ln["italymapDescription_cn"]="";
ln["audiosliderDescription_cn"]="";
ln["italymapDescription_cn"]="";

//inputs
ln["title_cn"]="标题";
ln["description_cn"]="描述";

ln["required_cn"]="需要";

ln["sortAscending_cn"]="升序排序";
ln["sortDescending_cn"]="降序排序";
ln["unsort_cn"]="未分类的";

//-->";"_" not allowed!"
ln["TITLE_cn"]="标题";
ln["DESCRIPTION_cn"]="描述";
ln["XAxis_cn"]="x轴";
ln["YAxis_cn"]="y轴";
ln["NumericXAxis_cn"]="x轴";
ln["NumericYAxis_cn"]="y轴";
ln["Column_cn"]="行";
ln["Level_cn"]="层";
ln["SliceLabels_cn"]="标签";
ln["SliceSizes_cn"]="尺寸";
ln["StartDate_cn"]="开始日期";
ln["EndDate_cn"]="结束日期";
ln["EventTitle_cn"]="活动标题";
ln["EventDescription_cn"]="活动描述";
ln["MediaUrl_cn"]="媒体网址";
ln["Background_cn"]="背景";
ln["MediaTitle_cn"]="媒体标题";
ln["MediaDescription_cn"]="媒体描述";
ln["Latitude_cn"]="纬度";
ln["Longitude_cn"]="经度";
ln["BalloonContent_cn"]="气球内容";
ln["GEOJSON_cn"]="GEOJSON";
ln["GEOJSONContent_cn"]="GEOJSON内容";
ln["BubbleContent_cn"]="气泡内容";
ln["BubbleSize_cn"]="气泡大小";
ln["Categories_cn"]="类别";
ln["AudioUrl_cn"]="音频网址";
ln["AudioTiming_cn"]="音频时长";
ln["ImageUrl_cn"]="图片网址";
ln["AudioDescription_cn"]="音频描述";
ln["Area_cn"]="领域";
ln["Value_cn"]="值";
ln["TooltipContent_cn"]="工具内容";

ln["TITLEDescription_cn"]="数据集标题";
ln["DESCRIPTIONDescription_cn"]="数据集描述";
ln["XAxisDescription_cn"]="x轴";
ln["YAxisDescription_cn"]="y轴";
ln["NumericXAxisDescription_cn"]="x轴";
ln["NumericYAxisDescription_cn"]="y轴";
ln["ColumnDescription_cn"]="表格的一栏";
ln["LevelDescription_cn"]="树状图的层级";
ln["SliceLabelsDescription_cn"]="切片的标签";
ln["SliceSizesDescription_cn"]="切片的大小";
ln["StartDateDescription_cn"]="活动的开始日期，表示RFC2822或ISO 8601日期的字符串（例如2015-03-25,03 / 25/2015，2015年3月25日，2015年3月25日，星期三）或表示年份的单个数字（例如2017，7， - 150）或用'bc'，'bc'，'bce'或'bce'表示世纪的罗马数字，辨别基督前/前共同时代（例如IV, X bce, III b.c）。也可以用其他的格式表示，但结果可能是出乎预料的。";
ln["EndDateDescription_cn"]="活动结束日期（见开始日期）";
ln["EventTitleDescription_cn"]="活动标题";
ln["EventDescriptionDescription_cn"]="活动描述";
ln["MediaUrlDescription_cn"]="媒体网址";
ln["BackgroundDescription_cn"]="完全限定的网址指向将被用作背景或CSS颜色的图像，使用十六进制（例如#0f9bd1）或有效的CSS有颜色的关键字。";
ln["MediaTitleDescription_cn"]="媒体的标题";
ln["MediaDescriptionDescription_cn"]="媒体的描述";
ln["LatitudeDescription_cn"]="位置的纬度";
ln["LongitudeDescription_cn"]="位置的经度";
ln["BalloonContentDescription_cn"]="气球的内容";
ln["GEOJSONDescription_cn"]="GeoJSON数据";
ln["GEOJSONContentDescription_cn"]="GeoJSON内容";
ln["BubbleContentDescription_cn"]="气泡的内容";
ln["BubbleSizeDescription_cn"]="气泡的大小";
ln["CategoriesDescription_cn"]="这种分类将y轴的值分离。如果选择此项，则仅考虑第一个选择的y轴。";
ln["AudioUrlDescription_cn"]=" ";
ln["AudioTimingDescription_cn"]=" ";
ln["ImageUrlDescription_cn"]=" ";
ln["AudioDescriptionDescription_cn"]=" ";
ln["AreaDescription_cn"]=" ";
ln["ValueDescription_cn"]=" ";
ln["TooltipContentDescription_cn"]=" ";

//options
ln["x-axis-label_cn"]="x轴标签";
ln["y-axis-label_cn"]="y轴标签";
ln["suffix_cn"]="工具提示后缀";
ln["legend_cn"]="图例";
ln["data-labels_cn"]="显示数据标签";
ln["stack_cn"]="堆栈";
ln["theme_cn"]="主题";
ln["donut_cn"]="圆环图";
ln["date-format_cn"]="日期格式";
ln["animation_cn"]="动画";
ln["animationDescription_cn"]= "Choose animation for the catalog.";

ln["map_cn"]="地图";
ln["1_italyRegion_cn"]="意大利地区";
ln["2_italyProvince_cn"]="意大利省";
ln["3_campaniaProvince_cn"]="坎帕尼亚省";
ln["4_campaniaMunicipality_cn"]="坎帕尼亚市";

ln["layer_cn"] = "Layer";
ln["layerDescription_cn"] = "Choose a layer";

ln["true_cn"]="是";
ln["false_cn"]="否";
ln["bottom_cn"]="是：底部";
ln["topRight_cn"]="是：右上角";
ln["normal_cn"]="是：正常";
ln["percent_cn"]="是：百分比";
ln["themeBase_cn"]="基础";
ln["themeDarkGreen_cn"]="深绿";
ln["themeDarkBlue_cn"]="深蓝";
ln["themeDarkUnica_cn"]="";
ln["themeGray_cn"]="灰色";
ln["themeGrid_cn"]="网格";
ln["themeGridLight_cn"]="";
ln["themeSandSignika_cn"]="";
ln["themeSkies_cn"]="";
ln["MDY_cn"]="月-日-年";
ln["DMY_cn"]="日-月-年";
ln["random_cn"]="随机";
ln["simpleFade_cn"]="简单淡化";
ln["curtainTopLeft_cn"]="";
ln["curtainTopRight_cn"]="";
ln["curtainBottomLeft_cn"]="";
ln["curtainBottomRight_cn"]="";
ln["curtainSliceLeft_cn"]="";
ln["curtainSliceRight_cn"]="";
ln["blindCurtainTopLeft_cn"]="";
ln["blindCurtainTopRight_cn"]="";
ln["blindCurtainBottomLeft_cn"]="";
ln["blindCurtainBottomRight_cn"]="";
ln["blindCurtainSliceBottom_cn"]="";
ln["blindCurtainSliceTop_cn"]="";
ln["stampede_cn"]="";
ln["mosaic_cn"]="马赛克";
ln["mosaicReverse_cn"]="反向马赛克";
ln["mosaicRandom_cn"]="随机马赛克";
ln["mosaicSpiral_cn"]="旋转马赛克";
ln["mosaicSpiralReverse_cn"]="反向旋转马克";
ln["topLeftBottomRight_cn"]="左上右下";
ln["bottomRightTopLeft_cn"]="右下左上";
ln["bottomLeftTopRight_cn"]="左下右上";
//ln["bottomLeftTopRight_cn"]="左下右上";
ln["scrollLeft_cn"]="向左滑动";
ln["scrollRight_cn"]="向右滑动";
ln["scrollHorz_cn"]="水平滑动";
ln["scrollBottom_cn"]="滑到底部";
ln["scrollTop_cn"]="滑到顶部";

ln["x-axis-labelDescription_cn"]="x轴标签";
ln["y-axis-labelDescription_cn"]="y轴标签";
ln["suffixDescription_cn"]="添加到工具提示中的数据标签的后缀";
ln["legendDescription_cn"]="图例的位置";
ln["data-labelsDescription_cn"]="显示/隐藏数据标签";
ln["themeDescription_cn"]="主题影响图表的外观和颜色";
ln["stackDescription_cn"]="堆栈种类";
ln["donutDescription_cn"]="饼状图将会变成圆环图！（反之亦然）";
ln["mapDescription_cn"]="";

ln["OpenStreetMap_cn"] = "OpenStreetMap";
ln["OpenTopoMap_cn"] = "Topographic Map";
ln["Esri.WorldImagery_cn"] = "Imagery Map";
ln["Esri.WorldStreetMap_cn"] = "World Street Map";
ln["Esri.DeLorme_cn"] = "DeLorme Topographic Map";
ln["Esri.WorldTopoMap_cn"] = "Topographic Map";
ln["Esri.OceanBasemap_cn"] = "Ocean Base Map";
ln["Esri.NatGeoWorldMap_cn"] = "National Geographic Map";
ln["Esri.WorldGrayCanvas_cn"] = "Gray Map";
ln["Stamen.Watercolor_cn"] = "Watercolor Map";
ln["NASAGIBS.ViirsEarthAtNight2012_cn"] = "Night Lights Map";

//Quick guide
//Quick guide
ln["Next_cn"] = "Next";
ln["Back_cn"] = "Back";
ln["Skip_cn"] = "Skip";
ln["Done_cn"] = "Done";

ln["step1_cn"] = "Welcome. This is the first step of the datalet creator wizard.";
ln["step2_cn"] = "First, please select a dataset from the featured list.";
ln["step3_cn"] = "Or, you can search by title the dataset in the featured list.";
ln["step4_cn"] = "Or, you can enter a public dataset URL.";
ln["step5_cn"] = "You can take a look at the metadata of the chosen dataset.";
ln["step6_cn"] = "If the selected dataset is valid, the arrow will be colored and you can go to the next step";
ln["step7_cn"] = "This is the data selection screen.";
ln["step8_cn"] = "Select the columns contain the data you want to display or on which to apply filters or groupings. If you are undecided, click on the \"Fields\" heading to select them all.";
ln["step9_cn"] = "This area will show a preview of selected columns.";
ln["step10_cn"] = "You can apply filters and / or groupings to the dataset, by clicking on the right.";
ln["step11_cn"] = "Once your selection is done, click the arrow to proceed to the next step.";
ln["step12_cn"] = "This is the visualization creation screen.";
ln["step13_cn"] = "Search or select the type of datalet you want to create.";
ln["step14_cn"] = "Please select columns containing data to be visualized. Almost every datalet require you to fill at least the first two fields in order to show a preview.";
ln["step15_cn"] = "Use the “Options” area to customize the visualization by adding labels or changing the visual theme.";
ln["step16_cn"] = "Give a title and, optionally, a description.";
ln["step17_cn"] = "Once you have selected the minimum number of columns required by the selected datalet, this area will show a preview. The preview is refreshed whenever you change any setting in this screen.";
ln["step18_cn"] = "Select this tab for information on the selected graph (input values, options).";
ln["step19_cn"] = "If you are satisfied of the visualization, you can share the datalet by clicking the “Add” button.";

/**** CREATOR ****/

/** EN **/

ln["btn_share_en"] = "Share";
ln["btn_download_en"] = "Save As...";
ln["btn_embed_en"] = "Click to Copy HTML";
ln["btn_fullscreen_en"] = "Fullscreen";

ln["btn_png_en"] = "Save as Image (.png)";
ln["btn_doc_en"] = "Save as Document (.docx)";
ln["btn_csv_en"] = "Save Dataset (.csv)";

ln["label_fb_en"] = "Share on Facebook";
ln["label_tw_en"] = "Share on Twitter";
ln["label_li_en"] = "Share on LinkedIn";
ln["label_pn_en"] = "Share on Pinterest";
ln["label_ml_en"] = "Send Mail";

ln["fb1_en"] = "This visualization does not yet support sharing on Facebook.";
ln["fb2_en"] = "The image of the visualization will be downloaded and descriptive text will be copied in clipboard to speed up and simplify publication on Facebook.";

/** IT **/

ln["btn_share_it"] = "Condividi";
ln["btn_download_it"] = "Salva come...";
ln["btn_embed_it"] = "Clicca per copiare l'HTML";
ln["btn_fullscreen_it"] = "Tutto schermo";

ln["btn_png_it"] = "Salva come immagine (.png)";
ln["btn_doc_it"] = "Salva come documento (.docx)";
ln["btn_csv_it"] = "Salva dataset (.csv)";

ln["label_fb_it"] = "Condividi su Facebook";
ln["label_tw_it"] = "Condividi su Twitter";
ln["label_li_it"] = "Condividi su LinkedIn";
ln["label_pn_it"] = "Condividi suShare on Pinterest";
ln["label_ml_it"] = "Invia Mail";

ln["fb1_it"] = "Questa visualizzazione non supporta ancora la condivisione su Facebook.";
ln["fb2_it"] = "Verr\u00e0 scaricata l'immagine della visualizzazione e sar\u00e0 copiato del testo descrittivo negli appunti per velocizzare e semplificare la pubblicazione su Facebook.";


//logtimeline english lan
ln["timeline_en"] = "logtimeline-datalet";

ln["Start Date"] = "StartDate";
ln["StartDatedescription_en"] = "Event Start Date";

ln["End Date"] = "EndDate";
ln["EndDatedescription_en"] = "Event End Date";

ln["Event Title"] = "EventTitle";
ln["EventTitledescription_en"] = "Name of the event";

ln["Event Description"] = "EventDescription";
ln["EventDescriptiondescription_en"] = "Event Description";

ln["MediaUrl"] = "MediaUrl";
ln["MediaUrldescription_en"] = "Url of video/image";

ln["Background"] = "Background";
ln["Backgrounddescription_en"] = "Url of background image";

ln["Start Time"] = "StartTime";
ln["StartTimedescription_en"] = "Event start time";

ln["Finish Time"] = "FinishTime";
ln["FinishTimedescription_en"] = "Event end time";

ln["Event info 1"] = "Event-info1";
ln["EventInfo1description_en"] = "Additional info 1";

ln["Event info 2"] = "Event-info2";
ln["EventInfo2description_en"] = "Additional info 2";

ln["Event info 3"] = "Event-info3";
ln["EventInfo3description_en"] = "Additional info 3";

//logtimeline english lan
ln["logtimeline_en"] = "Log timeline";
ln["logtimelineDescription_en"] = "The logtimeline-datalet is an interactive visualization of event logs on timeline. The event logs are a basic resource that helps provide information about network traffic and other conditions. Each event has a timestamp that represents the date it occurred: if the event is not punctual, it has a start and an end date. You also can add the start time and/or end time details from dataset with only time schedule information. You can add event title, event description and other additional event info. It's possible to freely move and zoom the timeline.";
ln["LOGTIMELINEStartDate_en"] = "START DATE";
ln["LOGTIMELINEStartDateDescription_en"] = "Start date of the event. The logtimeline-datalet supports most of timestamp formats written in log files. For example: the format “yyyy-MM-d’T’HH:mm:ss.SSSZ” (sample value: 2001-07-04T12:08:56.235-0700); the format “yyyyy.MMMMM.dd GGG hh:mm aaa” (sample value: 02001.July.04 AD 12:08:56 -0700); the format “yyyy.MM.dd G ‘at’ HH:mm:ss” (sample value: 2001.07.04 at 12:08:56 PDT). The complete list of supported timestamp formats is available at this link: https://lo901355326.wordpress.com/";
ln["LOGTIMELINEEndDate_en"] = "END DATE";
ln["LOGTIMELINEEndDateDescription_en"] = "The end date of the event (see start date). You can use the same information of “Start Date” if the dataset has punctual events.";
ln["LOGTIMELINEEventTitle_en"] = "EVENT NAME";
ln["LOGTIMELINEEventTitleDescription_en"] = "Event name";
ln["LOGTIMELINEEventDescription_en"] = "EVENT DESCRIPTION";
ln["LOGTIMELINEEventDescriptionDescription_en"] = "Event description";
ln["LOGTIMELINEMediaUrl_en"] = "MEDIA URL";
ln["LOGTIMELINEMediaUrlDescription_en"] = "Url of image or video";
ln["LOGTIMELINEBackground_en"] = "BACKGROUND";
ln["LOGTIMELINEBackgroundDescription_en"] = "URL of background image, CSS colours (for example red, aqua etc.), hexadecimal format (for example # 0f9bd1) or a valid CSS managed colour keyword.";
ln["LOGTIMELINEStartTime_en"] = "START TIME";
ln["LOGTIMELINEStartTimeDescription_en"] = "Start time of the event. You can add the time schedule in this input or the full timestamp. The logtimeline-datalet supports these schedule formats: “hh:mm”, “hh:mm:ss”, “hh:mm:ss:ms”, “hh:mm:ss aaa” (for example 12:08:56 -0700), “HH:mm:ssZ” (for example 16:53:34Z), “HH:mm:ss a” (for example 11:31:45 AM) and “hh ‘english time’ a, zzzz” (for example 12 o’clock PM, Pacific Daylight Time).";
ln["LOGTIMELINEFinishTime_en"] = "FINISH TIME";
ln["LOGTIMELINEFinishTimeDescription_en"] = "Finish time of the event. (see start time).";
ln["LOGTIMELINEEventInfo1_en"] = "EVENT INFO 1";
ln["LOGTIMELINEEventInfo1Description_en"] = "Additional event information.";
ln["LOGTIMELINEEventInfo2_en"] = "EVENT INFO 2";
ln["LOGTIMELINEEventInfo2Description_en"] = "Additional event information.";
ln["LOGTIMELINEEventInfo3_en"] = "EVENT INFO 3";
ln["LOGTIMELINEEventInfo3Description_en"] = "Additional event information."
ln["LOGTIMELINELink_en"] = "LINK";
ln["LOGTIMELINELinkDescription_en"] = "Link";
ln["date-reading_en"] = "Date reading";
ln["Std_en"] = "Standard";
ln["Alt_en"] = "Alternative (first the day)";
ln["date-readingDescription_en"] = 'The logtimeline read the date in standard mode or in alternative mode (first the day): in standard mode it read the month before the day(for example logtimeline read 10-02-2020 as October, 2); in alternative mode it read the day before the month(for example logtimeline read 10-02-2020 as February, 10).';
ln["timenav-position_en"] = "Timenav position";
ln["timenav-positionDescription_en"] = "The position of timeline navigation bar";
ln["Bottom_en"] = "Bottom";
ln["Top_en"] = "Top";
ln["lang-timeline_en"] = "Language";
ln["lang-timelineDescription_en"] = "The timeline language";
ln["en_en"] = "English";
ln["it_en"] = "Italian";
ln["fr_en"] = "French";
ln["de_en"] = "German";
ln["es_en"] = "Spanish";
ln["cn_en"] = "Chinese";
ln["ja_en"] = "Japan";
ln["slides-order_en"] = "Slides loading";
ln["slides-orderDescription_en"] = 'Load timeline on last or on first slide';
ln["start_en"] = "On first";
ln["end_en"] = "On last";
ln["hash_bookmark_en"] = "Hash bookmark";
ln["hash_bookmarkDescription_en"] = "If set to ON, logtimeline will update the browser URL each time a slide advances, so that you can link directly to specific slides."
ln["off_en"] = "OFF";
ln["on_en"] = "ON";
ln["LOGTIMELINETheme_en"] = "Theme";
ln["LOGTIMELINEThemeDescription_en"] = "Theme"
ln["light_en"] = "Light";
ln["dark_en"] = "Dark";

//logtimeline italian lan
ln["logtimeline_it"] = "Log timeline";
ln["logtimelineDescription_it"] = "La log timeline è una visualizzazione interattiva di event logs su una linea temporale. Gli event logs sono una risorsa di base e forniscono informazioni circa il traffico sulla rete e altre condizioni. Ogni evento ha un timestamp che rappresenta la data in cui si è verificato: nel caso in cui l’evento non è puntuale, ha una data iniziale e una finale. Oltre alla data, è possibile includere le informazioni circa l’orario di inizio e di fine di un evento, il nome, la descrizione, un link e altre informazioni aggiuntive. Inoltre, è possibile spostare e zoomare liberamente la timeline.";
ln["LOGTIMELINEStartDate_it"] = "DATA INIZIALE";
ln["LOGTIMELINEStartDateDescription_it"] = "Data iniziale dell'evento. La log timeline supporta la maggior parte dei timestamp scritti nei file di log. Per esempio: il formato “yyyy-MM-d’T’HH:mm:ss.SSSZ” (esempio: 2001-07-04T12:08:56.235-0700); il formato “yyyyy.MMMMM.dd GGG hh:mm aaa” (esempio: 02001.July.04 AD 12:08:56 -0700); il formato “yyyy.MM.dd G ‘at’ HH:mm:ss” (esempio: 2001.07.04 at 12:08:56 PDT). La lista completa dei formati di timestamp supportati è presente a questo link: https://lo901355326.wordpress.com/";
ln["LOGTIMELINEEndDate_it"] = "DATA FINALE";
ln["LOGTIMELINEEndDateDescription_it"] = "La data finale dell'evento (vedi data iniziale). Può essere uguale alla data iniziale quando l'evento è puntuale.";
ln["LOGTIMELINEEventTitle_it"] = "NOME EVENTO";
ln["LOGTIMELINEEventTitleDescription_it"] = "Nome evento";
ln["LOGTIMELINEEventDescription_it"] = "DESCRIZIONE EVENTO";
ln["LOGTIMELINEEventDescriptionDescription_it"] = "Descrizione evento";
ln["LOGTIMELINEMediaUrl_it"] = "MEDIA URL";
ln["LOGTIMELINEMediaUrlDescription_it"] = "Url di un'immagine o video";
ln["LOGTIMELINEBackground_it"] = "IMMAGINE DI SFONDO";
ln["LOGTIMELINEBackgroundDescription_it"] = "URL di un'immagine di sfondo, colori CSS (ad esempio red, aqua etc.), formati esadecimali (ad esempio # 0f9bd1) oppure una parola chiave valida di un colore gestito con CSS.";
ln["LOGTIMELINEStartTime_it"] = "ORARIO DI INIZIO";
ln["LOGTIMELINEStartTimeDescription_it"] = "L'orario di inizio dell'evento. La log timeline supporta questi formati di ora: “hh:mm”, “hh:mm:ss”, “hh:mm:ss:ms”, “hh:mm:ss aaa” (ad esempio 12:08:56 -0700), “HH:mm:ssZ” (ad esempio 16:53:34Z), “HH:mm:ss a” (ad esempio 11:31:45 AM) e “hh ‘english time’ a, zzzz” (ad esempio 12 o’clock PM, Pacific Daylight Time).";
ln["LOGTIMELINEFinishTime_it"] = "ORARIO DI FINE";
ln["LOGTIMELINEFinishTimeDescription_it"] = "Orario di fine dell'evento. (vedi orario di inizio).";
ln["LOGTIMELINEEventInfo1_it"] = "INFORMAZIONE EVENTO 1";
ln["LOGTIMELINEEventInfo1Description_it"] = "Informazione aggiuntiva dell'evento.";
ln["LOGTIMELINEEventInfo2_it"] = "INFORMAZIONE EVENTO 2";
ln["LOGTIMELINEEventInfo2Description_it"] = "Informazione aggiuntiva dell'evento.";
ln["LOGTIMELINEEventInfo3_it"] = "INFORMAZIONE EVENTO 3";
ln["LOGTIMELINEEventInfo3Description_it"] = "Informazione aggiuntiva dell'evento."
ln["LOGTIMELINELink_it"] = "LINK";
ln["LOGTIMELINELinkDescription_it"] = "Link";
ln["date-reading_it"] = "Modalità di lettura della data";
ln["Std_it"] = "Standard";
ln["Alt_it"] = "Alternativa (prima il giorno)";
ln["date-readingDescription_it"] = 'La log timeline può leggere la data in modalità standard o alternativa (prima il giorno): in modalità standard legge il mese prima del giorno(ad esempio legge 10-02-2020 come 2 Ottobre); in modalità alternativa legge il giorno prima del mese(ad esempio legge 10-02-2020 come 10 febbraio).';
ln["timenav-position_it"] = "Posizione del timenav";
ln["timenav-positionDescription_it"] = "La posizione della barra di navigazione della timeline";
ln["Bottom_it"] = "Sotto";
ln["Top_it"] = "Sopra";
ln["lang-timeline_it"] = "Lingua";
ln["lang-timelineDescription_it"] = "La lingua della timeline";
ln["en_it"] = "Inglese";
ln["it_it"] = "Italiano";
ln["fr_it"] = "Francese";
ln["de_it"] = "Tedesco";
ln["es_it"] = "Spagnolo";
ln["cn_it"] = "Cinese";
ln["ja_it"] = "Giapponese";
ln["slides-order_it"] = "Caricamento diapositive";
ln["slides-orderDescription_it"] = "Carica la sequenza temporale dalla prima o dall'ultima diapositiva";
ln["start_it"] = "Dall'inizio";
ln["end_it"] = "Dalla fine";
ln["hash_bookmark_it"] = "Segnalibro hash";
ln["hash_bookmarkDescription_it"] = "Se impostato su ON, la logtimeline aggiornerà l'url del browser per ogni diapositiva, in questo modo è possibile collegarsi direttamente a diapositive specifiche."
ln["off_it"] = "OFF";
ln["on_it"] = "ON";
ln["LOGTIMELINETheme_it"] = "Tema";
ln["LOGTIMELINEThemeDescription_it"] = "Tema"
ln["light_it"] = "Chiaro";
ln["dark_it"] = "Scuro";