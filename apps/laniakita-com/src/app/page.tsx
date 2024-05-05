import BotClickerScene from '@/components/canvas/scenes/bot-clicker/neil/main';
import { DeviceWidthStoreProvider } from '@/providers/device-width-store-provider';
import { HajClickerStoreProvider } from '@/providers/hajclicker-store-provider';

export default function Page() {
  return (
    <HajClickerStoreProvider>
      <DeviceWidthStoreProvider>
        <BotClickerScene />
      </DeviceWidthStoreProvider>
    </HajClickerStoreProvider>
  );
}
