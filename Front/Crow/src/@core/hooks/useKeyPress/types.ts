export interface UseKeyProps {
  callback: () => void;
  keyCodes: Array<string | KeyCodeItem>; // like: 'Escape', 'Enter', ...
}

interface KeyCodeItem {
  code: string;
  location: number;
}