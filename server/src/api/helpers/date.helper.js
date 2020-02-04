const moment = require('moment');

const dateHelper = {
    getYesterdayDate() {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        today = moment(today, 'MM-DD-YYYY');
        today.add(-1, 'days');
        return today;
    },
    getTodayDate() {
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        today = moment(today, 'MM-DD-YYYY');
        return today;
    },
    getLastWeekDate() {
        var lastWeek = new Date();
        lastWeek.setHours(0, 0, 0, 0);
        lastWeek = moment(lastWeek, 'MM-DD-YYYY');
        lastWeek.add(-7, 'days');
        return lastWeek.toDate();
    },
    getLastMonthDate() {
        var lastMonth = new Date();
        lastMonth.setHours(0, 0, 0, 0);
        lastMonth = moment(lastMonth, 'MM-DD-YYYY');
        lastMonth.add(-30, 'days');
        return lastMonth.toDate();
    },
    getLastYearDate() {
        var lastYear = new Date();
        lastYear.setHours(0, 0, 0, 0);
        lastYear.setDate(1);
        lastYear = moment(lastYear, 'MM-DD-YYYY');
        lastYear.add(-1, 'years');
        return lastYear.toDate();
    },
    cleanDate(date) {
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return `${day}/${month}`;
    },
    getMonthLabel(date) {
        var month = '';
        switch (date.getMonth() + 1) {
            case 1: month = 'Enero'; break;
            case 2: month = 'Febrero'; break;
            case 3: month = 'Marzo'; break;
            case 4: month = 'Abril'; break;
            case 5: month = 'Mayo'; break;
            case 6: month = 'Junio'; break;
            case 7: month = 'Julio'; break;
            case 8: month = 'Agosto'; break;
            case 9: month = 'Septiembre'; break;
            case 10: month = 'Octubre'; break;
            case 11: month = 'Noviembre'; break;
            case 12: month = 'Diciembre'; break;
        }
        return month;
    }
}

module.exports = dateHelper;