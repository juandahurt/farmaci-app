package threads;

import view.MainView;

public class ViewThread extends Thread {

    private MainView view;

    public ViewThread(String name, MainView view) {
        super(name);
        this.view = view;
    }

    public void run() {
        view.setVisible(true);
    }
}
