import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Game from '../src/components/Game';

export default function GamePage({ user, showNotification }) {
  const router = useRouter();

  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      router.push('/login');
    }
  }, [user]);

  if (!user) return null;

  return <Game user={user} showNotification={showNotification} />;
}