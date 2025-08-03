import React, { ReactElement, useEffect } from "react";
import { trackAboutView } from "../../utils/analytics";
import { 
    TimelineIcon, 
    ChurchIcon, 
    PastorIcon, 
    ValuesIcon, 
    HistoryIcon, 
    LeadershipIcon 
} from "../../assets";

export const About = (): ReactElement => {
    useEffect(() => {
        // Track about page engagement
        trackAboutView();
    }, []);

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-stone-400 via-orange-200 to-stone-400 text-white rounded-lg p-8 shadow-lg">
                <div className="flex items-center justify-center mb-6">
                    <img src={ChurchIcon} alt="" className="w-16 h-16 mr-4" />
                    <div>
                        <h1 className="text-4xl font-bold text-stone-800">About Our Church</h1>
                        <p className="text-xl opacity-90 mt-2 text-stone-700">Open Door Full Gospel Church</p>
                    </div>
                </div>
                <p className="text-center text-lg opacity-95 max-w-3xl mx-auto text-stone-700">
                    Founded in 1975, our church has been a cornerstone of faith and community service 
                    in Pleasant Hill, Missouri for nearly five decades.
                </p>
            </section>

            {/* Church History Timeline */}
            <section className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-6">
                    <img src={TimelineIcon} alt="" className="w-12 h-12 mr-4" />
                    <h2 className="text-3xl font-bold text-stone-800">Our History</h2>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-stone-50 to-white p-6 rounded-lg border-l-4 border-green-500">
                        <div className="flex items-start">
                            <img src={HistoryIcon} alt="" className="w-10 h-10 mr-4 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold text-stone-800 mb-2">The Founding (1975)</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Open Door was founded by Herbert & Willetta Lowry and William & Mable Burnett in 
                                    July of 1975. Services were first held in an old house on the corner of Cedar and 
                                    Campbell. There were 35 people in attendance at the first service. The founders 
                                    asked Harvey Bryant to pastor the church.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-white to-stone-50 p-6 rounded-lg border-l-4 border-orange-300">
                        <div className="flex items-start">
                            <img src={ChurchIcon} alt="" className="w-10 h-10 mr-4 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold text-stone-800 mb-2">Building Our Home</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Pastor Bryant bought the church's current building after it was damaged by smoke 
                                    from a neighboring building. The church later bought the building from Pastor Bryant, 
                                    establishing our permanent home in Pleasant Hill.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Legacy */}
            <section className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-6">
                    <img src={LeadershipIcon} alt="" className="w-12 h-12 mr-4" />
                    <h2 className="text-3xl font-bold text-stone-800">Leadership Legacy</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-4">Past Pastors</h3>
                        <div className="space-y-3">
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <p className="text-gray-700">
                                    <span className="font-semibold text-stone-800">Harvey Bryant</span> - Founding Pastor
                                </p>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <p className="text-gray-700">
                                    <span className="font-semibold text-stone-800">Don Sherwood</span> - Continued Leadership
                                </p>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <p className="text-gray-700">
                                    <span className="font-semibold text-stone-800">Lauren Simmons</span> - Pastoral Ministry
                                </p>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <p className="text-gray-700">
                                    <span className="font-semibold text-stone-800">Jim Coons, Roger Nichols, Sam Meyers</span> - Faithful Service
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-4">Current Leadership</h3>
                        <div className="bg-gradient-to-br from-green-500 to-orange-300 text-white p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <img src={PastorIcon} alt="" className="w-12 h-12 mr-4" />
                                <div>
                                    <h4 className="text-xl font-bold">Pastor Dennis Gulley</h4>
                                    <p className="text-sm opacity-90">Current Pastor</p>
                                </div>
                            </div>
                            <p className="text-sm opacity-95 leading-relaxed">
                                Pastor Gulley brings the truth of the Bible and applies it to everyday life, 
                                continuing the legacy of faithful leadership at Open Door.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Church Values */}
            <section className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-6">
                    <img src={ValuesIcon} alt="" className="w-12 h-12 mr-4" />
                    <h2 className="text-3xl font-bold text-stone-800">Our Core Values</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-gradient-to-b from-stone-50 to-white rounded-lg border border-stone-200">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">🙏</span>
                        </div>
                        <h3 className="text-lg font-semibold text-stone-800 mb-2">Prayer</h3>
                        <p className="text-gray-600 text-sm">Foundation of spiritual growth and community connection</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-b from-stone-50 to-white rounded-lg border border-stone-200">
                        <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">📖</span>
                        </div>
                        <h3 className="text-lg font-semibold text-stone-800 mb-2">Bible Study</h3>
                        <p className="text-gray-600 text-sm">Commitment to biblically sound teachings and programs</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-b from-stone-50 to-white rounded-lg border border-stone-200">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">🤝</span>
                        </div>
                        <h3 className="text-lg font-semibold text-stone-800 mb-2">Community Service</h3>
                        <p className="text-gray-600 text-sm">Active outreach and service to the local community</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-b from-stone-50 to-white rounded-lg border border-stone-200">
                        <div className="w-16 h-16 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl font-bold">👥</span>
                        </div>
                        <h3 className="text-lg font-semibold text-stone-800 mb-2">Youth Development</h3>
                        <p className="text-gray-600 text-sm">Programs for children, youth, and young adults</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-green-500 to-orange-300 text-white rounded-lg p-8 text-center shadow-lg">
                <h2 className="text-3xl font-bold mb-4">Experience God's Love</h2>
                <p className="text-xl mb-6 opacity-95">
                    We invite you to come and experience the wonderful things God is doing at Open Door!
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="text-center">
                        <p className="text-lg font-semibold">Sunday Service</p>
                        <p className="text-sm opacity-90">10:15 AM</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold">135 S 1st St</p>
                        <p className="text-sm opacity-90">Pleasant Hill, MO 64080</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
