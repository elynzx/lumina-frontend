interface AlertOptions {
  title: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info';
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  timer?: number;
}

export const showAlert = ({ 
  title, 
  text, 
  icon = 'success', 
  confirmButtonText = 'OK',
  cancelButtonText = 'Cancelar',
  showCancelButton = false,
  timer 
}: AlertOptions): Promise<boolean> => {
  return new Promise((resolve) => {
    // Crear el overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    `;

    // Crear el modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 32px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      text-align: center;
      animation: slideIn 0.3s ease;
    `;

    // Iconos SVG
    const icons = {
      success: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" stroke="#10B981" stroke-width="4" fill="none"/>
        <path d="M25 40L35 50L55 30" stroke="#10B981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      error: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" stroke="#EF4444" stroke-width="4" fill="none"/>
        <path d="M30 30L50 50M50 30L30 50" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
      </svg>`,
      warning: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 10L70 65H10L40 10Z" stroke="#F59E0B" stroke-width="4" fill="none"/>
        <path d="M40 30V45M40 55V57" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/>
      </svg>`,
      info: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="36" stroke="#3B82F6" stroke-width="4" fill="none"/>
        <path d="M40 35V55M40 25V27" stroke="#3B82F6" stroke-width="4" stroke-linecap="round"/>
      </svg>`
    };

    // Contenido del modal
    modal.innerHTML = `
      <div style="margin-bottom: 20px;">
        ${icons[icon]}
      </div>
      <h2 style="font-size: 24px; font-weight: 600; color: #1F2937; margin-bottom: 12px;">
        ${title}
      </h2>
      ${text ? `<p style="font-size: 16px; color: #6B7280; margin-bottom: 24px;">${text}</p>` : ''}
      <div style="display: flex; gap: 12px; justify-content: center;">
        ${showCancelButton ? `
          <button id="alert-cancel-btn" style="
            background: #E5E7EB;
            color: #374151;
            border: none;
            padding: 12px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${cancelButtonText}
          </button>
        ` : ''}
        <button id="alert-confirm-btn" style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        ">
          ${confirmButtonText}
        </button>
      </div>
    `;

    // Agregar animaciones CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      #alert-confirm-btn:hover {
        transform: scale(1.05);
      }
      #alert-confirm-btn:active {
        transform: scale(0.95);
      }
    `;
    document.head.appendChild(style);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Función para cerrar el modal
    const closeModal = (confirmed: boolean) => {
      overlay.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(() => {
        document.body.removeChild(overlay);
        document.head.removeChild(style);
        resolve(confirmed);
      }, 300);
    };

    // Event listeners
    const confirmBtn = modal.querySelector('#alert-confirm-btn');
    const cancelBtn = modal.querySelector('#alert-cancel-btn');
    
    confirmBtn?.addEventListener('click', () => closeModal(true));
    cancelBtn?.addEventListener('click', () => closeModal(false));
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(false);
    });

    // Auto-cerrar si hay timer
    if (timer) {
      setTimeout(() => closeModal(true), timer);
    }
  });
};
