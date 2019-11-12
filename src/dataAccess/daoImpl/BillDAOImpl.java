package dataAccess.daoImpl;

import config.Config;
import dataAccess.JSONHandler;
import dataAccess.dao.BillDAO;
import logic.Bill;
import logic.ProductInCart;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;
import threads.UnitsThread;

public class BillDAOImpl implements BillDAO {
    @Override
    public boolean save(Bill bill) {
        String billsPath = Config.BILLS_PATH;

        String yearPath = Paths.get(billsPath, String.valueOf(bill.getDate().getYear())).toString();
        String monthPath = Paths.get(yearPath, String.valueOf(bill.getDate().getMonth())).toString();
        String dayPath = Paths.get(monthPath, String.valueOf(bill.getDate().getDay())).toString();

        if (createDir(yearPath)) {
            createStatsFile(yearPath);
        }
        if (createDir(monthPath)) {
            createStatsFile(monthPath);
        }
        if (createDir(dayPath)) {
            createStatsFile(dayPath);
        }

        // Bill details
        JSONObject billDetails = new JSONObject();
        billDetails.put("id", getActualId());
        billDetails.put("total", bill.getTotal());
        billDetails.put("date", bill.getDate().toString());

        // Products
        JSONArray productsArray = new JSONArray();
        for (ProductInCart product : bill.getProducts()) {
            JSONObject productObject = new JSONObject();
            productObject.put("id", product.getPublicId());
            productObject.put("quantity", product.getQuantity());
            productObject.put("desc", product.getDescription());
            productObject.put("unidad", product.getType());
            productObject.put("subtotal", product.getSubtotal());
            productsArray.add(productObject);
        }
        billDetails.put("products", productsArray);

        // Get bill path
        String billPath = Paths.get(dayPath, getActualId() + ".json").toString();

        // Bill object
        JSONObject billObject = new JSONObject();
        billObject.put("bill", billDetails);

        updateStats(bill);

        JSONHandler.writeJSONFile(billPath, billObject);
        
        UnitsThread units = new UnitsThread("Units");
        units.start();
        
        return copyFile();
    }

        public boolean copyFile() {
        String dest = Config.PRODUCTS_PATH;
        String source = Config.PRODUCTS_TEMP_PATH;
        InputStream is = null;
        OutputStream os = null;
        try {
            is = new FileInputStream(source);
            os = new FileOutputStream(dest);
            byte[] buffer = new byte[1024];
            int length;
            while ((length = is.read(buffer)) > 0) {
                os.write(buffer, 0, length);
            }
        } catch (FileNotFoundException ex) {
            Logger.getLogger(ProductDAOImpl.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(ProductDAOImpl.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                is.close();
                os.close();
                return true;
            } catch (IOException ex) {
                Logger.getLogger(ProductDAOImpl.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        return false;
    }
    
    private void updateStats(Bill bill) {
        // general stats
        String genStatsPath = Config.BILLS_PATH;
        updateStats(genStatsPath, bill);
        // annual stats
        String yearStatsPath = Paths.get(genStatsPath, String.valueOf(bill.getDate().getYear())).toString();
        updateStats(yearStatsPath, bill);
        // monthly stats
        String monthStatsPath = Paths.get(yearStatsPath, String.valueOf(bill.getDate().getMonth())).toString();
        updateStats(monthStatsPath, bill);
        // daily stats
        String dayStatsPath = Paths.get(monthStatsPath, String.valueOf(bill.getDate().getDay())).toString();
        updateStats(dayStatsPath, bill);
    }

    private void updateStats(String path, Bill bill) {
        String statsPath = Paths.get(path, "stats.json").toString();
        JSONParser jsonParser = new JSONParser();
        Object obj;
        try {
            obj = jsonParser.parse(new FileReader(statsPath));
            JSONObject statsObject = (JSONObject) obj;
            int totalBills = Math.toIntExact((Long) statsObject.get("total-bills"));
            double total = (double) statsObject.get("total");

            statsObject.remove("total-bills");
            statsObject.remove("total");

            statsObject.put("total-bills", totalBills + 1);
            statsObject.put("total", total + bill.getTotal());

            JSONHandler.writeJSONFile(statsPath, statsObject);
        } catch (IOException | ParseException e) {
            e.printStackTrace();
        }
    }

    private int getActualId() {
        String statsPath = Paths.get(Config.BILLS_PATH, "stats.json").toString();
        JSONParser jsonParser = new JSONParser();
        Object obj;
        try {
            obj = jsonParser.parse(new FileReader(statsPath));
        } catch (IOException | ParseException e) {
            e.printStackTrace();
            return -1;
        }
        JSONObject statsObject = (JSONObject) obj;
        int totalBills = Math.toIntExact((Long) statsObject.get("total-bills"));
        return totalBills;
    }

    /**
     * Creates a directory if it doesn't exist.
     *
     * @param path pathname for the new directory
     * @return true if it was created
     */
    private boolean createDir(String path) {
        File file = new File(path);
        if (!file.exists()) {
            return file.mkdir();
        }
        return false;
    }

    private void createStatsFile(String path) {
        JSONObject statsObject = new JSONObject();
        statsObject.put("total-bills", 0);
        statsObject.put("total", 0.0);
        JSONHandler.writeJSONFile(Paths.get(path, "stats.json").toString(), statsObject);
    }
}
