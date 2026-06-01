'use client';

import { toast } from 'react-toastify';

export const showToast = () => {
  const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  return { showToast };
};