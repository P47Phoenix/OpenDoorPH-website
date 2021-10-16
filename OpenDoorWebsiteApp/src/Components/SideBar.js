import React, {Component} from "react";

export class SideBar extends Component {
    render() {
        return <div id="sidebar">
            <h3>
                Sunday
            </h3>
            <div>
                <p>
                    Morning Service: 10:15 AM
                </p>
            </div>
            <div>
                <ul class="sidemenu">
                    <li>
                        <a href="https://www.facebook.com/pg/Open-Door-Full-Gospel-Of-Pleasant-Hill-MO-217411360471/videos">Facebook
                            Video</a>
                    </li>
                </ul>
            </div>
        </div>;
    }
}