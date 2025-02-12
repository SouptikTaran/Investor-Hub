import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ token, user, children }) => {
  return token && user ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
