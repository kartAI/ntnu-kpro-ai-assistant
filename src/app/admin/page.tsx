import Link from 'next/link';

export default function Admin() {
    const applications = [
        { id: 1, text: "Jeg har bygget" },
        { id: 2, text: "Jeg har også bygget (tihi)" }
    ];

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <p>{"Dette er admin siden"}</p>
            <p>{"Her er tanken at man får en oversikt over alle byggesøknadene som har blitt sendt inn, under er demoer på dette"}</p>
            <div className='my-10 flex flex-col gap-4'>
                {applications.map((application) => (
                    <Link key={application.id} href={`/admin/soknad/${application.id}`} className='bg-red-500 rounded-xl p-4'>
                        <p>{application.id + ": " + application.text}</p>
                    </Link>
                ))}
            </div>
        </main>
    );
}
