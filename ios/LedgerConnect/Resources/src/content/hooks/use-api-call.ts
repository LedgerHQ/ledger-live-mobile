import { useEffect, useState } from 'react';
import { GenericAsyncFunction, ApiCallOptions, GenericFunction } from './types';

export const useApiCall = <T>(
  asyncApiFunction: GenericAsyncFunction | GenericFunction,
  options: ApiCallOptions = {},
) => {
  const { args, onSuccess, onFail } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  const argsAsString = JSON.stringify(args);
  let isMounted = true;

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      let response: any | null = null;

      try {
        response = await asyncApiFunction(...(args || []));

        if (isMounted) {
          if (onSuccess) {
            onSuccess(response, args || []);
          }

          if (isLoading) {
            setData(response || null);
          }
        }
      } catch (err) {
        if (isMounted) {
          if (onFail) {
            onFail(err, args || []);
          }

          console.error('useApiCall error', error);
          setError(err);
        }
      }
      if (isMounted) {
        setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
      setIsLoading(false);
    };
  }, [asyncApiFunction, argsAsString, onSuccess, onFail]);

  return { data, error, isLoading };
};
