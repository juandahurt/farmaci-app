package dataAccess.dao;

import logic.Product;
import logic.Unit;
import logic.exceptions.*;

import java.util.ArrayList;

public interface ProductDAO {
    boolean create(Product product) throws BarcodeAlreadyRegistered, NameAlreadyRegistered;
    boolean update(String id, Product product) throws NameAlreadyRegistered, BarcodeAlreadyRegistered;
    boolean delete(String id);
    Product search(String id);
    ArrayList<Product> list();

    //
    // Units
    //
    boolean setRelation(String productId, int boxes, int others, int units);
    int[] getRelation(String productId);
    boolean create(Unit unit);
    ArrayList<Unit> listUnits(String id);
    boolean delete(Unit unit);
    boolean update(Unit unit);
    boolean removeUnits(int unitType, int quantity, String productId)
            throws
            NotEnoughBoxes,
            NotEnoughUnits,
            NotEnoughOthers,
            NotEnoughUnitsPerBox, NotEnoughUnitsPerOther, NotEnoughOthersPerBox;
    int getTotalBoxes(String productId);
    int getTotalOthers(String productId);
    int getTotalUnits(String productId);

    //
    // File
    //
    boolean copyFile();
}
