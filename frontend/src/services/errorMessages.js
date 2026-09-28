const fieldLabels = {
  email: 'El email',
  first_name: 'El nombre',
  last_name: 'El apellido',
  password: 'La contraseña',
  current_password: 'La contraseña actual',
  new_email: 'El nuevo email',
  new_password: 'La nueva contraseña',
};

export function getUserErrorMessage(error) {
  const message = error?.message || '';

  if (message === 'Invalid credentials') {
    return 'El email o la contraseña no son correctos.';
  }

  if (message === 'Invalid current password') {
    return 'La contraseña actual no es correcta.';
  }

  if (message === 'email is already registered') {
    return 'Ese email ya está registrado.';
  }

  if (message === 'password must contain at least 8 characters') {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }

  if (message === 'new_password must contain at least 8 characters') {
    return 'La nueva contraseña debe tener al menos 8 caracteres.';
  }

  if (message === 'Unauthorized') {
    return 'Tu sesión no es válida o ha caducado.';
  }

  if (message === 'Invalid request') {
    return 'La solicitud no es válida.';
  }

  if (message === 'Internal server error') {
    return 'Se produjo un error en el servidor.';
  }

  const requiredFieldMatch = message.match(/^(.+) is required$/);

  if (requiredFieldMatch) {
    const field = fieldLabels[requiredFieldMatch[1]];

    if (field) {
      return `${field} es obligatorio.`;
    }
  }

  return message || 'Se produjo un error inesperado.';
}
