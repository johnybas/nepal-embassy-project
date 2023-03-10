import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface pageState {
  title: string;
  setPageTitle: (title: string) => void;
}
const pageTitleStore = create<pageState>((set) => ({
  title: 'Embassy of Nepal - New Delhi',
  setPageTitle: (title) =>
    set((state) => ({
      ...state,
      title,
    })),
}));

export default pageTitleStore;
