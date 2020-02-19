import Swal from 'sweetalert2';

export class Notification {
    /**
     * Contiene la notificación
     */
    private toast;

    /**
     * Contiene la alerta
     */
    private alert;

    constructor() {
        this.toast = Swal.mixin( {
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000
        });
        this.alert = Swal.mixin( {
            customClass: {
                confirmButton: 'btn btn-primary rounded-pill'
            },
            toast: true,
            position: "bottom",
            showConfirmButton: false,
            showCloseButton: true,
            buttonsStyling: false
        });
    }

    /**
     * Notifica al usuario con un mensaje de exito
     * @param msg Mensaje de exito
     */
    public showSuccess(msg): void {
        this.toast.fire({
            icon: 'success',
            title: msg
        });
    }

    /**
     * Notifica al usuario con un mensaje de error
     * @param err Mensaje de error
     */
    public showError(err): void {
        this.toast.fire({
            icon: 'error',
            title: err
        });
    }

    /**
     * Alerta al usuario
     * @param msg Mensaje de la alerta
     */
    public showAlert(msg): void {
        this.alert.fire({
            title: msg
        })
    }
}