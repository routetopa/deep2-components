class SelectField {

    static MEDIA_URL = "LOGTIMELINEMediaUrl";
    static BACKGROUND = "LOGTIMELINEBackground";
    static START_TIME = "LOGTIMELINEStartTime";
    static FINISH_TIME = "LOGTIMELINEFinishTime";
    static EVENT_INFO1 = "LOGTIMELINEEventInfo1";
    static EVENT_INFO2 = "LOGTIMELINEEventInfo2";
    static EVENT_INFO3 = "LOGTIMELINEEventInfo3";
    static LINK = "LOGTIMELINELink";
    static ALL = "All";

    /**
     *
     * @returns {string} defaults fields StartDate, EndDate, EventTitle, EventDescription and other selected fields
     */
    static select () {
        let selectedFields = [{field : "LOGTIMELINEStartDate"}, {field : "LOGTIMELINEEndDate"}, {field: "LOGTIMELINEEventTitle"}, {field : "LOGTIMELINEEventDescription", index : 2}];
        if(arguments.length > 0){
            let index = 2;
            for (let arg of arguments) {
                if (arg.match(/mediaurl/i)) {
                    selectedFields.push({field: "LOGTIMELINEMediaUrl", index: (++index)});
                }
                else if (arg.match(/background/i)) {
                    selectedFields.push({field: "LOGTIMELINEBackground", index: (++index)});
                }
                else if (arg.match(/starttime/i)) {
                    console.log('match starttime');
                    selectedFields.push({field: "LOGTIMELINEStartTime", index: (++index)});
                }
                else if (arg.match(/finishtime/i)) {
                    console.log('match finishtime');
                    selectedFields.push({field: "LOGTIMELINEFinishTime", index: (++index)});
                }
                else if (arg.match(/eventinfo\d/i)) {
                    let num = (arg + '').charAt((arg + '').length - 1);
                    selectedFields.push({field: "LOGTIMELINEEventInfo".concat(num), index: (++index)});
                }
                else if(arg.match(/All/g)) {
                    selectedFields.push({field: "LOGTIMELINEMediaUrl", index: (++index)});
                    selectedFields.push({field: "LOGTIMELINEBackground", index: (++index)});
                    selectedFields.push({field: "LOGTIMELINEStartTime", index: (++index)});
                    selectedFields.push({field: "LOGTIMELINEFinishTime", index: (++index)});
                    selectedFields.push({field: "LOGTIMELINEEventInfo1", index: (++index)});
                    selectedFields.push({field: "LOGTIMELINEEventInfo2", index: (++index)});
                    selectedFields.push({field: "LOGTIMELINEEventInfo3", index: (++index)});
                    break;
                }
                else if (arg.match(/link/i)) {
                    selectedFields.push({field: "LOGTIMELINELink", index: (++index)});
                }
            }
        }
        return JSON.stringify(selectedFields);
    }
}