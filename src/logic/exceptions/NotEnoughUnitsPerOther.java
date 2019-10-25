package logic.exceptions;

public class NotEnoughUnitsPerOther extends Exception {

    public NotEnoughUnitsPerOther() {
        super("Esa cantidad de unidades excede o iguala la cantidad que vienen por sobre");
    }

}
