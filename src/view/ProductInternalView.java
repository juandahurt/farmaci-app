package view;

import logic.Category;
import logic.Product;
import logic.Unit;
import logic.Validator;
import logic.exceptions.BarcodeAlreadyRegistered;
import logic.exceptions.NameAlreadyRegistered;
import view.abstracts.AbstractInternalView;
import view.abstracts.AbstractView;
import view.helpers.NumericTextField;
import view.msg.Message;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;

class ProductInternalView extends AbstractInternalView {

    //
    // Methods
    //
    static final int ADD = 0;
    static final int UPDATE = 1;
    static final int INFO = 2;

    private int method;

    //
    // Main product info panel
    //
    private JPanel pnlMainProductInfo;

    //
    // Product info
    //
    private JPanel pnlProductInfo;
    private JLabel lblHasCodeBar;
    private JRadioButton rbtYes;
    private JRadioButton rbtNo;
    private JLabel lblIdentifier;
    private JTextField txtIdentifier;
    private JLabel lblDescription;
    private JTextField txtDescription;
    private JLabel lblCategory;
    private JComboBox<String> cbxCategory;
    private JLabel lblCost;
    private NumericTextField txtCost;

    //
    // Product Prices
    //
    private JPanel pnlPrices;
    private JLabel lblSubtitlePrices;
    private JLabel lblBoxPrice;
    private JTextField txtBoxPrice;
    private JButton btnSwicthBox;
    private JLabel lblOtherPrice;
    private JTextField txtOtherPrice;
    private JButton btnSwitchOther;
    private JLabel lblUnitPrice;
    private JTextField txtUnitPrice;
    private JButton btnSwicthUnit;

    //
    // Independent button
    //
    private ImageIcon icoOk;
    private JButton btnOK;

    private ImageIcon icoSwitchOff;
    private ImageIcon icoSwitchOn;

    //
    // Units panel
    //
    private JPanel pnlMainUnits;
    private JPanel pnlUnitsButtons;
    private JTable tblUnits;
    private JLabel lblTotalBoxes;
    private JLabel lblTotalOthers;
    private JLabel lblTotalUnits;
    private JPanel pnlTableUnits;

    //
    // Product Tabbed Pane
    //
    private JTabbedPane tbpProduct;

    //
    // Stock View
    //
    private StockInternalView stockView;

    //
    // Product
    //
    private Product product;

    //
    // Units
    //
    private ArrayList<Unit> units;

    ProductInternalView(AbstractView parent, int method, StockInternalView stockView) {
        super(520, 520, "", parent);
        initCategories();
        switch (method) {
            case ADD:
                setTitle("Añadir nuevo producto");
                break;
            case UPDATE:
                setTitle("Modificar producto");
                btnSwicthBox.setEnabled(false);
                btnSwitchOther.setEnabled(false);
                btnSwicthUnit.setEnabled(false);
                break;
            case INFO:
                setTitle("Producto");
                disableProductInfo();
                break;
        }
        chooseButtonSettings(method);
        this.stockView = stockView;
    }

