import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#161B27",
            color: "#F0F4FF",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: "10px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#7C3AED", secondary: "#F0F4FF" },
          },
          error: {
            iconTheme: { primary: "#F87171", secondary: "#F0F4FF" },
          },
        }}
      />
    </>
  );
}
