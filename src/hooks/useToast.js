import { useDispatch } from 'react-redux';
import { addToast } from '../store/toast/toastSlice';

export function useToast() {
  const dispatch = useDispatch();
  return {
    success: (message, duration) => dispatch(addToast({ type: 'success', message, duration })),
    error:   (message, duration) => dispatch(addToast({ type: 'error',   message, duration })),
    info:    (message, duration) => dispatch(addToast({ type: 'info',    message, duration })),
  };
}
