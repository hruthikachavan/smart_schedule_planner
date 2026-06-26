import { useState, useEffect, useCallback, useRef } from 'react';

export function useApi(fn, deps = [], immediate = true) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError]     = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const execute = useCallback(async (...args) => {
    if (mounted.current) { setLoading(true); setError(null); }
    try {
      const result = await fn(...args);
      if (mounted.current) setData(result);
      return result;
    } catch (e) {
      if (mounted.current) setError(e.message || 'An error occurred');
      throw e;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => { if (immediate) execute(); }, [immediate]); // eslint-disable-line

  return { data, loading, error, execute, setData };
}
