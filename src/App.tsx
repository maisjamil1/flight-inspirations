import "./App.css";
import { ThemeProvider } from "next-themes";
import FlightInspirations from "@/components/features/FlightInspirations";
import { Layout } from "@/components/layout/Layout";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Layout>
        <FlightInspirations />
        <Toaster />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
