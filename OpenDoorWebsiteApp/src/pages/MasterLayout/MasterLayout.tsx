import React, { Component, ReactElement } from "react";
import SideBar from "../../components/layout/SideBar";
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
            <div>
                <div id="header">
                    <h1 id="logo">
                        Open&nbsp;<span className="green">Door</span>&nbsp;Full&nbsp;<span className="gray">Gospel</span><span className="small">&nbsp;church of pleasant hill mo</span>
                    </h1>
                    <h2 id="slogan">
                        Brethren, if a man is overtaken in any trespass, you who are spiritual restore such
                        a one in a spirit of gentleness, considering yourself lest you also be tempted.
                        Galatians 6:1
                    </h2>
                    <div id="login">
                    </div>
                    <ul>
                        <li><a href="/opendoor" title="Open door home page"><span>Home</span></a></li>
                        <li><a href="/opendoor/Home/Location" title="Open door location page"><span>Location</span></a></li>
                        <li><a href="/opendoor/Home/About" title="Open door about page"><span>About</span></a></li>
                    </ul>
                </div>
                <div id="content-wrap">
                    <img 
                        src="/headerphoto.jpg" 
                        width="820" 
                        height="120" 
                        alt="headerphoto" 
                        className="header-photo"
                    />
                    <SideBar />
                </div>
                <div id="main">
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
                </div>
                <Footer />
            </div>
        );
    }
}
