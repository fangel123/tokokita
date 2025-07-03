const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p>
          © {new Date().getFullYear()} TokoKita. Dibuat mikha.dev untuk
          Portofolio.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
