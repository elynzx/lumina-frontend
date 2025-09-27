import { DistrictSection } from './components/DistrictSection'
import { HowWorksSection } from './components/HowWorksSection';
import { TypeEventSection } from './components/TypeEventSection'
import { VenuePreviewSection } from './components/VenuePreviewSection'
import { PopularVenuesSection } from './components/PopularVenuesSection';

export const Home = () => {
    return (
        <>
            <DistrictSection />
            <HowWorksSection />
            <TypeEventSection />
            <PopularVenuesSection />
            <VenuePreviewSection />
        </>
    )
};
