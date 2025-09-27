import { Header } from "@/components/organism/Header";
import { ProductsSection } from "./components/ProductsSection";
import { Footer } from "@/components/organism/Footer";

export const Catalog = () => {
    return (
        <>
            <Header onClickAction={() => { }} buttonText="Crear cuenta" isHome={false} />
            <ProductsSection />
            <Footer />
        </>
    )
};
