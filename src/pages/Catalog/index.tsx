import { Header } from "@/components/organism/Header";
import { ProductsSection } from "./components/ProductsSection";

export const Catalog = () => {
    return (
        <>
            <Header onClickAction={() => { }} buttonText="Crear cuenta" isHome={false} />
            <ProductsSection />
        </>
    )
};
