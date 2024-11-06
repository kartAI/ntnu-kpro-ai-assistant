export default function TilPage({ params }: { params: { til: string } }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h1>{"Denne siden skal navigere til: " + params.til}</h1>
      </div>
    );
  }
  