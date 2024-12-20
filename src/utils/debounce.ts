export default function debounce<Arguments extends any[]>(
  func: (...args: Arguments) => void,
  delay: number,
) {
  let timer: NodeJS.Timeout;
  return (...args: Arguments) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