    @Override
    public void initComponents() {
        Icon icoEdit = new ImageIcon(getClass().getResource("/img/icons/update.png"));
        Icon icoDelete = new ImageIcon(getClass().getResource("/img/icons/delete.png"));
        //
        // Main product info
        //
        pnlMainProductInfo = getContainer();
        pnlMainProductInfo.setBounds(0, 0, 500, 510);

        //
        // Product info
        //
        pnlProductInfo = getContainer();
        pnlProductInfo.setBounds(10, 10, getWidth() - 40, 165);

        lblHasCodeBar = new JLabel("¿Tiene código de barras?");
        lblHasCodeBar.setBounds(60, 10, 200, 30);
        pnlProductInfo.add(lblHasCodeBar);

        rbtYes = new JRadioButton("Sí");
        rbtYes.setBounds(270, 10, 60, 30);
        rbtYes.addActionListener(e -> yesOnClick());
        rbtYes.setSelected(true);

        rbtNo = new JRadioButton("No");
        rbtNo.setBounds(330, 10, 60, 30);
        rbtNo.addActionListener(e -> noOnClick());

        ButtonGroup buttonGroup = new ButtonGroup();
        buttonGroup.add(rbtYes);
        buttonGroup.add(rbtNo);

        pnlProductInfo.add(rbtYes);
        pnlProductInfo.add(rbtNo);

        lblIdentifier = new JLabel("Código");
        lblIdentifier.setBounds(15, 50, 80, 30);
        pnlProductInfo.add(lblIdentifier);

        txtIdentifier = new JTextField();
        txtIdentifier.setBounds(120, 50, 180, 30);
        pnlProductInfo.add(txtIdentifier);

        lblDescription = new JLabel("Descripción");
        lblDescription.setBounds(15, 90, 100, 30);
        pnlProductInfo.add(lblDescription);

        txtDescription = new JTextField();
        txtDescription.setBounds(120, 90, 340, 30);
        pnlProductInfo.add(txtDescription);

        lblCategory = new JLabel("Categoría");
        lblCategory.setBounds(15, 130, 150, 30);
        pnlProductInfo.add(lblCategory);

        cbxCategory = new JComboBox<>();
        cbxCategory.setBounds(120, 130, 150, 30);
        pnlProductInfo.add(cbxCategory);
        
        lblCost = new JLabel("Precio de Compra");
        lblCost.setBounds(25, 180, 180, 30);
        pnlMainProductInfo.add(lblCost);
        
        txtCost = new NumericTextField();
        txtCost.setBounds(175, 180, 120, 30);
        pnlMainProductInfo.add(txtCost);

        pnlMainProductInfo.add(pnlProductInfo);

        //
        // Product prices
        //
        pnlPrices = getContainer();
        pnlPrices.setBounds(10, 200, getWidth() - 40, 180);

        icoSwitchOff = new ImageIcon(getClass().getResource("/img/icons/switch_off.png"));
        icoSwitchOn = new ImageIcon(getClass().getResource("/img/icons/switch_on.png"));

        lblSubtitlePrices = new JLabel("Precios por unidad");
        lblSubtitlePrices.setBounds(160, 10, 140, 30);
        pnlPrices.add(lblSubtitlePrices);

        lblBoxPrice = new JLabel("Caja");
        lblBoxPrice.setBounds(120, 50, 80, 30);
        pnlPrices.add(lblBoxPrice);

        txtBoxPrice = new NumericTextField();
        txtBoxPrice.setBounds(180, 50, 100, 30);
        pnlPrices.add(txtBoxPrice);

        btnSwicthBox = new JButton(icoSwitchOn);
        btnSwicthBox.setBorder(null);
        btnSwicthBox.setBackground(pnlPrices.getBackground());
        btnSwicthBox.setContentAreaFilled(false);
        btnSwicthBox.addActionListener(e -> switchOnClick(btnSwicthBox, lblBoxPrice, txtBoxPrice));
        btnSwicthBox.setBounds(280, 50, 60, 30);
        pnlPrices.add(btnSwicthBox);

        lblOtherPrice = new JLabel("Sobre");
        lblOtherPrice.setBounds(120, 90, 80, 30);
        pnlPrices.add(lblOtherPrice);

        txtOtherPrice = new NumericTextField();
        txtOtherPrice.setBounds(180, 90, 100, 30);
        pnlPrices.add(txtOtherPrice);

        btnSwitchOther = new JButton(icoSwitchOn);
        btnSwitchOther.setBorder(null);
        btnSwitchOther.setContentAreaFilled(false);
        btnSwitchOther.setBackground(pnlPrices.getBackground());
        btnSwitchOther.addActionListener(e -> switchOnClick(btnSwitchOther, lblOtherPrice, txtOtherPrice));
        btnSwitchOther.setBounds(280, 90, 60, 30);
        pnlPrices.add(btnSwitchOther);

        lblUnitPrice = new JLabel("Unidad");
        lblUnitPrice.setBounds(120, 130, 80, 30);
        pnlPrices.add(lblUnitPrice);

        txtUnitPrice = new NumericTextField();
        txtUnitPrice.setBounds(180, 130, 100, 30);
        pnlPrices.add(txtUnitPrice);

        btnSwicthUnit = new JButton(icoSwitchOn);
        btnSwicthUnit.setBorder(null);
        btnSwicthUnit.setContentAreaFilled(false);
        btnSwicthUnit.setBackground(pnlPrices.getBackground());
        btnSwicthUnit.addActionListener(e -> switchOnClick(btnSwicthUnit, lblUnitPrice, txtUnitPrice));
        btnSwicthUnit.setBounds(280, 130, 60, 30);
        pnlPrices.add(btnSwicthUnit);

        pnlMainProductInfo.add(pnlPrices);

        //
        // Units panel
        //
        pnlMainUnits = getContainer();
        pnlMainUnits.setBounds(0, 0, 700, getHeight());

        lblTotalBoxes = new JLabel("Cajas: 0");
        lblTotalBoxes.setFont(new Font("Arial", Font.BOLD, 20));
        lblTotalBoxes.setBounds(20, 10, 200, 30);
        pnlMainUnits.add(lblTotalBoxes);

        lblTotalOthers = new JLabel("Sobres: 0");
        lblTotalOthers.setFont(new Font("Arial", Font.BOLD, 20));
        lblTotalOthers.setBounds(260, 10, 200, 30);
        pnlMainUnits.add(lblTotalOthers);

        lblTotalUnits = new JLabel("Unidades: 0");
        lblTotalUnits.setFont(new Font("Arial", Font.BOLD, 20));
        lblTotalUnits.setBounds(520, 10, 200, 30);
        pnlMainUnits.add(lblTotalUnits);

        tblUnits = new JTable();
        updateUnitsTable();

        pnlTableUnits = getContainer();
        pnlTableUnits.setLayout(new BorderLayout());
        pnlTableUnits.add(tblUnits.getTableHeader(), "First");
        pnlTableUnits.add(tblUnits, "Center");
        JScrollPane unitsScroll = new JScrollPane(pnlTableUnits);
        unitsScroll.setBounds(5, 60, 680, 280);

        pnlMainUnits.add(unitsScroll);

        pnlUnitsButtons = getContainer();
        pnlUnitsButtons.setBounds(200, 370, 300, 100);

        ImageIcon icoAddUnits = new ImageIcon(getClass().getResource("/img/icons/add-units.png"));
        JButton btnAddUnits = new JButton(icoAddUnits);
        btnAddUnits.addActionListener(e -> addUnitsOnClick());
        btnAddUnits.setToolTipText("Añadir unidades");
        btnAddUnits.setBounds(10, 0, 80, 50);
        pnlUnitsButtons.add(btnAddUnits);

        JButton btnDeleteUnit = new JButton(icoDelete);
        btnDeleteUnit.setBounds(210, 0, 80, 50);
        btnDeleteUnit.addActionListener(e -> deleteUnitOnClick());
        btnDeleteUnit.setToolTipText("Eliminar");
        pnlUnitsButtons.add(btnDeleteUnit);

        pnlMainUnits.add(pnlUnitsButtons);

        //
        // Stock tabs
        //
        tbpProduct = new JTabbedPane();
        tbpProduct.addChangeListener(e -> productOnChange());
        tbpProduct.setBounds(0, 0, 520, 480);
        tbpProduct.add("Información", pnlMainProductInfo);
        tbpProduct.add("Unidades", pnlMainUnits);
        tbpProduct.setEnabledAt(1, false);
        add(tbpProduct);

        //
        // Units
        //
        this.units = new ArrayList<>();
    }

