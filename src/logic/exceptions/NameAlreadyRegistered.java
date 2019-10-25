package logic.exceptions;

public class NameAlreadyRegistered extends Exception {
    public NameAlreadyRegistered() {
        super("Este nombre ya se encuentra registado");
    }
}
