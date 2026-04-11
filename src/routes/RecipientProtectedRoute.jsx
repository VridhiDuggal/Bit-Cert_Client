import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsRecipientAuthenticated } from '../store/recipientAuth/recipientAuthSelectors';

export function RecipientProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsRecipientAuthenticated);
  if (!isAuthenticated) return <Navigate to="/?openRecipientLogin=true" replace />;
  return children;
}
