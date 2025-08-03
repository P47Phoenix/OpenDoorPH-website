import React, { ReactElement, useEffect } from "react";
import { trackLocationView, trackExternalLink } from "../../utils/analytics";
import { MapMarkerIcon, DirectionsIcon, PhoneIcon, EmailIcon, AddressIcon, CarIcon } from "../../assets";

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
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Page Header */}
            <section className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <img src={MapMarkerIcon} alt="" className="h-16 w-auto" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                    Visit Our Church
                </h1>
                <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                    We're located in the heart of Pleasant Hill, Missouri. Join us for worship and fellowship!
                </p>
            </section>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Church Information Card */}
                <section className="bg-white rounded-xl shadow-lg border border-stone-200 p-8">
                    <div className="flex items-center mb-6">
                        <img src={AddressIcon} alt="" className="w-12 h-12 mr-4" />
                        <h2 className="text-2xl font-bold text-stone-800">
                            Church Information
                        </h2>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Address */}
                        <div className="flex items-start space-x-4">
                            <img src={MapMarkerIcon} alt="" className="w-8 h-8 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-stone-800 mb-1">Address</h3>
                                <address className="text-stone-600 not-italic leading-relaxed">
                                    <strong>Open Door Full Gospel Church Of Pleasant Hill</strong><br/>
                                    135 S 1st St<br/>
                                    Pleasant Hill, Missouri 64080
                                </address>
                            </div>
                        </div>

                        {/* Contact Methods */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 p-3 bg-stone-50 rounded-lg">
                                <img src={PhoneIcon} alt="" className="w-6 h-6" />
                                <div>
                                    <h4 className="font-medium text-stone-800">Phone</h4>
                                    <p className="text-sm text-stone-600">Contact us for service times</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-stone-50 rounded-lg">
                                <img src={EmailIcon} alt="" className="w-6 h-6" />
                                <div>
                                    <h4 className="font-medium text-stone-800">Email</h4>
                                    <p className="text-sm text-stone-600">Send us a message</p>
                                </div>
                            </div>
                        </div>

                        {/* Directions Button */}
                        <div className="pt-4">
                            <a
                                href="http://maps.google.com/maps?f=q&source=embed&hl=en&geocode=&q=135+S+1st+St,+Pleasant+Hill,+Missouri+64080"
                                onClick={handleMapLinkClick}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-church-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-church-green/90 transition-colors duration-200"
                            >
                                <img src={DirectionsIcon} alt="" className="w-5 h-5 mr-2 filter brightness-0 invert" />
                                Get Directions
                            </a>
                        </div>
                    </div>
                </section>

                {/* Interactive Map Card */}
                <section className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden">
                    <div className="p-6 border-b border-stone-200">
                        <div className="flex items-center">
                            <img src={CarIcon} alt="" className="w-8 h-8 mr-3" />
                            <h2 className="text-xl font-bold text-stone-800">
                                Interactive Map
                            </h2>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <iframe 
                            className="w-full h-96 lg:h-80"
                            frameBorder="0" 
                            scrolling="no"
                            title="Google Maps location for Open Door Full Gospel Church"
                            src="http://maps.google.com/maps?f=q&amp;source=s_q&amp;hl=en&amp;geocode=&amp;q=135+S+1st+St,+Pleasant+Hill,+Missouri+64080+&amp;sll=38.784773,-94.274362&amp;sspn=0.001372,0.002411&amp;ie=UTF8&amp;hq=&amp;hnear=135+S+1st+St,+Pleasant+Hill,+Cass,+Missouri+64080&amp;ll=38.792159,-94.269133&amp;spn=0.023414,0.036478&amp;z=14&amp;iwloc=A&amp;output=embed"
                            allowFullScreen
                        />
                        <div className="absolute inset-0 border-4 border-transparent hover:border-church-green/20 transition-colors duration-200 pointer-events-none rounded-lg"></div>
                    </div>
                    
                    <div className="p-4 bg-stone-50 text-center">
                        <a
                            href="http://maps.google.com/maps?f=q&amp;source=embed&amp;hl=en&amp;geocode=&amp;q=135+S+1st+St,+Pleasant+Hill,+Missouri+64080+&amp;sll=38.784773,-94.274362&amp;sspn=0.001372,0.002411&amp;ie=UTF8&amp;hq=&amp;hnear=135+S+1st+St,+Pleasant+Hill,+Cass,+Missouri+64080&amp;ll=38.792159,-94.269133&amp;spn=0.023414,0.036478&amp;z=14&amp;iwloc=A"
                            onClick={handleMapLinkClick}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-church-green hover:text-church-green/80 font-medium transition-colors duration-200"
                        >
                            <img src={DirectionsIcon} alt="" className="w-4 h-4 mr-2" />
                            View Larger Map
                        </a>
                    </div>
                </section>
            </div>

            {/* Service Times & Directions */}
            <section className="bg-gradient-to-r from-church-green to-church-green/90 rounded-xl text-white p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Plan Your Visit
                    </h2>
                    <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                        We look forward to welcoming you to our church family. Come as you are and experience God's love.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/opendoor" 
                            className="bg-white text-church-green px-6 py-3 rounded-lg font-semibold hover:bg-stone-100 transition-colors duration-200"
                        >
                            Service Times
                        </a>
                        <a 
                            href="/opendoor/Home/About" 
                            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-church-green transition-colors duration-200"
                        >
                            About Our Church
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};
