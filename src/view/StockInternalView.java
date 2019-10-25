package view;

import com.mxrck.autocompleter.TextAutoCompleter;
import logic.Category;
import logic.Product;
import logic.exceptions.NameAlreadyRegistered;
import view.abstracts.AbstractProductVisualizer;
import view.abstracts.AbstractView;
import view.helpers.SearchKeyListener;
import view.msg.Message;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;

class StockInternalView extends AbstractProductVisualizer {
    //
    // Buttons area
    //
    private JPanel pnlMainContainer;
    private JButton btnAddProduct;
    private JButton btnInfo;
    private JButton btnUpdate;
    private JButton btnDelete;
    private JButton btnAddUnits;

    //
    // Stock tabs pane
    //
    private JTabbedPane tbpStock;

    //
    // Products tab
    //
    private JTextField txtSearch;
    private TextAutoCompleter textAutoCompleter;
    private JButton btnSearch;
    private JPanel pnlTable;
    private JTable tblProducts;

    //
    // Categories tab
    //
    private JPanel pnlCategories;
    private JPanel pnlCategoriesTable;
    private JTable tblCategories;
    private JPanel pnlAddCategory;
    private JLabel lblAddCategorySubTitle;
    private JLabel lblCategoryName;
    private JTextField txtCategoryName;
    private JButton btnAddCategory;

    //
    // update an delete category buttons
    //
    private JButton btnUpdateCategory;
    private JButton btnDeleteCategory;

    StockInternalView(AbstractView parent) {
        super(750, 400, "Bodega", parent);
    }

