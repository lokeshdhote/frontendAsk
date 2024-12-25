import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
// import { darkTheme } from "./utils/Themes";
// import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Hero from "./components/sections/Hero";
// import Skills from "./components/sections/Skills";
// import Projects from "./components/sections/Projects";
// import Experience from "./components/sections/Experience";
// import Education from "./components/sections/Education";
// import StartCanvas from "./components/canvas/Stars";
// import Contact from "./components/sections/Contact";
// import Footer from "./components/sections/Footer";
import Chatbot from "./components/sections/Chatbot";
// import Preloader from "./components/sections/Preloader";
// import { Loader } from "@react-three/drei";
// import Loader from "./components/sections/Loader";

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg || "#fff"};
  width: 100%;
  overflow-x: hidden;
  position: relative;
`;

const Wrapper = styled.div`
  padding-bottom: 100px;
  background: linear-gradient(
      38.73deg,
      rgba(204, 0, 187, 0.15) 0%,
      rgba(201, 32, 184, 0) 50%
    ),
    linear-gradient(
      141.27deg,
      rgba(0, 70, 209, 0) 50%,
      rgba(0, 70, 209, 0.15) 100%
    );
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fakeDataFetch = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    };
    fakeDataFetch();
  }, []);

  return (
    // Uncomment ThemeProvider if theming is required
    // <ThemeProvider theme={darkTheme}>
    <Router>
      {/* <Navbar /> */}
      <Body>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
        ) : (
          <>
            {/* <StartCanvas /> */}
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    {/* <Hero /> */}
                    {/* <Contact /> */}
                    {/* <Footer /> */}
                    <Chatbot />
                  </>
                }
              />
              {/* Render both Skills and Projects on the same route */}
              <Route
                path="/skills"
                element={
                  <>
                    {/* <Skills /> */}
                    {/* <Education /> */}
                    {/* <Footer /> */}
                    <Chatbot />
                  </>
                }
              />
              <Route
                path="/projects"
                element={
                  <>
                    {/* <Projects /> */}
                    {/* <Experience /> */}
                    {/* <Footer /> */}
                    <Chatbot />
                  </>
                }
              />
            </Routes>
          </>
        )}
      </Body>
    </Router>
    // </ThemeProvider>
  );
}

export default App;