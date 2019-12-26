import { Notification } from './notification.helper';

export class ErrorHandler {
    /**
     * Encargada de manejar errores enviados desde el servidor.
     * @param err error enviado desde el servidor
     * @param successMsg mensaje en caso de que err.status = 200
     */
    public static handleError(err: any, successMsg: string) {
        let notification = new Notification();

        if (err.status == 200) {
            notification.showSuccess(successMsg);
            return;
        }
        this.showError(err);
    }

    /**
     * Encargada de mostrar el error al usuario.
     * @param err error enviado desde el servidor
     */
    public static showError(err: any) {
        let notification = new Notification();

        switch (err.status) {
            case 0:
                notification.showError('No fue posible establecer una conexión con el servidor');
                break;
            default:
                notification.showError(err.error.error);
                break;
        }
    }
}