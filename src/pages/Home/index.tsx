import { DistrictSection } from './components/DistrictSection'
import { HowWorksSection } from './components/HowWorksSection';
import { TypeEventSection } from './components/TypeEventSection'
import { VenuePreviewSection } from './components/VenuePreviewSection'
import { PopularVenuesSection } from './components/PopularVenuesSection';
import { HomeBanner } from './components/HomeBanner';

export const Home = () => {
    return (
        <>
            <HomeBanner />
            <DistrictSection />
            <HowWorksSection />
            <TypeEventSection />
            <PopularVenuesSection />
            <VenuePreviewSection />
        </>
    )
};
