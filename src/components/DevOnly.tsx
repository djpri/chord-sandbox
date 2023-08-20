
/**
 * Simple wrapper for components only to be shown in dev mode
 */
function DevOnly({ children }) {
  if (!import.meta.env.DEV) {
    return null;
  }
  return <>{children}</>
}

export default DevOnly