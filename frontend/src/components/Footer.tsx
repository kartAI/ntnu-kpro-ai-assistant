const Footer = () => {
  return (
    <footer className="h-12 shadow-inner">
      <div className="h-full flex justify-center items-center">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} KartAI</p>
      </div>
    </footer>
  );
};

export default Footer;
