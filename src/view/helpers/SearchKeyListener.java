package view.helpers;

import logic.Product;
import view.abstracts.AbstractProductVisualizer;
import view.msg.Message;

import javax.swing.*;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

public class SearchKeyListener implements KeyListener {

    private JTextField textField;
    private AbstractProductVisualizer view;

    public SearchKeyListener(JTextField textField, AbstractProductVisualizer view) {
        this.textField = textField;
        this.view = view;
    }

    @Override
    public void keyTyped(KeyEvent e) {

    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ENTER) {
            if (textField.getText().isEmpty()) {
                new Message().showError("El campo de búsqueda no puede estar vacío");
            } else {
                view.setProductToShow(Product.search(textField.getText()));
                if (view.getProductToShow() == null) {
                    view.showNotFound();
                } else {
                    view.showProduct();
                }
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {

    }
}
