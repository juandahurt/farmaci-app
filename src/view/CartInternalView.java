package view;

import logic.*;
import logic.exceptions.*;
import view.abstracts.AbstractProductVisualizer;
import view.abstracts.AbstractView;
import view.helpers.NumericTextField;
import view.helpers.SearchKeyListener;
import view.msg.Message;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;
import java.util.Objects;

public class CartInternalView extends AbstractProductVisualizer {
    //
    // Search product
    //
    private JPanel pnlSearch;
    private JLabel lblIcoProductIdentifier;
    private JTextField txtIdentifier;
    private JButton btnSearch;

    //
    // Product info
    //
    private JPanel pnlProductInfo;
    private JLabel lblPrice;
    private JTextField txtPrice;
    private JLabel lblSubtotal;
    private JButton btnAddProduct;
    private JLabel lblDescription;
    private JTextField txtDescription;
    private JLabel lblType;
    private JComboBox<String> cbxType;
    private JLabel lblQuantity;
    private JSpinner spnQuantity;
    private JButton btnDelete;
    private JButton btnDone;

    //
    // List of productsInCart
    //
    private JPanel pnlTable;
    private JTable tblProductList;

    //
    // Total value
    //
    private JPanel pnlTotal;
    private JLabel lblTotal;
    private double total;
    private double subTotal;

    //
    // Products
    //
    private ArrayList<ProductInCart> productsInCart;

    /**
     * Incremental value to identify the products in the cart
     */
    private int id;

    CartInternalView(AbstractView parent) {
        super(800, 600, "Nueva Venta", parent);
        setEnableProductInfo(false);
        subTotal = 0;
        total = 0;
        productsInCart = new ArrayList<>();
        id = 0;
        Bill.open();
    }

    @Override
    public void setVisible(boolean b) {
        Bill.open();
        super.setVisible(b);
    }

    @Override
    public void initComponents() {
        //
        // Search product
        //
        pnlSearch = getContainer();
        pnlSearch.setBounds(140, 10, 500, 90);

        Icon icoBarcode = new ImageIcon(getClass().getResource("/img/icons/barcode.png"));
        lblIcoProductIdentifier = new JLabel(icoBarcode);
        lblIcoProductIdentifier.setBounds(20, 30, 80, 30);
        pnlSearch.add(lblIcoProductIdentifier);

        txtIdentifier = new JTextField();
        txtIdentifier.setBounds(90, 30, 300, 30);
        txtIdentifier.addKeyListener(new SearchKeyListener(txtIdentifier, this));
        pnlSearch.add(txtIdentifier);

        SwingUtilities.invokeLater(() -> txtIdentifier.requestFocus());

        Icon icoSearch = new ImageIcon(getClass().getResource("/img/icons/search.png"));
        btnSearch = new JButton(icoSearch);
        btnSearch.setBounds(400, 20, 80, 50);
        btnSearch.addActionListener(e -> searchOnClick());
        pnlSearch.add(btnSearch);

        add(pnlSearch);

        //
        // Product info
        //
        pnlProductInfo = getContainer();
        pnlProductInfo.setBounds(10, 110, getWidth() - 40, 130);

        lblDescription = new JLabel("Descripción del producto");
        lblDescription.setBounds(10, 10, 180, 30);
        pnlProductInfo.add(lblDescription);

        txtDescription = new JTextField();
        txtDescription.setBounds(200, 10, 440, 30);
        txtDescription.setEditable(false);
        pnlProductInfo.add(txtDescription);

        lblPrice = new JLabel("Precio");
        lblPrice.setBounds(10, 50, 90, 30);
        pnlProductInfo.add(lblPrice);

        txtPrice = new NumericTextField();
        txtPrice.setBounds(60, 50, 145, 30);
        pnlProductInfo.add(txtPrice);

        lblType = new JLabel("Unidad");
        lblType.setBounds(240, 50, 90, 30);
        pnlProductInfo.add(lblType);

        initCombobox();
        pnlProductInfo.add(cbxType);

        lblQuantity = new JLabel("Cantidad");
        lblQuantity.setBounds(465, 50, 120, 30);
        pnlProductInfo.add(lblQuantity);

        SpinnerModel model = new SpinnerNumberModel(1, 1, 100, 1);
        spnQuantity = new JSpinner(model);
        spnQuantity.setBounds(540, 50, 100, 30);
        spnQuantity.addChangeListener(e -> updateSubtotal());
        ((JSpinner.DefaultEditor) spnQuantity.getEditor()).getTextField().setEditable(false);
        pnlProductInfo.add(spnQuantity);

        ImageIcon icoAddProduct = new ImageIcon(getClass().getResource("/img/icons/add_product.png"));
        btnAddProduct = new JButton(icoAddProduct);
        btnAddProduct.setToolTipText("Añadir producto al carrito");
        btnAddProduct.setBounds(660, 30, 80, 50);
        btnAddProduct.addActionListener(e -> addProductOnClick());
        pnlProductInfo.add(btnAddProduct);

        JLabel lblSubtotalTitle = new JLabel("Subtotal:");
        lblSubtotalTitle.setBounds(295, 95, 150, 30);
        lblSubtotalTitle.setFont(new Font("Arial", Font.BOLD, 25));
        pnlProductInfo.add(lblSubtotalTitle);

        lblSubtotal = new JLabel("0.0");
        lblSubtotal.setFont(new Font("Arial", Font.BOLD, 25));
        lblSubtotal.setBounds(415, 95, 150, 30);
        pnlProductInfo.add(lblSubtotal);

        add(pnlProductInfo);

        //
        // List of productsInCart
        //
        initTable();
        pnlTable = getContainer();
        pnlTable.setLayout(new BorderLayout());
        pnlTable.add(tblProductList.getTableHeader(), "First");
        pnlTable.add(tblProductList, "Center");
        JScrollPane scroll = new JScrollPane(pnlTable);
        scroll.setBounds(10, 250, getWidth() - 40, 230);
        add(scroll);

        //
        // Independent buttons
        //
        ImageIcon icoDelete = new ImageIcon(getClass().getResource("/img/icons/delete.png"));
        btnDelete = new JButton(icoDelete);
        btnDelete.setToolTipText("Eliminar producto seleccionado");
        btnDelete.setBounds(40, getHeight() - 110, 80, 50);
        btnDelete.addActionListener(e -> deleteOnClick());
        add(btnDelete);

        ImageIcon icoDone = new ImageIcon(getClass().getResource("/img/icons/payment.png"));
        btnDone = new JButton(icoDone);
        btnDone.setToolTipText("Realizar venta");
        btnDone.setBounds(getWidth() - 140, getHeight() - 110, 80, 50);
        btnDone.addActionListener(e -> doneOnClick());
        add(btnDone);

        //
        // Total value
        //
        pnlTotal = getContainer();
        pnlTotal.setBounds(140, getHeight() - 110, 500, 50);

        lblSubtotalTitle = new JLabel("Total:");
        lblSubtotalTitle.setFont(new Font("Arial", Font.BOLD, 25));
        lblSubtotalTitle.setBounds(165, 10, 90, 30);
        pnlTotal.add(lblSubtotalTitle);

        lblTotal = new JLabel("0.0");
        lblTotal.setFont(new Font("Arial", Font.BOLD, 25));
        lblTotal.setBounds(240, 10, 200, 30);
        pnlTotal.add(lblTotal);

        add(pnlTotal);
    }

