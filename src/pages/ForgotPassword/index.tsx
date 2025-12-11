import { useState } from "react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-xs mx-auto mt-10 mb-10 px-6 py-12 bg-white rounded-xl shadow sm:mt-14 sm:max-w-md sm:px-12 sm:py-14">
      <h2 className="text-xl font-bold mb-4 text-center sm:mb-6">Recuperar contraseña</h2>
      {sent ? (
        <div className="text-green-600 text-center">
          Si el correo está registrado, recibirás un enlace para reestablecer tu contraseña.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">Correo electrónico</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            placeholder="tu@email.com"
          />
          <button
            type="submit"
            className="w-full bg-blue mt-3 text-white py-4 rounded-lg text-md sm:mt-4"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>
      )}
    </div>
  );
};