package dataAccess.dao;

import logic.Expense;

import java.util.ArrayList;

public interface ExpensesDAO {
    boolean save(Expense expense);
    ArrayList<Expense> list();
    boolean delete(int id);
}
