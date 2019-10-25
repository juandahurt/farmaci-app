package threads;

import dataAccess.dao.ProductDAO;
import dataAccess.daoImpl.ProductDAOImpl;
import doryan.windowsnotificationapi.fr.Notification;
import logic.Product;

import java.awt.*;
import java.net.MalformedURLException;

public class StockThread extends Thread {

    public StockThread(String name) {
        super(name);
    }


    public void run() {
        while (true) {
            ProductDAO productDAO = new ProductDAOImpl();
            for(Product product : productDAO.list()) {
                int[] relation = productDAO.getRelation(product.getId());
                boolean comesInBoxes = relation[0] != -1;
                boolean comesInOthers = relation[1] != -1;
                boolean comesInUnits = relation[2] != -1;
                boolean notify = false;

                if (comesInBoxes) {
                    int totalBoxes = productDAO.getTotalBoxes(product.getId());
                    if (totalBoxes < 5) {
                        sendNotification("¡" + product.getDescription() + " tiene pocas cajas en bodega!");
                        notify = true;
                    }
                }
                if (comesInOthers && !comesInBoxes) {
                    int totalOthers = productDAO.getTotalOthers(product.getId());
                    if (totalOthers < 5) {
                        sendNotification("¡" + product.getDescription() + " tiene pocos sobres en bodega!");
                        notify = true;
                    }
                }
                if (comesInUnits && !comesInBoxes && !comesInOthers) {
                    int totalUnits = productDAO.getTotalUnits(product.getId());
                    if (totalUnits < 5) {
                        sendNotification("¡" + product.getDescription() + " tiene pocas unidades en bodega!");
                        notify = true;
                    }
                }

                if (notify) {
                    try {
                        sleep(2000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                        break;
                    }
                }
            }
            try {
                sleep(21600000); // six hours
            } catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
        }
    }

    private void sendNotification(String msg) {
        try {
            Notification.sendNotification("Atención", msg, TrayIcon.MessageType.WARNING);
        } catch (AWTException | MalformedURLException e) {
            e.printStackTrace();
        }
    }
}