    private void deleteOnClick() {
        if (!userHasSelectedAProduct()) {
            new Message().showError("Debe seleccionar un producto");
        } else {
            removeProduct();
            updateTable();
            updateTotal();
        }
    }

    private void removeProduct() {
        int row = tblProductList.getSelectedRow();
        int idToRemove = (int) tblProductList.getModel().getValueAt(row, 0);

        for (ProductInCart product : productsInCart) {
            if (product.getPublicId() == idToRemove) {
                productsInCart.remove(product);
                try {
                    ProductInCart.updateCart(productsInCart);
                    break;
                } catch (NotEnoughUnits | NotEnoughUnitsPerBox | NotEnoughBoxes | NotEnoughOthers e) {
                    new Message().showError(e.getMessage());
                }
            }
        }
    }

    private boolean userHasSelectedAProduct() {
        return tblProductList.getSelectedRow() >= 0;
    }

    private void doneOnClick() {
        if (productsInCart.isEmpty()) {
            new Message().showError("No ha agregado ningún producto");
            return;
        }
        Bill newBill = new Bill();
        newBill.setDate(new Date());
        newBill.setProducts(productsInCart);
        newBill.setTotal(total);
        if (Bill.save(newBill)) {
            new Message().showMessage("Venta registrada exitosamente");
            productsInCart = new ArrayList<>();
            updateTable();
            id = 0;
            total = 0;
            updateTotal();
            subTotal = 0;
            updateSubtotal();
        } else {
            new Message().showError("La venta no pudo ser registrada");
        }
    }

    private void initCombobox() {
        cbxType = new JComboBox<>();
        cbxType.setBounds(300, 50, 130, 30);
        cbxType.addActionListener(e -> {
            setPrice();
            updateSubtotal();
        });
    }

