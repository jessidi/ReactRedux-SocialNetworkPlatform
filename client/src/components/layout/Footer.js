import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-light mt-5 p-4 text-center">
        Copyright &copy; {new Date().getFullYear()} DevBridge
      </footer>
    </div>
  );
};
export default Footer;
