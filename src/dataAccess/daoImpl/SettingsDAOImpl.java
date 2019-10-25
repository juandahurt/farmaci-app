package dataAccess.daoImpl;

import dataAccess.XMLHandler;
import dataAccess.dao.SettingsDAO;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;
import java.io.IOException;
import java.util.HashMap;

public class SettingsDAOImpl implements SettingsDAO {

    @Override
    public HashMap<String, String> getDefaultFont() throws IOException, SAXException, ParserConfigurationException {
        NodeList nodes = XMLHandler.getValueByTagName("settings/settings.xml", "font");
        HashMap<String, String> defaultFont = new HashMap<>();

        for (int i = 0; i < nodes.getLength(); i++) {
            Node node = nodes.item(i);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element fontElement = (Element) node;
                String name = fontElement.getElementsByTagName("name").item(0).getTextContent();
                String style = fontElement.getElementsByTagName("style").item(0).getTextContent();
                String size = fontElement.getElementsByTagName("size").item(0).getTextContent();
                defaultFont.put("name", name);
                defaultFont.put("style", style);
                defaultFont.put("size", size);
            }
        }
        return defaultFont;
    }

    @Override
    public String getInstallationPath() throws IOException, SAXException, ParserConfigurationException {
        return XMLHandler.getValueByTagName("src/config/settings.xml", "installation-folder").item(0).getTextContent();
    }

    @Override
    public boolean setInstallationPath(String installationPath) {
        try {
            return XMLHandler.setValue("src/config/settings.xml", "installation-folder", installationPath);
        } catch (IOException | SAXException | ParserConfigurationException | TransformerException e) {
            e.printStackTrace();
            return false;
        }
    }


}
