import { useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";

import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Catalog } from "@/pages/Catalog";
import { ProductDetail } from "@/pages/ProductDetail";
import { Payment } from "@/pages/Payment";

import Layout from "@/components/organism/Layout";
import { useAuthStore } from "@/store/useAuthStore";

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { setLoading } = useAuthStore();

  /**
   * Effect para inicializar la aplicación.
   * Se ejecuta solo una vez para evitar bucles infinitos.
   * 
   * @description Proceso de inicialización:
   * 1. Configura el estado de loading inicial
   * 2. Marca la aplicación como inicializada
   * 
   * Nota: No necesitamos verificar cookies aquí porque el store
   * los lee automáticamente cuando los componentes lo requieren.
   */
  useEffect(() => {
    /**
     * Función interna para inicializar la aplicación.
     * 
     * @description Simplemente marca la app como inicializada.
     * El store ya maneja la autenticación leyendo cookies automáticamente.
     */
    const initializeApp = () => {
      try {
        // El store lee automáticamente de cookies, no necesitamos hacer nada más
        setIsInitialized(true);
      } catch (error) {
        console.error('Error al inicializar aplicación:', error);
        setIsInitialized(true); // Inicializar de todos modos
      } finally {
        setLoading(false);
      }
    };

    if (!isInitialized) {
      initializeApp();
    }
  }, [isInitialized, setLoading]);

  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/registro", element: <Register /> },
        { path: "/catalogo", element: <Catalog /> },
        { path: "/producto/:id", element: <ProductDetail /> },
      ],
    },
    {
      path: "/pago/:id",
      element: <Payment />,
    },
  ]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-radial">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-lg text-white">Inicializando aplicación...</div>
        </div>
      </div>
    );
  }

  return routes;
}
