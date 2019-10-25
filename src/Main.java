import config.Config;
import threads.ExpirationThread;
import threads.StockThread;
import threads.ViewThread;
import view.InstallationView;
import view.MainView;

import javax.swing.*;

public class Main {

    public static void main(String[] args) {
        //InstallationView installationView = new InstallationView();
        //installationView.show();
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

        /*StockThread stock = new StockThread("Stock");
        stock.start();

        ExpirationThread expiration = new ExpirationThread("Expiration");
        expiration.start();*/
    }
}
