package view.helpers;

import view.abstracts.AbstractView;

import javax.swing.*;
import java.awt.*;

public class BackgroundHelper extends JDesktopPane {

    private Image backgroundImage;

    public BackgroundHelper() {
        backgroundImage = new ImageIcon(getClass().getResource("/img/background.jpg")).getImage();
    }

    @Override
    public void paint(Graphics g) {
        g.drawImage(backgroundImage, 0, 0, null);
        super.paint(g);
    }
}
