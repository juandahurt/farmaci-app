package view;

import view.abstracts.AbstractView;
import view.helpers.BackgroundHelper;

import javax.swing.*;

public class MainView extends AbstractView {

    private StockInternalView stockInternalView;
    private CartInternalView cartInternalView;
    private StatsInternalView statsInternalView;
    private ExpensesInternalView expensesInternalView;

    private JMenuBar mnbMenu;

    private JMenu mnFile;
    private JMenuItem mniStock;
    private JMenuItem mniExit;

    private JMenu mnAccounting;
    private JMenuItem mniCart;
    private JMenuItem mniStats;
    private JMenuItem mniExpenses;

    private BackgroundHelper background;

    public MainView() {
        super("Farmacia");
        ImageIcon icoApp = new ImageIcon(getClass().getResource("/img/icons/store.png"));
        setIconImage(icoApp.getImage());
    }

    @Override
    public void initComponents() {
        mnbMenu = new JMenuBar();

        //
        // File menu
        //
        Icon icoFile = new ImageIcon(getClass().getResource("/img/icons/file.png"));
        mnFile = new JMenu("Archivo");
        mnFile.setIcon(icoFile);

        Icon icoStock = new ImageIcon(getClass().getResource("/img/icons/stock.png"));
        mniStock = new JMenuItem("Bodega", icoStock);
        mniStock.addActionListener(e -> stockOnClick());

        Icon icoExit = new ImageIcon(getClass().getResource("/img/icons/exit.png"));
        mniExit = new JMenuItem("Salir", icoExit);
        mniExit.addActionListener(e -> exitOnClick());

        mnFile.add(mniStock);
        mnFile.add(new JSeparator());
        mnFile.add(mniExit);
        mnbMenu.add(mnFile);

        //
        // Accounting menu
        //
        Icon icoAccounting = new ImageIcon(getClass().getResource("/img/icons/accounting.png"));
        mnAccounting = new JMenu("Contabilidad");
        mnAccounting.setIcon(icoAccounting);

        Icon icoCart = new ImageIcon(getClass().getResource("/img/icons/cart.png"));
        mniCart = new JMenuItem("Nueva Venta", icoCart);
        mniCart.addActionListener(e -> cartOnClick());

        Icon icoStats = new ImageIcon(getClass().getResource("/img/icons/statistics.png"));
        mniStats = new JMenuItem("Estadisticas", icoStats);
        mniStats.addActionListener(e -> statsOnClick());

        Icon icoMoneyOut = new ImageIcon(getClass().getResource("/img/icons/money-out.png"));
        mniExpenses = new JMenuItem("Egresos", icoMoneyOut);
        mniExpenses.addActionListener(e -> moneyOutOnClick());


        mnAccounting.add(mniCart);
        mnAccounting.add(new JSeparator());
        mnAccounting.add(mniExpenses);
        mnAccounting.add(new JSeparator());
        mnAccounting.add(mniStats);
        mnbMenu.add(mnAccounting);

        setJMenuBar(mnbMenu);

        background = new BackgroundHelper();
        setContentPane(background);
    }

    private void moneyOutOnClick() {
        if (expensesInternalView != null) {
            if (!expensesInternalView.isVisible()) {
                expensesInternalView = null;
                expensesInternalView = new ExpensesInternalView(this);
                background.add(expensesInternalView);
                expensesInternalView.setVisible(true);
            }
        } else {
            expensesInternalView = new ExpensesInternalView(this);
            background.add(expensesInternalView);
            expensesInternalView.setVisible(true);
        }
    }

    private void statsOnClick() {
        if (statsInternalView != null) {
            if (!statsInternalView.isVisible()) {
                statsInternalView = null;
                statsInternalView = new StatsInternalView(this);
                background.add(statsInternalView);
                statsInternalView.setVisible(true);
            }
        } else {
            statsInternalView = new StatsInternalView(this);
            background.add(statsInternalView);
            statsInternalView.setVisible(true);
        }
    }

    private void cartOnClick() {
        if (cartInternalView != null) {
            if (!cartInternalView.isVisible()) {
                cartInternalView = null;
                cartInternalView = new CartInternalView(this);
                background.add(cartInternalView);
                cartInternalView.setVisible(true);
            }
        } else {
            cartInternalView = new CartInternalView(this);
            background.add(cartInternalView);
            cartInternalView.setVisible(true);
        }
    }

    private void stockOnClick() {
        if (stockInternalView != null) {
            if (!stockInternalView.isVisible()){
                stockInternalView = null;
                stockInternalView = new StockInternalView(this);
                background.add(stockInternalView);
                stockInternalView.setVisible(true);
            }
        } else {
            stockInternalView = new StockInternalView(this);
            background.add(stockInternalView);
            stockInternalView.setVisible(true);
        }
    }

    private void exitOnClick() {
        System.exit(0);
    }
}
