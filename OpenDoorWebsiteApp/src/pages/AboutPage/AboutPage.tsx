import React, { ReactElement, useEffect } from "react";
import { trackAboutView } from "../../utils/analytics";
import {
    TimelineIcon,
    ChurchIcon,
    PastorIcon,
    ValuesIcon,
    HistoryIcon,
    LeadershipIcon,
    HistoryScrollIcon,
    ExternalLinkIcon,
    CrossIcon,
    BibleIcon,
    CommunityServiceIcon
} from "../../assets";
import { usePageMeta } from '../../hooks/usePageMeta';

export const About = (): ReactElement => {
    usePageMeta({
        title: 'About Us — Open Door Full Gospel Church',
        description: 'Learn about Open Door Full Gospel Church, our faith, and our mission to the Pleasant Hill, MO community under Pastor Dennis Gulley.',
    });

    useEffect(() => {
        // Track about page engagement
        trackAboutView();
    }, []);

    return (
        <div className="w-full p-4 md:p-6 space-y-6 md:space-y-8">
            {/* Hero Section */}
            <section className="bg-parchment text-ink border border-rule rounded-xl p-5 md:p-8">
                <div className="flex flex-col md:flex-row items-center justify-center mb-4 md:mb-6 text-center md:text-left">
                    <img src={ChurchIcon} alt="" className="w-12 md:w-16 h-12 md:h-16 mb-4 md:mb-0 md:mr-4" />
                    <div>
                        <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-ink">About Our Church</h1>
                        <p className="text-lg md:text-xl mt-2 text-stone-700">Open Door Full Gospel Church</p>
                    </div>
                </div>
                <p className="text-center text-base md:text-lg max-w-3xl mx-auto text-stone-700 leading-relaxed px-2">
                    Founded in 1975, our church has been a cornerstone of faith and community service 
                    in Pleasant Hill, Missouri for nearly five decades.
                </p>
            </section>

            {/* Church History Timeline */}
            <section className="bg-white rounded-xl border border-rule p-5 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6 text-center md:text-left">
                    <HistoryScrollIcon className="w-10 md:w-12 h-10 md:h-12 mb-2 md:mb-0 md:mr-4 mx-auto md:mx-0 text-sage" />
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-ink">Our History</h2>
                </div>
                
                {/* Timeline visual element positioned below heading */}
                <div className="w-full mb-6">
                    <img src={TimelineIcon} alt="Historical Timeline" className="w-full h-16 md:h-20 opacity-60 object-contain" />
                </div>
                
                <div className="space-y-4 md:space-y-6">
                    <div className="bg-parchment p-4 md:p-6 rounded-lg border-l-4 border-sage">
                        <div className="flex flex-col md:flex-row md:items-start text-center md:text-left">
                            <img src={HistoryIcon} alt="" className="w-10 h-10 mx-auto md:mx-0 md:mr-4 mb-3 md:mb-0 md:mt-1 md:flex-shrink-0" />
                            <div>
                                <h3 className="font-serif text-lg font-bold text-ink mb-2">The Founding (1975)</h3>
                                <p className="text-stone-700 leading-relaxed">
                                    Open Door was founded by Herbert & Willetta Lowry and William & Mable Burnett in 
                                    July of 1975. Services were first held in an old house on the corner of Cedar and 
                                    Campbell. There were 35 people in attendance at the first service. The founders 
                                    asked Harvey Bryant to pastor the church.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-parchment p-4 md:p-6 rounded-lg border-l-4 border-brick">
                        <div className="flex flex-col md:flex-row md:items-start text-center md:text-left">
                            <img src={ChurchIcon} alt="" className="w-10 h-10 mx-auto md:mx-0 md:mr-4 mb-3 md:mb-0 md:mt-1 md:flex-shrink-0" />
                            <div>
                                <h3 className="font-serif text-lg font-bold text-ink mb-2">Building Our Home</h3>
                                <p className="text-stone-700 leading-relaxed">
                                    Pastor Bryant bought the church's current building after it was damaged by smoke
                                    from a neighboring building. The church later bought the building from Pastor Bryant,
                                    establishing our permanent home in Pleasant Hill.
                                </p>
                                <p className="text-stone-700 leading-relaxed mt-4">
                                    Our home is a piece of Pleasant Hill itself — a limestone commercial building on
                                    First Street that has stood at the heart of downtown since 1884. Long before it was
                                    ours, it served the town as an opera house, a grocery, and a gathering place. Today
                                    it is part of the Pleasant Hill Downtown Historic District, and we are honored to
                                    keep its doors open for a new kind of gathering.
                                </p>
                                <div className="border-t border-rule pt-3 mt-4">
                                    <div className="flex flex-col md:flex-row md:items-center md:flex-wrap text-sm text-stone-700">
                                        <span className="font-semibold mr-2 mb-2 md:mb-0">Learn more about our building:</span>
                                        <a
                                            href="https://historicmissouri.org/items/show/232"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="The Knorpp Opera House — University of Central Missouri History (opens in new tab)"
                                            className="inline-flex items-center gap-2 text-brick underline underline-offset-4 rounded transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-white hover:text-brick-dark mb-2 md:mb-0"
                                        >
                                            <img src={ExternalLinkIcon} alt="" className="w-4 h-4 mr-1" />
                                            The Knorpp Opera House (University of Central Missouri History)
                                        </a>
                                        <span className="hidden md:inline mx-2 text-stone-600" aria-hidden="true">|</span>
                                        <a
                                            href="https://en.wikipedia.org/wiki/Pleasant_Hill_Downtown_Historic_District"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Pleasant Hill Downtown Historic District — National Register (opens in new tab)"
                                            className="inline-flex items-center gap-2 text-brick underline underline-offset-4 rounded transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-white hover:text-brick-dark"
                                        >
                                            <img src={ExternalLinkIcon} alt="" className="w-4 h-4 mr-1" />
                                            Pleasant Hill Downtown Historic District (National Register)
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <figure className="mt-4 md:mt-6 max-w-3xl mx-auto">
                    <img
                        src={`${process.env.PUBLIC_URL}/images/congregation.jpg`}
                        alt="The Open Door Full Gospel Church congregation gathered in the sanctuary"
                        width={1424}
                        height={640}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-auto rounded-lg border border-rule"
                    />
                </figure>
            </section>

            {/* Leadership Legacy */}
            <section className="bg-white rounded-xl border border-rule p-5 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-6 text-center md:text-left">
                    <img src={LeadershipIcon} alt="" className="w-10 md:w-12 h-10 md:h-12 mb-2 md:mb-0 md:mr-4 mx-auto md:mx-0" />
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-ink">Leadership Legacy</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-serif text-lg font-bold text-ink mb-4">Past Leadership</h3>
                        <div className="space-y-3">
                            <div className="bg-parchment p-4 rounded-lg">
                                <p className="text-stone-700">
                                    <span className="font-semibold text-ink">Harvey Bryant</span> - Founding Pastor
                                </p>
                            </div>
                            <div className="bg-parchment p-4 rounded-lg">
                                <p className="text-stone-700">
                                    <span className="font-semibold text-ink">Sam Meyers</span> - Previous Pastor
                                </p>
                            </div>
                            <div className="bg-parchment p-4 rounded-lg">
                                <p className="text-stone-700">
                                    <span className="font-semibold text-ink">Don Sherwood, Lauren Simmons, Jim Coons, Roger Nichols</span> - Church Leaders
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-serif text-lg font-bold text-ink mb-4">Current Leadership</h3>
                        <div className="bg-white border border-rule text-ink p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <img src={PastorIcon} alt="" className="w-12 h-12 mr-4" />
                                <div>
                                    <h4 className="font-serif text-base font-bold text-ink">Pastor Dennis Gulley</h4>
                                    <p className="text-sm text-stone-700">Current Pastor</p>
                                </div>
                            </div>
                            <p className="text-sm text-stone-700 leading-relaxed">
                                Pastor Gulley brings the truth of the Bible and applies it to everyday life, 
                                continuing the legacy of faithful leadership at Open Door.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Church Values */}
            <section className="bg-white rounded-xl border border-rule p-5 md:p-8">
                <div className="flex items-center mb-6">
                    <img src={ValuesIcon} alt="" className="w-12 h-12 mr-4" />
                    <h2 className="font-serif text-xl md:text-2xl font-bold text-ink">Our Core Values</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-white border border-rule rounded-lg">
                        <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mx-auto mb-4">
                            <img src={CrossIcon} alt="" className="w-8 h-8 filter brightness-0 invert" />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-ink mb-2">Prayer</h3>
                        <p className="text-stone-600 text-sm">Foundation of spiritual growth and community connection</p>
                    </div>

                    <div className="text-center p-6 bg-white border border-rule rounded-lg">
                        <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mx-auto mb-4">
                            <img src={BibleIcon} alt="" className="w-8 h-8 filter brightness-0 invert" />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-ink mb-2">Bible Study</h3>
                        <p className="text-stone-600 text-sm">Commitment to biblically sound teachings and programs</p>
                    </div>

                    <div className="text-center p-6 bg-white border border-rule rounded-lg">
                        <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mx-auto mb-4">
                            <img src={CommunityServiceIcon} alt="" className="w-8 h-8 filter brightness-0 invert" />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-ink mb-2">Community Service</h3>
                        <p className="text-stone-600 text-sm">Active outreach and service to the local community</p>
                    </div>

                    <div className="text-center p-6 bg-white border border-rule rounded-lg">
                        <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mx-auto mb-4">
                            <img src={LeadershipIcon} alt="" className="w-8 h-8 filter brightness-0 invert" />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-ink mb-2">Youth Development</h3>
                        <p className="text-stone-600 text-sm">Programs for children and youth</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-sage text-white rounded-xl p-5 md:p-8 text-center">
                <h2 className="font-serif text-xl md:text-2xl font-bold text-white mb-4">Experience God's Love</h2>
                <p className="text-white leading-relaxed mb-6 max-w-2xl mx-auto">
                    We invite you to come and experience the wonderful things God is doing at Open Door!
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-white">Sunday Service</p>
                        <p className="text-sm text-white">10:30 AM</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold text-white">135 S 1st St</p>
                        <p className="text-sm text-white">Pleasant Hill, MO 64080</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
