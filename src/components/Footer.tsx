import React from "react";

const Footer = () => {
  return (
    <div className="main-footer">
      <div className="container">
        <p>
          <a href="https://science-dao.org" target="_top">
            Return to World Science DAO.
          </a>
        </p>
        <p>
          <a
            className="text-xs md:text-sm hover:text-base hover:text-gray-600 text-black duration-75"
            href="https://www.etsy.com/shop/vpfund"
          >
            Merch for Geeks
          </a>
          <a
            href="https://github.com/vporton/science-dao-donate"
            target="_blank"
            rel="noreferrer"
          >
            {/* <img src="github-mark.svg" width="16" height="16" alt="GitHub" /> */}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
