import React, { Component, ReactElement } from "react";
import { SideBarProps } from "../../../types";

export class SideBar extends Component<SideBarProps> {
    render(): ReactElement {
        const { 
            scheduleTitle = "Sunday", 
            scheduleItems = ["Morning Service: 10:15 AM"],
            menuItems = [
                {
                    text: "Facebook Page",
                    url: "https://www.facebook.com/Open-Door-Full-Gospel-Of-Pleasant-Hill-MO-217411360471",
                    external: true
                }
            ]
        } = this.props;

        return (
            <div id="sidebar">
                <h3>
                    {scheduleTitle}
                </h3>
                <div>
                    {scheduleItems.map((item, index) => (
                        <p key={index}>
                            {item}
                        </p>
                    ))}
                </div>
                <div>
                    <ul className="sidemenu">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <a 
                                    href={item.url} 
                                    target={item.external ? "_blank" : "_self"}
                                    rel={item.external ? "noreferrer" : undefined}
                                >
                                    {item.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}
