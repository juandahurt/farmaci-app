package view.abstracts;

import org.xml.sax.SAXException;
import view.helpers.FontHelper;
import view.msg.Message;

import javax.swing.*;
import javax.swing.plaf.FontUIResource;
import javax.xml.parsers.ParserConfigurationException;
import java.awt.*;
import java.io.IOException;

public abstract class AbstractView extends JFrame {

    public AbstractView(String title) {
        initSettings();
        initView(title);
        initComponents();
    }

    private void initView(String title) {
        setTitle(title);
        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
        setSize(screenSize);
        setResizable(true);
        setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        setLayout(null);
    }

    private void initSettings() {
        /*try {
            setUIFont(new FontUIResource(FontHelper.getDefaultFont()));
        } catch (ParserConfigurationException | IOException | SAXException e) {
            e.printStackTrace();
            new Message().showError(e.getMessage());
        }*/
        setUIFont(new FontUIResource(new Font("Arial", Font.PLAIN, 16)));
    }

    private void setUIFont(FontUIResource f) {
        java.util.Enumeration keys = UIManager.getDefaults().keys();
        while (keys.hasMoreElements()) {
            Object key = keys.nextElement();
            Object value = UIManager.get(key);
            if (value instanceof FontUIResource) {
                UIManager.put(key, f);
            }
        }
    }

    public abstract void initComponents();
}
