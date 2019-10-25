package dataAccess.dao;

import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.HashMap;

public interface SettingsDAO {
    HashMap<String, String> getDefaultFont() throws IOException, SAXException, ParserConfigurationException;
    String getInstallationPath() throws IOException, SAXException, ParserConfigurationException;
    boolean setInstallationPath(String installationPath);
}
