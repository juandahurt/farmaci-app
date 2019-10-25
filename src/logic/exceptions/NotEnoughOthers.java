package logic.exceptions;

public class NotEnoughOthers extends Exception {
    public NotEnoughOthers() {
        super("No hay suficientes sobres en bodega");
    }
}
