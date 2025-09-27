import { Footer } from '@/components/organism/Footer';
import { DistrictSection } from './components/DistrictSection'
import { HowWorksSection } from './components/HowWorksSection';
import { TypeEventSection } from './components/TypeEventSection'
import { VenuePreviewSection } from './components/VenuePreviewSection'
import { Header } from "@/components/organism/Header";

export const Home = () => {
    return (
        <>
            <DistrictSection />
            <HowWorksSection />
            <TypeEventSection />
            <VenuePreviewSection />
        </>
    )
};
