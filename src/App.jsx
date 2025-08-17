import { RouterProvider } from "react-router-dom";
import routes from "./router";

export default function App() {
  return (
    <>
      <RouterProvider router={routes}></RouterProvider>
    </>
  );
}
