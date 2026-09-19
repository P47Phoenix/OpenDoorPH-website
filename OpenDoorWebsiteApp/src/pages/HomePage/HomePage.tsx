import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { CrossIcon, HeartIcon, BibleIcon, CommunityServiceIcon } from "../../assets";
import { usePageMeta } from '../../hooks/usePageMeta';
import { trackCtaClick } from '../../utils/analytics';
import SideBar from '../../components/layout/SideBar';

export const Main = (): ReactElement => {
    usePageMeta({
        title: 'Open Door Full Gospel Church — Pleasant Hill, MO',
        description: 'Welcome to Open Door Full Gospel Church in Pleasant Hill, MO. Sunday service at 10:30 AM. Join Pastor Dennis Gulley for Spirit-filled worship and community.',
    });

    return (
        <div className="w-full p-4 md:p-6 space-y-6 md:space-y-8">
            {/* Church verse card (AC-15) */}
            <section className="bg-white border border-rule rounded-xl p-5 md:p-8" aria-labelledby="verse-label">
                <p id="verse-label" className="text-xs font-sans font-bold tracking-wide uppercase text-brick mb-3">Our church verse</p>
                <blockquote className="font-serif text-ink text-xl leading-relaxed first-letter:font-bold first-letter:text-brick first-letter:text-5xl first-letter:float-left first-letter:leading-none first-letter:mr-2 first-letter:mt-1">
                    Brethren, if a man is overtaken in any trespass, you who are spiritual restore such a one in a spirit of gentleness, considering yourself lest you also be tempted.
                </blockquote>
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mt-4 clear-both">
                    <cite className="text-sm text-stone-600 not-italic">Galatians 6:1 (NKJV)</cite>
                    <Link
                        to="/opendoor/Home/Scripture"
                        aria-label="Read the study of Galatians 6:1"
                        className="inline-flex items-center min-h-[44px] text-sm font-bold text-brick rounded transition-colors duration-150 motion-reduce:transition-none touch-manipulation focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-white hover:text-brick-dark hover:underline active:text-brick-dark"
                    >
                        Read the study
                    </Link>
                </div>
            </section>

            {/* Welcome Section */}
            <section className="text-center">
                <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-ink mb-3 md:mb-4 px-2">
                    Welcome to Open Door Full Gospel Church
                </h1>
                <p className="text-lg md:text-xl text-stone-700 max-w-3xl mx-auto leading-relaxed px-2">
                    A community of faith committed to prayer, Bible study, and serving others 
                    with the love of Christ.
                </p>
            </section>

            {/* Congregation photo (AC-43): moved here per elder ruling 2026-09-18 —
                right after the welcome heading, so a visitor sees the church before
                reading the mission. Loaded eager/high-priority since it now sits at or
                near the top of the viewport on most screens. */}
            <figure className="max-w-3xl mx-auto">
                <picture>
                    <source srcSet={`${process.env.PUBLIC_URL}/images/congregation-hero.webp`} type="image/webp" />
                    <img
                        src={`${process.env.PUBLIC_URL}/images/congregation-hero.jpg`}
                        alt="The Open Door Full Gospel Church congregation gathered in the sanctuary"
                        width={1424}
                        height={640}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="w-full h-auto rounded-lg border border-rule"
                    />
                </picture>
            </figure>

            {/* Mission Card */}
            <section className="bg-white rounded-xl border border-rule p-5 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4 mb-4 md:mb-6">
                    <img src={CrossIcon} alt="" className="w-12 h-12 flex-shrink-0 mx-auto md:mx-0 md:mt-1" />
                    <div className="text-center md:text-left">
                        <h2 className="font-serif text-xl md:text-2xl font-bold text-ink mb-3">
                            Our Mission
                        </h2>
                        <p className="text-stone-700 leading-relaxed">
                            Open Door Full Gospel is committed to being a rock solid church through prayer,
                            bible study, and community service. We strive to reach out to the community in any
                            way we can. We provide solid foundations through biblically sound programs for youth,
                            children, and Nursery. Our pastor, Dennis Gulley,
                            brings the truth of the Bible and applies it to everyday life.
                        </p>
                    </div>
                </div>
            </section>

            {/* Community Service Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Past Service Card */}
                <div className="bg-white rounded-xl border border-rule p-5 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center mb-4 text-center md:text-left">
                        <img src={CommunityServiceIcon} alt="" className="w-10 h-10 mx-auto md:mx-0 md:mr-4 mb-2 md:mb-0" />
                        <h3 className="font-serif text-lg font-bold text-ink">
                            Community Outreach
                        </h3>
                    </div>
                    <div className="space-y-3 md:space-y-4 text-stone-700">
                        <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-3">
                            <img src={HeartIcon} alt="" className="w-5 h-5 mx-auto md:mx-0 md:mt-1 md:flex-shrink-0" />
                            <p className="text-sm leading-relaxed text-center md:text-left">
                                <strong>2009 Clothes Drive:</strong> All clothes gathered were given away to the community free.
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-3">
                            <img src={HeartIcon} alt="" className="w-5 h-5 mx-auto md:mx-0 md:mt-1 md:flex-shrink-0" />
                            <p className="text-sm leading-relaxed text-center md:text-left">
                                <strong>Food Drive:</strong> All food gathered was donated to Harvesters. 
                                We helped pack boxes of bread for community pantries.
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-3">
                            <img src={HeartIcon} alt="" className="w-5 h-5 mx-auto md:mx-0 md:mt-1 md:flex-shrink-0" />
                            <p className="text-sm leading-relaxed text-center md:text-left">
                                <strong>Homeless Ministry:</strong> Worked with Uplift, providing coats, sleeping bags, 
                                clothes, and food to those in need.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Current & Future Service Card */}
                <div className="bg-white rounded-xl border border-rule p-5 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center mb-4 text-center md:text-left">
                        <img src={BibleIcon} alt="" className="w-10 h-10 mx-auto md:mx-0 md:mr-4 mb-2 md:mb-0" />
                        <h3 className="font-serif text-lg font-bold text-ink">
                            Ongoing Ministry
                        </h3>
                    </div>
                    <div className="space-y-3 md:space-y-4 text-stone-700">
                        <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-3">
                            <img src={HeartIcon} alt="" className="w-5 h-5 mx-auto md:mx-0 md:mt-1 md:flex-shrink-0" />
                            <p className="text-sm leading-relaxed text-center md:text-left">
                                <strong>Kansas City Rescue Mission:</strong> We work to prepare and serve 
                                hot meals to the homeless in our community.
                            </p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-start space-y-2 md:space-y-0 md:space-x-3">
                            <img src={HeartIcon} alt="" className="w-5 h-5 mx-auto md:mx-0 md:mt-1 md:flex-shrink-0" />
                            <p className="text-sm leading-relaxed text-center md:text-left">
                                <strong>Community Partnerships:</strong> We continue our partnership with Uplift 
                                and other local organizations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-sage text-white rounded-xl p-5 md:p-8 text-center">
                <div className="flex justify-center mb-4">
                    <img src={CrossIcon} alt="" className="w-10 md:w-12 h-10 md:h-12 filter brightness-0 invert" />
                </div>
                <h2 className="font-serif text-xl md:text-2xl font-bold text-white mb-4">
                    Join Our Church Family
                </h2>
                <p className="text-white leading-relaxed mb-6 max-w-2xl mx-auto px-2">
                    These are just a few of the things going on at Open Door. Come by and experience 
                    the love of Christ. We would love to have you as part of our church family.
                </p>
                <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-4 justify-center">
                    <Link
                        to="/opendoor/Home/Location"
                        onClick={() => trackCtaClick('Visit Us', 'homepage_hero', '/opendoor/Home/Location')}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold bg-white text-sage transition-colors duration-150 motion-reduce:transition-none touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sage hover:bg-parchment hover:text-sage-dark active:bg-rule active:text-sage-dark"
                    >
                        Visit Us
                    </Link>
                    <Link
                        to="/opendoor/Home/About"
                        onClick={() => trackCtaClick('Learn More', 'homepage_hero', '/opendoor/Home/About')}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border-2 border-white text-white transition-colors duration-150 motion-reduce:transition-none touch-manipulation min-h-[44px] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sage hover:bg-sage-dark active:bg-sage-dark"
                    >
                        Learn More
                    </Link>
                </div>
            </section>

            {/* Schedule / Welcome / Facebook blocks — mounted last (AC-12) */}
            <SideBar />
        </div>
    );
};
