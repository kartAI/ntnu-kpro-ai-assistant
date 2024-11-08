import Image from "next/image";


export default async function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <figure className="xl:flex pl-10 md:pl-40 pr-4 md:pr-16">
          <section id="welcome-text" className="w-1/2">
            <h1 className="text-5xl font-bold">KartAI</h1>
            <p className="mt-10 text-lg md:text-xl">
              Dette er en tjeneste som viser hvordan de ulike KI-assistentene til Norkart kan brukes til å effektivisere og hjelpe innbyggere og saksbehandlere med byggesøknader.
              </p>
            <p className="mt-10 text-lg md:text-xl mb-10 xl:mb-0">
              Ved at innbyggere tar i bruk digitale selvbetjeningsløsninger, sparer både kommune og innbyggere tid, ressurser og penger. 
            </p>
            <p className="mt-10 text-lg md:text-xl mb-10 xl:mb-0">
              Denne tjenesten viser hvordan Norkart sine KI-assistenter kan brukes og implementeres både før og etter søknad, og for saksbehandlere. 
            </p>
          </section>
          <Image 
            id="homepage-picture" 
            src= "/homepagepicture.jpg" 
            alt="Lanskapsbilde"  
            width={800} 
            height={600} 
            className="rounded-md xl:ml-20"  
          />
        </figure>

      </main>
  );
}
