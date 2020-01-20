export class DateHelper {
    /** */
    public static cleanDate(date: string) {
        let dateCleaned = '';
        for (var i = 0; i < date.length; i++) {
            if (date[i] === 'T') { break; }
            dateCleaned += date[i];
        }
        return dateCleaned;
    }
}