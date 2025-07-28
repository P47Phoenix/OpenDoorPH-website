import React, {Component} from "react";
import {SideBar} from "../Components/SideBar";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Main} from "./Main";
import {Video} from "./Video";
import {Location} from "./Location";
import {About} from "./About";
import {Footer} from "../Components/Footer";

export class Master extends Component {
    render() {
        return <div>
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
                <img src="/headerphoto.jpg" width="820" height="120" alt="headerphoto" className="header-photo"/>
                <SideBar />
            </div>
            <div id="main">
                <Router>
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="/opendoor" element={<Main />} />
                        <Route path="/opendoor/Home/Video" element={<Video />} />
                        <Route path="/opendoor/Home/Location" element={<Location />} />
                        <Route path="/opendoor/Home/About" element={<About />} />
                    </Routes>
                </Router>
            </div>
            <Footer/>
        </div>;
    }
}