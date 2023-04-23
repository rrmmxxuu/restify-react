import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthRedirect = (isAuthed) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await isAuthed();
      if (!isLoggedIn) {
        navigate('/');
      }
    };

    checkAuth();
  }, [isAuthed, navigate]);
};

export default useAuthRedirect;