    private void deleteUnitOnClick() {
        int row = tblUnits.getSelectedRow();
        if (row < 0) {
            new Message().showError("No ha seleccionado ninguna unidad");
            return;
        }
        if (Product.delete(this.units.get(row))) {
            updateUnitsTable();
            new Message().showMessage("Unidades eleminada satidafacotriamente");
        } else {
            new Message().showError("Las unidades no pudieron ser eliminadas");
        }
    }

    public Product getProduct() {
        return this.product;
    }

    private void productOnChange() {
        if (tbpProduct.getSelectedIndex() == 0) {
            setSize(520, 520);
            tbpProduct.setBounds(0, 0, 520, 480);
        } else {
            setSize(720, 520);
            tbpProduct.setBounds(0, 0, 700, 480);
            updateUnitsTable();
        }
    }

    private void initCategories() {
        cbxCategory.addItem("");
        for (Category c : Category.list()) {
            cbxCategory.addItem(c.getName());
        }
    }

    public void setProduct(Product product) {
        tbpProduct.setEnabledAt(1, true);
        this.product = product;
        txtIdentifier.setText(product.getId());
        txtDescription.setText(product.getDescription());
        txtCost.setText(String.valueOf(product.getCost()));
        if (product.getBoxPrice() < 0) {
            disablePrice("box");
        } else {
            txtBoxPrice.setText(String.valueOf(product.getBoxPrice()));
        }
        if (product.getOtherPrice() < 0) {
            disablePrice("other");
        } else {
            txtOtherPrice.setText(String.valueOf(product.getOtherPrice()));
        }
        if (product.getUnitPrice() < 0) {
            disablePrice("unit");
        } else {
            txtUnitPrice.setText(String.valueOf(product.getUnitPrice()));
        }
        cbxCategory.setSelectedItem(product.getCategory());
    }

