import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Auth from '../src/components/Auth';

export default function LoginPage({ user, setUser, showNotification }) {
  const router = useRouter();

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      router.push('/game');
    }
  }, [user]);

  if (user) return null;

  return <Auth setUser={setUser} showNotification={showNotification} />;
}