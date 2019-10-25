package logic;

import dataAccess.dao.ProductDAO;
import dataAccess.daoImpl.ProductDAOImpl;
import logic.exceptions.*;

import java.util.ArrayList;

public class ProductInCart {

    private String productId;

    private int publicId;

    private String description;

    private double price;

    private int type;

    private double subtotal;

    private int quantity;

    public ProductInCart() {}

    public String getProductId() {
        return productId;
    }

    public void setProductId(String id) {
        this.productId = id;
    }

    public int getPublicId() {
        return publicId;
    }

    public void setPublicId(int publicId) {
        this.publicId = publicId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    //
    // Static methods
    //
    public static void updateCart(ArrayList<ProductInCart> products)
            throws
            NotEnoughOthers,
            NotEnoughUnits,
            NotEnoughBoxes,
            NotEnoughUnitsPerBox {
        ProductDAO productDAO = new ProductDAOImpl();
        productDAO.copyFile();
        int id = 0;
        for (ProductInCart product : products) {
            product.setPublicId(id);
            try {
                productDAO.removeUnits(product.type, product.getQuantity(), product.getProductId());
            } catch (NotEnoughUnitsPerOther | NotEnoughOthersPerBox notEnoughUnitsPerOther) {
                notEnoughUnitsPerOther.printStackTrace();
            }
            id++;
        }
    }
}