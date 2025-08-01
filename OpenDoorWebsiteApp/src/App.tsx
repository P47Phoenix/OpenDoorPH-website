import React, { Component, ReactElement } from 'react';
import './App.css';
import { Master } from "./Pages/Master";

interface AppProps {}

class App extends Component<AppProps> {
  render(): ReactElement {
    return (
      <Master />
    );
  }
}

export default App;
