package logic;

import dataAccess.dao.ExpensesDAO;
import dataAccess.daoImpl.ExpensesDAOImpl;

import java.util.ArrayList;

public class Expense {
    private int id;
    private double amount;
    private String description;
    private Date regDate;

    public Expense() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    //
    // Static methods
    //
    public static boolean save(Expense expense) {
        ExpensesDAO expensesDAO = new ExpensesDAOImpl();
        return expensesDAO.save(expense);
    }

    public static ArrayList<Expense> list() {
        ExpensesDAO expensesDAO = new ExpensesDAOImpl();
        return expensesDAO.list();
    }

    public static boolean delete(int id) {
        ExpensesDAO expensesDAO = new ExpensesDAOImpl();
        return expensesDAO.delete(id);
    }

    public Date getRegDate() {
        return regDate;
    }

    public void setRegDate(Date regDate) {
        this.regDate = regDate;
    }
}
