package threads;

import dataAccess.dao.ProductDAO;
import dataAccess.daoImpl.ProductDAOImpl;
import doryan.windowsnotificationapi.fr.Notification;
import logic.Date;
import logic.Product;
import logic.Unit;

import java.awt.*;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.concurrent.TimeUnit;

public class ExpirationThread extends Thread {

    public ExpirationThread(String name) {
        super(name);
    }

    public void run() {
        while (true) {
            Date today = new Date();
            ProductDAO productDAO = new ProductDAOImpl();
            for (Product product : productDAO.list()) {
                int[] relation = productDAO.getRelation(product.getId());
                boolean comesInBoxes = relation[0] != -1;
                boolean comesInOthers = relation[1] != -1;
                boolean comesInUnits = relation[2] != -1;
                int quantity = -1;

                for (Unit unit : productDAO.listUnits(product.getId())) {
                    unit.getExpDate().add(GregorianCalendar.MONTH, -1);
                    long diff = today.getTimeInMillis() - unit.getExpDate().getTimeInMillis();
                    long days = TimeUnit.MILLISECONDS.toDays(diff);
                    System.out.println(days);
                    if (days <= 10) {
                        quantity += unit.getQuantity();
                    }
                }

                if (quantity >= 0) {
                    if (comesInBoxes) {
                        sendNotification("El producto "+ product.getDescription() + " tiene cajas proximas a expirar " +
                                "o ya expiradas");
                    }
                    if (comesInOthers && !comesInBoxes) {
                        sendNotification("El producto "+ product.getDescription() + " tiene sobres proximos a expirar " +
                                "o ya expirados");
                    }
                    if (comesInUnits && !comesInBoxes && !comesInOthers) {
                        sendNotification("El producto "+ product.getDescription() + " tiene unidades proximas a expirar " +
                                "o ya expiradas");
                    }
                    try {
                        sleep(2000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }
            try {
                sleep(86400000);
            } catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
        }
    }

    private void sendNotification(String msg){
        try {
            Notification.sendNotification("Atención", msg, TrayIcon.MessageType.WARNING);
        } catch (AWTException | MalformedURLException e) {
            e.printStackTrace();
        }
    }
}
