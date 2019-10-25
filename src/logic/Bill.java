package logic;

import dataAccess.dao.BillDAO;
import dataAccess.dao.ProductDAO;
import dataAccess.daoImpl.BillDAOImpl;
import dataAccess.daoImpl.ProductDAOImpl;

import java.util.ArrayList;
import java.util.GregorianCalendar;

public class Bill {

    private int id;
    private Date date;
    private ArrayList<ProductInCart> products;
    private double total;

    public Bill() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public ArrayList<ProductInCart> getProducts() {
        return products;
    }

    public void setProducts(ArrayList<ProductInCart> products) {
        this.products = products;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    //
    // Static methods
    //
    public static boolean save(Bill bill) {
        BillDAO billDAO = new BillDAOImpl();
        return billDAO.save(bill);
    }

    public static boolean open() {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.copyFile();
    }
}
