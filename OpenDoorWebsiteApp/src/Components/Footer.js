import React, {Component} from "react";

export class Footer extends Component {
    render() {
        return <div id="footer">
            <div class="footer-left">
                <p class="align-left">
                    &copy; 2010 Open Door Full Gospel Church Of Pleasant Hill | <a
                    href="http://www.bluewebtemplates.com/"
                    title="Website Templates">website templates</a> by <a href="http://www.styleshout.com/">
                    styleshout</a>
                </p>
            </div>
            <div class="footer-right">
                <p class="align-right">
                    <a href="/opendoor">home</a>
                    |
                    <a href="/opendoor/Home/Video">Video</a>
                    |
                    <a href="/opendoor/Home/Location">location</a>
                    |
                    <a href="/opendoor/Home/About">about</a>
                </p>
            </div>
        </div>;
    }
}