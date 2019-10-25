package view;

import logic.Category;
import view.abstracts.AbstractInternalView;
import view.abstracts.AbstractView;
import view.msg.Message;

import javax.swing.*;

public class UpdateCategoryInternalView extends AbstractInternalView {

    // Main container
    private JPanel pnlMainContainer;

    // Name
    private JLabel lblName;
    private JTextField txtName;

    // Button
    private JButton btnSave;

    private int categoryId;

    private StockInternalView stockInternalView;

    public UpdateCategoryInternalView(int id, AbstractView parent, StockInternalView stockInternalView) {
        super(300, 210, "Actualizar Categoría", parent);
        this.categoryId = id;
        this.stockInternalView = stockInternalView;
    }

    @Override
    public void initComponents() {
        // Main Container
        pnlMainContainer = getContainer();
        pnlMainContainer.setBounds(10,10, 270, 160);

        // Name
        lblName = new JLabel("Nombre");
        lblName.setBounds(10, 10, 80, 30);
        pnlMainContainer.add(lblName);

        txtName = new JTextField();
        txtName.setBounds(10, 50, 250, 30);
        pnlMainContainer.add(txtName);

        // Button
        ImageIcon icoSave = new ImageIcon(getClass().getResource("/img/icons/save.png"));
        btnSave = new JButton(icoSave);
        btnSave.setBounds(95, getHeight() - 110, 80, 50);
        btnSave.addActionListener(e -> saveOnClick());
        pnlMainContainer.add(btnSave);

        add(pnlMainContainer);
    }

    private void saveOnClick() {
        Category category = new Category();
        category.setName(txtName.getText());
        category.setId(this.categoryId);
        if (Category.update(this.categoryId, category)) {
            new Message().showMessage("Categoría actualizada correctamente");
        } else {
            new Message().showError("La categoría no pudo ser actualizada");
        }
        // Update tables
        stockInternalView.updateCategoriesTable();
        stockInternalView.updateProductsTable();
    }
}
