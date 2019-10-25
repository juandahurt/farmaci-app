package logic.exceptions;

public class NotEnoughUnits extends Exception {
    public NotEnoughUnits() {
        super("No hay suficientes unidades en bodega");
    }
}
