import {CategoryCard} from './components/CategoryCard'
import {VenuePreviewCard} from './components/VenuePreviewCard'

export const Home = () => {
    return (
        <>
            <CategoryCard title="Título" description="Descripción" imgUrl="https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg" />
            <br />
            <VenuePreviewCard title="Título" address="Descripción" details="Detalles" imgUrl="https://cdn0.matrimonio.com.pe/vendor/5326/3_2/1280/jpeg/whatsapp-image-2023-03-07-at-12-29-44-4_11_115326-167838324481472.jpeg" />
        </>
    )
};
