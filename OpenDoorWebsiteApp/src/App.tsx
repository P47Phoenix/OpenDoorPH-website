import React, { Component, ReactElement } from 'react';
import './App.css';
import { Master } from "./pages/MasterLayout/MasterLayout";
import { initGA } from './utils/analytics';

interface AppProps {}

class App extends Component<AppProps> {
  componentDidMount(): void {
    // Initialize Google Analytics 4 when the app starts
    initGA();
  }

  render(): ReactElement {
    return (
      <Master />
    );
  }
}

export default App;
