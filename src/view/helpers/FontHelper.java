package view.helpers;

import logic.Initializer;
import org.xml.sax.SAXException;

import javax.swing.plaf.FontUIResource;
import javax.xml.parsers.ParserConfigurationException;
import java.awt.*;
import java.io.IOException;
import java.util.HashMap;

public class FontHelper {

    public static FontUIResource getDefaultFont() throws ParserConfigurationException, SAXException, IOException {
        HashMap<String, String> defaultFont = Initializer.getDefaultFont();
        String name = defaultFont.get("name");
        int style = -1;
        switch (defaultFont.get("style")) {
            case "Plain":
                style = Font.PLAIN;
                break;
            case "Bold":
                style = Font.BOLD;
                break;
            case "Italic":
                style = Font.ITALIC;
                break;
        }
        int size = Integer.parseInt(defaultFont.get("size"));
        return new FontUIResource(name, style, size);
    }
}