    private void disableProductInfo() {
        rbtYes.setEnabled(false);
        rbtNo.setEnabled(false);
        txtIdentifier.setEditable(false);
        txtDescription.setEditable(false);
        txtCost.setEditable(false);
        cbxCategory.setEditable(false);
        txtBoxPrice.setEnabled(false);
        txtOtherPrice.setEnabled(false);
        txtUnitPrice.setEnabled(false);
        cbxCategory.setEnabled(false);
    }

    private void disablePrice(String str) {
        switch (str) {
            case "box":
                btnSwicthBox.setIcon(icoSwitchOff);
                btnSwicthBox.setBorder(null);
                lblBoxPrice.setEnabled(false);
                txtBoxPrice.setEnabled(false);
                txtBoxPrice.setText("");
                break;
            case "other":
                btnSwitchOther.setIcon(icoSwitchOff);
                btnSwitchOther.setBorder(null);
                lblOtherPrice.setEnabled(false);
                txtOtherPrice.setEnabled(false);
                txtOtherPrice.setText("");
                break;
            case "unit":
                btnSwicthUnit.setIcon(icoSwitchOff);
                btnSwicthUnit.setBorder(null);
                lblUnitPrice.setEnabled(false);
                txtUnitPrice.setEnabled(false);
                txtUnitPrice.setText("");
                break;
        }
    }

    void updateUnitsTable() {
        if (product != null) {
            DefaultTableModel model = new DefaultTableModel() {
                @Override
                public boolean isCellEditable(int row, int column) {
                    return false;
                }
            };

            model.addColumn("Ingreso");
            int lenght = 3;
            int [] relation = Product.getRelation(product.getId());
            if (relation[0] != -1) {
                model.addColumn("Cajas");
                lenght ++;
            }
            if (relation[1] != -1) {
                model.addColumn("Sobres");
                lenght ++;
            }
            if (relation[2] != -1) {
                model.addColumn("Unidades");
                lenght ++;
            }
            model.addColumn("Lote");
            model.addColumn("Vencimiento");

            if (product != null) {
                this.units = new ArrayList<>();
                for(Unit unit : Product.getUnits(product.getId())) {
                    this.units.add(unit);
                    Object[] row = new Object[lenght];
                    int startIndex = 0;
                    row[startIndex] = unit.getRegDate().toString();
                    if (relation[0] != -1) {
                        startIndex++;
                        row[startIndex] = unit.getBoxes();
                    }
                    if (relation[1] != -1) {
                        startIndex++;
                        row[startIndex] = unit.getOthers();
                    }
                    if (relation[2] != -1) {
                        startIndex++;
                        row[startIndex] = unit.getUnits();
                    }
                    row[lenght - 2] = unit.getLot();
                    row[lenght - 1] = unit.getExpDate();
                    model.addRow(row);
                }
                // Update total labels
                int totalBoxes = Product.getTotalBoxes(product.getId());
                if (totalBoxes < 0) {
                    totalBoxes = 0;
                    lblTotalBoxes.setEnabled(false);
                }
                int totalOthers = Product.getTotalOthers(product.getId());
                if (totalOthers < 0) {
                    totalOthers = 0;
                    lblTotalOthers.setEnabled(false);
                }
                int totalUnits = Product.getTotalUnits(product.getId());
                if (totalUnits < 0) {
                    totalUnits = 0;
                    lblTotalUnits.setEnabled(false);
                }
                lblTotalBoxes.setText("Cajas: " + totalBoxes);
                lblTotalOthers.setText("Sobres: " + totalOthers);
                lblTotalUnits.setText("Unidades: " + totalUnits);
            }
            tblUnits.setModel(model);
        }
    }

    private void switchOnClick(JButton btn, JLabel lbl, JTextField txt) {
        if (this.method != INFO) {
            Icon icon = btn.getIcon().equals(icoSwitchOn) ? icoSwitchOff : icoSwitchOn;
            if (icon.equals(icoSwitchOn)) {
                lbl.setEnabled(true);
                txt.setEnabled(true);
            } else {
                lbl.setEnabled(false);
                txt.setEnabled(false);
            }
            btn.setIcon(icon);
            btn.setBorder(null);
        }
    }

