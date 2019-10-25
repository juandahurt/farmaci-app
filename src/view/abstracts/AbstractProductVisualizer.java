package view.abstracts;

import logic.Product;

public abstract class AbstractProductVisualizer extends AbstractInternalView {

    protected Product productToShow;

    public AbstractProductVisualizer(int width, int height, String title, AbstractView parent) {
        super(width, height, title, parent);
        productToShow = null;
    }
    public abstract void showProduct();
    public abstract void showNotFound();

    public void setProductToShow(Product productToShow) {
        this.productToShow = productToShow;
    }

    public Product getProductToShow() {
        return this.productToShow;
    }
}
