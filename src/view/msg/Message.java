package view.msg;

import javax.swing.*;

public class Message {
    public void showMessage(String msg) {
        JOptionPane.showMessageDialog(null, msg, "Mensaje", JOptionPane.INFORMATION_MESSAGE);
    }

    public void showNotFound() {
        Icon icoNotFound = new ImageIcon(getClass().getResource("/img/icons/not-found.png"));
        JOptionPane.showMessageDialog(null, "Producto no encontrado", "Información",
                JOptionPane.INFORMATION_MESSAGE, icoNotFound);
    }

    public void showError(String err) {
        Icon icoError = new ImageIcon(getClass().getResource("/img/icons/warning.png"));
        JOptionPane.showMessageDialog(null, err, "Error", JOptionPane.ERROR_MESSAGE, icoError);
    }

    public boolean showConfirmDialog(String msg) {
        Icon icoQuestion = new ImageIcon(getClass().getResource("/img/icons/question.png"));
        return JOptionPane.showConfirmDialog(null, msg, "Pregunta", JOptionPane.YES_NO_OPTION,
                JOptionPane.INFORMATION_MESSAGE,icoQuestion) == JOptionPane.YES_NO_OPTION;
    }
}
