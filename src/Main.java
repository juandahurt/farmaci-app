import config.Config;
import java.util.logging.Level;
import java.util.logging.Logger;
import threads.ExpirationThread;
import threads.StockThread;
import threads.ViewThread;
import view.MainView;

import javax.swing.*;
import threads.UnitsThread;

public class Main {

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getInstalledLookAndFeels()[1].getClassName());
        } catch (
                ClassNotFoundException |
                UnsupportedLookAndFeelException |
                IllegalAccessException |
                InstantiationException e
        ) {
            e.printStackTrace();
        }
        Config.init();

        ViewThread view = new ViewThread("View", new MainView());
        view.start();

        StockThread stock = new StockThread("Stock");
        stock.start();

        ExpirationThread expiration = new ExpirationThread("Expiration");
        try {
            expiration.join();
        } catch (InterruptedException ex) {
            Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        UnitsThread units = new UnitsThread("Units");
        try {
            units.join();
        } catch (InterruptedException ex) {
            Logger.getLogger(Main.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
