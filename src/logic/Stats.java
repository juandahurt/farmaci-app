package logic;

import dataAccess.dao.StatsDAO;
import dataAccess.daoImpl.StatsImpl;

import java.util.ArrayList;

public class Stats {
    public static final int WEEK = 0;
    public static final int MONTH = 1;
    public static final int YEAR = 2;
    public static final int ALL_TIME = 3;

    private Date initDate;
    private Date finalDate;
    private double total;
    private int billsQuantity;
    private int range;
    private String label;

    public Stats() {
        this.range = WEEK;
        billsQuantity = 0;
        total = 0.0;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setLabel(int date) {
        switch (this.range) {
            case Stats.WEEK:
                switch(date) {
                    case 1:
                        this.label = "Domingo";
                        break;
                    case 2:
                        this.label = "Lunes";
                        break;
                    case 3:
                        this.label = "Martes";
                        break;
                    case 4:
                        this.label = "Miércoles";
                        break;
                    case 5:
                        this.label = "Jueves";
                        break;
                    case 6:
                        this.label = "Viernes";
                        break;
                    case 7:
                        this.label = "Sábado";
                        break;
                }
                break;
            case Stats.YEAR:
                switch (date) {
                    case 1:
                        this.label = "Enero";
                        break;
                    case 2:
                        this.label = "Febrero";
                        break;
                    case 3:
                        this.label = "Marzo";
                        break;
                    case 4:
                        this.label = "Abril";
                        break;
                    case 5:
                        this.label = "Mayo";
                        break;
                    case 6:
                        this.label = "Junio";
                        break;
                    case 7:
                        this.label = "Julio";
                        break;
                    case 8:
                        this.label = "Agosto";
                        break;
                    case 9:
                        this.label = "Septiembre";
                        break;
                    case 10:
                        this.label = "Octubre";
                        break;
                    case 11:
                        this.label = "Noviembre";
                        break;
                    case 12:
                        this.label = "Diciembre";
                        break;
                }
        }


    }

    public Date getInitDate() {
        return initDate;
    }

    public void setInitDate(Date initDate) {
        this.initDate = initDate;
    }

    public Date getFinalDate() {
        return finalDate;
    }

    public void setFinalDate(Date finalDate) {
        this.finalDate = finalDate;
    }

    public double getProfits() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public int getBillsQuantity() {
        return billsQuantity;
    }

    public void setBillsQuantity(int billsQuantity) {
        this.billsQuantity = billsQuantity;
    }

    public int getRange() {
        return range;
    }

    public void setRange(int range) {
        this.range = range;
    }

    //
    // Static methods
    //
    public static ArrayList<Stats> getStats(int range) {
        StatsDAO statsDAO = new StatsImpl();
        return statsDAO.getStats(range);
    }
}
