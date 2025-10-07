export const REGEX_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^.{6,}$/, // Solo mínimo 6 caracteres, cualquier carácter
  phone: /^9\d{8}$/,
  dni: /^\d{8}$/,
  name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/
};

export const VALIDATION_MESSAGES = {
  required: 'Este campo es obligatorio',
  email: 'Ingresa un correo electrónico válido',
  password: 'La contraseña debe tener al menos 6 caracteres',
  passwordMatch: 'Las contraseñas no coinciden',
  phone: 'Ingresa un número de celular válido (9 dígitos empezando por 9)',
  dni: 'Ingresa un DNI válido (8 dígitos)',
  name: 'Ingresa un nombre válido (solo letras, mínimo 2 caracteres)',
  minLength: (min: number) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max: number) => `No debe exceder ${max} caracteres`
};

export const VALIDATION_RULES = {
  email: {
    required: VALIDATION_MESSAGES.required,
    pattern: {
      value: REGEX_PATTERNS.email,
      message: VALIDATION_MESSAGES.email
    }
  },
  password: {
    required: VALIDATION_MESSAGES.required,
    pattern: {
      value: REGEX_PATTERNS.password,
      message: VALIDATION_MESSAGES.password
    }
  },
  phone: {
    required: VALIDATION_MESSAGES.required,
    pattern: {
      value: REGEX_PATTERNS.phone,
      message: VALIDATION_MESSAGES.phone
    }
  },
  dni: {
    required: VALIDATION_MESSAGES.required,
    pattern: {
      value: REGEX_PATTERNS.dni,
      message: VALIDATION_MESSAGES.dni
    }
  },
  firstName: {
    required: VALIDATION_MESSAGES.required,
    pattern: {
      value: REGEX_PATTERNS.name,
      message: VALIDATION_MESSAGES.name
    }
  },
  lastName: {
    required: VALIDATION_MESSAGES.required,
    pattern: {
      value: REGEX_PATTERNS.name,
      message: VALIDATION_MESSAGES.name
    }
  }
};