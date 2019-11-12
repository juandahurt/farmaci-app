package dataAccess;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class JSONHandler {

    public static JSONObject getJSONObject(String path) {
        JSONParser parser = new JSONParser();
        Object obj;
        FileReader fr;
        try {
            fr = new FileReader(path);
            obj = parser.parse(fr);
        } catch (IOException | ParseException e) {
            e.printStackTrace();
            return null;
        }
        try {
            fr.close();
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
        return (JSONObject) obj;
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
