package view;

import logic.Stats;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartPanel;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.CategoryAxis;
import org.jfree.chart.axis.CategoryLabelPositions;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;
import view.abstracts.AbstractInternalView;
import view.abstracts.AbstractView;

import javax.swing.*;
import java.util.ArrayList;

class StatsInternalView extends AbstractInternalView {
    //
    // Independent Stats
    //
    private JLabel lblIcoBills;
    private JLabel lblBills;
    private JComboBox<String> cbxRange;
    private JLabel lblIcoProfits;
    private JLabel lblProfits;

    //
    // Charts TabbedPane
    //
    private JTabbedPane tbpCharts;

    //
    // Charts
    //
    private ChartPanel pnlBills;
    private JFreeChart billsChart;
    private DefaultCategoryDataset billsDataset;
    private ChartPanel pnlProfits;
    private JFreeChart profitsChart;
    private DefaultCategoryDataset profitsDataset;


    StatsInternalView(AbstractView parent) {
        super(830, 400, "Estadísticas", parent);
    }

    @Override
    public void initComponents() {
        //
        // Independent stats
        //
        Icon icoBills = new ImageIcon(getClass().getResource("/img/icons/shopping-bag.png"));
        lblIcoBills = new JLabel(icoBills);
        lblIcoBills.setBounds(170, 20, 40, 40);
        lblIcoBills.setToolTipText("Ventas realizadas");
        add(lblIcoBills);

        lblBills = new JLabel("0");
        lblBills.setBounds(220, 20, 200, 40);
        add(lblBills);

        cbxRange = new JComboBox<>();
        cbxRange.addItem("Semanal");
        cbxRange.addItem("Mensual");
        cbxRange.addItem("Anual");
        cbxRange.addItem("Todo el tiempo");
        cbxRange.setBounds(320, 20, 160, 40);
        cbxRange.addActionListener(e -> rangeOnClick());
        add(cbxRange);

        Icon icoProfits = new ImageIcon(getClass().getResource("/img/icons/profits.png"));
        lblIcoProfits = new JLabel(icoProfits);
        lblIcoProfits.setBounds(540, 20, 40, 40);
        lblIcoProfits.setToolTipText("Ingresos");
        add(lblIcoProfits);

        lblProfits = new JLabel();
        lblProfits.setBounds(590, 20, 200, 40);
        add(lblProfits);

        initStatsContainer();
    }

    private void rangeOnClick() {
        String selectedRange = (String) cbxRange.getSelectedItem();
        if (selectedRange.equals("Semanal")) {
            updateStats(Stats.WEEK);
        } else if (selectedRange.equals("Mensual")) {
            updateStats(Stats.MONTH);
        } else if (selectedRange.equals("Anual")) {
            updateStats(Stats.YEAR);
        } else if (selectedRange.equals("Todo el tiempo")) {
            updateStats(Stats.ALL_TIME);
        }
    }

    private void updateBillsLabel(int bills) {
        lblBills.setText(String.valueOf(bills));
    }

    private void updateProfitsLabel(double profits) {
        lblProfits.setText("$" + profits);
    }

    private void initStatsContainer() {
        billsDataset = new DefaultCategoryDataset();
        profitsDataset = new DefaultCategoryDataset();
        int bills = 0;
        double profits = 0.0;
        for (Stats stats : getStats(Stats.WEEK)) {
            billsDataset.setValue(stats.getBillsQuantity(), "Ventas", stats.getLabel());
            profitsDataset.setValue(stats.getProfits(), "Ingresos", stats.getLabel());
            bills += stats.getBillsQuantity();
            profits += stats.getProfits();
        }
        updateBillsLabel(bills);
        updateProfitsLabel(profits);

        billsChart = ChartFactory.createBarChart("", "", "", billsDataset, PlotOrientation.VERTICAL, false, true, true);
        profitsChart = ChartFactory.createBarChart("", "", "", profitsDataset, PlotOrientation.VERTICAL, false, true, true);

        // create the charts into the containers
        pnlBills = new ChartPanel(billsChart);
        pnlProfits = new ChartPanel(profitsChart);

        //
        // Charts TabbedPane
        //
        tbpCharts = null;
        tbpCharts = new JTabbedPane();
        tbpCharts.setBounds(5, 60, 800, 275);
        tbpCharts.add("Ventas", pnlBills);
        tbpCharts.add("Ingresos", pnlProfits);
        add(tbpCharts);
    }

    private void updateStats(int range) {
        int bills = 0;
        double profits = 0.0;
        DefaultCategoryDataset newBillsDataset = new DefaultCategoryDataset();
        DefaultCategoryDataset newProfitsDataset = new DefaultCategoryDataset();
        for (Stats stats : getStats(range)) {
            newBillsDataset.setValue(stats.getBillsQuantity(), "Ventas", stats.getLabel());
            newProfitsDataset.setValue(stats.getProfits(), "Ingresos", stats.getLabel());
            bills += stats.getBillsQuantity();
            profits += stats.getProfits();
        }

        updateBillsLabel(bills);
        updateProfitsLabel(profits);

        if (range == Stats.MONTH || range == Stats.YEAR) {
            CategoryAxis billsAxis = billsChart.getCategoryPlot().getDomainAxis();
            billsAxis.setCategoryLabelPositions(CategoryLabelPositions.UP_90);
            CategoryAxis profitsAxis = profitsChart.getCategoryPlot().getDomainAxis();
            profitsAxis.setCategoryLabelPositions(CategoryLabelPositions.UP_90);
        }

        PlotOrientation plotOrientation = range == Stats.MONTH ? PlotOrientation.VERTICAL : PlotOrientation.HORIZONTAL;

        JFreeChart newBillsChart = ChartFactory.createBarChart("", "", "", newBillsDataset, plotOrientation, false, true, true);
        JFreeChart newProfitsChart = ChartFactory.createBarChart("", "", "", newProfitsDataset, plotOrientation, false, true, true);

        billsChart.getCategoryPlot().setDataset(newBillsChart.getCategoryPlot().getDataset());
        profitsChart.getCategoryPlot().setDataset(newProfitsChart.getCategoryPlot().getDataset());
    }

    private ArrayList<Stats> getStats(int range) {
        return Stats.getStats(range);
    }
}
