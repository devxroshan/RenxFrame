import NonProtectedRoute from "./Wrappers/NonProtectedRoute";

export default function Home() {
  return (
    <NonProtectedRoute>
      <div></div>
    </NonProtectedRoute>
  );
}
