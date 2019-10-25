package view;

import logic.Date;
import logic.Product;
import logic.Unit;
import logic.Validator;
import org.jdatepicker.JDatePicker;
import org.jdatepicker.impl.DateComponentFormatter;
import org.jdatepicker.impl.JDatePanelImpl;
import org.jdatepicker.impl.JDatePickerImpl;
import org.jdatepicker.impl.UtilDateModel;
import view.abstracts.AbstractInternalView;
import view.abstracts.AbstractView;
import view.msg.Message;

import javax.swing.*;
import java.util.GregorianCalendar;
import java.util.Properties;

public class UnitsInternalView extends AbstractInternalView {
    //
    // Methods
    //
    static final int ADD = 0;
    static final int UPDATE = 1;

    private int method;


    //
    // Units
    //
    private JPanel pnlUnits;
    private JLabel lblQuantity;
    private JSpinner spnQuantity;
    private JLabel lblExpirationDate;
    private JDatePicker dpkExpirationDate;
    private JLabel lblLot;
    private JTextField txtLot;

    //
    // OK button
    //
    private JButton btnOK;

    private ProductInternalView productInternalView;

    UnitsInternalView(AbstractView parent, ProductInternalView productInternalView, int method) {
        super(345, 240, "", parent);
        this.method = method;
        switch (this.method) {
            case ADD:
                setTitle("Añadir Unidades");
                break;
            case UPDATE:
                setTitle("Editar Unidades");
                break;
        }
        this.productInternalView = productInternalView;
        updateLabel();
    }

    @Override
    public void initComponents() {
        //
        // Units
        //
        pnlUnits = getContainer();
        pnlUnits.setBounds(10, 10, 310, 125);

        lblQuantity = new JLabel("");
        lblQuantity.setBounds(20, 10, 100, 30);
        pnlUnits.add(lblQuantity);

        SpinnerModel modelBox = new SpinnerNumberModel(0, 0, 100, 1);
        spnQuantity = new JSpinner(modelBox);
        spnQuantity.setBounds(150, 10, 100, 30);
        ((JSpinner.DefaultEditor) spnQuantity.getEditor()).getTextField().setEditable(false);
        pnlUnits.add(spnQuantity);

        lblExpirationDate = new JLabel("Vencimiento");
        lblExpirationDate.setBounds(20, 45, 100, 30);
        pnlUnits.add(lblExpirationDate);

        Properties p = new Properties();
        p.put("text.today", "today");
        p.put("text.month", "month");
        p.put("text.year", "year");

        UtilDateModel model = new UtilDateModel();
        JDatePanelImpl datePanel = new JDatePanelImpl(model, p);
        dpkExpirationDate = new JDatePickerImpl(datePanel, new DateComponentFormatter());
        ((JDatePickerImpl) dpkExpirationDate).setBounds(150, 45, 155, 30);
        pnlUnits.add((JDatePickerImpl) dpkExpirationDate);

        lblLot = new JLabel("Lote");
        lblLot.setBounds(20, 85, 70, 30);
        pnlUnits.add(lblLot);

        txtLot = new JTextField();
        txtLot.setBounds(150, 85, 110, 30);
        pnlUnits.add(txtLot);

        add(pnlUnits);

        Icon icoOk = new ImageIcon(getClass().getResource("/img/icons/done.png"));
        btnOK = new JButton(icoOk);
        btnOK.setBounds(120, getHeight() - 95, 80, 50);
        btnOK.addActionListener(e -> OKOnClick());
        add(btnOK);
    }


    private void updateLabel() {
        int[] relation = Product.getRelation(productInternalView.getProduct().getId());

        if (relation[0] != -1) {
            lblQuantity.setText("Cajas");
        }
        if (relation[1] != -1 && relation[0] == -1) {
            lblQuantity.setText("Sobres");
        }
        if (relation[2] != -1 && relation[0] == -1 && relation[1] == -1) {
            lblQuantity.setText("Unidades");
        }
    }

    private void OKOnClick() {
        if (!Validator.isPositive((int) spnQuantity.getValue())) {
            new Message().showError("La cantidad a ingresar debe ser mayor a cero");
            return;
        }
        int year = dpkExpirationDate.getModel().getYear();
        int month = dpkExpirationDate.getModel().getMonth();
        int day = dpkExpirationDate.getModel().getDay();
        if (Validator.isExpired(Date.createDateFrom(year, month, day))) {
            new Message().showError("Fecha de vencimiento inválida");
            return;
        }

        Unit newUnit = new Unit();
        newUnit.setProduct(this.productInternalView.getProduct());

        // Cast expDate to logic.Date
        month = dpkExpirationDate.getModel().getMonth() + 1;
        newUnit.setExpDate(Date.createDateFrom(year, month, day));

        newUnit.setRegDate(new Date());
        newUnit.getRegDate().add(GregorianCalendar.MONTH, 1); // wtf!?

        int [] relation = Product.getRelation(newUnit.getProduct().getId());
        boolean comesInBoxes = relation[0] != -1;
        boolean comesInOthers = relation[1] != -1;
        boolean comesInUnits = relation[2] != -1;

        int quantity = (int) spnQuantity.getValue();

        // One type
        if (comesInBoxes && !comesInOthers && !comesInUnits) {
            newUnit.setBoxes(quantity);
        } else if (!comesInBoxes && comesInOthers && !comesInUnits) {
            newUnit.setOthers(quantity);
        } else if (!comesInBoxes && !comesInOthers && comesInUnits) {
            newUnit.setUnits(quantity);
        }

        // Two types
        if (comesInBoxes && comesInOthers && !comesInUnits) {
            newUnit.setBoxes(quantity);
            newUnit.setOthers(quantity * relation[1]);
        } else if (comesInBoxes && !comesInOthers && comesInUnits) {
            newUnit.setBoxes(quantity);
            newUnit.setUnits(quantity * relation[2]);
        } else if (!comesInBoxes && comesInOthers && comesInUnits) {
            newUnit.setOthers(quantity);
            newUnit.setUnits(quantity * relation[2]);
        }

        // All types
        if (comesInBoxes && comesInOthers && comesInUnits) {
            newUnit.setBoxes(quantity);
            newUnit.setOthers(relation[1] * quantity);
            newUnit.setUnits(relation[2] * relation[1] * quantity);
        }

        newUnit.setQuantity((int) spnQuantity.getValue());
        newUnit.setLot(txtLot.getText());
        if (Product.create(newUnit)) {
            productInternalView.updateUnitsTable();
            new Message().showMessage("Unidades agregadas correctamente");
        } else {
            new Message().showError("No fue posible registrar las unidades");
        }

    }
}
