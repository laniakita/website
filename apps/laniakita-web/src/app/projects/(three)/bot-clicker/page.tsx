import { HajClickerStoreProvider } from '@/providers/hajclicker-store-provider';
import BotClickerScene from './main';

export default function BotClicker() {
  return (
    <HajClickerStoreProvider>
      <BotClickerScene />
    </HajClickerStoreProvider>
  );
}