    @Override
    public void initComponents() {
        //
        // Buttons area
        //
        pnlMainContainer = getContainer();
        pnlMainContainer.setBounds(10, 10, getWidth() - 40, 340);
        add(pnlMainContainer);

        ImageIcon icoAddProduct = new ImageIcon(getClass().getResource("/img/icons/add.png"));
        btnAddProduct = new JButton(icoAddProduct);
        btnAddProduct.setToolTipText("Agregar nuevo producto");
        btnAddProduct.setBounds(5, 5, 80, 50);
        btnAddProduct.addActionListener(e -> addOnClick());
        pnlMainContainer.add(btnAddProduct);

        Icon icoMore = new ImageIcon(getClass().getResource("/img/icons/more.png"));
        btnInfo = new JButton(icoMore);
        btnInfo.setToolTipText("Más información sobre el producto");
        btnInfo.addActionListener(e -> moreOnClick());
        btnInfo.setBounds(90, 5, 80, 50);
        pnlMainContainer.add(btnInfo);

        Icon icoUpdate = new ImageIcon(getClass().getResource("/img/icons/update.png"));
        btnUpdate = new JButton(icoUpdate);
        btnUpdate.setToolTipText("Modificar producto");
        btnUpdate.addActionListener(e -> updateOnClick());
        btnUpdate.setBounds(175, 5, 80, 50);
        pnlMainContainer.add(btnUpdate);

        ImageIcon icoDelete = new ImageIcon(getClass().getResource("/img/icons/delete.png"));
        btnDelete = new JButton(icoDelete);
        btnDelete.setToolTipText("Eliminar producto");
        btnDelete.setBounds(260, 5, 80, 50);
        btnDelete.addActionListener(e -> deleteOnClick());
        pnlMainContainer.add(btnDelete);

        txtSearch = new JTextField();
        txtSearch.setBounds(440, 15, 180, 30);
        txtSearch.addKeyListener(new SearchKeyListener(txtSearch, this));
        pnlMainContainer.add(txtSearch);

        textAutoCompleter = new TextAutoCompleter(txtSearch);

        Icon icoSearch = new ImageIcon(getClass().getResource("/img/icons/search.png"));
        btnSearch = new JButton(icoSearch);
        btnSearch.setToolTipText("Buscar producto");
        btnSearch.addActionListener(e -> searchOnClick());
        btnSearch.setBounds(getWidth() - 125, 5, 80, 50);
        pnlMainContainer.add(btnSearch);

        //
        // Products tab
        //
        tblProducts = new JTable();
        updateProductsTable();

        pnlTable = new JPanel();
        pnlTable.setLayout(new BorderLayout());
        pnlTable.add(tblProducts.getTableHeader(), "First");
        pnlTable.add(tblProducts, "Center");
        JScrollPane productsScroll = new JScrollPane(pnlTable);
        productsScroll.setBounds(5, 60, 700, 275);

        //
        // Categories tab
        //
        tblCategories = new JTable();
        updateCategoriesTable();
        pnlCategories = getContainer();
        pnlCategories.setBackground(Color.WHITE);

        pnlCategoriesTable = getContainer();
        pnlCategoriesTable.setLayout(new BorderLayout());
        pnlCategoriesTable.add(tblCategories.getTableHeader(), "First");
        pnlCategoriesTable.add(tblCategories, "Center");
        JScrollPane categoriesScroll = new JScrollPane(pnlCategoriesTable);
        categoriesScroll.setBounds(10, 10, 340, 210);
        pnlCategories.add(categoriesScroll);

        pnlAddCategory = getContainer();
        pnlAddCategory.setBounds(360, 10, 310, 150);

        lblAddCategorySubTitle = new JLabel("Añadir categoría");
        lblAddCategorySubTitle.setBounds(100, 10, 120, 30);
        pnlAddCategory.add(lblAddCategorySubTitle);

        lblCategoryName = new JLabel("Nombre");
        lblCategoryName.setBounds(10, 50, 90, 30);
        pnlAddCategory.add(lblCategoryName);

        txtCategoryName = new JTextField();
        txtCategoryName.setBounds(85, 50, 210, 30);
        pnlAddCategory.add(txtCategoryName);

        Icon icoAddCategory = new ImageIcon(getClass().getResource("/img/icons/left-arrow.png"));
        btnAddCategory = new JButton(icoAddCategory);
        btnAddCategory.setBounds(120, 90, 80, 50);
        btnAddCategory.addActionListener(e -> addCategoryOnClick());
        pnlAddCategory.add(btnAddCategory);

        pnlCategories.add(pnlAddCategory);

        //
        // update an delete category buttons
        //
        btnUpdateCategory = new JButton(icoUpdate);
        btnUpdateCategory.setBounds(400, 170, 80, 50);
        btnUpdateCategory.addActionListener(e -> updateCategoryOnClick());
        pnlCategories.add(btnUpdateCategory);

        btnDeleteCategory = new JButton(icoDelete);
        btnDeleteCategory.setBounds(560, 170, 80, 50);
        btnDeleteCategory.addActionListener(e -> deleteCategoryOnClick());
        pnlCategories.add(btnDeleteCategory);

        //
        // Stock tabs
        //
        tbpStock = new JTabbedPane();
        tbpStock.addChangeListener(e -> stockOnChange());
        tbpStock.setBounds(5, 60, 700, 275);
        tbpStock.add("Productos", productsScroll);
        tbpStock.add("Categorías", pnlCategories);
        pnlMainContainer.add(tbpStock);
    }

    @Override
    public void showProduct() {
        ProductFoundInternalView productFoundInternalView = new ProductFoundInternalView(parent, this);
        parent.add(productFoundInternalView);
        productFoundInternalView.setVisible(true);
    }

    @Override
    public void showNotFound() {
        new Message().showNotFound();
    }

    private void deleteCategoryOnClick() {
        if (!userHasSelectedACategory()) {
            new Message().showError("Debe seleccionar una categoría");
        } else {
            int row = tblCategories.getSelectedRow();
            int id = (int)tblCategories.getModel().getValueAt(row, 0);
            if (Category.delete(id)) {
                new Message().showMessage("La categoría ha sido eliminada exitosamente");
                updateCategoriesTable();
                updateProductsTable();
            } else {
                new Message().showError("La categoría no pudo ser eliminada");
            }
        }
    }

    private void updateCategoryOnClick() {
        int row = tblCategories.getSelectedRow();
        int id = (int) tblCategories.getModel().getValueAt(row, 0);
        UpdateCategoryInternalView updateCategoryInternalView = new UpdateCategoryInternalView(id, parent, this);
        parent.add(updateCategoryInternalView);
        updateCategoryInternalView.setVisible(true);
    }

