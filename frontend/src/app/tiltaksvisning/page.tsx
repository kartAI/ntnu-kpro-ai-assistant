import EmbeddedFrame from "../_components/EmbeddedFrame";


export default async function Home() {
  return (
    <div>
        <EmbeddedFrame data-cy="tiltaksvisning"  src="https://byggesak3d.norkart.no/view/bf204afe-e50e-4ac6-8839-ebd9406167ac" title="3D tiltaksvisning" />
    </div>
  );
}

