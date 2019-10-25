package dataAccess.daoImpl;

import config.Config;
import dataAccess.JSONHandler;
import dataAccess.dao.CategoryDAO;
import dataAccess.dao.ProductDAO;
import logic.Category;
import logic.Product;
import logic.exceptions.BarcodeAlreadyRegistered;
import logic.exceptions.NameAlreadyRegistered;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.util.ArrayList;

public class CategoryDAOImpl implements CategoryDAO {
    @Override
    public boolean create(Category category) throws NameAlreadyRegistered {
        for (Category c : list()) {
            if (c.getName().equals(category.getName())) {
                throw new NameAlreadyRegistered();
            }
        }
        String categoriesPath = Config.CATEGORIES_PATH;
        JSONObject categoriesObj = JSONHandler.getJSONObject(categoriesPath);
        JSONArray categoriesArray = (JSONArray)categoriesObj.get("categories");

        // create new category object
        JSONObject categoryObj = new JSONObject();
        int id = Math.toIntExact((Long)categoriesObj.get("id"));
        categoryObj.put("id", id);
        categoryObj.put("name", category.getName());
        id++;
        // update id
        categoriesObj.remove("id");
        categoriesObj.put("id", id);

        categoriesArray.add(categoryObj);

        return JSONHandler.writeJSONFile(categoriesPath, categoriesObj);
    }

    @Override
    public boolean update(int id, Category category) {
        String categoriesPath = Config.CATEGORIES_PATH;
        JSONObject categoriesObj = JSONHandler.getJSONObject(Config.CATEGORIES_PATH);
        JSONArray categoriesArr = (JSONArray) categoriesObj.get("categories");

        for (Object cat : categoriesArr) {
            JSONObject categoryObj = (JSONObject) cat;
            int idVal = ((Long)categoryObj.get("id")).intValue();
            String catName = (String) categoryObj.get("name");
            if (idVal == id) {
                // Remove category
                categoriesArr.remove(categoryObj);

                // Add category
                JSONObject catUpdated = new JSONObject();
                catUpdated.put("id", category.getId());
                catUpdated.put("name", category.getName());
                categoriesArr.add(catUpdated);

                updateProducts(catName, category.getName());

                return JSONHandler.writeJSONFile(categoriesPath, categoriesObj);
            }
        }
        return false;
    }

    private boolean updateProducts(String categoryOld, String categoryNew) {
        // Get the products
        ProductDAO productDAO = new ProductDAOImpl();
        for (Product product : productDAO.list()) {
            if (product.getCategory().equals(categoryOld)) {
                product.setCategory(categoryNew);
                try {
                    return productDAO.update(product.getId(), product);
                } catch (NameAlreadyRegistered | BarcodeAlreadyRegistered nameAlreadyRegistered) {
                    nameAlreadyRegistered.printStackTrace();
                    return false;
                }
            }
        }
        return false;
    }

    @Override
    public boolean delete(int id) {
        JSONObject categoriesObj = JSONHandler.getJSONObject(Config.CATEGORIES_PATH);
        JSONArray categoriesArray = (JSONArray) categoriesObj.get("categories");
        String catName = "";
        int index = 0;
        boolean found = false;
        for (Object cat : categoriesArray) {
            JSONObject catObj = (JSONObject) cat;
            int categoryId = Math.toIntExact((Long) catObj.get("id"));
            if (categoryId == id) {
                found = true;
                catName = (String) catObj.get("name");
                break;
            }
            index++;
        }
        if (found) {
            updateProducts(catName, "");
            categoriesArray.remove(index);
            return JSONHandler.writeJSONFile(Config.CATEGORIES_PATH, categoriesObj);
        }
        return false;
    }

    @Override
    public ArrayList<Category> list() {
        JSONObject categoriesObj = JSONHandler.getJSONObject(Config.CATEGORIES_PATH);
        JSONArray categoriesArray = (JSONArray) categoriesObj.get("categories");
        ArrayList<Category> categories = new ArrayList<>();
        for (Object cat : categoriesArray) {
            Category category = new Category();
            int id = Math.toIntExact((Long) (((JSONObject) cat).get("id")));
            String name = (String) ((JSONObject) cat).get("name");
            category.setId(id);
            category.setName(name);
            categories.add(category);
        }
        return categories;
    }
}
