import BotClickerScene from '@/components/canvas/scenes/bot-clicker/neil/main';
import { HajClickerStoreProvider } from '@/providers/hajclicker-store-provider';

export default function Page() {
  return (
    <HajClickerStoreProvider>
      <BotClickerScene />
    </HajClickerStoreProvider>
  );
}
