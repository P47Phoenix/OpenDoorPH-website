import React, { ReactElement, useEffect } from "react";
import { Link } from "react-router-dom";
import { trackLocationView, trackDirectionsClick, trackCtaClick } from "../../utils/analytics";
import { MapMarkerIcon, DirectionsIcon, AddressIcon, CarIcon } from "../../assets";
import { usePageMeta } from '../../hooks/usePageMeta';
import { EVENTS } from '../../config/events';

export const Location = (): ReactElement => {
    usePageMeta({
        title: 'Location & Directions — Open Door Full Gospel Church',
        description: 'Find Open Door Full Gospel Church at 135 S 1st St, Pleasant Hill, MO 64080. Get directions and service times.',
    });

    useEffect(() => {
        // Track location page engagement
        trackLocationView();
    }, []);

    const GOOGLE_MAPS_URL = "https://maps.google.com/maps?f=q&source=embed&hl=en&geocode=&q=Open+Door+Full+Gospel+Church,+Pleasant+Hill,+MO+64080";

    const handleGetDirectionsClick = () => {
        trackDirectionsClick("Get Directions", GOOGLE_MAPS_URL);
    };

    const handleViewLargerMapClick = () => {
        trackDirectionsClick("View Larger Map", GOOGLE_MAPS_URL);
    };

    return (
        <div className="w-full p-4 md:p-6 space-y-6 md:space-y-8">
            {/* Page Header */}
            <section className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <img src={MapMarkerIcon} alt="" className="h-16 w-auto" />
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">
                    Visit Our Church
                </h1>
                <p className="text-lg md:text-xl text-stone-700 max-w-3xl mx-auto leading-relaxed">
                    We're located in the heart of Pleasant Hill, Missouri. Join us for worship and fellowship!
                </p>
            </section>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Church Information Card */}
                <section className="bg-white rounded-xl border border-rule p-5 md:p-8">
                    <div className="flex items-center mb-6">
                        <img src={AddressIcon} alt="" className="w-12 h-12 mr-4" />
                        <h2 className="font-serif text-xl md:text-2xl font-bold text-ink">
                            Church Information
                        </h2>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Address */}
                        <div className="flex items-start space-x-4">
                            <img src={MapMarkerIcon} alt="" className="w-8 h-8 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-serif text-lg font-bold text-ink mb-1">Address</h3>
                                <address className="text-stone-700 not-italic leading-relaxed">
                                    <strong>Open Door Full Gospel Church Of Pleasant Hill</strong><br/>
                                    135 S 1st St<br/>
                                    Pleasant Hill, Missouri 64080
                                </address>
                                <p className="text-sm text-stone-600 mt-2">
                                    Sundays {EVENTS[0].time}, about two hours
                                </p>
                            </div>
                        </div>

                        {/* Directions Button */}
                        <div className="pt-4">
                            <a
                                href={GOOGLE_MAPS_URL}
                                onClick={handleGetDirectionsClick}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-sage text-white hover:bg-sage-dark active:bg-sage-dark transition-colors duration-150 motion-reduce:transition-none touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-white"
                            >
                                <img src={DirectionsIcon} alt="" className="w-5 h-5 mr-2 filter brightness-0 invert" />
                                Get Directions
                            </a>
                        </div>
                    </div>
                </section>

                {/* Interactive Map Card */}
                <section className="bg-white rounded-xl border border-rule overflow-hidden">
                    <div className="p-6 border-b border-rule">
                        <div className="flex items-center">
                            <img src={CarIcon} alt="" className="w-8 h-8 mr-3" />
                            <h2 className="font-serif text-xl md:text-2xl font-bold text-ink">
                                Interactive Map
                            </h2>
                        </div>
                    </div>
                    
                    <div>
                        <iframe
                            className="w-full h-96 lg:h-80 block"
                            frameBorder="0"
                            scrolling="no"
                            title="Google Maps location for Open Door Full Gospel Church"
                            src="https://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=Open+Door+Full+Gospel+Church,+Pleasant+Hill,+MO+64080&amp;sll=38.784773,-94.274362&amp;sspn=0.001372,0.002411&amp;ie=UTF8&amp;hq=&amp;hnear=135+S+1st+St,+Pleasant+Hill,+Cass,+Missouri+64080&amp;ll=38.792159,-94.269133&amp;spn=0.023414,0.036478&amp;z=14&amp;iwloc=A&amp;output=embed"
                            allowFullScreen
                        />
                    </div>
                    
                    <div className="p-4 bg-parchment text-center">
                        <a
                            href={GOOGLE_MAPS_URL}
                            onClick={handleViewLargerMapClick}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-medium text-brick hover:text-brick-dark hover:underline active:text-brick-dark rounded underline-offset-4 transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 min-h-[44px]"
                        >
                            <img src={DirectionsIcon} alt="" className="w-4 h-4 mr-2" />
                            View Larger Map
                        </a>
                    </div>
                </section>
            </div>

            {/* Service Times & Directions */}
            <section className="bg-white border border-rule rounded-xl text-ink p-5 md:p-8">
                <div className="text-center">
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-ink mb-4">
                        Plan Your Visit
                    </h2>
                    <p className="text-stone-700 leading-relaxed mb-6 max-w-2xl mx-auto">
                        We look forward to welcoming you to our church family. Come as you are and experience God's love.
                    </p>
                    <div className="flex justify-center">
                        <Link
                            to="/opendoor/Home/About"
                            onClick={() => trackCtaClick('About Our Church', 'location_page', '/opendoor/Home/About')}
                            className="inline-flex items-center gap-2 font-semibold text-brick hover:text-brick-dark hover:underline active:text-brick-dark rounded underline-offset-4 transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 min-h-[44px]"
                        >
                            About Our Church
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
