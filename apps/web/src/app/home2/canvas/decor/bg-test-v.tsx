import { PerspectiveCamera, Sparkles, View } from '@react-three/drei';

export function BgTestV() {
  return (
    <View className='view'>
      <Sparkles speed={0.1} color='#ea76cb' size={1} count={200} scale={1} />
      <PerspectiveCamera position={[0, 0, 1]} makeDefault />
    </View>
  );
}
