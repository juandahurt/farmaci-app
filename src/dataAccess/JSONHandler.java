package dataAccess;

import java.io.File;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class JSONHandler {

    public static JSONObject getJSONObject(String path) {
        try {
            JSONParser jsonParser = new JSONParser();
            File file = new File(path);
            Object object = jsonParser.parse(new FileReader(file));
            return (JSONObject) object;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    public static boolean writeJSONFile(String path, JSONObject jsonObject) {
        try (FileWriter file = new FileWriter(path)) {
            file.write(jsonObject.toJSONString());
            file.flush();
            file.close();
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
}
