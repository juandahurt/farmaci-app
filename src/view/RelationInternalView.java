package view;

import logic.Product;
import view.abstracts.AbstractInternalView;
import view.abstracts.AbstractView;
import view.msg.Message;

import javax.swing.*;

public class RelationInternalView extends AbstractInternalView {

    private ProductInternalView productInternalView;

    //
    // Main container
    //
    private JPanel pnlMainContainer;
    private JLabel lblOuter;
    private JSpinner spnOuter;
    private JLabel lblInner;
    private JSpinner spnInner;
    private JButton btnOK;

    //
    // Types
    //
    private int types;
    private int[] relation;

    RelationInternalView(AbstractView parent, ProductInternalView productInternalView, int[] relation) {
        super(300, 300, "Cantidad de unidades", parent);
        this.productInternalView = productInternalView;
        this.relation = relation;
        updateView();
    }

    @Override
    public void initComponents() {
        //
        // Main container
        //
        pnlMainContainer = getContainer();
        pnlMainContainer.setBounds(10, 10, getWidth() - 30, getHeight() - 50);

        lblOuter = new JLabel("Sobres por caja");
        lblOuter.setBounds(75, 10, 190, 30);
        pnlMainContainer.add(lblOuter);

        SpinnerModel modelOuter = new SpinnerNumberModel(1, 1, 100, 1);
        spnOuter = new JSpinner(modelOuter);
        spnOuter.setBounds(100, 50, 100, 30);
        ((JSpinner.DefaultEditor) spnOuter.getEditor()).getTextField().setEditable(false);
        pnlMainContainer.add(spnOuter);

        lblInner = new JLabel("Unidades por sobre");
        lblInner.setBounds(75, 90, 190, 30);
        pnlMainContainer.add(lblInner);

        SpinnerModel modelInner = new SpinnerNumberModel(1, 1, 100, 1);
        spnInner = new JSpinner(modelInner);
        spnInner.setBounds(100, 130, 100, 30);
        ((JSpinner.DefaultEditor) spnInner.getEditor()).getTextField().setEditable(false);
        pnlMainContainer.add(spnInner);

        ImageIcon icoSave = new ImageIcon(getClass().getResource("/img/icons/save.png"));
        btnOK = new JButton(icoSave);
        btnOK.addActionListener(e -> OKOnClick());
        btnOK.setBounds(100, getHeight() - 105, 80, 50);
        pnlMainContainer.add(btnOK);

        add(pnlMainContainer);
    }

    private void updateView() {
        types = 0;
        for (int r : this.relation) {
            if (r != -1) {
                types++;
            }
        }
        if (types == 2) {
            // Other and unit
            if (this.relation[1] != -1 && this.relation[2] != -1) {
                lblOuter.setText("Unidades por sobre");
            }
            // Box and unit
            if (this.relation[0] != -1 && this.relation[2] != -1) {
                lblOuter.setText("Unidades por caja");
            }
            // Box and other
            if (this.relation[0] != -1 && this.relation[1] != -1) {
                lblOuter.setText("Sobres por caja");
            }
            lblInner.setVisible(false);
            spnInner.setVisible(false);
            setSize(300, 200);
            btnOK.setBounds(100, getHeight() - 105, 80, 50);
            pnlMainContainer.setBounds(10, 10, getWidth() - 30, getHeight() - 50);
        }
    }

    private void OKOnClick() {
        String productId = productInternalView.getProduct().getId();
        int boxes = -1, others = -1, units = -1;
        if (types == 2) {
            // Other and unit
            if (this.relation[1] != -1 && this.relation[2] != -1) {
                others = 1;
                units = (int) spnOuter.getValue();
            }
            // Box and unit
            if (this.relation[0] != -1 && this.relation[2] != -1) {
                boxes = 1;
                units = (int) spnOuter.getValue();
            }
            // Box and other
            if (this.relation[0] != -1 && this.relation[1] != -1) {
                boxes = 1;
                others = (int) spnOuter.getValue();
            }
        } else if (types == 3) {
            boxes = 1;
            others = (int) spnOuter.getValue();
            units = (int) spnInner.getValue();
        }

        // Set relation
        if (Product.setRelation(productId, boxes, others, units)) {
            new Message().showMessage("Cantidad de unidades actualizadas correctamente");
            setVisible(false);
            UnitsInternalView unitsInternalView = new UnitsInternalView(parent, productInternalView, UnitsInternalView.ADD);
            parent.add(unitsInternalView);
            unitsInternalView.setVisible(true);
            return;
        }
        new Message().showError("No fue posible actualizar la cantidad de unidades");
    }
}
