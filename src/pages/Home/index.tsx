import { DistrictSection } from './components/DistrictSection'
import { HowWorksSection } from './components/HowWorksSection';
import { TypeEventSection } from './components/TypeEventSection'
import { VenuePreviewSection } from './components/VenuePreviewSection'
import { Header } from "@/components/organism/Header";

export const Home = () => {
    return (
        <>
            <Header
                buttonText="Regístrate"
                onClickAction={() => { console.log("Regístrate") }}
            />
            <DistrictSection />
            <HowWorksSection />
            <TypeEventSection />
            <VenuePreviewSection />
        </>
    )
};
