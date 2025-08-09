import React, { Component, ReactElement } from "react";
import SideBar from "../../components/layout/SideBar";
import Header from "../../components/layout/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main } from "../HomePage/HomePage";
import { Location } from "../LocationPage/LocationPage";
import { About } from "../AboutPage/AboutPage";
import { ScriptureStudy } from "../ScriptureStudy/ScriptureStudy";
import Footer from "../../components/layout/Footer";
import RouteTracker from "../../components/tracking/RouteTracker";

interface MasterProps {}

export class Master extends Component<MasterProps> {
    render(): ReactElement {
        return (
            <Router basename={process.env.REACT_APP_ROOT_URI || '/'}>
                <RouteTracker>
                    <div className="min-h-screen flex flex-col">
                        <Header />
                        <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full gap-0">
                            <main className="church-main flex-1 order-1 lg:order-2 min-w-0">
                                <Routes>
                                    <Route path="/" element={<Main />} />
                                    <Route path="/opendoor" element={<Main />} />
                                    <Route path="/opendoor/Home/Location" element={<Location />} />
                                    <Route path="/opendoor/Home/About" element={<About />} />
                                    <Route path="/opendoor/Home/Scripture" element={<ScriptureStudy />} />
                                </Routes>
                            </main>
                            <SideBar className="order-2 lg:order-1 lg:flex-shrink-0" />
                        </div>
                        <Footer />
                    </div>
                </RouteTracker>
            </Router>
        );
    }
}
