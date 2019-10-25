package view.abstracts;

import javax.swing.*;
import java.awt.*;

public abstract class AbstractInternalView extends JInternalFrame {

    protected AbstractView parent;
    public AbstractInternalView(int width, int height, String title, AbstractView parent) {
        this.parent = parent;
        initView(width, height, title);
        initComponents();
    }

    private void initView(int width, int height, String title) {
        setSize(width, height);
        setClosable(true);
        setResizable(false);
        setIconifiable(false);
        setMaximizable(false);
        setLayout(null);
        setTitle(title);
        Dimension desktopSize = parent.getContentPane().getSize();
        Dimension jInternalFrameSize = getSize();
        setLocation(
                (desktopSize.width - jInternalFrameSize.width)/2,
                (desktopSize.height- jInternalFrameSize.height)/2
        );
        setBackground(Color.WHITE);
    }

    public abstract void initComponents();

    public JPanel getContainer() {
        JPanel container = new JPanel();
        container.setLayout(null);
        container.setBackground(new Color(240, 240, 240));
        return container;
    }
}
