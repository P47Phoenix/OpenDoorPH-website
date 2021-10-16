import React from "react";

const MapStyle = {
    "color": '#0000FF',
    "text-align": "left"
}
export const Location = () => {
    return (
        <div class="location">
            <div class="address">
                Open Door Full Gospel Church Of Pleasant Hill
                <br/>
                135 S 1st St
                <br/>
                Pleasant Hill, Missouri 64080
            </div>
            <div class="map">
                <iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0"
                        marginwidth="0"
                        src="http://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=135+S+1st+St,+Pleasant+Hill,+Missouri+64080+&amp;sll=38.784773,-94.274362&amp;sspn=0.001372,0.002411&amp;ie=UTF8&amp;hq=&amp;hnear=135+S+1st+St,+Pleasant+Hill,+Cass,+Missouri+64080&amp;ll=38.792159,-94.269133&amp;spn=0.023414,0.036478&amp;z=14&amp;iwloc=A&amp;output=embed">
                </iframe>
                <br/>
                <small><a
                    href="http://maps.google.com/maps?f=q&amp;source=embed&amp;hl=en&amp;geocode=&amp;q=135+S+1st+St,+Pleasant+Hill,+Missouri+64080+&amp;sll=38.784773,-94.274362&amp;sspn=0.001372,0.002411&amp;ie=UTF8&amp;hq=&amp;hnear=135+S+1st+St,+Pleasant+Hill,+Cass,+Missouri+64080&amp;ll=38.792159,-94.269133&amp;spn=0.023414,0.036478&amp;z=14&amp;iwloc=A"
                    style={MapStyle}>View Larger Map</a></small>
            </div>
        </div>
    )
}