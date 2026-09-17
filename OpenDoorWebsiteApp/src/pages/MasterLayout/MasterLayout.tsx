import React, { Component, ReactElement } from "react";
import Header from "../../components/layout/Header";
import TimeStrip from "../../components/layout/TimeStrip";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main } from "../HomePage/HomePage";
import { Location } from "../LocationPage/LocationPage";
import { About } from "../AboutPage/AboutPage";
import { ScriptureStudy } from "../ScriptureStudy/ScriptureStudy";
import Footer from "../../components/layout/Footer";
import RouteTracker from "../../components/tracking/RouteTracker";
import ConsentBanner from "../../components/ConsentBanner/ConsentBanner";

interface MasterProps {}

export class Master extends Component<MasterProps> {
    render(): ReactElement {
        return (
            <Router basename={(process.env.REACT_APP_ROOT_URI || '/').replace(/\/$/, '') || '/'}>
                <RouteTracker>
                    <div className="min-h-screen flex flex-col">
                        <Header />
                        <TimeStrip />
                        <div className="flex-1 max-w-7xl mx-auto w-full">
                            <main className="church-main min-w-0">
                                <Routes>
                                    <Route path="/" element={<Main />} />
                                    <Route path="/opendoor" element={<Main />} />
                                    <Route path="/opendoor/Home/Location" element={<Location />} />
                                    <Route path="/opendoor/Home/About" element={<About />} />
                                    <Route path="/opendoor/Home/Scripture" element={<ScriptureStudy />} />
                                </Routes>
                            </main>
                        </div>
                        <Footer />
                    </div>
                </RouteTracker>
                <ConsentBanner />
            </Router>
        );
    }
}
