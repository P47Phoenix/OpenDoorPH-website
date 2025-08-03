import React, { Component, ReactElement } from "react";
import SideBar from "../../components/layout/SideBar";
import Header from "../../components/layout/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Main } from "../HomePage/HomePage";
import { Video } from "../VideoPage/VideoPage";
import { Location } from "../LocationPage/LocationPage";
import { About } from "../AboutPage/AboutPage";
import Footer from "../../components/layout/Footer";
import RouteTracker from "../../components/tracking/RouteTracker";

interface MasterProps {}

export class Master extends Component<MasterProps> {
    render(): ReactElement {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex flex-1">
                    <SideBar />
                    <main className="church-main flex-1">
                        <Router>
                            <RouteTracker>
                                <Routes>
                                    <Route path="/" element={<Main />} />
                                    <Route path="/opendoor" element={<Main />} />
                                    <Route path="/opendoor/Home/Video" element={<Video />} />
                                <Route path="/opendoor/Home/Location" element={<Location />} />
                                <Route path="/opendoor/Home/About" element={<About />} />
                            </Routes>
                        </RouteTracker>
                    </Router>
                    </main>
                </div>
                <Footer />
            </div>
        );
    }
}
