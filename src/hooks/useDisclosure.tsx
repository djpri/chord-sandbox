import { useState } from 'react'

/**
 * A hook that manages the open/close state of a modal
 */
function useDisclosure() {
  const [isOpen, setOpen] = useState(false);
  return {
    isOpen,
    onOpen: () => setOpen(true),
    onToggle: () => setOpen(prevState => !prevState),
    onClose: () => setOpen(false),
  }
}

export default useDisclosure