package view;

import logic.Initializer;

import javax.swing.*;

public class InstallationView {

    private JFileChooser chooser;

    public InstallationView() {
        chooser = new JFileChooser();
        chooser.setDialogTitle("Escoge el lugar de instalación");
        chooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
        chooser.setAcceptAllFileFilterUsed(false);
    }

    public void show() {
        if (chooser.showOpenDialog(null) == JFileChooser.APPROVE_OPTION) {
            Initializer.setInstallationPath(chooser.getSelectedFile().getPath());
        } else {
            System.exit(0);
        }
    }
}