    @Override
    public void showProduct() {
        if (cbxType.getItemCount() > 0) {
            initCombobox();
        }
        if (productToShow.getBoxPrice() > 0) {
            cbxType.addItem("Caja");
        }
        if (productToShow.getOtherPrice() > 0) {
            cbxType.addItem("Sobre");
        }
        if (productToShow.getUnitPrice() > 0) {
            cbxType.addItem("Unidad");
        }

        setPrice();
        updateSubtotal();
        txtDescription.setText(productToShow.getDescription());
        setEnableProductInfo(true);
    }

    @Override
    public void showNotFound() {
        cbxType.removeAllItems();
        setEnableProductInfo(false);
        subTotal = 0;
        updateSubtotal();
        new Message().showNotFound();
    }

    private void searchOnClick() {
        productToShow = Product.search(txtIdentifier.getText());
        if (productToShow == null) {
            showNotFound();
        } else {
            showProduct();
        }
    }

    private void updateSubtotal() {
        if (!txtPrice.getText().equals("")) {
            subTotal = Double.parseDouble(txtPrice.getText()) * (int) spnQuantity.getValue();
        }
        lblSubtotal.setText(String.valueOf(subTotal));
    }

    private void setPrice() {
        if (productToShow == null) {
            txtPrice.setText("0.0");
            return;
        }
        if (cbxType.getItemCount() > 0) {
            switch ((String) Objects.requireNonNull(cbxType.getSelectedItem())) {
                case "Caja":
                    txtPrice.setText(String.valueOf(productToShow.getBoxPrice()));
                    break;
                case "Unidad":
                    txtPrice.setText(String.valueOf(productToShow.getUnitPrice()));
                    break;
                case "Sobre":
                    txtPrice.setText(String.valueOf(productToShow.getOtherPrice()));
                    break;
            }
        }
    }

    private void setEnableProductInfo(boolean b) {
        for (Component comp : pnlProductInfo.getComponents()) {
            comp.setEnabled(b);
        }
        if (!b) {
            txtPrice.setText("");
            txtDescription.setText("");
            spnQuantity.setValue(1);
        }
    }

    private void addProductOnClick() {
        // Check if there are enough units
        String selectedType = (String) cbxType.getSelectedItem();
        int type = -1;
        switch (selectedType) {
            case "Caja":
                type = Unit.BOX;
                break;
            case "Sobre":
                type = Unit.OTHER;
                break;
            case "Unidad":
                type = Unit.UNIT;
                break;
        }
        int quantity = (int) spnQuantity.getValue();

        boolean removed;
        try {
            removed = Product.removeUnits(type, quantity, productToShow.getId());
        } catch (NotEnoughOthers | NotEnoughUnits | NotEnoughBoxes | NotEnoughUnitsPerBox | NotEnoughUnitsPerOther | NotEnoughOthersPerBox e) {
            new Message().showError(e.getMessage());
            return;
        }
        if (removed) {
            ProductInCart p = new ProductInCart();
            p.setPublicId(productsInCart.size());
            p.setProductId(productToShow.getId());
            p.setQuantity((int) spnQuantity.getValue());
            p.setDescription(txtDescription.getText());
            p.setType(type);
            p.setPrice(Double.parseDouble(txtPrice.getText()));
            p.setSubtotal(Double.parseDouble(lblSubtotal.getText()));
            if (!productsInCart.contains(p)) { // wtf?
                productsInCart.add(p);
            }
            updateTable();
            setEnableProductInfo(false);
            cbxType.removeAllItems();
            updateTotal();
        } else {
            new Message().showError("Ha ocurrido un error al agregar las unidades");
        }
    }

    private void initTable() {
        DefaultTableModel model = new DefaultTableModel();
        setColumnsToModel(model);
        tblProductList = new JTable(model);
    }

    private void setColumnsToModel(DefaultTableModel model) {
        model.addColumn("Id");
        model.addColumn("Cantidad");
        model.addColumn("Descripción");
        model.addColumn("Unidad");
        model.addColumn("Valor unitario");
        model.addColumn("Subtotal");
    }

    private void updateTable() {
        DefaultTableModel model = new DefaultTableModel();
        setColumnsToModel(model);

        for(ProductInCart product : productsInCart) {
            Object[] row = new Object[6];
            row[0] = product.getPublicId();
            row[1] = product.getQuantity();
            row[2] = product.getDescription();
            switch (product.getType()) {
                case Unit.BOX:
                    row[3] = "Caja";
                    break;
                case Unit.OTHER:
                    row[3] = "Sobre";
                    break;
                case Unit.UNIT:
                    row[3] = "Unidad";
                    break;
            }
            row[4] = product.getPrice();
            row[5] = product.getSubtotal();
            model.addRow(row);
        }
        tblProductList.setModel(model);
    }

    private void updateTotal() {
        total = 0;
        for(ProductInCart product : productsInCart) {
            total += product.getSubtotal();
        }
        lblTotal.setText(String.valueOf(total));
    }
}
