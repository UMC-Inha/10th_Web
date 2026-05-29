function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-center text-sm text-gray-400 sm:flex-row sm:text-left">
        <p className="font-semibold text-white">UMC Play List</p>
        <p>© {new Date().getFullYear()} UMC 10th Web — Redux Toolkit Mission</p>
        <p className="text-xs text-gray-500">Mock LP 데이터 · Tailwind CSS · TypeScript</p>
      </div>
    </footer>
  );
}

export default Footer;
