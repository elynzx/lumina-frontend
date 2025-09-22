import { useRoutes } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Catalog } from "@/pages/Catalog";
import { ProductDetail } from "@/pages/ProductDetail";
import { Payment } from "@/pages/Payment";

export default function App() {
  const routes = useRoutes([
    {
      path: "/",
      children: [
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/registro", element: <Register /> },
        { path: "/catalogo", element: <Catalog /> },
        { path: "/producto/:id", element: <ProductDetail /> },
        { path: "/pago", element: <Payment /> },
      ],
    },
  ]);

  return routes;
}
