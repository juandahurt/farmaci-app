package dataAccess.daoImpl;

import config.Config;
import dataAccess.dao.StatsDAO;
import logic.Date;
import logic.Stats;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.GregorianCalendar;

public class StatsImpl implements StatsDAO {

    @Override
    public ArrayList<Stats> getStats(int range) {
        String billsPath = Config.BILLS_PATH;
        int n = -1;
        boolean allTime = false;
        switch (range) {
            case Stats.WEEK:
                n = 6;
                break;
            case Stats.MONTH:
                n = 29;
                break;
            case Stats.YEAR:
                n = 11;
                break;
            case Stats.ALL_TIME:
                allTime = true;
                n = 1;
                break;
        }
        ArrayList<Stats> stats = new ArrayList<>();

        while (n >= 0 || allTime) {
            Date todayDate = new Date();
            switch (range) {
                case Stats.WEEK:
                    todayDate.add(GregorianCalendar.DAY_OF_MONTH, -n);
                    break;
                case Stats.MONTH:
                    todayDate.add(GregorianCalendar.DAY_OF_MONTH, -n);
                    break;
                case Stats.YEAR:
                    todayDate.add(GregorianCalendar.MONTH, -n);
                    break;
                case Stats.ALL_TIME:
                    todayDate.add(GregorianCalendar.YEAR, n);
                    break;
            }
            String year, month, day;
            year = String.valueOf(todayDate.getYear());
            month = String.valueOf(todayDate.getMonth());
            day = String.valueOf(todayDate.getDay());
            String statsPath = "";
            Stats statsObj = new Stats();
            statsObj.setRange(range);

            switch (range) {
                case Stats.WEEK:
                    statsPath = Paths.get(billsPath, year, month, day, "stats.json").toString();
                    statsObj.setLabel(todayDate.getDayOfWeek());
                    break;
                case Stats.MONTH:
                    statsPath = Paths.get(billsPath, year, month, day, "stats.json").toString();
                    int dayOfMonth = todayDate.getDay();
                    int theMonth = todayDate.getMonth();
                    statsObj.setLabel(dayOfMonth + "/" + theMonth);
                    break;
                case Stats.YEAR:
                    statsPath = Paths.get(billsPath, year, month,"stats.json").toString();
                    statsObj.setLabel(todayDate.getMonth());
                    break;
                case Stats.ALL_TIME:
                    allTime = true;
                    statsObj.setLabel(String.valueOf(todayDate.getYear()));
                    statsPath = Paths.get(billsPath, year, "stats.json").toString();
                    break;
            }

            File file = new File(statsPath);
            if (!file.exists()) {
                // create the empty stats
                if (allTime){
                    if (new Date().getYear() < todayDate.getYear()) {
                        stats.add(statsObj);
                    }
                } else {
                    stats.add(statsObj);
                }
                n--;
                allTime = false;
                continue;
            }
            // read the stats file
            JSONParser jsonParser = new JSONParser();
            Object obj;
            try {
                FileReader fr = new FileReader(file);
                obj = jsonParser.parse(fr);
                JSONObject statsObject = (JSONObject) obj;
                int totalBills = Math.toIntExact((Long) statsObject.get("total-bills"));
                double total = (double) statsObject.get("total");
                statsObj.setTotal(total);
                statsObj.setBillsQuantity(totalBills);
                stats.add(statsObj);
                fr.close();
            } catch (IOException | ParseException e) {
                e.printStackTrace();
                return null;
            }
            n--;
        }
        return stats;
    }
}
