import React, { ReactElement, CSSProperties, useEffect } from "react";
import { trackLocationView, trackExternalLink } from "../../utils/analytics";

const MapStyle: CSSProperties = {
    color: '#0000FF',
    textAlign: "left"
};

export const Location = (): ReactElement => {
    useEffect(() => {
        // Track location page engagement
        trackLocationView();
    }, []);

    const handleMapLinkClick = () => {
        trackExternalLink(
            "http://maps.google.com/maps?f=q&source=embed&hl=en&geocode=&q=135+S+1st+St,+Pleasant+Hill,+Missouri+64080",
            "View Larger Map"
        );
    };

    return (
        <div className="location">
            <h2>Our Location</h2>
            <div className="address">
                <h3>Open Door Full Gospel Church Of Pleasant Hill</h3>
                <address>
                    135 S 1st St<br/>
                    Pleasant Hill, Missouri 64080
                </address>
            </div>
            <div className="map">
                <iframe 
                    width="425" 
                    height="350" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0}
                    marginWidth={0} 
                    title="Google Maps location for Open Door Full Gospel Church"
                    src="http://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=135+S+1st+St,+Pleasant+Hill,+Missouri+64080+&amp;sll=38.784773,-94.274362&amp;sspn=0.001372,0.002411&amp;ie=UTF8&amp;hq=&amp;hnear=135+S+1st+St,+Pleasant+Hill,+Cass,+Missouri+64080&amp;ll=38.792159,-94.269133&amp;spn=0.023414,0.036478&amp;z=14&amp;iwloc=A&amp;output=embed"
                    allowFullScreen
                />
                <br/>
                <small>
                    <a
                        href="http://maps.google.com/maps?f=q&amp;source=embed&amp;hl=en&amp;geocode=&amp;q=135+S+1st+St,+Pleasant+Hill,+Missouri+64080+&amp;sll=38.784773,-94.274362&amp;sspn=0.001372,0.002411&amp;ie=UTF8&amp;hq=&amp;hnear=135+S+1st+St,+Pleasant+Hill,+Cass,+Missouri+64080&amp;ll=38.792159,-94.269133&amp;spn=0.023414,0.036478&amp;z=14&amp;iwloc=A"
                        style={MapStyle}
                        onClick={handleMapLinkClick}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Larger Map
                    </a>
                </small>
            </div>
        </div>
    );
};
