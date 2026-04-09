import { useEffect, useState } from 'react';

export default function useApi(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    loader()
      .then((response) => {
        if (active) setData(response.data);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.error || err.message || 'Something went wrong');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, deps);

  return { data, loading, error, setData };
}
