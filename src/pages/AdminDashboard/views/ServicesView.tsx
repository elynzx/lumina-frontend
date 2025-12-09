import { useState } from 'react';
import { AdditionalServicesView } from './AdditionalServicesView';
import { MandatoryServicesView } from './MandatoryServicesView';

type SubView = 'additional' | 'mandatory';

export const ServicesView = () => {
    const [activeSubView, setActiveSubView] = useState<SubView>('additional');

    return (
        <div className="p-6">
            {/* Sub-navegación */}
            <div className="mb-6 flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveSubView('additional')}
                    className={`px-6 py-3 font-medium transition-all ${
                        activeSubView === 'additional'
                            ? 'text-[#FF5050] border-b-2 border-[#FF5050]'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Servicios Adicionales
                </button>
                <button
                    onClick={() => setActiveSubView('mandatory')}
                    className={`px-6 py-3 font-medium transition-all ${
                        activeSubView === 'mandatory'
                            ? 'text-[#FF5050] border-b-2 border-[#FF5050]'
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                    Servicios Obligatorios
                </button>
            </div>

            {/* Renderizar vista según sub-navegación */}
            {activeSubView === 'additional' && <AdditionalServicesView />}
            {activeSubView === 'mandatory' && <MandatoryServicesView />}
        </div>
    );
};
