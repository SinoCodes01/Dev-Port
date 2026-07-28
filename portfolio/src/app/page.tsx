import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
          Sinovuyo Ngqazolo
        </h1>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="flex flex-col md:flex-row items-center gap-8 mb-16">
          <div className="relative w-48 h-48 rounded-full overflow-hidden">
            <Image
              src="/Pfp.png"
              alt="Sinovuyo Ngqazolo"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-zinc-50 mb-4">
              Hello, I&apos;m Sinovuyo Ngqazolo
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
              Full-stack developer specializing in modern web applications and e-commerce solutions.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-6">
            Projects
          </h3>
          <div className="border rounded-lg p-6 bg-white dark:bg-black/50">
            <h4 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
              AdvocatesIphones
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              E-commerce store for retail iPhone and Apple devices
            </p>
            <a
              href="https://www.advocatesiphones.co.za/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-400"
            >
              View Live Site
            </a>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-zinc-600 dark:text-zinc-400">
        <p>&copy; {new Date().getFullYear()} Sinovuyo Ngqazolo. All rights reserved.</p>
      </footer>
    </div>
  );
}