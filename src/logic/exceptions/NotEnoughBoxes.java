package logic.exceptions;

public class NotEnoughBoxes extends Exception {
    public NotEnoughBoxes() {
        super("No hay suficientes cajas en bodega");
    }
}
