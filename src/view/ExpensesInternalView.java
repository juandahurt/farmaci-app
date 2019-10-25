package view;

import logic.Date;
import logic.Expense;
import logic.Product;
import view.abstracts.AbstractInternalView;
import view.abstracts.AbstractView;
import view.helpers.NumericTextField;
import view.msg.Message;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;
import java.util.GregorianCalendar;

public class ExpensesInternalView extends AbstractInternalView {
    //
    // Table container
    //
    private JPanel pnlTableExpenses;
    private JTable tblExpenses;

    //
    // Expense container
    //
    private JPanel pnlExpense;

    private JLabel lblAmount;
    private JTextField txtAmount;

    private JLabel lblDescription;
    private JTextField txtDescription;

    private JButton btnSave;

    private JButton btnDelete;

    private ArrayList<Expense> expenses;

    ExpensesInternalView(AbstractView parent) {
        super(750, 280, "Egresos", parent);
    }

    @Override
    public void initComponents() {
        //
        // Table container
        //
        tblExpenses = new JTable();
        updateExpensesTable();

        pnlTableExpenses = getContainer();
        pnlTableExpenses.setLayout(new BorderLayout());
        pnlTableExpenses.add(tblExpenses.getTableHeader(), "First");
        pnlTableExpenses.add(tblExpenses, "Center");
        JScrollPane expensesScroll = new JScrollPane(pnlTableExpenses);
        expensesScroll.setBounds(10, 10, 390, 170);

        add(expensesScroll);

        //
        // Expense container
        //
        pnlExpense = getContainer();
        pnlExpense.setBounds(410, 10, 320, 230);

        lblAmount = new JLabel("Monto");
        lblAmount.setBounds(20, 20, 90, 30);
        pnlExpense.add(lblAmount);

        txtAmount = new NumericTextField();
        txtAmount.setBounds(20, 55, 210, 30);
        pnlExpense.add(txtAmount);

        lblDescription = new JLabel("Descripción");
        lblDescription.setBounds(20, 100, 150, 30);
        pnlExpense.add(lblDescription);

        txtDescription = new JTextField();
        txtDescription.setBounds(20, 135, 280, 30);
        pnlExpense.add(txtDescription);

        Icon icoSave = new ImageIcon(getClass().getResource("/img/icons/save.png"));
        btnSave = new JButton(icoSave);
        btnSave.setBounds(120, 175, 80, 50);
        btnSave.addActionListener(e -> saveOnClick());
        pnlExpense.add(btnSave);

        Icon icoDelete = new ImageIcon(getClass().getResource("/img/icons/delete.png"));
        btnDelete = new JButton(icoDelete);
        btnDelete.setBounds(300, 190, 80, 50);
        btnDelete.addActionListener(e -> deleteOnClick());
        add(btnDelete);

        add(pnlExpense);
    }

    private void deleteOnClick() {
        int row = tblExpenses.getSelectedRow();
        if (row < 0) {
            new Message().showError("No ha seleccionado ningún egreso");
            return;
        }
        if (Expense.delete(expenses.get(row).getId())) {
            updateExpensesTable();
            new Message().showMessage("Egreso eliminado satisfactoriamente");
        } else {
            new Message().showError("No fue posible eliminar el egreso");
        }
    }

    private void saveOnClick() {
        // TODO: Move validations to a validator in logic layer
        if (txtAmount.getText().isEmpty()) {
            new Message().showError("Debe ingresar un monto");
            return;
        }
        if (txtDescription.getText().isEmpty()) {
            new Message().showError("Debe ingresar una descripción");
            return;
        }
        Expense newExpense = new Expense();
        newExpense.setAmount(Double.valueOf(txtAmount.getText()));
        newExpense.setDescription(txtDescription.getText());
        Date today = new Date();
        today.add(GregorianCalendar.MONTH, 1);
        newExpense.setRegDate(today);
        if (Expense.save(newExpense)) {
            updateExpensesTable();
            txtDescription.setText("");
            txtAmount.setText("");
            new Message().showMessage("Egreso registrado exitosamente");
        } else {
            new Message().showError("No fue posible registrar el egreso");
        }
    }

    private void updateExpensesTable() {
        DefaultTableModel model = new DefaultTableModel() {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        model.addColumn("Fecha");
        model.addColumn("Descripción");
        model.addColumn("Monto");

        if (Product.list() != null) {
            expenses = Expense.list();
            for(Expense expense : expenses) {
                Object[] row = new Object[3];
                row[0] = expense.getRegDate().toString();
                row[1] = expense.getDescription();
                row[2] = expense.getAmount();
                model.addRow(row);
            }
        }
        tblExpenses.setModel(model);
    }
}
