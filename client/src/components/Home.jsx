import React from "react";
import './Home.css'
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div>
      <section id="header">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="#e6b30e"
                className="bi bi-house"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
                ></path>
                <path
                  fillRule="evenodd"
                  d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
                ></path>
              </svg>{" "}
              <a className="navbar-brand theme-text" href="#">
                &nbsp;Website
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link to={'/home'} className="nav-link act" aria-current="page" href="#">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="#">
                      Our Services
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={'/about'} className="nav-link" >
                      About
                    </Link>
                  </li>
                  <li className="nav-item">
                  <Link to={'/contact'} className="nav-link" >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          {/* Navbar code */}
          <div className="middle">
            <h1 className="text-white display-3 fw-bold">
             We help you <span className="theme-text">Sell & Buy </span>Products.
            </h1>
          </div>
        </div>
        <svg
          className="wave"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#fff"
            fillOpacity="1"
            d="M0,192L60,181.3C120,171,240,149,360,133.3C480,117,600,107,720,106.7C840,107,960,117,1080,122.7C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
        </svg>
      </section>
    </div>
  );
}