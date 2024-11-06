import EmbeddedFrame from "~/components/EmbeddedFrame";


export default async function Tiltaksvisning() {
  return (
    <div className="px-20">
      <h1 data-cy="title" className="mt-10 mb-5 text-left text-3xl font-bold">3D tiltaksvisning</h1>
      <span className="mb-10 text-left text-xl">
        Se hvordan ditt tiltak vises i et 3D kart av området ditt
      </span>
      <EmbeddedFrame className="pt-10" data-cy="tiltaksvisning" src="https://byggesak3d.norkart.no/view/bf204afe-e50e-4ac6-8839-ebd9406167ac" title="3D tiltaksvisning" />
    </div>
  );
}

