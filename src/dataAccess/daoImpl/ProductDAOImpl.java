package dataAccess.daoImpl;

import config.Config;
import dataAccess.JSONHandler;
import dataAccess.dao.ProductDAO;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import logic.Date;
import logic.Product;
import logic.Unit;
import logic.exceptions.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ProductDAOImpl implements ProductDAO {

    @Override
    public boolean create(Product product) throws BarcodeAlreadyRegistered, NameAlreadyRegistered {
        // verify that the id is not being used
        for (Product p : list()) {
            if (p.getId().equals(product.getId())) {
                if (product.hasBarcode()) {
                    throw new BarcodeAlreadyRegistered();
                }
                throw new NameAlreadyRegistered();
            }
        }
        // Product details
        JSONObject productDetails = new JSONObject();
        productDetails.put("id", product.getId());
        productDetails.put("has-barcode", product.hasBarcode());
        productDetails.put("desc", product.getDescription());
        productDetails.put("category", product.getCategory());
        productDetails.put("cost", product.getCost());
        productDetails.put("boxes-total", product.getBoxQuantity());
        productDetails.put("others-total", product.getOtherQuantity());
        productDetails.put("units-total", product.getUnitQuantity());
        productDetails.put("units-sold", 0);
        productDetails.put("others-sold", 0);

        // Product prices
        JSONObject pricesObject = new JSONObject();
        pricesObject.put("box", product.getBoxPrice());
        pricesObject.put("other", product.getOtherPrice());
        pricesObject.put("unit", product.getUnitPrice());
        productDetails.put("prices", pricesObject);

        // Relation
        JSONObject relObj = new JSONObject();
        if (product.getBoxPrice() > 0) {
            relObj.put("box", 0);
        } else {
            relObj.put("box", -1);
        }
        if (product.getOtherPrice() > 0) {
            relObj.put("other", 0);
        } else {
            relObj.put("other", -1);
        }
        if (product.getUnitPrice() > 0) {
            relObj.put("unit", 0);
        } else {
            relObj.put("unit", -1);
        }
        productDetails.put("relation", relObj);

        // Units
        JSONArray unitsArray = new JSONArray();
        productDetails.put("units", unitsArray);
        productDetails.put("unit-id", 0);

        String productsPath = Config.PRODUCTS_PATH;

        // Get the JSON object
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        JSONArray productsArr = (JSONArray) productsObj.get("products");
        productsArr.add(productDetails);

        return JSONHandler.writeJSONFile(productsPath, productsObj);
    }

    @Override
    public boolean update(String id, Product product) throws NameAlreadyRegistered, BarcodeAlreadyRegistered {
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        JSONArray productsArr = (JSONArray) productsObj.get("products");

        for (Object p : productsArr) {
            JSONObject productObj = (JSONObject) p;
            if (productObj.get("id").equals(id)) {
                // Get the units
                ArrayList<Unit> units = listUnits(id);

                // Remove the products
                productsArr.remove(productObj);
                boolean itWasRemoved = JSONHandler.writeJSONFile(productsPath, productsObj);

                // Create the product
                boolean itWasCreated = create(product);

                // Add the units
                for (Unit unit : units) {
                    unit.getProduct().setId(product.getId());
                    create(unit);
                }

                return itWasCreated && itWasRemoved;
            }
        }
        return false;
    }

    @Override
    public boolean delete(String id) {
        // Get the JSON Object
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        JSONArray productsArr = (JSONArray) productsObj.get("products");
        boolean itWasRemoved = false;

        for (Object product : productsArr) {
            JSONObject productObj = (JSONObject) product;
            if (productObj.get("id").equals(id)) {
                itWasRemoved = productsArr.remove(product);
                break;
            }
        }
        if (!itWasRemoved) {
            return false;
        }
        return JSONHandler.writeJSONFile(productsPath, productsObj);
    }

    @Override
    public Product search(String idToFind) {
        ArrayList<Product> products = list();
        for (Product product : products) {
            if (product.getId().equalsIgnoreCase(idToFind)) {
                return product;
            }
        }
        return null;
    }

    @Override
    public ArrayList<Product> list() {
        ArrayList<Product> products = new ArrayList<>();

        // Read JSON file
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);

        JSONArray productsArr = (JSONArray) productsObj.get("products");
        for (Object product : productsArr) {
            JSONObject productObj = (JSONObject) product;
            String barcode = (String) productObj.get("id");
            String desc = (String) productObj.get("desc");
            String category = (String) productObj.get("category");
            boolean hasBarcode = (boolean) productObj.get("has-barcode");
            double cost = 0;
            
            try {
                cost = (double) productObj.get("cost");
            } catch (NullPointerException ex) {
                System.out.println(ex.getMessage());
            }
            
            // Prices
            JSONObject pricesObj = (JSONObject) productObj.get("prices");
            double boxPrice = (double) pricesObj.get("box");
            double boxUnit = (double) pricesObj.get("unit");
            double boxOther = (double) pricesObj.get("other");

            Product p = new Product();
            p.setId(barcode);
            p.setDescription(desc);
            p.setHasBarcode(hasBarcode);
            p.setCategory(category);
            p.setCost(cost);
            p.setBoxPrice(boxPrice);
            p.setUnitPrice(boxUnit);
            p.setOtherPrice(boxOther);

            products.add(p);
        }
        return products;
    }

    //
    // Units
    //
    @Override
    public boolean setRelation(String productId, int boxes, int others, int units) {
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);

        // Get the Array
        JSONArray productsArr = (JSONArray) productsObj.get("products");

        boolean comesInBoxes = boxes != -1;
        boolean comesInOthers = others != -1;
        boolean comesInUnits = units != -1;

        // Find the product
        for (Object product: productsArr) {
            JSONObject productObj = (JSONObject) product;
            if (productObj.get("id").equals(productId)) {
                JSONObject relationObj = (JSONObject) productObj.get("relation");
                relationObj.replace("box", boxes);
                relationObj.replace("other", others);
                relationObj.replace("unit", units);

                // Two types
                if (comesInBoxes && comesInOthers && !comesInUnits) {
                    productObj.put("others-sold", 0);
                } else if (comesInBoxes && !comesInOthers && comesInUnits) {
                    productObj.put("units-sold", 0);
                } else if (!comesInBoxes && comesInOthers && comesInUnits) {
                    productObj.put("units-sold", 0);
                }

                return JSONHandler.writeJSONFile(productsPath, productsObj);
            }
        }

        return false;
    }

    @Override
    public int[] getRelation(String productId) {
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        int[] relation = {-1, -1, -1};

        // Get the Array
        JSONArray productsArr = (JSONArray) productsObj.get("products");

        for (Object product: productsArr) {
            JSONObject productObj = (JSONObject) product;
            if (productObj.get("id").equals(productId)) {
                JSONObject relationObj = (JSONObject) productObj.get("relation");
                // Boxes
                relation[0] = Math.toIntExact((Long) relationObj.get("box"));
                // Others
                relation[1] = Math.toIntExact((Long) relationObj.get("other"));
                // Units
                relation[2] = Math.toIntExact((Long) relationObj.get("unit"));
                break;
            }
        }
        return relation;
    }

    @Override
    public boolean create(Unit unit) {
        // Get the JSON Object
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        boolean wasFound = false;

        // Get the Array
        JSONArray productsArr = (JSONArray) productsObj.get("products");

        for (Object product: productsArr) {
            JSONObject productObj = (JSONObject) product;
            String productId = (String) productObj.get("id");
            if (productId.equals(unit.getProduct().getId())) {
                wasFound = true;
                int boxesTotal = Math.toIntExact((Long) productObj.get("boxes-total"));
                int othersTotal = Math.toIntExact((Long) productObj.get("others-total"));
                int unitsTotal = Math.toIntExact((Long) productObj.get("units-total"));

                //Get relation
                int[] relation = getRelation(productId);
                boolean comesInBoxes = relation[0] != -1;
                boolean comesInOthers = relation[1] != -1;
                boolean comesInUnits = relation[2] != -1;

                // One type
                if (comesInBoxes && !comesInOthers && !comesInUnits) {
                    boxesTotal += unit.getBoxes();
                } else if (!comesInBoxes && comesInOthers && !comesInUnits) {
                    othersTotal += unit.getOthers();
                } else if (!comesInBoxes && !comesInOthers && comesInUnits) {
                    unitsTotal += unit.getUnits();
                }

                // Two types
                if (comesInBoxes && comesInOthers && !comesInUnits) {
                    boxesTotal += unit.getBoxes();
                    othersTotal += unit.getBoxes() * relation[1];
                } else if (comesInBoxes && !comesInOthers && comesInUnits) {
                    boxesTotal += unit.getBoxes();
                    unitsTotal += unit.getBoxes() * relation[2];
                } else if (!comesInBoxes && comesInOthers && comesInUnits) {
                    othersTotal += unit.getOthers();
                    unitsTotal += unit.getOthers() * relation[2];
                }

                // All types
                if (comesInBoxes && comesInOthers && comesInUnits) {
                    boxesTotal += unit.getBoxes();
                    othersTotal += relation[1] * unit.getBoxes();
                    unitsTotal += relation[2] * relation[1] * unit.getBoxes();
                }

                productObj.put("boxes-total", boxesTotal);
                productObj.put("others-total", othersTotal);
                productObj.put("units-total", unitsTotal);

                JSONArray unitsArr = (JSONArray) productObj.get("units");
                int unitId = Math.toIntExact((Long)(productObj.get("unit-id")));
                productObj.put("unit-id", unitId + 1);

                JSONObject unitObject = new JSONObject();
                unitObject.put("id", unitId);
                unitObject.put("boxes", unit.getBoxes());
                unitObject.put("others", unit.getOthers());
                unitObject.put("units", unit.getUnits());
                unitObject.put("units-sold", 0);
                unitObject.put("others-sold", 0);
                unitObject.put("exp-date", unit.getExpDate().toString());
                unitObject.put("reg-date", unit.getRegDate().toString());
                unitObject.put("lot", unit.getLot());
                unitsArr.add(unitObject);
            }
        }
        if (!wasFound) {
            return false;
        }
        return JSONHandler.writeJSONFile(productsPath, productsObj);
    }

    @Override
    public ArrayList<Unit> listUnits(String id) {
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        JSONArray productsArray = (JSONArray) productsObj.get("products");

        ArrayList<Unit> unitsList = new ArrayList<>();
        JSONArray unitsArr = new JSONArray();

        for (Object product : productsArray) {
            JSONObject productObj = (JSONObject) product;
            if (productObj.get("id").equals(id)) {
                unitsArr = (JSONArray) productObj.get("units");
            }
        }

        Product p = new Product();
        p.setId(id);

        for (Object unit : unitsArr) {
            JSONObject unitObj = (JSONObject) unit;

            int unitId = Math.toIntExact((Long)(unitObj.get("id")));
            int boxes = Math.toIntExact((Long)(unitObj.get("boxes")));
            int others = Math.toIntExact((Long)(unitObj.get("others")));
            int units = Math.toIntExact((Long)(unitObj.get("units")));
            String regDateStr = (String) unitObj.get("reg-date");
            String expDateStr = (String) unitObj.get("exp-date");
            String lot = (String) unitObj.get("lot");
            Date regDate = Date.createDateFrom(regDateStr);
            Date expDate = Date.createDateFrom(expDateStr);

            Unit u = new Unit();
            u.setId(unitId);
            u.setProduct(p);
            u.setBoxes(boxes);
            u.setOthers(others);
            u.setUnits(units);
            u.setLot(lot);
            u.setRegDate(regDate);
            u.setExpDate(expDate);

            unitsList.add(u);
        }
        return unitsList;
    }

    @Override
    public boolean delete(Unit unit) {
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        JSONArray productsArr = (JSONArray) productsObj.get("products");
        boolean wasRemoved;

        for (Object p : productsArr) {
            JSONObject productObj = (JSONObject) p;
            String productId = (String) productObj.get("id");
            if (productId.equals(unit.getProduct().getId())) {
                JSONArray unitsArr = (JSONArray) productObj.get("units");
                int boxesTotal = Math.toIntExact((Long) productObj.get("boxes-total"));
                int othersTotal = Math.toIntExact((Long) productObj.get("others-total"));
                int unitsTotal = Math.toIntExact((Long) productObj.get("units-total"));

                for (Object u : unitsArr) {
                    JSONObject unitObj = (JSONObject) u;
                    int unitId = Math.toIntExact((Long)(unitObj.get("id")));
                    if (unit.getId() == unitId) {
                        wasRemoved = unitsArr.remove(unitObj);

                        //Get relation
                        int[] relation = getRelation(productId);
                        boolean comesInBoxes = relation[0] != -1;
                        boolean comesInOthers = relation[1] != -1;
                        boolean comesInUnits = relation[2] != -1;

                        // One type
                        if (comesInBoxes && !comesInOthers && !comesInUnits) {
                            boxesTotal -= unit.getBoxes();
                        } else if (!comesInBoxes && comesInOthers && !comesInUnits) {
                            othersTotal -= unit.getOthers();
                        } else if (!comesInBoxes && !comesInOthers && comesInUnits) {
                            unitsTotal -= unit.getUnits();
                        }

                        // Two types
                        if (comesInBoxes && comesInOthers && !comesInUnits) {
                            boxesTotal -= unit.getBoxes();
                            othersTotal -= unit.getOthers();
                        } else if (comesInBoxes && !comesInOthers && comesInUnits) {
                            boxesTotal -= unit.getBoxes();
                            unitsTotal -= unit.getUnits();
                        } else if (!comesInBoxes && comesInOthers && comesInUnits) {
                            othersTotal = unit.getOthers();
                            unitsTotal = unit.getUnits();
                        }

                        // All types
                        if (comesInBoxes && comesInOthers && comesInUnits) {
                            boxesTotal -= unit.getBoxes();
                            othersTotal -= unit.getOthers();
                            unitsTotal -= unit.getUnits();
                        }

                        productObj.put("boxes-total", boxesTotal);
                        productObj.put("others-total", othersTotal);
                        productObj.put("units-total", unitsTotal);

                        return JSONHandler.writeJSONFile(Config.PRODUCTS_PATH, productsObj) && wasRemoved;
                    }
                }

            }
        }
        return true;
    }

    @Override
    public boolean update(Unit unit) {
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        JSONArray productsArr = (JSONArray) productsObj.get("products");

        for (Object p : productsArr) {
            JSONObject productObj = (JSONObject) p;
            String productId = (String) productObj.get("id");
            if (productId.equals(unit.getProduct().getId())) {
                JSONArray unitsArr = (JSONArray) productObj.get("units");
                int boxesTotal = Math.toIntExact((Long) productObj.get("boxes-total"));
                int othersTotal = Math.toIntExact((Long) productObj.get("others-total"));
                int unitsTotal = Math.toIntExact((Long) productObj.get("units-total"));

                int index = 0;
                for (Object u : unitsArr) {
                    JSONObject unitObj = (JSONObject) u;
                    int unitId = Math.toIntExact((Long)(unitObj.get("id")));
                    if (unit.getId() == unitId) {
                        // Verify the unit type
                        int quantity = Math.toIntExact((Long) unitObj.get("quantity"));

                        //Get relation
                        int[] relation = getRelation(productId);
                        boolean comesInBoxes = relation[0] != -1;
                        boolean comesInOthers = relation[1] != -1;
                        boolean comesInUnits = relation[2] != -1;

                        // One type
                        if (comesInBoxes && !comesInOthers && !comesInUnits) {
                            boxesTotal -= quantity;
                            boxesTotal += unit.getQuantity();
                        } else if (!comesInBoxes && comesInOthers && !comesInUnits) {
                            othersTotal -= quantity;
                            othersTotal += unit.getQuantity();
                        } else if (!comesInBoxes && !comesInOthers && comesInUnits) {
                            unitsTotal -= quantity;
                            unitsTotal += unit.getQuantity();
                        }

                        // Two types
                        if (comesInBoxes && comesInOthers && !comesInUnits) {
                            boxesTotal -= quantity;
                            othersTotal -= quantity * relation[1];

                            boxesTotal += unit.getQuantity();
                            othersTotal += unit.getQuantity() * relation[1];
                        } else if (comesInBoxes && !comesInOthers && comesInUnits) {
                            boxesTotal -= quantity;
                            unitsTotal -= quantity * relation[2];

                            boxesTotal += unit.getQuantity();
                            unitsTotal += unit.getQuantity() * relation[2];
                        } else if (!comesInBoxes && comesInOthers && comesInUnits) {
                            othersTotal += quantity;
                            unitsTotal += quantity * relation[2];

                            othersTotal += unit.getQuantity();
                            unitsTotal += unit.getQuantity() * relation[2];
                        }

                        // All types
                        if (comesInBoxes && comesInOthers && comesInUnits) {
                            boxesTotal -= quantity;
                            othersTotal -= relation[1] * quantity;
                            unitsTotal -= relation[2] * relation[1] * quantity;

                            boxesTotal += unit.getQuantity();
                            othersTotal += relation[1] * unit.getQuantity();
                            unitsTotal += relation[2] * relation[1] * unit.getQuantity();
                        }

                        unitsArr.remove(unitObj);
                        unitObj.put("quantity", unit.getQuantity());
                        unitObj.put("lot", unit.getLot());
                        unitObj.put("exp-date", unit.getExpDate().toString());
                        unitsArr.add(index, unitObj);

                        productObj.put("boxes-total", boxesTotal);
                        productObj.put("others-total", othersTotal);
                        productObj.put("units-total", unitsTotal);

                        return JSONHandler.writeJSONFile(productsPath, productsObj);
                    }
                    index++;
                }
            }
        }
        return true;
    }

    @Override
    public boolean removeUnits(int unitType, int quantity, String productId) throws
            NotEnoughBoxes,
            NotEnoughUnits,
            NotEnoughOthers,
            NotEnoughUnitsPerBox, NotEnoughUnitsPerOther, NotEnoughOthersPerBox {
        // Remove the units
        String productsPath = Config.PRODUCTS_TEMP_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        JSONArray productsArr = (JSONArray) productsObj.get("products");
        JSONArray unitsArr = null;

        JSONObject productObj = null;
        JSONObject unitToExpire;

        int totalBoxes = -1;
        int totalOthers = -1;
        int totalUnits = -1;
        boolean productFound = false;

        for (Object p : productsArr) {
            productObj = (JSONObject) p;
            String id = (String) productObj.get("id");

            if (productId.equals(id)) {
                productFound = true;
                totalBoxes = Math.toIntExact((Long) (productObj.get("boxes-total")));
                totalOthers = Math.toIntExact((Long) (productObj.get("others-total")));
                totalUnits = Math.toIntExact((Long) (productObj.get("units-total")));

                switch (unitType) {
                    case Unit.BOX:
                        if (quantity > totalBoxes) {
                            throw new NotEnoughBoxes();
                        }
                        break;
                    case Unit.OTHER:
                        if (quantity > totalOthers) {
                            throw new NotEnoughOthers();
                        }
                        break;
                    case Unit.UNIT:
                        if (quantity > totalUnits) {
                            throw new NotEnoughUnits();
                        }
                        break;
                }
            }
            if (productFound) { break; }
        }

        if (productObj == null) {
            return false;
        }

        //Get relation
        int[] relation = getRelation(productId);
        boolean comesInBoxes = relation[0] != -1;
        boolean comesInOthers = relation[1] != -1;
        boolean comesInUnits = relation[2] != -1;
        int types = 0;

        for (int r : relation) {
            if (r != -1) {
                types ++;
            }
        }

        String unit = "";
        switch (unitType) {
            case Unit.BOX:
                unit = "boxes";
                break;
            case Unit.OTHER:
                unit = "others";
                break;
            case Unit.UNIT:
                unit = "units";
                break;
        }

        int unitsRemoved = 0;
        int qStock;
        JSONObject unitAux = null;
        while (unitsRemoved < quantity) {
            unitsArr = (JSONArray) productObj.get("units");
            for (Object u : unitsArr) {
                JSONObject unitObj = (JSONObject) u;
                String dateStr = (String) unitObj.get("exp-date");
                int boxes;
                int units;
                int others;
                if (unitObj.get("boxes") instanceof Integer) {
                    boxes = (int) unitObj.get("boxes");
                } else {
                    boxes = Math.toIntExact((Long) (unitObj.get("boxes")));
                }
                if (unitObj.get("units") instanceof Integer) {
                    units = (int) unitObj.get("units");
                } else {
                    units = Math.toIntExact((Long) (unitObj.get("units")));
                }
                if (unitObj.get("others") instanceof Integer) {
                    others = (int) unitObj.get("others");
                } else {
                    others = Math.toIntExact((Long) (unitObj.get("others")));
                }
                if (
                        (unitType == Unit.BOX && boxes == 0) ||
                        (unitType == Unit.OTHER && others == 0) ||
                        (unitType == Unit.UNIT && units == 0)
                ) {
                    unitAux = unitObj;
                    unitsArr.remove(unitObj);
                    break;
                }
            }

            // Find the unit
            unitToExpire = (JSONObject) unitsArr.get(0);
            String dateStr = (String) unitToExpire.get("exp-date");
            Date lowerDate = Date.createDateFrom(dateStr);
            int units;
            int boxes;
            int others;
            if (unitToExpire.get("boxes") instanceof Integer) {
                boxes = (int) unitToExpire.get("boxes");
            } else {
                boxes = Math.toIntExact((Long) (unitToExpire.get("boxes")));
            }
            if (unitToExpire.get("units") instanceof Integer) {
                units = (int) unitToExpire.get("units");
            } else {
                units = Math.toIntExact((Long) (unitToExpire.get("units")));
            }
            if (unitToExpire.get("others") instanceof Integer) {
                others = (int) unitToExpire.get("others");
            } else {
                others = Math.toIntExact((Long) (unitToExpire.get("others")));
            }

            qStock = getqStock(unitType, unitToExpire);

            for (Object u : unitsArr) {
                JSONObject unitObj = (JSONObject) u;
                dateStr = (String) unitObj.get("exp-date");
                // which unit will expire soon
                Date currDate = Date.createDateFrom(dateStr);
                if (currDate.compareTo(lowerDate) < 0) {
                    lowerDate = currDate;
                    unitToExpire = unitObj;
                    qStock = getqStock(unitType, unitToExpire);
                    if (unitToExpire.get("boxes") instanceof Integer) {
                        boxes = (int) unitToExpire.get("boxes");
                    } else {
                        boxes = Math.toIntExact((Long) (unitToExpire.get("boxes")));
                    }
                    if (unitToExpire.get("units") instanceof Integer) {
                        units = (int) unitToExpire.get("units");
                    } else {
                        units = Math.toIntExact((Long) (unitToExpire.get("units")));
                    }
                }
            }

            switch (types) {
                case 1:
                    int quantityRemoved;
                    // Remove units
                    if (quantity - unitsRemoved >= qStock) {
                        unitsRemoved += qStock;
                        unitsArr.remove(unitToExpire);
                        quantityRemoved = qStock;
                    } else {
                        unitToExpire.put(unit, qStock - (quantity - unitsRemoved));
                        quantityRemoved = quantity - unitsRemoved;
                        unitsRemoved = quantity;
                    }

                    switch (unitType) {
                        case Unit.BOX:
                            totalBoxes -= quantityRemoved;
                            break;
                        case Unit.OTHER:
                            totalOthers -= quantityRemoved;
                            break;
                        case Unit.UNIT:
                            totalUnits -= quantityRemoved;
                            break;
                    }
                    break;
                case 2:
                    int unitsSold;
                    int othersSold;

                    boolean boxAndOther = comesInBoxes && comesInOthers && !comesInUnits;
                    boolean boxAndUnit = comesInBoxes && !comesInOthers && comesInUnits;
                    boolean otherAndUnit = !comesInBoxes && comesInOthers && comesInUnits;

                    if (boxAndOther) {
                        othersSold = Math.toIntExact((Long) (unitToExpire.get("others-sold")));
                        if (unitType == Unit.BOX) {
                            if (quantity - unitsRemoved < qStock) {
                                unitToExpire.put(unit, qStock - (quantity - unitsRemoved));
                                unitToExpire.put("others", others - ((quantity - unitsRemoved) * relation[1]));
                                totalOthers -= (quantity - unitsRemoved) * relation[1];
                                totalBoxes -= (quantity - unitsRemoved);
                                unitsRemoved = quantity;
                            } else {
                                unitsRemoved += qStock;
                                if (othersSold == 0) {
                                    unitsArr.remove(unitToExpire);
                                } else {
                                    unitToExpire.put("boxes", 0);
                                }
                                totalOthers -= qStock * relation[1];
                                totalBoxes -= qStock;
                            }
                        } else if (unitType == Unit.OTHER) {
                            if (quantity >= relation[1]) {
                                throw new NotEnoughOthersPerBox();
                            }
                            if (othersSold == 0) {
                                totalBoxes --;
                                unitToExpire.put("boxes", boxes - 1);
                            }
                            if (relation[1] - othersSold < quantity) {
                                // it needs two boxes
                                unitsRemoved += relation[2] - othersSold;
                                totalUnits -= relation[2] - othersSold;
                                unitToExpire.put("others", units - (relation[1] - othersSold));
                                unitToExpire.replace("units-sold", (long) 0);
                                if (boxes == 0) {
                                    unitsArr.remove(unitToExpire);
                                }
                            } else if (othersSold + quantity == relation[1]) {
                                // Remove box
                                unitToExpire.replace("others-sold", (long) 0);
                                totalOthers -= quantity;
                                unitsRemoved = quantity;
                                unitToExpire.replace("others", others - (quantity - unitsRemoved));
                                if (boxes == 0) {
                                    unitsArr.remove(unitToExpire);
                                } else {
                                    unitToExpire.replace("boxes", boxes - 1);
                                }
                            } else {
                                // the current box is enough
                                othersSold += (quantity - unitsRemoved);
                                unitToExpire.put("others-sold", othersSold);
                                unitToExpire.put("others", others - (quantity - unitsRemoved));
                                totalOthers -= (quantity - unitsRemoved);
                                unitsRemoved = quantity;
                            }
                        }
                    } else if (boxAndUnit) {
                        unitsSold = Math.toIntExact((Long) (unitToExpire.get("units-sold")));
                        if (unitType == Unit.BOX) {
                            if (quantity - unitsRemoved < qStock) {
                                unitToExpire.put(unit, qStock - (quantity - unitsRemoved));
                                unitToExpire.put("units", units - ((quantity - unitsRemoved) * relation[2]));
                                totalUnits -= (quantity - unitsRemoved) * relation[2];
                                totalBoxes -= (quantity - unitsRemoved);
                                unitsRemoved = quantity;
                            } else {
                                unitsRemoved += qStock;
                                if (unitsSold == 0) {
                                    unitsArr.remove(unitToExpire);
                                } else {
                                    unitToExpire.put("boxes", 0);
                                }
                                totalUnits -= qStock * relation[2];
                                totalBoxes -= qStock;
                            }
                        } else if (unitType == Unit.UNIT) {
                            if (quantity >= relation[2]) {
                                throw new NotEnoughOthersPerBox();
                            }
                            if (unitsSold == 0) {
                                totalBoxes --;
                                unitToExpire.put("boxes", boxes - 1);
                            }
                            if (relation[2] - unitsSold < quantity) {
                                // it needs two boxes
                                unitsRemoved += relation[2] - unitsSold;
                                totalUnits -= relation[2] - unitsSold;
                                unitToExpire.put("units", units - (relation[2] - unitsSold));
                                unitToExpire.replace("units-sold", (long) 0);
                                if (boxes == 0) {
                                    unitsArr.remove(unitToExpire);
                                }
                            } else if (unitsSold + quantity == relation[2]) {
                                // Remove box
                                unitToExpire.replace("units-sold", (long) 0);
                                totalUnits -= quantity;
                                unitsRemoved = quantity;
                                unitToExpire.replace("units", units - (quantity - unitsRemoved));
                                if (boxes == 0) {
                                    unitsArr.remove(unitToExpire);
                                } else {
                                    unitToExpire.replace("boxes", boxes - 1);
                                }
                            } else {
                                // the current box is enough
                                unitsSold += (quantity - unitsRemoved);
                                unitToExpire.put("units-sold", unitsSold);
                                unitToExpire.put("units", units - (quantity - unitsRemoved));
                                totalUnits -= (quantity - unitsRemoved);
                                unitsRemoved = quantity;
                            }
                        }
                    break;
                    } else if (otherAndUnit) {
                        unitsSold = Math.toIntExact((Long) (unitToExpire.get("units-sold")));
                        if (unitType == Unit.OTHER) {
                            if (quantity - unitsRemoved < qStock) {
                                unitToExpire.put(unit, qStock - (quantity - unitsRemoved));
                                unitToExpire.put("units", units - ((quantity - unitsRemoved) * relation[2]));
                                totalUnits -= (quantity - unitsRemoved) * relation[2];
                                totalOthers -= (quantity - unitsRemoved);
                                unitsRemoved = quantity;
                            } else {
                                unitsRemoved += qStock;
                                if (unitsSold == 0) {
                                    unitsArr.remove(unitToExpire);
                                } else {
                                    unitToExpire.put("others", 0);
                                }
                                totalUnits -= qStock * relation[2];
                                totalOthers -= qStock;
                            }
                        } else if (unitType == Unit.UNIT) {
                            if (quantity >= relation[2]) {
                                throw new NotEnoughUnitsPerOther();
                            }
                            if (unitsSold == 0) {
                                totalOthers--;
                                unitToExpire.put("others", others - 1);
                            }
                            if (relation[2] - unitsSold < quantity) {
                                // it needs two boxes
                                unitsRemoved += relation[2] - unitsSold;
                                totalUnits -= relation[2] - unitsSold;
                                unitToExpire.put("units", units - (relation[2] - unitsSold));
                                unitToExpire.replace("units-sold", (long) 0);
                                if (others == 0) {
                                    unitsArr.remove(unitToExpire);
                                }
                            } else if (unitsSold + quantity == relation[2]) {
                                // Remove box
                                unitToExpire.replace("units-sold", (long) 0);
                                totalUnits -= quantity;
                                unitsRemoved = quantity;
                                unitToExpire.replace("units", units - (quantity - unitsRemoved));
                                if (others == 0) {
                                    unitsArr.remove(unitToExpire);
                                } else {
                                    unitToExpire.replace("others", others - 1);
                                }
                            } else {
                                // the current box is enough
                                unitsSold += (quantity - unitsRemoved);
                                unitToExpire.put("units-sold", unitsSold);
                                unitToExpire.put("units", units - (quantity - unitsRemoved));
                                totalUnits -= (quantity - unitsRemoved);
                                unitsRemoved = quantity;
                            }
                        }
                    }
                    break;
                case 3:
                    othersSold = Math.toIntExact((Long) (unitToExpire.get("others-sold")));
                    unitsSold = Math.toIntExact((Long) (unitToExpire.get("units-sold")));

                    if (unitType == Unit.BOX) {
                        if (quantity - unitsRemoved < qStock) {
                            unitToExpire.put("boxes", boxes - (quantity - unitsRemoved));
                            totalOthers -= (quantity - unitsRemoved) * relation[1];
                            unitToExpire.put("others", others - ((quantity - unitsRemoved) * relation[1]));
                            totalUnits -= (quantity - unitsRemoved) * relation[1] * relation[2];
                            unitToExpire.put("units", units - ((quantity - unitsRemoved) * relation[1] * relation[2]));
                            totalBoxes -= (quantity - unitsRemoved);
                            unitsRemoved = quantity;
                        } else {
                            unitsRemoved += qStock;
                            if (unitsSold == 0 && othersSold == 0) {
                                unitsArr.remove(unitToExpire);
                            }
                            totalOthers -= qStock * relation[2];
                            totalUnits -= qStock * relation[1] * relation[2];
                            totalBoxes -= qStock;
                        }
                    } else if (unitType == Unit.OTHER) {
                        if (quantity >= relation[1]) {
                            throw new NotEnoughOthersPerBox();
                        }
                        if (othersSold == 0) {
                            if (totalBoxes != 0) {
                                totalBoxes --;
                            }
                            unitToExpire.put("boxes", boxes - 1);
                        }
                        if (relation[1] - othersSold < quantity) {
                            // it needs two boxes
                            unitsRemoved += relation[1] - othersSold;
                            totalOthers -= relation[1] - othersSold;
                            unitToExpire.put("others", others - (relation[1] - othersSold));
                            totalUnits -= (relation[1] - othersSold) * relation[2];
                            unitToExpire.put("units", units - (relation[1] - othersSold) * relation[2]);
                            unitToExpire.replace("others-sold", (long) 0);
                            if (unitsSold == 0 && boxes == 0) {
                                unitsArr.remove(unitToExpire);
                            }
                        } else if (unitsSold + quantity == relation[1]) {
                            // Remove box
                            unitToExpire.replace("others-sold", (long) 0);
                            totalOthers -= quantity;
                            unitToExpire.replace("others", others - (quantity - unitsRemoved));
                            totalUnits -= quantity * relation[2];
                            unitToExpire.put("units", units - ((quantity - unitsRemoved) * relation[2]));
                            unitsRemoved = quantity;
                            if (boxes == 0 && unitsSold == 0) {
                                unitsArr.remove(unitToExpire);
                            }
                        } else {
                            // the current box is enough
                            othersSold += (quantity - unitsRemoved);
                            unitToExpire.put("others-sold", othersSold);
                            totalOthers -= (quantity - unitsRemoved);
                            unitToExpire.put("others", others - (quantity - unitsRemoved));
                            totalUnits -= (quantity - unitsRemoved) * relation[2];
                            unitToExpire.put("units", units - ((quantity - unitsRemoved) * relation[2]));
                            unitsRemoved = quantity;
                        }
                    } else if (unitType == Unit.UNIT) {
                        if (quantity >= relation[2]) {
                            throw new NotEnoughUnitsPerOther();
                        }
                        if (unitsSold == 0) {
                            if (othersSold == 0 && boxes != 0) {
                                totalBoxes --;
                            }
                            othersSold ++;
                            unitToExpire.replace("others-sold", othersSold);
                            totalOthers --;
                            unitToExpire.replace("others", others - 1);
                            unitToExpire.put("boxes", boxes - 1);
                        }
                        if (relation[2] - unitsSold < quantity) {
                            // it needs more than one 'other'
                            unitsRemoved += relation[2] - unitsSold;
                            totalUnits -= relation[2] - unitsSold;
                            unitToExpire.replace("units-sold", (long) 0);
                            unitToExpire.put("units", units - (relation[2] - unitsSold));
                            if (boxes == 0) {
                                unitsArr.remove(unitToExpire);
                            }
                        } else if (unitsSold + quantity == relation[2]) {
                            // Remove other
                            unitToExpire.replace("units-sold", (long) 0);
                            othersSold++;
                            unitToExpire.replace("others-sold", othersSold);
                            totalUnits -= quantity;
                            unitToExpire.put("units", units - (quantity - unitsRemoved));
                            unitsRemoved = quantity;
                            if (boxes == 0) {
                                if (othersSold == relation[1]) {
                                    unitToExpire.replace("others-sold", (long) 0);
                                    unitsArr.remove(unitToExpire);
                                }
                            }
                        } else {
                            // the current other is enough
                            unitsSold += (quantity - unitsRemoved);
                            unitToExpire.put("units-sold", unitsSold);
                            unitToExpire.put("units", units - (quantity - unitsRemoved));
                            totalUnits -= (quantity - unitsRemoved);
                            unitsRemoved = quantity;
                        }
                    }
                    break;
            }
        }

        // Update total
        if (comesInBoxes) {
            productObj.replace("boxes-total", totalBoxes);
        }
        if (comesInOthers) {
            productObj.replace("others-total", totalOthers);
        }
        if (comesInUnits) {
            productObj.replace("units-total", totalUnits);
        }

        if (unitAux != null) {
            unitsArr.add(unitAux);
        }

        return JSONHandler.writeJSONFile(productsPath, productsObj);
    }

    private int getqStock(int unitType, JSONObject unitToExpire) {
        int qStock = -1;
        switch (unitType) {
            case Unit.BOX:
                if (unitToExpire.get("boxes") instanceof Integer) {
                    qStock = (int) unitToExpire.get("boxes");
                } else {
                    qStock = Math.toIntExact((Long) unitToExpire.get("boxes"));
                }
                break;
            case Unit.OTHER:
                if (unitToExpire.get("others") instanceof Integer) {
                    qStock = (int) unitToExpire.get("others");
                } else {
                    qStock = Math.toIntExact((Long) unitToExpire.get("others"));
                }
                break;
            case Unit.UNIT:
                if (unitToExpire.get("units") instanceof Integer) {
                    qStock = (int) unitToExpire.get("units");
                } else {
                    qStock = Math.toIntExact((Long) unitToExpire.get("units"));
                }
                break;
        }
        return qStock;
    }

    @Override
    public int getTotalBoxes(String productId) {
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        JSONArray productsArr = (JSONArray) productsObj.get("products");

        for (Object p : productsArr) {
            JSONObject productObj = (JSONObject) p;
            String id = (String) productObj.get("id");
            if (id.equals(productId)) {
                return Math.toIntExact((Long) productObj.get("boxes-total"));
            }
        }
        return 0;
    }

    @Override
    public int getTotalOthers(String productId) {
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        JSONArray productsArr = (JSONArray) productsObj.get("products");

        for (Object p : productsArr) {
            JSONObject productObj = (JSONObject) p;
            String id = (String) productObj.get("id");
            if (id.equals(productId)) {
                return Math.toIntExact((Long) productObj.get("others-total"));
            }
        }
        return 0;
    }

    @Override
    public int getTotalUnits(String productId) {
        String productsPath = Config.PRODUCTS_PATH;
        JSONObject productsObj = JSONHandler.getJSONObject(productsPath);
        JSONArray productsArr = (JSONArray) productsObj.get("products");

        for (Object p : productsArr) {
            JSONObject productObj = (JSONObject) p;
            String id = (String) productObj.get("id");
            if (id.equals(productId)) {
                return Math.toIntExact((Long) productObj.get("units-total"));
            }
        }
        return 0;
    }

    @Override
    public boolean copyFile() {
        String source = Config.PRODUCTS_PATH;
        String dest = Config.PRODUCTS_TEMP_PATH;
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
}
