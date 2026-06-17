import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { store, persistor } from "./store";
import { router } from "./Router";

const queryClient = new QueryClient();

function App() {
  if (import.meta.env.DEV) {
    (window as any).__store__ = store;
  }
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <RouterProvider router={router} />

            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              draggable
            />
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
