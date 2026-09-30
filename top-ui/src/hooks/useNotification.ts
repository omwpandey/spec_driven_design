import { useAppDispatch } from '@store';
import { addNotification } from '@store/slices/appSlice';

export const useNotification = () => {
  const dispatch = useAppDispatch();

  const notify = {
    success: (message: string) => dispatch(addNotification({ message, type: 'success', read: false })),
    error: (message: string) => dispatch(addNotification({ message, type: 'error', read: false })),
    warning: (message: string) => dispatch(addNotification({ message, type: 'warning', read: false })),
    info: (message: string) => dispatch(addNotification({ message, type: 'info', read: false })),
  };

  return notify;
};
