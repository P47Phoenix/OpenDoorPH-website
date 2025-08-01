import React, { ReactElement } from "react";

export const Video = (): ReactElement => {
    return (
        <div>
            <iframe 
                src="https://www.youtube.com/embed/videoseries?list=PLTEzkRjWlPyQhKteW1xKjNGv42h0-kzTr" 
                width="480"
                height="400" 
                title="Open Door Full Gospel Church YouTube playlist"
                allowFullScreen
            />
        </div>
    );
};
