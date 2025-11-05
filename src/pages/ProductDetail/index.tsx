import { data } from "@/constants/data";
import { PhotosLayout } from "./components/PhotosLayout";
import starIcon from "@/assets/icons/Star_gold.svg";
import locationIcon from "@/assets/icons/location.svg";
import sshhIcon from "@/assets/icons/sshh.svg";
import capacityIcon from "@/assets/icons/capacity_blue.svg";
import wifiIcon from "@/assets/icons/wifi.svg";
import { BudgetLayout } from "./components/BudgetForm";
import { useParams } from "react-router-dom";

export const ProductDetail = () => {

    const { id } = useParams<{ id: string }>();
    const idLocal = parseInt(id || "1");

    const localData = data.locales.find(l => l.idLocal === idLocal);

    if (!localData) {
        return <div className="p-8 text-center">Local no encontrado.</div>;
    }

    const distritoData = data.distritos.find(d => d.idDistrito === localData?.idDistrito);
    const reviewsLocal = data.reviewsLocales.find(r => r.idLocal === localData?.idLocal);
    const ubicacionLocal = data.ubicacionesLocales.find(u => u.idLocal === localData?.idLocal);

    const fotos = data.fotosLocales.filter(_ => _.idLocal === localData.idLocal).map(_ => _.urlFoto);

    return (
        <div className="flex flex-col px-16 py-6 gap-8 justify-center items-center">

            <PhotosLayout imgUrls={fotos} description="Local para eventos" />

            <div className="w-full max-w-6xl flex gap-10">

                <div className="flex-1 flex flex-col gap-6">

                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold">{localData.nombreLocal}</h1>
                            <div className="flex items-center gap-2">
                                <img src={locationIcon} alt="ubicación" className="w-5 h-5" />
                                <span>{distritoData?.nombreDistrito},</span> {localData.direccion}
                            </div>
                            <div className="flex items-center gap-1">
                                <img src={starIcon} alt="star" className="w-5 h-5" />
                                <p>{reviewsLocal?.promedio}<span className="text-gray-600 text-sm"> ({reviewsLocal?.totalReviews} reseñas)</span></p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center flex-col p-3">
                                <img src={capacityIcon} alt="capacidad" className="w-8 mb-1" />
                                <span className="text-xs">Máx. {localData.aforoMaximo}</span>
                                <span className="text-xs">personas</span>
                            </div>
                            <div className="flex items-center flex-col p-3">
                                <img src={sshhIcon} alt="capacidad" className="w-8 mb-1" />
                                <span className="text-xs">Baños</span>
                            </div>
                            <div className="flex items-center flex-col p-3">
                                <img src={wifiIcon} alt="capacidad" className="w-8 mb-1" />
                                <span className="text-xs">WiFi</span>
                            </div>
                        </div>
                    </div>
                    <p className="leading-relaxed text-sm">{localData.descripcion}</p>
                    <iframe
                        className="w-full h-96 rounded-lg border border-gray-200"
                        src={ubicacionLocal?.urlGoogleMaps || ''}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                <div className="w-full max-w-[38%] flex flex-col gap-6 sticky top-20">
                    <BudgetLayout />
                </div>

            </div>
        </div>
    )
};