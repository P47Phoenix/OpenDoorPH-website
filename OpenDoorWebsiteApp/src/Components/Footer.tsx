import React, { Component, ReactElement } from "react";
import { FooterProps } from "../types";

export class Footer extends Component<FooterProps> {
    render(): ReactElement {
        return (
            <div id="footer">
                <div className="footer-left">
                    <p className="align-left">
                        &copy; 2010 Open Door Full Gospel Church Of Pleasant Hill |{" "}
                        <a
                            href="http://www.bluewebtemplates.com/"
                            title="Website Templates"
                        >
                            website templates
                        </a>{" "}
                        by{" "}
                        <a href="http://www.styleshout.com/">
                            styleshout
                        </a>
                    </p>
                </div>
                <div className="footer-right">
                    <p className="align-right">
                        <a href="/opendoor">home</a>
                        |
                        <a href="/opendoor/Home/Video">Video</a>
                        |
                        <a href="/opendoor/Home/Location">location</a>
                        |
                        <a href="/opendoor/Home/About">about</a>
                    </p>
                </div>
            </div>
        );
    }
}
