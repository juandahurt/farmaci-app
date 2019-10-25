package logic.exceptions;

public class NotEnoughOthersPerBox extends Exception {
    public NotEnoughOthersPerBox() {
        super("Esa cantidad de sobres excede o iguala la cantidad que viene por caja");
    }
}
