import React from 'react';
import Navigation from "./Navigation";

<style type="text/css">{`
  @font-face {
    font-family: 'AbrilFatface';
    src: url(${require('./assets/fonts/AbrilFatface.ttf')}) format('truetype');
  }
  
`}</style>

function App() {
  return (
    <Navigation />
  );
}

export default App;