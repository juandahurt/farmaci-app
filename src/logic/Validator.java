package logic;

public class Validator {

    public static boolean isEmpty(String str) {
        return str.isEmpty();
    }

    public static boolean isPositive(int val) {
        return val > 0;
    }

    public static boolean isExpired(Date d) {
        return new Date().compareTo(d) >= 0;
    }
}
