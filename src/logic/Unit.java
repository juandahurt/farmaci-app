package logic;

public class Unit {

    public static final int BOX = 0;
    public static final int OTHER = 1;
    public static final int UNIT = 2;

    private Product product;

    private int id;

    private int quantity;

    private int boxes;

    private int others;

    private int units;

    private String lot;

    /**
     * Registration date
     */
    private Date regDate;

    /**
     * Expiration date
     */
    private Date expDate;

    public Unit() {
        this.quantity = -1;
        this.boxes = -1;
        this.others = -1;
        this.units = -1;
        this.lot = "";
        this.expDate = null;
        this.regDate = new Date();
    }

    public int getBoxes() {
        return boxes;
    }

    public void setBoxes(int boxes) {
        this.boxes = boxes;
    }

    public int getOthers() {
        return others;
    }

    public void setOthers(int others) {
        this.others = others;
    }

    public int getUnits() {
        return units;
    }

    public void setUnits(int units) {
        this.units = units;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getLot() {
        return lot;
    }

    public void setLot(String lot) {
        this.lot = lot;
    }

    public Date getRegDate() {
        return regDate;
    }

    public void setRegDate(Date regDate) {
        this.regDate = regDate;
    }

    public Date getExpDate() {
        return expDate;
    }

    public void setExpDate(Date expDate) {
        this.expDate = expDate;
    }
}
