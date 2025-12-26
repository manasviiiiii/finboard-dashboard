import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">
        FinBoard Dashboard
      </h1>

      <p className="text-gray-600 mt-2">
        Customizable finance widgets will appear here.
      </p>

      <Dashboard />
    </main>
  );
}
