import React, { ReactElement, useEffect } from "react";
import { trackVideoPlay } from "../../utils/analytics";

export const Video = (): ReactElement => {
    useEffect(() => {
        // Track video page view as a custom event
        trackVideoPlay("YouTube Playlist - OpenDoor Full Gospel Church", 
                      "https://www.youtube.com/embed/videoseries?list=PLTEzkRjWlPyQhKteW1xKjNGv42h0-kzTr");
    }, []);

    return (
        <div>
            <h2>Sermons and Videos</h2>
            <p>Watch our latest sermons and church videos:</p>
            <iframe 
                src="https://www.youtube.com/embed/videoseries?list=PLTEzkRjWlPyQhKteW1xKjNGv42h0-kzTr" 
                width="480"
                height="400" 
                title="Open Door Full Gospel Church YouTube playlist"
                allowFullScreen
                onLoad={() => {
                    // Track when video iframe loads successfully
                    trackVideoPlay("Video Page Loaded", window.location.href);
                }}
            />
        </div>
    );
};
