import React, { ReactElement } from "react";
import { CrossIcon, HeartIcon, BibleIcon, CommunityServiceIcon, WelcomeBanner } from "../../assets";

export const Main = (): ReactElement => {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Welcome Section */}
            <section className="text-center mb-12">
                <div className="flex justify-center mb-6">
                    <img src={WelcomeBanner} alt="" className="h-16 w-auto" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
                    Welcome to Open Door Full Gospel Church
                </h1>
                <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
                    A community of faith committed to prayer, Bible study, and serving others 
                    with the love of Christ.
                </p>
            </section>

            {/* Mission Card */}
            <section className="bg-white rounded-xl shadow-lg border border-stone-200 p-8">
                <div className="flex items-start space-x-4 mb-6">
                    <img src={CrossIcon} alt="" className="w-12 h-12 flex-shrink-0 mt-1" />
                    <div>
                        <h2 className="text-2xl font-bold text-stone-800 mb-3">
                            Our Mission
                        </h2>
                        <p className="text-stone-700 leading-relaxed">
                            Open Door Full Gospel is committed to being a rock solid church through prayer,
                            bible study, and community service. We strive to reach out to the community in any
                            way we can. We provide solid foundations through biblically sound programs for youth,
                            children, Nursery, and young adults (classes coming soon). Our pastor, Dennis Gulley,
                            brings the truth of the Bible and applies it to everyday life.
                        </p>
                    </div>
                </div>
            </section>

            {/* Community Service Section */}
            <section className="grid md:grid-cols-2 gap-8">
                {/* Past Service Card */}
                <div className="bg-gradient-to-br from-church-green/5 to-stone-50 rounded-xl border border-church-green/20 p-6">
                    <div className="flex items-center mb-4">
                        <img src={CommunityServiceIcon} alt="" className="w-10 h-10 mr-4" />
                        <h3 className="text-xl font-bold text-stone-800">
                            Community Outreach
                        </h3>
                    </div>
                    <div className="space-y-4 text-stone-700">
                        <div className="flex items-start space-x-3">
                            <img src={HeartIcon} alt="" className="w-5 h-5 mt-1 flex-shrink-0" />
                            <p className="text-sm leading-relaxed">
                                <strong>2009 Clothes Drive:</strong> All clothes gathered were given away to the community free.
                                We also held our first annual Vacation Bible School.
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <img src={HeartIcon} alt="" className="w-5 h-5 mt-1 flex-shrink-0" />
                            <p className="text-sm leading-relaxed">
                                <strong>Food Drive:</strong> All food gathered was donated to Harvesters. 
                                We helped pack boxes of bread for community pantries.
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <img src={HeartIcon} alt="" className="w-5 h-5 mt-1 flex-shrink-0" />
                            <p className="text-sm leading-relaxed">
                                <strong>Homeless Ministry:</strong> Worked with Uplift, providing coats, sleeping bags, 
                                clothes, and food to those in need.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Current & Future Service Card */}
                <div className="bg-gradient-to-br from-stone-100 to-stone-50 rounded-xl border border-stone-200 p-6">
                    <div className="flex items-center mb-4">
                        <img src={BibleIcon} alt="" className="w-10 h-10 mr-4" />
                        <h3 className="text-xl font-bold text-stone-800">
                            Ongoing Ministry
                        </h3>
                    </div>
                    <div className="space-y-4 text-stone-700">
                        <div className="flex items-start space-x-3">
                            <img src={HeartIcon} alt="" className="w-5 h-5 mt-1 flex-shrink-0" />
                            <p className="text-sm leading-relaxed">
                                <strong>Kansas City Rescue Mission:</strong> We work to prepare and serve 
                                hot meals to the homeless in our community.
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <img src={HeartIcon} alt="" className="w-5 h-5 mt-1 flex-shrink-0" />
                            <p className="text-sm leading-relaxed">
                                <strong>Annual VBS:</strong> Our Vacation Bible School continues to serve 
                                children and families in the community.
                            </p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <img src={HeartIcon} alt="" className="w-5 h-5 mt-1 flex-shrink-0" />
                            <p className="text-sm leading-relaxed">
                                <strong>Community Partnerships:</strong> We continue our partnership with Uplift 
                                and other local organizations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-church-green rounded-xl text-white p-8 text-center">
                <div className="flex justify-center mb-4">
                    <img src={CrossIcon} alt="" className="w-12 h-12 filter brightness-0 invert" />
                </div>
                <h2 className="text-2xl font-bold mb-4">
                    Join Our Church Family
                </h2>
                <p className="text-green-100 leading-relaxed mb-6 max-w-2xl mx-auto">
                    These are just a few of the things going on at Open Door. Come by and experience 
                    the love of Christ. We would love to have you as part of our church family.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                        href="/opendoor/Home/Location" 
                        className="bg-white text-church-green px-6 py-3 rounded-lg font-semibold hover:bg-stone-100 transition-colors duration-200"
                    >
                        Visit Us
                    </a>
                    <a 
                        href="/opendoor/Home/About" 
                        className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-church-green transition-colors duration-200"
                    >
                        Learn More
                    </a>
                </div>
            </section>
        </div>
    );
};
