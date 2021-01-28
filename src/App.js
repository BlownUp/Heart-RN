import React from 'react';
import Navigation from "./Navigation";

<style type="text/css">{`
  @font-face {
    font-family: 'raleway-B';
    src: url(${require('./assets/fonts/raleway/Raleway-Bold.ttf')}) format('truetype');
  }
  @font-face {
    font-family: 'raleway-M';
    src: url(${require('./assets/fonts/raleway/Raleway-Medium.ttf')}) format('truetype');
  }
  @font-face {
    font-family: 'freedoka';
    src: url(${require('./assets/fonts/FredokaOne-Regular.ttf')}) format('truetype');
  }
`}
</style>

function App() {
  return (
    <Navigation />
  );
}

export default App;