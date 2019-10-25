package view;

import logic.Product;
import view.abstracts.AbstractInternalView;
import view.abstracts.AbstractView;
import view.msg.Message;

import javax.swing.*;

public class ProductFoundInternalView extends AbstractInternalView {

    private StockInternalView stockInternalView;

    public ProductFoundInternalView(AbstractView parent, StockInternalView stockInternalView) {
        super(230, 200, "¡Producto encontrado!", parent);
        this.stockInternalView = stockInternalView;
    }

    @Override
    public void initComponents() {
        JButton btnInfo = new JButton("Mostrar Producto");
        btnInfo.addActionListener(e -> buttonPressed(ProductInternalView.INFO));
        btnInfo.setBounds(10, 10, 200, 40);
        add(btnInfo);

        JButton btnUpdate = new JButton("Editar Producto");
        btnUpdate.setBounds(10, 60, 200, 40);
        btnUpdate.addActionListener(e -> buttonPressed(ProductInternalView.UPDATE));
        add(btnUpdate);

        JButton btnDelete = new JButton("Eliminar Producto");
        btnDelete.setBounds(10, 110, 200, 40);
        btnDelete.addActionListener(e -> deleteOnClick());
        add(btnDelete);
    }

    private void buttonPressed(int method) {
        setVisible(false);

        ProductInternalView productInternalView = new ProductInternalView(parent, method, stockInternalView);
        productInternalView.setProduct(stockInternalView.getProductToShow());
        parent.add(productInternalView);
        productInternalView.setVisible(true);
    }

    private void deleteOnClick() {
        setVisible(false);

        if (Product.delete(stockInternalView.getProductToShow().getId())) {
            new Message().showMessage("Producto eliminado satisfactoriamente");
            stockInternalView.updateProductsTable();
            return;
        }
        new Message().showError("El producto no pudo ser eliminado");
    }
}
