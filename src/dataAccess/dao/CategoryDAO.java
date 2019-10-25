package dataAccess.dao;

import logic.Category;
import logic.exceptions.NameAlreadyRegistered;

import java.util.ArrayList;

public interface CategoryDAO {
    boolean create(Category category) throws NameAlreadyRegistered;
    boolean update(int id, Category category);
    boolean delete(int id);
    ArrayList<Category> list();
}
