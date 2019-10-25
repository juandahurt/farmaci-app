package logic;

import dataAccess.dao.ProductDAO;
import dataAccess.daoImpl.ProductDAOImpl;
import logic.exceptions.*;

import java.util.ArrayList;

public class Product {

    private String id;

    private String category;

    private boolean hasBarcode;

    private String description;

    private String unitType;

    private double cost;
    
    private double boxPrice;

    private double unitPrice;

    private double otherPrice;

    private int boxQuantity;

    private int otherQuantity;

    private int unitQuantity;

    private ArrayList<Unit> units;

    public Product() {
        this.id = "";
        this.category = "";
        this.hasBarcode = false;
        this.description = "";
        this.cost = -1;
        this.boxPrice = -1;
        this.unitPrice = -1;
        this.otherPrice = -1;
        this.boxQuantity = -1;
        this.otherQuantity = -1;
        this.unitQuantity = -1;
        this.unitType = "";
        this.units = new ArrayList<>();
    }
    
    public double getCost() {
        return this.cost;
    }
    
    public void setCost(double cost) {
        this.cost = cost;
    }

    public int getOtherQuantity() {
        return otherQuantity;
    }

    public void setOtherQuantity(int otherQuantity) {
        this.otherQuantity = otherQuantity;
    }

    public int getUnitQuantity() {
        return unitQuantity;
    }

    public void setUnitQuantity(int unitQuantity) {
        this.unitQuantity = unitQuantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean hasBarcode() {
        return hasBarcode;
    }

    public void setHasBarcode(boolean hasCodeBar) {
        this.hasBarcode = hasCodeBar;
    }

    public void setBoxQuantity(int boxQuantity) {
        this.boxQuantity = boxQuantity;
    }

    public int getBoxQuantity() {
        return this.boxQuantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getBoxPrice() {
        return boxPrice;
    }

    public void setBoxPrice(double boxPrice) {
        this.boxPrice = boxPrice;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public double getOtherPrice() {
        return otherPrice;
    }

    public void setOtherPrice(double otherPrice) {
        this.otherPrice = otherPrice;
    }

    //
    // Static methods
    //
    public static boolean create(Product newProduct) throws NameAlreadyRegistered, BarcodeAlreadyRegistered {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.create(newProduct);
    }

    public static boolean delete(String id) {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.delete(id);
    }

    public static Product search(String id) {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.search(id);
    }

    public static ArrayList<Product> list() {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.list();
    }

    public static boolean update(String id, Product product) throws NameAlreadyRegistered, BarcodeAlreadyRegistered {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.update(id, product);
    }

    //
    // Units
    //
    public static boolean create(Unit unit) {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.create(unit);
    }

    public static ArrayList<Unit> getUnits(String id) {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.listUnits(id);
    }

    public static boolean delete(Unit unit) {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.delete(unit);
    }

    public static boolean update(Unit unit) {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.update(unit);
    }

    public static int getTotalBoxes(String productId) {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.getTotalBoxes(productId);
    }

    public static int getTotalOthers(String productId) {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.getTotalOthers(productId);
    }

    public static int getTotalUnits(String productId) {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.getTotalUnits(productId);
    }

    public static boolean removeUnits(int unitType, int quantity, String productId)
            throws
            NotEnoughOthers,
            NotEnoughUnits,
            NotEnoughBoxes,
            NotEnoughUnitsPerBox,
            NotEnoughUnitsPerOther,
            NotEnoughOthersPerBox {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.removeUnits(unitType, quantity, productId);
    }

    public static boolean isRelationSet(String productId) {
        ProductDAO productDAO = new ProductDAOImpl();
        int[] relation = productDAO.getRelation(productId);
        int types = 0;
        int quantity = 0;

        for (int i = 0; i < relation.length; i++) {
            if (relation[i] != -1) {
                types++;
            }
            if (relation[i] > 0) {
                quantity++;
            }
        }
        // 1 type
        if (types == 1) {
            return true;
        }
        // 2 or 3 types
        return quantity == types;
    }

    public static int[] getRelation(String productId) {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.getRelation(productId);
    }

    public static boolean setRelation(String productId, int boxes, int others, int units) {
        ProductDAO productDAO = new ProductDAOImpl();
        return productDAO.setRelation(productId, boxes, others, units);
    }

    public String getUnitType() {
        return unitType;
    }

    public void setUnitType(String unitType) {
        this.unitType = unitType;
    }
}