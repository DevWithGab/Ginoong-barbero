import Swal from 'sweetalert2';

const theme = {
  confirmButtonColor: '#C9A84C',
  cancelButtonColor: '#6b7280',
  customClass: {
    confirmButton: 'swal2-confirm',
    cancelButton: 'swal2-cancel',
  },
};

export const swalConfirm = (options) =>
  Swal.fire({
    title: 'Are you sure?',
    text: options.text || 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: options.confirmText || 'Yes, do it!',
    cancelButtonText: options.cancelText || 'Cancel',
    reverseButtons: true,
    ...theme,
    ...options,
  });

export const swalSuccess = (options) =>
  Swal.fire({
    icon: 'success',
    confirmButtonText: 'OK',
    ...theme,
    ...options,
  });

export const swalError = (options) =>
  Swal.fire({
    icon: 'error',
    confirmButtonText: 'OK',
    ...theme,
    ...options,
  });

export const swalInfo = (options) =>
  Swal.fire({
    icon: 'info',
    confirmButtonText: 'OK',
    ...theme,
    ...options,
  });

export const swalLoading = (options) =>
  Swal.fire({
    title: options?.title || 'Processing...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading(),
    ...options,
  });

export const swalClose = () => Swal.close();

export default Swal;
