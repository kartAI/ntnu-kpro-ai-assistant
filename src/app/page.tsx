import Link from "next/link";

export default async function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex flex-row gap-4">
          <Link href={"/bygget"} className="bg-blue-500 rounded-xl p-4">
            Grenssesnitt 1 (meld fra om bygging)
          </Link>
          <Link href={"/soknad"} className="bg-blue-500 rounded-xl p-4">
            Grenssesnitt 2 (søk om byggetillatelse)
          </Link>
          <Link href={"/admin"} className="bg-blue-500 rounded-xl p-4">
            Grenssesnitt 3 (admin dashboard)
          </Link>
        </div>
      </main>
  );
}