    private void addCategoryOnClick() {
        String name = txtCategoryName.getText();
        try {
            if (Category.create(new Category(name))) {
                updateCategoriesTable();
                new Message().showMessage("Categoría registrada exitosamente");
            } else {
                new Message().showError("La categoría no pudo ser registrada");
            }
        } catch (NameAlreadyRegistered e) {
            new Message().showMessage(e.getMessage());
        }
    }

    private void searchOnClick() {
        productToShow = Product.search(txtSearch.getText());
        if (productToShow == null) {
            showNotFound();
        } else {
            showProduct();
        }
    }

    private void setButtonsVisible(boolean b) {
        btnAddProduct.setVisible(b);
        btnInfo.setVisible(b);
        btnUpdate.setVisible(b);
        btnDelete.setVisible(b);
    }

    private void stockOnChange() {
        if (tbpStock.getSelectedIndex() != 0) {
            setButtonsVisible(false);
        } else {
            setButtonsVisible(true);
        }
    }

    private void addOnClick() {
       ProductInternalView productInternalView = new ProductInternalView(parent, ProductInternalView.ADD, this);
       parent.add(productInternalView);
       productInternalView.setVisible(true);
    }

    private void moreOnClick() {
        if (userHasSelectedAProduct()) {
            int row = tblProducts.getSelectedRow();
            String id = (String)tblProducts.getModel().getValueAt(row, 0);
            Product product = Product.search(id);
            if (product == null) {
                new Message().showError("El producto no se encuentra registrado");
            } else {
                ProductInternalView productInternalView = new ProductInternalView(parent, ProductInternalView.INFO, this);
                productInternalView.setProduct(product);
                parent.add(productInternalView);
                productInternalView.setVisible(true);
            }
        } else {
            new Message().showError("Debe seleccionar un producto");
        }
    }

    private void updateOnClick() {
        if (userHasSelectedAProduct()) {
            int row = tblProducts.getSelectedRow();
            String id = (String)tblProducts.getModel().getValueAt(row, 0);
            Product product = Product.search(id);
            if (product == null) {
                new Message().showError("El producto no se encuentra registrado");
            } else {
                ProductInternalView productInternalView = new ProductInternalView(parent, ProductInternalView.UPDATE, this);
                productInternalView.setProduct(product);
                parent.add(productInternalView);
                productInternalView.setVisible(true);
            }
        } else {
            new Message().showError("Debe seleccionar un producto");
        }
    }

    private void deleteOnClick() {
        if (userHasSelectedAProduct()) {
            if (new Message().showConfirmDialog("¿Está seguro que desea eliminar el producto?")) {
                int row = tblProducts.getSelectedRow();
                String id = (String) tblProducts.getModel().getValueAt(row, 0);
                if (Product.delete(id)) {
                    updateProductsTable();
                    new Message().showMessage("El producto ha sido eliminado");
                } else {
                    new Message().showError("El producto no pudo ser eliminado");
                }
            }
        } else {
            showUserMustSelectAProduct();
        }
    }

    private boolean userHasSelectedAProduct() {
        return tblProducts.getSelectedRow() >= 0;
    }

    private boolean userHasSelectedACategory() {
        return tblCategories.getSelectedRow() >= 0;
    }

    private void showUserMustSelectAProduct() {
        new Message().showError("Debe seleccionar un producto");
    }

    public void updateCategoriesTable() {
        DefaultTableModel model = new DefaultTableModel() {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        model.addColumn("Código");
        model.addColumn("Nombre");

        if (Category.list() != null) {
            for(Category category : Category.list()) {
                Object[] row = new Object[2];
                row[0] = category.getId();
                row[1] = category.getName();
                model.addRow(row);
            }
        }

        tblCategories.setModel(model);
    }

    public void updateProductsTable() {
        DefaultTableModel model = new DefaultTableModel() {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        model.addColumn("Identificador");
        model.addColumn("Categoría");
        model.addColumn("Descripción");

        if (Product.list() != null) {
            textAutoCompleter.removeAllItems();
            for(Product product : Product.list()) {
                Object[] row = new Object[3];
                row[0] = product.getId();
                row[1] = product.getCategory();
                row[2] = product.getDescription();
                if (!product.hasBarcode()) {
                    textAutoCompleter.addItem(product.getId());
                }
                model.addRow(row);
            }
        }
        tblProducts.setModel(model);
    }
}
