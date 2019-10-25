package config;

import dataAccess.daoImpl.SettingsDAOImpl;

import java.nio.file.Paths;

public class Config {

    public static String INSTALL_PATH;
    public static String PRODUCTS_PATH;
    public static String PRODUCTS_TEMP_PATH;
    public static String CATEGORIES_PATH;
    public static String SETTINGS_PATH;
    public static String BILLS_PATH;
    public static String EXPENSES_PATH;

    public static void init() {
        try {
            INSTALL_PATH = new SettingsDAOImpl().getInstallationPath();
            SETTINGS_PATH = new SettingsDAOImpl().getInstallationPath();
        } catch(Exception e) {
            e.printStackTrace();
            return;
        }
        PRODUCTS_PATH = Paths.get(INSTALL_PATH, "products", "products.json").toString();
        PRODUCTS_TEMP_PATH = Paths.get(INSTALL_PATH, "products", "products.tmp.json").toString();
        CATEGORIES_PATH = Paths.get(INSTALL_PATH, "categories", "categories.json").toString();
        BILLS_PATH = Paths.get(INSTALL_PATH, "bills").toString();
        EXPENSES_PATH = Paths.get(INSTALL_PATH, "expenses", "expenses.json").toString();
    }
}
