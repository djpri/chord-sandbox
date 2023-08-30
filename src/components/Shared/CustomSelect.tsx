import { useRef, useEffect } from 'react';

const CustomSelect = ({ watch, selectId, currentSelectId, children, ...props }) => {
  const ref = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (selectId === currentSelectId) {
      ref.current?.focus();
    }
  }, [watch, currentSelectId]);

  return (
    <select ref={ref} {...props}>{children}</select>
  );
};

export default CustomSelect;
