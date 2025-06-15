
import { useState, useMemo } from 'react';

export const useSearch = <T>(
  items: T[],
  searchFields: (keyof T)[],
  filterFn?: (item: T, searchTerm: string) => boolean
) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;

    return items.filter(item => {
      if (filterFn) {
        return filterFn(item, searchTerm);
      }

      return searchFields.some(field => {
        const fieldValue = item[field];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
    });
  }, [items, searchTerm, searchFields, filterFn]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems
  };
};
