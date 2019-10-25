package logic.exceptions;

public class NotEnoughUnitsPerBox extends Exception {
    public NotEnoughUnitsPerBox() {
        super("Esa cantidad de unidades excede o iguala la cantidad que viene por caja");
    }
}
