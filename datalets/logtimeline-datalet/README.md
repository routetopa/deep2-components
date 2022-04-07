# Logtimeline-datalet
Logtimeline-datalet for event-logs visualization in DEEP

Before using this datalet on SPOD, you must add this lines to "\Datalet-Ecosystem-Provider\deep\datalets.xml":

        <!--Logtimeline-->
        <component>
            <name>logtimeline-datalet</name>
            <type>logtimeline</type>
            <idm>
                <inputs>                  
                    <input>
                        <name>LOGTIMELINEStartDate</name>
                        <description>start date of the event</description>
                        <type>TEXT</type>
                        <selection>1</selection>
                    </input>
                    <input>
                        <name>LOGTIMELINEEndDate</name>
                        <description>end date of the event</description>
                        <type>TEXT</type>
                        <selection>1</selection>
                    </input>
                    <input>
                        <name>LOGTIMELINEEventTitle</name>
                        <description>name of the event</description>
                        <type>TEXT</type>
                        <selection>1</selection>
                    </input>
                    <input>
                        <name>LOGTIMELINEEventDescription</name>
                        <description>description of the event</description>
                        <type>TEXT</type>
                        <selection>1</selection>
                    </input>
                    <input>
                        <name>LOGTIMELINEMediaUrl</name>
                        <description>url of video/image (optional)</description>
                        <type>TEXT</type>
                        <selection>1</selection>
                    </input>
                    <input>
                        <name>LOGTIMELINEBackground</name>
                        <description>url of background image (optional)</description>
                        <type>TEXT</type>
                        <selection>1</selection>
                    </input>
                    <input>
                        <name>LOGTIMELINEStartTime</name>
                        <description>start time of the event (optional)</description>
                        <type>TEXT</type>
                        <selection>1</selection>
                    </input>
                    <input>
                        <name>LOGTIMELINEFinishTime</name>
                        <description>end time of the event (optional)</description>
                        <type>TEXT</type>
                        <selection>1</selection>
                    </input>
                    <input>
                        <name>LOGTIMELINEEvent-info1</name>
                        <description>event info 1 (optional)</description>
                        <type>TEXT</type>
                        <selection>1</selection>
                    </input>
                    <input>
                        <name>LOGTIMELINEEvent-info2</name>
                        <description>event info 2 (optional)</description>
                        <type>TEXT</type>
                        <selection>1</selection>
                    </input>
                    <input>
                        <name>LOGTIMELINEEvent-info3</name>
                        <description>event info 3 (optional)</description>
                        <type>TEXT</type>
                        <selection>1</selection>
                    </input>
                </inputs>
            </idm>
        </component>

Also, you should add in "\Datalet-Ecosystem-Provider\deep-components\locales\controllet_ln.js" the proper translation for the controllet (english and italian):

ENGLISH:

        //logtimeline english lan
        ln["timeline_en"] = "Logtimeline";
        
        ln["LOGTIMELINEStartDate_en"] = "StartDate";
        ln["LOGTIMELINEStartDatedescription_en"] = "Event Start Date";
        
        ln["LOGTIMELINEEndDate_en"] = "EndDate";
        ln["LOGTIMELINEEndDatedescription_en"] = "Event End Date";
        
        ln["LOGTIMELINEEventTitle_en"] = "EventTitle";
        ln["LOGTIMELINEEventTitledescription_en"] = "Name of the event";
        
        ln["LOGTIMELINEEventDescription_en"] = "EventDescription";
        ln["LOGTIMELINEEventDescriptiondescription_en"] = "Event Description";
        
        ln["LOGTIMELINEMediaUrl_en"] = "MediaUrl";
        ln["LOGTIMELINEMediaUrldescription_en"] = "Url of video/image";
        
        ln["LOGTIMELINEBackground_en"] = "Background";
        ln["LOGTIMELINEBackgrounddescription_en"] = "Url of background image";
        
        ln["LOGTIMELINEStartTime_en"] = "StartTime";
        ln["LOGTIMELINEStartTimedescription_en"] = "Event start time";
        
        ln["LOGTIMELINEFinishTime_en"] = "FinishTime";
        ln["LOGTIMELINEFinishTimedescription_en"] = "Event end time";
        
        ln["LOGTIMELINEEven-info1_en"] = "Event-info1";
        ln["LOGTIMELINEEventInfo1description_en"] = "Additional info 1";
        
        ln["LOGTIMELINEEvent-info2_en"] = "Event-info2";
        ln["LOGTIMELINEEventInfo2description_en"] = "Additional info 2";
        
        ln["LOGTIMELINEEvent-info3_en"] = "Event-info3";
        ln["LOGTIMELINEEventInfo3description_en"] = "Additional info 3";
         

ITALIAN:

        //logtimeline italian lan
        ln["timeline_it"] = "Logtimeline";
        
        ln["LOGTIMELINEStartDate_it"] = "Data di inizio";
        ln["LOGTIMELINEStartDatedescription_it"] = "Data iniziale dell'evento";
        
        ln["LOGTIMELINEEndDate_it"] = "Data di fine";
        ln["LOGTIMELINEEndDatedescription_it"] = "Data di fine dell'evento";
        
        ln["LOGTIMELINEHeadline_it"] = "Nome evento";
        ln["LOGTIMELINEHeadlinedescription_it"] = "Nome dell'evento";
        
        ln["LOGTIMELINEDescription_it"] = "Descrizione";
        ln["LOGTIMELINEDescriptiondescription_it"] = "Descrizione dell'evento";
        
        ln["LOGTIMELINEMediaUrl_it"] = "MediaUrl";
        ln["LOGTIMELINEMediaUrldescription_it"] = "Url dell'immagine o video";
        
        ln["LOGTIMELINEBackground_it"] = "Immagine di sfondo";
        ln["LOGTIMELINEBackgrounddescription_it"] = "Url dell'immagine di sfondo";
        
        ln["LOGTIMELINEStartTime_it"] = "Orario di inizio";
        ln["LOGTIMELINEStartTimedescription_it"] = "Orario di inzio dell'evento";
        
        ln["LOGTIMELINEFinishTime_it"] = "Orario di fine";
        ln["LOGTIMELINEFinishTimedescription_it"] = "Orario di fine dell'evento";
        
        ln["LOGTIMELINEEventInfo1_it"] = "Informazione evento 1";
        ln["LOGTIMELINEEventInfo1description_en"] = "Informazione aggiuntiva dell'evento";
        
        ln["LOGTIMELINEEventInfo2_it"] = "Informazione evento 2";
        ln["LOGTIMELINEEventInfo2description_it"] = "Informazione aggiuntiva dell'evento";
        
        ln["LOGTIMELINEEventInfo3_it"] = "Informazione evento 2";
        ln["LOGTIMELINEEventInfo3description_it"] = "Informazione aggiuntiva dell'evento";        
