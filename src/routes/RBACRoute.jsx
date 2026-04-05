import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectOrg } from '../store/auth/authSelectors';

export function RBACRoute({ children, allowedRoles }) {
  const org = useSelector(selectOrg);
  const role = org ? 'org' : '';

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
