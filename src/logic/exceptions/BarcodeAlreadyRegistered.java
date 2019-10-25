package logic.exceptions;

public class BarcodeAlreadyRegistered extends Exception {
    public BarcodeAlreadyRegistered() {
        super("Ese código de barras ya se encuentra registrado");
    }
}
