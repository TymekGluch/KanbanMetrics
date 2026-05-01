'use client';

import React from 'react';

export function useOutsideClick (
  callback: () => void,
  ...refs: React.RefObject<HTMLElement>[]
)  {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = refs.every((ref) => {
        return ref.current && !ref.current.contains(event.target as Node);
      });

      if (isOutside) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, callback]);

  return refs;
};