package threads;

import config.Config;
import dataAccess.JSONHandler;
import dataAccess.dao.ProductDAO;
import dataAccess.daoImpl.ProductDAOImpl;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class UnitsThread extends Thread {

    public UnitsThread(String name) {
        super(name);
    }

    public void run() {
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        JSONArray productsArr = (JSONArray) productsObj.get("products");
        
        for (Object obj : productsArr) {
            JSONObject productObj = (JSONObject) obj;
            JSONArray unitsArr = (JSONArray) productObj.get("units");
            if (unitsArr.isEmpty()) {
                if (Math.toIntExact((Long) productObj.get("boxes-total")) > 0) {
                    productObj.put("boxes-total", 0);
                }
                if (Math.toIntExact((Long) productObj.get("others-total")) > 0) {
                    productObj.put("others-total", 0);
                }
                if (Math.toIntExact((Long) productObj.get("units-total")) > 0) {
                    productObj.put("units-total", 0);
                }
            } 
            fixTotals(productObj);
        }
        
        JSONHandler.writeJSONFile(productsPath, productsObj);
    }
    
    private void fixTotals(JSONObject productObj) {
        JSONArray unitsArr = (JSONArray) productObj.get("units");
        int boxesTotalSum = 0, othersTotalSum = 0, unitsTotalSum = 0;
        System.out.println("id: " + productObj.get("id"));
        ProductDAO productDAO = new ProductDAOImpl();
        int relation[] = productDAO.getRelation((String) productObj.get("id"));
        boolean comesInBoxes = relation[0] != -1;
        boolean comesInOthers = relation[1] != -1;
        boolean comesInUnits = relation[2] != -1;
        
        for (Object obj : unitsArr) {
            JSONObject unitObj = (JSONObject) obj;
            if (Math.toIntExact((Long) unitObj.get("boxes")) >= 0) {
                boxesTotalSum += Math.toIntExact((Long) unitObj.get("boxes"));
            }
            if (Math.toIntExact((Long) unitObj.get("others")) >= 0) {
                othersTotalSum += Math.toIntExact((Long) unitObj.get("others"));
            }
            if (Math.toIntExact((Long) unitObj.get("units")) >= 0) {
                unitsTotalSum += Math.toIntExact((Long) unitObj.get("units"));
            }
        }
        
        int boxesTotal = Math.toIntExact((Long) productObj.get("boxes-total"));
        int othersTotal = Math.toIntExact((Long) productObj.get("others-total"));
        int unitsTotal = Math.toIntExact((Long) productObj.get("units-total"));
        
        if (comesInBoxes && (boxesTotal != boxesTotalSum)) {
            System.out.println("incongruencia encontrada en cajas");
            productObj.put("boxes-total", boxesTotalSum);
        }
        if (comesInOthers && (othersTotal != othersTotalSum)) {
            System.out.println("incongruencia encontrada en sobres");
            productObj.put("others-total", othersTotalSum);
        }
        if (comesInUnits && (unitsTotal != unitsTotalSum)) {
            System.out.println("incongruencia encontrada en unidades");
            productObj.put("units-total", unitsTotalSum);
        }
    }
}
