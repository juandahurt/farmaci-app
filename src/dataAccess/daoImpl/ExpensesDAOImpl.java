package dataAccess.daoImpl;

import config.Config;
import dataAccess.JSONHandler;
import dataAccess.dao.ExpensesDAO;
import logic.Date;
import logic.Expense;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.util.ArrayList;

public class ExpensesDAOImpl implements ExpensesDAO {
    @Override
    public boolean save(Expense expense) {
        String expensesPath = Config.EXPENSES_PATH;
        JSONObject expensesObj = JSONHandler.getJSONObject(expensesPath);
        JSONArray expensesArr = (JSONArray) expensesObj.get("expenses");
        int expenseId = Math.toIntExact((Long)(expensesObj.get("id")));
        expensesObj.put("id", expenseId + 1);

        // Create the new Expense
        JSONObject newExpense = new JSONObject();
        newExpense.put("id", expenseId);
        newExpense.put("amount", expense.getAmount());
        newExpense.put("date", expense.getRegDate().toString());
        newExpense.put("desc", expense.getDescription());

        // Add the new Expense
        expensesArr.add(newExpense);

        return JSONHandler.writeJSONFile(expensesPath, expensesObj);
    }

    @Override
    public ArrayList<Expense> list() {
        String expensesPath = Config.EXPENSES_PATH;
        JSONObject expensesObj = JSONHandler.getJSONObject(expensesPath);
        JSONArray expensesArr = (JSONArray) expensesObj.get("expenses");
        ArrayList<Expense> expenses = new ArrayList<>();

        for (Object e: expensesArr) {
            JSONObject expenseObj = (JSONObject) e;
            int id = Math.toIntExact((Long)(expenseObj.get("id")));
            String description = (String) expenseObj.get("desc");
            Date regDate = Date.createDateFrom((String) expenseObj.get("date"));
            double amount = (double) expenseObj.get("amount");

            Expense expense = new Expense();
            expense.setId(id);
            expense.setDescription(description);
            expense.setRegDate(regDate);
            expense.setAmount(amount);

            expenses.add(expense);
        }

        return expenses;
    }

    @Override
    public boolean delete(int id) {
        String expensesPath = Config.EXPENSES_PATH;
        JSONObject expensesObj = JSONHandler.getJSONObject(expensesPath);
        JSONArray expensesArr = (JSONArray) expensesObj.get("expenses");

        for (Object e: expensesArr) {
            JSONObject expenseObj = (JSONObject) e;
            int expenseId = Math.toIntExact((Long)(expenseObj.get("id")));
            System.out.println("expenseId: " + expenseId);
            boolean itWasRemoved;
            if (expenseId == id) {
                itWasRemoved = expensesArr.remove(expenseObj);
                return itWasRemoved && JSONHandler.writeJSONFile(expensesPath, expensesObj);
            }
        }
        return false;
    }
}
