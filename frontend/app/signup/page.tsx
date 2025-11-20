export default function SignUpPage() {
  // Registration is disabled; return 404-like page
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Registro desativado</h1>
        <p className="text-gray-600 text-sm">Peça a um administrador para criar um usuário.</p>
      </div>
    </div>
  );
}
