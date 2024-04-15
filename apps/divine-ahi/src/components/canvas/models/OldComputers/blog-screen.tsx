import { SpinningBox } from './screenInteractive';
import ScreenLink from './screenLink';

export default function BlogScreen() {
  return (
    <ScreenLink
      modelLink='/assets/models/old_computers-transformed.glb'
      screenName="blog"
      textIn='READ THE BLOG'
      frame='Object_212'
      panel='Object_216'
      position={[0.992, 4.287, -4.209]}
      rotation={[0, -0.01, 0]}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 0, 10]} intensity={3.75} />

      <SpinningBox position={[-2.5, 0, -3]} scale={2} />
    </ScreenLink>
  );
}
