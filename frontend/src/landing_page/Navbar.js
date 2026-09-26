import React from "react";
import { Link } from "react-router-dom";
import logo from "./tdflow.jpeg";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom bg-white"
    >
      <div className="container p-2">

        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            style={{ width: "25%" }}
            alt="Logo"
          />
        </Link>

        {/* Hamburger Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapse Area */}
        <div
          className="collapse navbar-collapse"
          id="navbarSupportedContent"
        >

          {/* Main Links */}
          <ul className="navbar-nav ms-auto gap-3">

            <li className="nav-item">
              <Link className="nav-link" to="/signup">
                Signup
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/product">
                Product
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/pricing">
                Pricing
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/support">
                Support
              </Link>
            </li>

            {/* Extra Menu Items */}
            <li className="nav-item dropdown">

              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                More
              </a>

              <ul className="dropdown-menu">

                <li>
                  <Link className="dropdown-item" to="/login">
                    Kite
                  </Link>
                </li>

                <li>
                  <a className="dropdown-item" href="#">
                    Console
                  </a>
                </li>

                <li>
                  <a className="dropdown-item" href="#">
                    Kite Connect
                  </a>
                </li>

                <li>
                  <a className="dropdown-item" href="#">
                    Coin
                  </a>
                </li>

              </ul>

            </li>

          </ul>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;