import React, { ReactElement, useEffect } from "react";
import { trackPageView } from "../../utils/analytics";
import { BibleIcon, CrossIcon, HeartIcon } from "../../assets";

export const ScriptureStudy = (): ReactElement => {
    useEffect(() => {
        // Track scripture study page engagement
        trackPageView('/opendoor/Home/Scripture', 'Scripture Study - Galatians 6:1');
    }, []);

    return (
        <div className="w-full p-4 md:p-6 space-y-6 md:space-y-8">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-stone-50 to-white rounded-lg shadow-md p-4 md:p-8">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <img src={BibleIcon} alt="" className="w-12 h-12" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
                        Galatians 6:1
                    </h1>
                    <blockquote className="text-lg md:text-xl text-stone-700 italic leading-relaxed max-w-4xl mx-auto border-l-4 border-green-500 pl-6">
                        "Brethren, if a man is overtaken in any trespass, you who are spiritual restore such 
                        a one in a spirit of gentleness, considering yourself lest you also be tempted."
                        <cite className="block text-green-600 font-semibold mt-3 not-italic text-base">
                            — Galatians 6:1 (NKJV)
                        </cite>
                    </blockquote>
                </div>
            </section>

            {/* Historical Context */}
            <section className="bg-white rounded-lg shadow-md p-4 md:p-8">
                <div className="flex items-center mb-6">
                    <img src={CrossIcon} alt="" className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-800">Historical Context</h2>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">The Galatian Churches</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            The letter to the Galatians was written by the Apostle Paul around AD 48-50 to the churches 
                            in the region of Galatia (modern-day Turkey). These churches were established during Paul's 
                            first missionary journey and included cities like Antioch of Pisidia, Iconium, Lystra, and Derbe.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                            The Galatian believers were predominantly Gentile converts who had embraced the Gospel of 
                            grace through faith in Christ. However, they were being influenced by Judaizers—Jewish 
                            Christians who insisted that Gentile converts must follow the Mosaic Law, particularly 
                            circumcision, to be truly saved.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">Paul's Pastoral Concern</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Galatians 6:1 comes at the conclusion of Paul's letter, after he has vigorously defended 
                            the doctrine of justification by faith alone. Having established the theological foundation, 
                            Paul turns to practical Christian living. This verse addresses how believers should respond 
                            when a fellow Christian falls into sin—a common challenge in any church community.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Book of Galatians Overview */}
            <section className="bg-white rounded-lg shadow-md p-4 md:p-8">
                <div className="flex items-center mb-6">
                    <img src={BibleIcon} alt="" className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-800">The Letter to the Galatians</h2>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">Central Theme: Freedom in Christ</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Martin Luther called Galatians "my epistle" and "my Katie von Bora" (his wife), emphasizing 
                            its central role in understanding Christian freedom. The letter's main theme is that 
                            salvation comes through faith in Christ alone, not through works of the law.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">Structure and Key Passages</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-stone-800 mb-2">Chapters 1-2: Paul's Authority</h4>
                                <p className="text-gray-700 text-sm">
                                    Paul defends his apostolic calling and recounts his confrontation with Peter 
                                    over the Gospel's universality.
                                </p>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-stone-800 mb-2">Chapters 3-4: Justification by Faith</h4>
                                <p className="text-gray-700 text-sm">
                                    The theological heart of the letter, explaining that righteousness comes 
                                    through faith, not law-keeping.
                                </p>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-stone-800 mb-2">Chapter 5: Christian Liberty</h4>
                                <p className="text-gray-700 text-sm">
                                    "Stand fast therefore in the liberty by which Christ has made us free" (5:1). 
                                    Freedom from law, but not license to sin.
                                </p>
                            </div>
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-stone-800 mb-2">Chapter 6: Practical Christian Living</h4>
                                <p className="text-gray-700 text-sm">
                                    Including our key verse (6:1), Paul provides practical guidance for 
                                    Christian community and mutual restoration.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">Key Doctrinal Contributions</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span><strong>Sola Fide:</strong> "A man is not justified by the works of the law but by faith in Jesus Christ" (2:16)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span><strong>Union with Christ:</strong> "I have been crucified with Christ; it is no longer I who live, but Christ lives in me" (2:20)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span><strong>Fruit of the Spirit:</strong> "Love, joy, peace, longsuffering, kindness, goodness, faithfulness, gentleness, self-control" (5:22-23)</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span><strong>Law of Christ:</strong> "Bear one another's burdens, and so fulfill the law of Christ" (6:2)</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Verse Analysis */}
            <section className="bg-white rounded-lg shadow-md p-4 md:p-8">
                <div className="flex items-center mb-6">
                    <img src={HeartIcon} alt="" className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-800">Detailed Analysis of Galatians 6:1</h2>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">Key Greek Terms</h3>
                        <div className="space-y-4">
                            <div className="border-l-4 border-green-300 pl-4">
                                <p className="font-semibold text-stone-800">"Brethren" (adelphoi)</p>
                                <p className="text-gray-700 text-sm">
                                    Emphasizes the family relationship among believers—we are brothers and sisters in Christ, 
                                    sharing the same spiritual Father.
                                </p>
                            </div>
                            <div className="border-l-4 border-green-300 pl-4">
                                <p className="font-semibold text-stone-800">"Overtaken" (prolambano)</p>
                                <p className="text-gray-700 text-sm">
                                    Literally means "to be caught beforehand" or "surprised by." This suggests the person 
                                    didn't deliberately plan to sin but was caught off guard or overwhelmed.
                                </p>
                            </div>
                            <div className="border-l-4 border-green-300 pl-4">
                                <p className="font-semibold text-stone-800">"Restore" (katartizo)</p>
                                <p className="text-gray-700 text-sm">
                                    A medical term meaning "to set a broken bone" or "to mend fishing nets." It implies 
                                    careful, skillful restoration to proper function, not harsh condemnation.
                                </p>
                            </div>
                            <div className="border-l-4 border-green-300 pl-4">
                                <p className="font-semibold text-stone-800">"Gentleness" (prautes)</p>
                                <p className="text-gray-700 text-sm">
                                    One of the fruits of the Spirit (5:23), meaning "meekness" or "controlled strength." 
                                    It's power under control, like a well-trained horse.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">The Process of Restoration</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <h4 className="font-semibold text-green-700 mb-2">1. Recognition</h4>
                                <p className="text-sm text-gray-700">
                                    Acknowledging when a brother or sister has fallen into sin
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <h4 className="font-semibold text-green-700 mb-2">2. Restoration</h4>
                                <p className="text-sm text-gray-700">
                                    Gentle, skillful work to bring them back to spiritual health
                                </p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <h4 className="font-semibold text-green-700 mb-2">3. Self-Reflection</h4>
                                <p className="text-sm text-gray-700">
                                    Remembering our own vulnerability to temptation
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Scriptures */}
            <section className="bg-white rounded-lg shadow-md p-4 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-6">Related Scripture Passages</h2>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">On Restoration and Forgiveness</h3>
                        <div className="space-y-4">
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <p className="font-semibold text-stone-800 mb-2">Matthew 18:15-17</p>
                                <p className="text-gray-700 text-sm italic mb-2">
                                    "Moreover if your brother sins against you, go and tell him his fault between you and him alone. 
                                    If he hears you, you have gained your brother."
                                </p>
                                <p className="text-gray-700 text-sm">
                                    Jesus outlines the process for addressing sin in the church community, emphasizing private 
                                    confrontation first and gradual escalation if needed.
                                </p>
                            </div>
                            
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <p className="font-semibold text-stone-800 mb-2">James 5:19-20</p>
                                <p className="text-gray-700 text-sm italic mb-2">
                                    "Brethren, if anyone among you wanders from the truth, and someone turns him back, 
                                    let him know that he who turns a sinner from the error of his way will save a soul from death."
                                </p>
                                <p className="text-gray-700 text-sm">
                                    James emphasizes the eternal significance of restoration—it's literally a matter of 
                                    life and death, both spiritually and sometimes physically.
                                </p>
                            </div>

                            <div className="bg-stone-50 p-4 rounded-lg">
                                <p className="font-semibold text-stone-800 mb-2">Luke 17:3-4</p>
                                <p className="text-gray-700 text-sm italic mb-2">
                                    "Take heed to yourselves. If your brother sins against you, rebuke him; and if he repents, 
                                    forgive him. And if he sins against you seven times in a day, and seven times in a day 
                                    returns to you, saying, 'I repent,' you shall forgive him."
                                </p>
                                <p className="text-gray-700 text-sm">
                                    Jesus teaches about the unlimited nature of forgiveness when there is genuine repentance.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">On Gentleness and Humility</h3>
                        <div className="space-y-4">
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <p className="font-semibold text-stone-800 mb-2">1 Corinthians 4:21</p>
                                <p className="text-gray-700 text-sm italic mb-2">
                                    "What do you want? Shall I come to you with a rod, or in love and a spirit of gentleness?"
                                </p>
                                <p className="text-gray-700 text-sm">
                                    Paul contrasts harsh discipline with gentle restoration, preferring the latter approach.
                                </p>
                            </div>

                            <div className="bg-stone-50 p-4 rounded-lg">
                                <p className="font-semibold text-stone-800 mb-2">2 Timothy 2:24-25</p>
                                <p className="text-gray-700 text-sm italic mb-2">
                                    "And a servant of the Lord must not quarrel but be gentle to all, able to teach, patient, 
                                    in humility correcting those who are in opposition."
                                </p>
                                <p className="text-gray-700 text-sm">
                                    Paul instructs Timothy on the proper attitude for correction and restoration ministry.
                                </p>
                            </div>

                            <div className="bg-stone-50 p-4 rounded-lg">
                                <p className="font-semibold text-stone-800 mb-2">1 Corinthians 10:12</p>
                                <p className="text-gray-700 text-sm italic mb-2">
                                    "Therefore let him who thinks he stands take heed lest he fall."
                                </p>
                                <p className="text-gray-700 text-sm">
                                    This warning echoes Galatians 6:1's caution about our own vulnerability to temptation.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">On Bearing One Another's Burdens</h3>
                        <div className="space-y-4">
                            <div className="bg-stone-50 p-4 rounded-lg">
                                <p className="font-semibold text-stone-800 mb-2">Galatians 6:2</p>
                                <p className="text-gray-700 text-sm italic mb-2">
                                    "Bear one another's burdens, and so fulfill the law of Christ."
                                </p>
                                <p className="text-gray-700 text-sm">
                                    The immediate context of our verse, showing that restoration is part of Christian community life.
                                </p>
                            </div>

                            <div className="bg-stone-50 p-4 rounded-lg">
                                <p className="font-semibold text-stone-800 mb-2">Romans 15:1</p>
                                <p className="text-gray-700 text-sm italic mb-2">
                                    "We then who are strong ought to bear with the scruples of the weak, and not to please ourselves."
                                </p>
                                <p className="text-gray-700 text-sm">
                                    Paul emphasizes the responsibility of mature believers to help those who are struggling.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Practical Application */}
            <section className="bg-white rounded-lg shadow-md p-4 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-6">Practical Application for Today</h2>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">Who Should Restore?</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Paul specifies "you who are spiritual" (hoi pneumatikoi). This doesn't mean "perfect people" 
                            but rather those who are walking in the Spirit, demonstrating the fruit of the Spirit, 
                            and have spiritual maturity and wisdom. John Chrysostom (349-407 AD) noted that this 
                            refers to those who are "gentle, meek, and considerate."
                        </p>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-700 mb-2">Qualifications for Restoration Ministry:</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li>• Walking in the Spirit consistently</li>
                                <li>• Demonstrating the fruit of the Spirit, especially gentleness</li>
                                <li>• Having a humble heart that recognizes personal vulnerability</li>
                                <li>• Possessing wisdom and experience in handling spiritual matters</li>
                                <li>• Motivated by love for the fallen brother, not judgment</li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">The Manner of Restoration</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Matthew Henry (1662-1714) emphasized that restoration should be done "in the spirit of meekness," 
                            meaning with genuine humility and love. The goal is not to punish but to heal and restore.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-red-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-red-700 mb-2">What NOT to Do:</h4>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    <li>• Approach with a judgmental attitude</li>
                                    <li>• Gossip about the person's failure</li>
                                    <li>• Use harsh, condemning language</li>
                                    <li>• Assume superiority or self-righteousness</li>
                                    <li>• Rush the process of restoration</li>
                                </ul>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-green-700 mb-2">What TO Do:</h4>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    <li>• Approach with love and gentleness</li>
                                    <li>• Maintain confidentiality</li>
                                    <li>• Use gracious, healing words</li>
                                    <li>• Remember your own need for grace</li>
                                    <li>• Be patient with the healing process</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-stone-800 mb-3">Guarding Against Temptation</h3>
                        <p className="text-gray-700 leading-relaxed">
                            The warning "considering yourself lest you also be tempted" serves multiple purposes. 
                            It keeps the restorer humble, prevents spiritual pride, and acknowledges that involvement 
                            in someone else's sin can sometimes lead to our own temptation. As Charles Spurgeon (1834-1892) 
                            noted, "He who would lift up the fallen must take care that he does not fall himself."
                        </p>
                    </div>
                </div>
            </section>

            {/* Historical Christian Commentary */}
            <section className="bg-white rounded-lg shadow-md p-4 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-6">Historical Christian Commentary</h2>
                
                <div className="space-y-6">
                    <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-stone-800 mb-2">John Chrysostom (349-407 AD)</h3>
                        <p className="text-gray-700 italic mb-2">
                            "If you see anyone falling into sin, do not despise him, but reach out your hand to him as 
                            you would to someone who has fallen into a ditch. For you do not know if tomorrow you might 
                            not be in need of the same assistance."
                        </p>
                        <p className="text-gray-700 text-sm">
                            The golden-mouthed preacher emphasized the practical nature of Christian love in restoration.
                        </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-stone-800 mb-2">John Calvin (1509-1564)</h3>
                        <p className="text-gray-700 italic mb-2">
                            "Let us remember that we are all sailing in the same ship, and are equally exposed to the 
                            same storms. When we see a brother fall, let us not triumphantly trample upon him, but let us 
                            stretch out our hand and lift him up."
                        </p>
                        <p className="text-gray-700 text-sm">
                            Calvin emphasized the shared vulnerability of all believers to sin.
                        </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-stone-800 mb-2">Matthew Henry (1662-1714)</h3>
                        <p className="text-gray-700 italic mb-2">
                            "Those who are spiritual should restore such as have fallen, not with roughness, severity, 
                            and insulting, but with the spirit of meekness, in a mild and gentle manner, endeavoring to 
                            convince them of their error and to bring them to repentance."
                        </p>
                        <p className="text-gray-700 text-sm">
                            Henry's commentary emphasizes the method and manner of biblical restoration.
                        </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-stone-800 mb-2">Charles Spurgeon (1834-1892)</h3>
                        <p className="text-gray-700 italic mb-2">
                            "When you restore a fallen brother, do it as surgeons work upon a broken limb—very tenderly, 
                            lest you cause more damage than good. Remember that you are handling a soul that is already 
                            wounded."
                        </p>
                        <p className="text-gray-700 text-sm">
                            The Prince of Preachers used medical imagery to illustrate gentle restoration.
                        </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="text-lg font-semibold text-stone-800 mb-2">Martyn Lloyd-Jones (1899-1981)</h3>
                        <p className="text-gray-700 italic mb-2">
                            "The moment you begin to think that you are different from other people, and that you are 
                            not as likely to fall as they are, you are in the greatest danger. The person who is not 
                            afraid of sinning is most likely to sin."
                        </p>
                        <p className="text-gray-700 text-sm">
                            Lloyd-Jones warned against the spiritual pride that can make us ineffective in restoration ministry.
                        </p>
                    </div>
                </div>
            </section>

            {/* References */}
            <section className="bg-stone-50 rounded-lg p-4 md:p-6">
                <h2 className="text-xl font-bold text-stone-800 mb-4">Sources and References</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-stone-800 mb-3">Primary Sources</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• <a href="https://www.biblegateway.com/passage/?search=Galatians+6%3A1&version=NKJV" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">The Holy Bible, New King James Version</a></li>
                            <li>• <a href="https://www.google.com/search?q=Nestle-Aland+28th+Edition+Greek+New+Testament" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Greek New Testament (Nestle-Aland 28th Edition)</a></li>
                            <li>• <a href="https://archive.org/details/theologicaldicti0000unse" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Theological Dictionary of the New Testament (Kittel)</a></li>
                            <li>• <a href="https://biblehub.com/commentaries/egt/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Expositor's Greek Testament</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-stone-800 mb-3">Historical Commentaries</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• <a href="https://www.google.com/search?q=John+Chrysostom+Homilies+on+Galatians" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">John Chrysostom - Homilies on Galatians</a></li>
                            <li>• <a href="https://www.ccel.org/ccel/calvin/calcom41.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">John Calvin - Commentary on Galatians</a></li>
                            <li>• <a href="https://www.biblestudytools.com/commentaries/matthew-henry-complete/galatians/6.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Matthew Henry - Commentary on the Whole Bible</a></li>
                            <li>• <a href="https://www.spurgeon.org/resource-library/sermons/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Charles Spurgeon - Sermon Collection</a></li>
                            <li>• <a href="https://www.google.com/search?q=Martyn+Lloyd-Jones+Commentary+Galatians" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Martyn Lloyd-Jones - Commentary on Galatians</a></li>
                            <li>• <a href="https://www.ivpress.com/the-message-of-galatians" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">John Stott - The Message of Galatians</a></li>
                            <li>• <a href="https://www.google.com/search?q=F.F.+Bruce+Commentary+on+Galatians+NIGTC" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">F.F. Bruce - Commentary on Galatians</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-stone-800 mb-3">Theological Resources</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• <a href="https://www.crossway.org/books/systematic-theology-tpb/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Systematic Theology by Wayne Grudem</a></li>
                            <li>• <a href="https://www.google.com/search?q=New+Bible+Dictionary+IVP" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">The New Bible Dictionary (IVP)</a></li>
                            <li>• <a href="https://www.google.com/search?q=Vine%27s+Expository+Dictionary+of+Biblical+Words" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Vine's Expository Dictionary</a></li>
                            <li>• <a href="https://www.google.com/search?q=Anchor+Bible+Dictionary+Yale" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">The Anchor Bible Dictionary</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-stone-800 mb-3">Historical Context</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• <a href="https://www.zondervan.com/9780310279518/an-introduction-to-the-new-testament/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">New Testament Introduction by D.A. Carson & Douglas Moo</a></li>
                            <li>• <a href="https://www.google.com/search?q=Paul+Apostle+of+the+Heart+Set+Free+F.F.+Bruce" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Paul: Apostle of the Heart Set Free by F.F. Bruce</a></li>
                            <li>• <a href="https://www.google.com/search?q=Book+of+Acts+Setting+Hellenistic+History+Colin+Hemer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">The Book of Acts in the Setting of Hellenistic History by Colin Hemer</a></li>
                            <li>• <a href="https://www.google.com/search?q=Early+Christian+Doctrines+J.N.D.+Kelly" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Early Christian Doctrines by J.N.D. Kelly</a></li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-6 p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600 italic">
                        <strong>Note:</strong> All interpretations and applications presented here are based on 
                        historically orthodox Christian scholarship and commentary from recognized biblical scholars 
                        and theologians throughout church history. This study seeks to understand Scripture in its 
                        original context while applying its timeless truths to contemporary Christian life.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default ScriptureStudy;
