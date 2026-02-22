import ProtectedRoute from "../Wrappers/ProtectedRoute";

const App = () => {
  return (
    <ProtectedRoute>
      <div>AUTHENTICATED APP</div>
    </ProtectedRoute>
  );
};

export default App;
