// ErrorPage.jsx
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-6 text-center">
      <AlertTriangle className="w-16 h-16 text-yellow-400 mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-yellow-400 tracking-widest">
        ERROR 404
      </h1>
      <p className="text-lg text-gray-400 mb-6 max-w-md">
        The page you were trying to access has disappeared into the shadows.
        Perhaps it never existed at all.
      </p>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-6 rounded-md transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to the Batcave
      </button>
    </div>
  );
}
