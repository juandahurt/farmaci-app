package logic;

import dataAccess.dao.CategoryDAO;
import dataAccess.daoImpl.CategoryDAOImpl;
import logic.exceptions.NameAlreadyRegistered;

import java.util.ArrayList;

public class Category {

    private int id;
    private String name;

    public Category() {}

    public Category(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    //
    // Static methods
    //
    public static boolean create(Category category) throws NameAlreadyRegistered {
        CategoryDAO categoryDAO = new CategoryDAOImpl();
        return categoryDAO.create(category);
    }

    public static boolean update(int id, Category category) {
        CategoryDAO categoryDAO = new CategoryDAOImpl();
        return categoryDAO.update(id, category);
    }

    public static boolean delete(int id) {
        CategoryDAO categoryDAO = new CategoryDAOImpl();
        return categoryDAO.delete(id);
    }

    public static ArrayList<Category> list() {
        CategoryDAO categoryDAO = new CategoryDAOImpl();
        return categoryDAO.list();
    }
}