    private void yesOnClick() {
        lblIdentifier.setText("Código");
    }

    private void noOnClick() {
        lblIdentifier.setText("Nombre");
    }

    private void OKOnClick() {
        if (Validator.isEmpty(txtIdentifier.getText())) {
            new Message().showError("El campo del identificador no puede estar vacío");
            return;
        }
        if (Validator.isEmpty(txtDescription.getText())) {
            new Message().showError("El campo de la descripción no puede estar vacío");
            return;
        }

        Product newProduct = new Product();
        if (rbtYes.isSelected()) {
            newProduct.setHasBarcode(true);
        } else {
            newProduct.setHasBarcode(false);
        }
        newProduct.setId(txtIdentifier.getText());
        newProduct.setDescription(txtDescription.getText());
        if (Validator.isEmpty(txtCost.getText())) {
            new Message().showError("No ha ingresado el precio de compra");
            return;
        }
        newProduct.setCost(Double.valueOf(txtCost.getText()));
        if (txtBoxPrice.isEnabled()) {
            if (Validator.isEmpty(txtBoxPrice.getText())) {
                new Message().showError("No ha ingresado el precio para la caja");
                return;
            }
            newProduct.setBoxQuantity(0);
            newProduct.setBoxPrice(Double.valueOf(txtBoxPrice.getText()));
        }
        if (txtOtherPrice.isEnabled()) {
            if (Validator.isEmpty(txtOtherPrice.getText())) {
                new Message().showError("No ha ingresado el precio para el sobre");
                return;
            }
            newProduct.setOtherQuantity(0);
            newProduct.setOtherPrice(Double.valueOf(txtOtherPrice.getText()));
        }
        if (txtUnitPrice.isEnabled()) {
            if (Validator.isEmpty(txtUnitPrice.getText())) {
                new Message().showError("No ha ingresado el precio para la unidad");
                return;
            }
            newProduct.setUnitQuantity(0);
            newProduct.setUnitPrice(Double.valueOf(txtUnitPrice.getText()));
        }
        newProduct.setCategory((String)cbxCategory.getSelectedItem());

        if (this.method == ADD) {
            try {
                if (Product.create(newProduct)) {
                    stockView.updateProductsTable();
                    new Message().showMessage("Producto registrado exitosamente");
                    setProduct(newProduct);
                    disableProductInfo();
                    btnSwicthBox.setEnabled(false);
                    btnSwitchOther.setEnabled(false);
                    btnSwicthUnit.setEnabled(false);
                    btnOK.setEnabled(false);
                } else {
                    new Message().showError("El producto no pudo ser registrado");
                }
            } catch (NameAlreadyRegistered | BarcodeAlreadyRegistered e) {
                new Message().showError(e.getMessage());
            }
        }
        if (this.method == UPDATE) {
            try {
                if (Product.update(this.product.getId(), newProduct)) {
                    stockView.updateProductsTable();
                    new Message().showMessage("Producto actualizado exitosamente");
                    this.product = newProduct;
                } else {
                    new Message().showError("El producto no pudo ser actualizado");
                }
            } catch (NameAlreadyRegistered | BarcodeAlreadyRegistered e) {
                new Message().showError(e.getMessage());
            }
        }
        if (this.method == INFO) {
            setVisible(false);
        }
    }

    private void chooseButtonSettings(int method) {
        this.method = method;
        if (method == INFO) {
            icoOk = new ImageIcon(getClass().getResource("/img/icons/done.png"));
        } else {
            icoOk = new ImageIcon(getClass().getResource("/img/icons/save.png"));
        }
        btnOK = new JButton(icoOk);
        btnOK.setBounds(200, getHeight() - 135, 80, 50);
        btnOK.addActionListener(e -> OKOnClick());
        pnlMainProductInfo.add(btnOK);
    }

    private void addUnitsOnClick() {
        if (!Product.isRelationSet(product.getId())) {
            new Message().showMessage("Debe ingresar cantidad de unidades");
            int[] relation = Product.getRelation(product.getId());
            RelationInternalView relationInternalView = new RelationInternalView(parent, this, relation);
            parent.add(relationInternalView);
            relationInternalView.setVisible(true);
        } else {
            UnitsInternalView unitsInternalView = new UnitsInternalView(parent, this, UnitsInternalView.ADD);
            parent.add(unitsInternalView);
            unitsInternalView.setVisible(true);
        }
    }
}
