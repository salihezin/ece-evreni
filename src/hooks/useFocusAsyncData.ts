import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Loads async data every time the screen gains focus (which also covers
 * the initial mount), and exposes a `reload()` you can call manually —
 * e.g. right after an Admin screen adds/edits/deletes a row, so the list
 * updates without waiting for a focus change.
 *
 * Replaces the "useState + useFocusEffect + isActive guard" boilerplate
 * that used to be duplicated across every list/detail screen.
 */
export function useFocusAsyncData<T>(loader: () => Promise<T>, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  // Always call the latest loader (e.g. one closing over a changed
  // storyId) without needing it in useCallback's dependency array. Ref
  // is updated in an effect, not during render — mutating refs while
  // rendering isn't safe (breaks under the React Compiler).
  const loaderRef = useRef(loader);
  useEffect(() => {
    loaderRef.current = loader;
  });

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loaderRef.current();
      setData(result);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { data, isLoading, error, reload, setData };
}
