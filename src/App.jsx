import { RouterProvider } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import routes from "./router";

export default function App() {
  return (
    <>
      <RouterProvider router={routes}></RouterProvider>
      <Toaster />
    </>
  );
}
