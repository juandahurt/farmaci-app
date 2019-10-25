package logic;

import java.util.GregorianCalendar;

public class Date extends GregorianCalendar {

    public Date() {
        //add(GregorianCalendar.MONTH, 1);
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder();
        str.append(get(GregorianCalendar.YEAR));
        str.append("-");
        str.append(get(GregorianCalendar.MONTH));
        str.append("-");
        str.append(get(GregorianCalendar.DAY_OF_MONTH));
        return str.toString();
    }

    public void setYear(int year) {
        set(GregorianCalendar.YEAR, year);
    }

    public void setMonth(int month) {
        set(GregorianCalendar.MONTH, month);
    }

    public void setDay(int day) {
        set(GregorianCalendar.DAY_OF_MONTH, day);
    }

    public int getYear() {
        return get(GregorianCalendar.YEAR);
    }

    public int getMonth() {
        return get(GregorianCalendar.MONTH) + 1;
    }

    public int getDay() {
        return get(GregorianCalendar.DAY_OF_MONTH);
    }

    public int getDayOfWeek() {
        return get(GregorianCalendar.DAY_OF_WEEK);
    }

    public static Date createDateFrom(int year, int month, int day) {
        Date date = new Date();
        date.setYear(year);
        date.setMonth(month);
        date.setDay(day);
        return date;
    }

    public static Date createDateFrom(String str) {
        String strSplit[] = str.split("-");
        int year = Integer.parseInt(strSplit[0]);
        int month = Integer.parseInt(strSplit[1]);
        int day = Integer.parseInt(strSplit[2]);

        Date date = new Date();
        date.setYear(year);
        date.setMonth(month);
        date.setDay(day);

        return date;
    }
}
