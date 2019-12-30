import Swal from 'sweetalert2';

export class ConfirmForm {
    /**
     * Contiene el formulario
     */
    private form;

    constructor() {
        this.form = Swal.mixin( {
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-light shadow-sm ml-5',
                title: 'text-dark'
            },
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            buttonsStyling: false,
            focusConfirm: false,
            focusCancel: false
        });
    }

    /**
     * Muestra el formulario
     * @param title Título de formulario
     * @param text Texto de formulario
     */
    public async show(title, text) {
        return this.form.fire({
            icon: 'warning',
            title: title,
            text: text
        });
    }
}