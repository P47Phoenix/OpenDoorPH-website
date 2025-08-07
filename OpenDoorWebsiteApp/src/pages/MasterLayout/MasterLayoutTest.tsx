import React, { Component, ReactElement } from "react";
import Header from "../../components/layout/Header";

interface MasterProps {}

export class Master extends Component<MasterProps> {
    render(): ReactElement {
        return (
            <div style={{ minHeight: '100vh' }}>
                <Header />
                <div style={{ 
                    padding: '20px', 
                    backgroundColor: 'green', 
                    color: 'white', 
                    fontSize: '18px'
                }}>
                    <h1>HEADER ADDED - Testing Header Component</h1>
                    <p>If you see the header above and this green section, Header is working.</p>
                </div>
            </div>
        );
    }
}
