package logic;

import dataAccess.dao.SettingsDAO;
import dataAccess.daoImpl.SettingsDAOImpl;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.HashMap;

public class Initializer {

    public static HashMap<String, String> getDefaultFont() throws IOException, SAXException, ParserConfigurationException {
        SettingsDAO settingsDAO = new SettingsDAOImpl();
        return settingsDAO.getDefaultFont();
    }

    public static void setInstallationPath(String path) {
        SettingsDAO settingsDAO = new SettingsDAOImpl();
        settingsDAO.setInstallationPath(path);
    }
}
