package dataAccess.dao;

import logic.Stats;

import java.util.ArrayList;

public interface StatsDAO {
    ArrayList<Stats> getStats(int range);
}
