import React, { ReactElement } from "react";
import { BibleIcon, CrossIcon, HeartIcon } from "../../assets";
import { usePageMeta } from '../../hooks/usePageMeta';
import { trackReferenceClick } from '../../utils/analytics';
import {
    ENGLISH_LEV_19_17,
    ENGLISH_LEV_19_18,
    GREEK_BAROS,
    GREEK_PHORTION,
    GREEK_PRAUTES,
    GREEK_PROLEMPHTHE,
    HEBREW_HOCHEACH_TOCHIACH,
    HEBREW_LEV_19_17,
    HEBREW_LEV_19_18,
    HEBREW_SHUV,
    HEBREW_TESHUVAH,
    TRANSLIT_BAROS,
    TRANSLIT_HOCHEACH_TOCHIACH,
    TRANSLIT_LEV_19_18,
    TRANSLIT_PHORTION,
    TRANSLIT_PRAUTES,
    TRANSLIT_PROLEMPHTHE,
    TRANSLIT_SHUV,
    TRANSLIT_TESHUVAH,
} from '../../constants/biblical-languages';

export const ScriptureStudy = (): ReactElement => {
    usePageMeta({
        title: 'Scripture Study — Open Door Full Gospel Church',
        description: 'Explore scripture study resources and biblical teaching from Open Door Full Gospel Church in Pleasant Hill, MO.',
    });

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
                        {/* STORY-ISSUE-014 — Dating debate parenthetical per source PRD
                            ISSUE-014 Required Action. Text is verbatim from the PRD;
                            footnote cites Bruce + Carson/Moo per component-specs §6. */}
                        <p className="text-gray-700 leading-relaxed mb-4 italic text-sm">
                            This study follows the South Galatian theory (cf. Bruce, Carson/Moo), dating the letter to approximately AD 48-49. The North Galatian theory dates the letter later, circa AD 53-57. The exegetical conclusions of this study are unaffected by either dating.
                            <sup className="ml-0.5">
                                <a
                                    href="#fn-hc-1"
                                    id="fnref-hc-1"
                                    aria-label="Footnote 1"
                                    className="inline-block min-w-[1.5rem] text-center text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded not-italic"
                                >
                                    1
                                </a>
                            </sup>
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

                    {/* STORY-ISSUE-014 — Footnotes for Historical Context section.
                        Section-scoped counter (hc-*) per component-specs §6.2/§6.3. */}
                    <aside
                        aria-label="Footnotes for this section"
                        className="mt-8 pt-4 border-t border-stone-200"
                    >
                        <h3 className="sr-only">Footnotes</h3>
                        <ol className="space-y-2 text-sm text-stone-600 list-decimal list-inside">
                            <li id="fn-hc-1" tabIndex={-1} className="scroll-mt-4">
                                F.F. Bruce, <em>Paul: Apostle of the Heart Set Free</em> (Eerdmans);
                                {' '}D.A. Carson and Douglas Moo, <em>An Introduction to the New Testament</em> (Zondervan), pp. 458-461.
                                {' '}
                                <a
                                    href="#fnref-hc-1"
                                    aria-label="Return to reference 1"
                                    className="inline-block min-w-[1.5rem] text-center ml-1 text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                >
                                    ↩
                                </a>
                            </li>
                        </ol>
                    </aside>
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
                            {/* STORY-ISSUE-010 — Sola Fide reframed per source PRD ISSUE-010
                                Required Action. Replacement text is verbatim from the PRD.
                                Galatians 2:16 retained as the supporting citation (AC-2). */}
                            <li className="flex items-start">
                                <span className="text-green-600 mr-2">•</span>
                                <span>
                                    <strong>Sola Fide:</strong> The doctrine later articulated by the Reformers as Sola Fide finds its foundational Pauline expression here. Paul's immediate concern, however, was the Judaizer insistence on Torah observance and circumcision as conditions of salvation for Gentile believers. (Galatians 2:16)
                                </span>
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
                                <p className="font-semibold text-stone-800">
                                    "Overtaken" (<span lang="grc" className="font-serif">{GREEK_PROLEMPHTHE}</span>
                                    <span className="italic ml-1">(<em>{TRANSLIT_PROLEMPHTHE}</em>)</span>)
                                </p>
                                <p className="text-gray-700 text-sm">
                                    The aorist passive form suggests one who has been overtaken or caught — whether by
                                    sudden temptation or by the discovery of a fault — without necessarily resolving the
                                    question of deliberate intent.
                                    <sup className="ml-0.5">
                                        <a
                                            href="#fn-da-1"
                                            id="fnref-da-1"
                                            aria-label="Footnote 1"
                                            className="inline-block min-w-[1.5rem] text-center text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                        >
                                            1
                                        </a>
                                    </sup>
                                    <sup className="ml-0.5">
                                        <a
                                            href="#fn-da-2"
                                            id="fnref-da-2"
                                            aria-label="Footnote 2"
                                            className="inline-block min-w-[1.5rem] text-center text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                        >
                                            2
                                        </a>
                                    </sup>
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
                                <p className="font-semibold text-stone-800">
                                    "Gentleness" (<span lang="grc" className="font-serif">{GREEK_PRAUTES}</span>
                                    <span className="italic ml-1">(<em>{TRANSLIT_PRAUTES}</em>)</span>)
                                </p>
                                <p className="text-gray-700 text-sm">
                                    One of the fruits of the Spirit (5:23). The <em>Theological Dictionary of the New
                                    Testament</em> defines <span lang="grc" className="font-serif">{GREEK_PRAUTES}</span>{' '}
                                    as "the humble and gentle attitude which expresses itself particularly in a patient
                                    submissiveness to offense".
                                    <sup className="ml-0.5">
                                        <a
                                            href="#fn-da-3"
                                            id="fnref-da-3"
                                            aria-label="Footnote 3"
                                            className="inline-block min-w-[1.5rem] text-center text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                        >
                                            3
                                        </a>
                                    </sup>
                                </p>
                            </div>

                            {/* STORY-ISSUE-012 — Teshuvah h4 sub-point of Restore (katartizo).
                                Placed as last child of the Key Greek Terms space-y-4 list per
                                component-specs §2.4; visually indented (pl-4 border-l-2 border-stone-300)
                                to cue sub-of-katartizo depth. Parent chain is h2 → h3 → h4 (no
                                h2→h4 skip per FR-06.a). Content verbatim from source PRD ISSUE-012. */}
                            <div className="mt-4 pl-4 border-l-2 border-stone-300">
                                <h4
                                    id="teshuvah"
                                    className="font-semibold text-stone-800 mb-2 scroll-mt-4"
                                >
                                    Teshuvah (
                                    <span lang="he" dir="rtl">{HEBREW_TESHUVAH}</span>
                                    ) — The Hebrew Return
                                </h4>
                                <p className="text-gray-700 text-sm leading-relaxed mb-2">
                                    The Hebrew concept of <em>{TRANSLIT_TESHUVAH}</em>{' '}
                                    (<span lang="he" dir="rtl" className="mx-1">{HEBREW_TESHUVAH}</span>) —{' '}
                                    <em>return</em> — is the foundational framework for the New Testament
                                    concept of repentance (<em>metanoia</em>). It derives from the root{' '}
                                    <span lang="he" dir="rtl" className="mx-1">{HEBREW_SHUV}</span>{' '}
                                    (<em>{TRANSLIT_SHUV}</em> — to turn, to return).
                                </p>
                                <p className="text-gray-700 text-sm leading-relaxed mb-2">
                                    The act of restoring a fallen believer in Galatians 6:1 is, at its
                                    deepest level, facilitating <em>{TRANSLIT_TESHUVAH}</em> — enabling
                                    a return to God and to covenantal community. This is not a New
                                    Testament innovation but the continuation of Israel's covenantal
                                    life. Reading <em>katartizo</em> (restore) without this framework
                                    reduces restoration to a social or relational exercise, stripping
                                    it of its covenantal and theological weight.
                                </p>
                                <blockquote className="text-gray-700 text-sm italic border-l-4 border-green-300 pl-4 my-2">
                                    <em>{TRANSLIT_TESHUVAH}</em> means to turn, to return. Sin is a
                                    departure; repentance is a return.
                                    <sup className="ml-0.5">
                                        <a
                                            href="#fn-da-6"
                                            id="fnref-da-6"
                                            aria-label="Footnote 6"
                                            className="inline-block min-w-[1.5rem] text-center text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                        >
                                            6
                                        </a>
                                    </sup>
                                    <cite className="block text-stone-600 not-italic mt-1">
                                        — Abraham Joshua Heschel, <em>God in Search of Man</em>
                                    </cite>
                                </blockquote>
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

                    {/* STORY-ISSUE-007: Baros vs. Phortion — sibling h3 of Key Greek Terms,
                        anchor id "baros-phortion" per FR-05.a. Block Greek display per
                        component-specs §4.2. */}
                    <div>
                        <h3
                            id="baros-phortion"
                            className="text-xl font-semibold text-stone-800 mb-3 scroll-mt-4"
                        >
                            The Tension with Galatians 6:5
                        </h3>
                        <div className="border-l-4 border-green-300 pl-4 mb-4">
                            <p className="mb-1">
                                <span lang="grc" className="font-serif text-lg">{GREEK_BAROS}</span>
                                <span className="italic ml-2 text-base" lang="en"> (<em>{TRANSLIT_BAROS}</em>)</span>
                            </p>
                            <p className="text-gray-700 text-sm">
                                Galatians 6:2 — a crushing, oppressive burden too heavy to carry alone
                                <sup className="ml-0.5">
                                    <a
                                        href="#fn-da-4"
                                        id="fnref-da-4"
                                        aria-label="Footnote 4"
                                        className="inline-block min-w-[1.5rem] text-center text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                    >
                                        4
                                    </a>
                                </sup>
                            </p>
                        </div>
                        <div className="border-l-4 border-green-300 pl-4 mb-4">
                            <p className="mb-1">
                                <span lang="grc" className="font-serif text-lg">{GREEK_PHORTION}</span>
                                <span className="italic ml-2 text-base" lang="en"> (<em>{TRANSLIT_PHORTION}</em>)</span>
                            </p>
                            <p className="text-gray-700 text-sm">
                                Galatians 6:5 — a personal pack or assigned load; one's own responsibility before God
                                <sup className="ml-0.5">
                                    <a
                                        href="#fn-da-5"
                                        id="fnref-da-5"
                                        aria-label="Footnote 5"
                                        className="inline-block min-w-[1.5rem] text-center text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                    >
                                        5
                                    </a>
                                </sup>
                            </p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                            Paul is not contradicting himself. In 6:1-2 he calls the community to carry what is too
                            heavy for one person; in 6:5 he calls each person to bear their own accountability before
                            God.
                        </p>
                    </div>

                    {/* Footnotes for Detailed Analysis (§6.2 component-specs).
                        Numbered per-section (da-*) to avoid collisions with other sections. */}
                    <aside
                        aria-label="Footnotes for this section"
                        className="mt-8 pt-4 border-t border-stone-200"
                    >
                        <h3 className="sr-only">Footnotes</h3>
                        <ol className="space-y-2 text-sm text-stone-600 list-decimal list-inside">
                            <li id="fn-da-1" tabIndex={-1} className="scroll-mt-4">
                                J.B. Lightfoot, <em>The Epistle of St. Paul to the Galatians</em> (Zondervan), p. 215.
                                {' '}
                                <a
                                    href="#fnref-da-1"
                                    aria-label="Return to reference 1"
                                    className="inline-block min-w-[1.5rem] text-center ml-1 text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                >
                                    ↩
                                </a>
                            </li>
                            <li id="fn-da-2" tabIndex={-1} className="scroll-mt-4">
                                F.F. Bruce, <em>Commentary on Galatians</em>, NIGTC (Eerdmans), p. 260.
                                {' '}
                                <a
                                    href="#fnref-da-2"
                                    aria-label="Return to reference 2"
                                    className="inline-block min-w-[1.5rem] text-center ml-1 text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                >
                                    ↩
                                </a>
                            </li>
                            <li id="fn-da-3" tabIndex={-1} className="scroll-mt-4">
                                G. Kittel (ed.), <em>Theological Dictionary of the New Testament</em>, Vol. VI
                                (Eerdmans), p. 645.
                                {' '}
                                <a
                                    href="#fnref-da-3"
                                    aria-label="Return to reference 3"
                                    className="inline-block min-w-[1.5rem] text-center ml-1 text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                >
                                    ↩
                                </a>
                            </li>
                            <li id="fn-da-4" tabIndex={-1} className="scroll-mt-4">
                                F.F. Bruce, <em>Commentary on Galatians</em>, NIGTC (Eerdmans), p. 263.
                                {' '}
                                <a
                                    href="#fnref-da-4"
                                    aria-label="Return to reference 4"
                                    className="inline-block min-w-[1.5rem] text-center ml-1 text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                >
                                    ↩
                                </a>
                            </li>
                            <li id="fn-da-5" tabIndex={-1} className="scroll-mt-4">
                                John Stott, <em>The Message of Galatians</em> (IVP), p. 159.
                                {' '}
                                <a
                                    href="#fnref-da-5"
                                    aria-label="Return to reference 5"
                                    className="inline-block min-w-[1.5rem] text-center ml-1 text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                >
                                    ↩
                                </a>
                            </li>
                            <li id="fn-da-6" tabIndex={-1} className="scroll-mt-4">
                                Abraham Joshua Heschel, <em>God in Search of Man</em>
                                {' '}(Farrar, Straus and Giroux), p. 375.
                                {' '}
                                <a
                                    href="#fnref-da-6"
                                    aria-label="Return to reference 6"
                                    className="inline-block min-w-[1.5rem] text-center ml-1 text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                >
                                    ↩
                                </a>
                            </li>
                        </ol>
                    </aside>
                </div>
            </section>

            {/* Hebrew Foundations (STORY-ISSUE-011, -013) — new h2 inserted between
                "Detailed Analysis of Galatians 6:1" and "Related Scripture Passages"
                per FR-06.a. Content verbatim from source PRD ISSUE-011 and ISSUE-013
                Required Action / Problem fields. Footnote numbering is per-section
                with the `hf-` prefix (hebrew-foundations counter). */}
            <section
                className="bg-white rounded-lg shadow-md p-4 md:p-8 scroll-mt-4"
                aria-labelledby="hebrew-foundations"
            >
                <div className="flex items-center mb-6">
                    <img src={BibleIcon} alt="" className="w-8 h-8 mr-3" />
                    <h2
                        id="hebrew-foundations"
                        className="text-2xl md:text-3xl font-bold text-stone-800"
                    >
                        Hebrew Foundations
                    </h2>
                </div>

                <div className="space-y-6">
                    {/* STORY-ISSUE-011 — The Hebrew Foundation: Tochacha */}
                    <div>
                        <h3
                            id="tochacha"
                            className="text-xl font-semibold text-stone-800 mb-3 scroll-mt-4"
                        >
                            The Hebrew Foundation: Tochacha (
                            <span lang="he" dir="rtl">{HEBREW_HOCHEACH_TOCHIACH}</span>
                            )
                        </h3>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            Paul, a trained Pharisee (Philippians 3:5), wrote within this framework
                            and his readers would have understood it.
                        </p>

                        <div className="hebrew-block mt-4 mb-6">
                            <blockquote
                                lang="he"
                                dir="rtl"
                                className="border-r-4 border-green-500 pr-6 text-right text-lg md:text-xl text-stone-800 leading-relaxed"
                            >
                                {HEBREW_LEV_19_17}
                            </blockquote>
                            <p className="text-gray-700 leading-relaxed mt-2 text-base">
                                {ENGLISH_LEV_19_17}
                            </p>
                            <p className="text-stone-600 text-sm mt-1">
                                — Leviticus 19:17
                            </p>
                        </div>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            The Hebrew{' '}
                            <span lang="he" dir="rtl" className="mx-1">{HEBREW_HOCHEACH_TOCHIACH}</span>{' '}
                            (<em>{TRANSLIT_HOCHEACH_TOCHIACH}</em>) is an infinitive absolute
                            construction — the doubling of the verb intensifies and obligates the
                            command. The Talmud (<em>Arachin</em> 16b) records rabbinic debate over
                            how many times one must rebuke.
                            <sup className="ml-0.5">
                                <a
                                    href="#fn-hf-1"
                                    id="fnref-hf-1"
                                    aria-label="Footnote 1"
                                    className="inline-block min-w-[1.5rem] text-center text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                >
                                    1
                                </a>
                            </sup>
                            {' '}Maimonides codifies this in <em>Mishneh Torah</em>,{' '}
                            <em>Hilchot De'ot</em> 6:7 — one must rebuke a neighbor who sins,
                            gently and privately, until the person accepts or refuses.
                            <sup className="ml-0.5">
                                <a
                                    href="#fn-hf-2"
                                    id="fnref-hf-2"
                                    aria-label="Footnote 2"
                                    className="inline-block min-w-[1.5rem] text-center text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                >
                                    2
                                </a>
                            </sup>
                        </p>

                        <p className="text-gray-700 leading-relaxed">
                            This is the direct halakhic backdrop against which Paul writes
                            Galatians 6:1. His use of <em>katartizo</em> (restore) is the Greek
                            expression of the Hebrew practice rooted in Torah.
                        </p>
                    </div>

                    {/* STORY-ISSUE-013 — Law of Christ and Leviticus 19:18.
                        Sibling h3 of Tochacha inside Hebrew Foundations h2.
                        Content verbatim from source PRD ISSUE-013 Required Action / Problem. */}
                    <div>
                        <h3
                            id="law-of-christ"
                            className="text-xl font-semibold text-stone-800 mb-3 scroll-mt-4"
                        >
                            Law of Christ and Leviticus 19:18
                        </h3>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            The document identifies the "law of Christ" but Paul himself provides
                            the answer in Galatians 5:14, where he explicitly quotes Leviticus 19:18:
                        </p>

                        <blockquote className="text-gray-700 italic leading-relaxed border-l-4 border-green-500 pl-6 mb-4">
                            "For all the law is fulfilled in one word, even in this: 'You shall
                            love your neighbor as yourself.'"
                            <cite className="block text-green-600 font-semibold mt-2 not-italic text-sm">
                                — Galatians 5:14
                            </cite>
                        </blockquote>

                        <p className="text-gray-700 leading-relaxed mb-4">
                            The Hebrew source is:
                        </p>

                        <div className="hebrew-block mt-4 mb-6">
                            <blockquote
                                lang="he"
                                dir="rtl"
                                className="border-r-4 border-green-500 pr-6 text-right text-lg md:text-xl text-stone-800 leading-relaxed"
                            >
                                {HEBREW_LEV_19_18}
                            </blockquote>
                            <p className="italic text-center text-stone-600 mt-2 text-base" lang="en">
                                <em>{TRANSLIT_LEV_19_18}</em>
                            </p>
                            <p className="text-gray-700 leading-relaxed mt-2 text-base">
                                {ENGLISH_LEV_19_18}
                            </p>
                            <p className="text-stone-600 text-sm mt-1">
                                — Leviticus 19:18
                            </p>
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                            This is not conjecture — it is the textual logic Paul himself
                            establishes in the same letter, one chapter earlier. The "law of
                            Christ" in 6:2 loops back directly to 5:14, which is itself a quotation
                            of Leviticus 19:18.
                        </p>
                    </div>

                    {/* Footnotes for Hebrew Foundations (§6.2 component-specs).
                        Numbered per-section (hf-*) to avoid collisions with other sections. */}
                    <aside
                        aria-label="Footnotes for this section"
                        className="mt-8 pt-4 border-t border-stone-200"
                    >
                        <h3 className="sr-only">Footnotes</h3>
                        <ol className="space-y-2 text-sm text-stone-600 list-decimal list-inside">
                            <li id="fn-hf-1" tabIndex={-1} className="scroll-mt-4">
                                Talmud Bavli, <em>Arachin</em> 16b.
                                {' '}
                                <a
                                    href="#fnref-hf-1"
                                    aria-label="Return to reference 1"
                                    className="inline-block min-w-[1.5rem] text-center ml-1 text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                >
                                    ↩
                                </a>
                            </li>
                            <li id="fn-hf-2" tabIndex={-1} className="scroll-mt-4">
                                Maimonides, <em>Mishneh Torah</em>, <em>Hilchot De'ot</em> 6:7.
                                {' '}
                                <a
                                    href="#fnref-hf-2"
                                    aria-label="Return to reference 2"
                                    className="inline-block min-w-[1.5rem] text-center ml-1 text-green-600 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 rounded"
                                >
                                    ↩
                                </a>
                            </li>
                        </ol>
                    </aside>
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
                                    life and death, spiritually.
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
                            <li>• <a href="https://www.biblegateway.com/passage/?search=Galatians+6%3A1&version=NKJV" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('The Holy Bible, New King James Version', 'https://www.biblegateway.com/passage/?search=Galatians+6%3A1&version=NKJV')} className="text-blue-600 hover:text-blue-800 hover:underline">The Holy Bible, New King James Version</a></li>
                            <li>• <a href="https://www.google.com/search?q=Nestle-Aland+28th+Edition+Greek+New+Testament" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('Greek New Testament (Nestle-Aland 28th Edition)', 'https://www.google.com/search?q=Nestle-Aland+28th+Edition+Greek+New+Testament')} className="text-blue-600 hover:text-blue-800 hover:underline">Greek New Testament (Nestle-Aland 28th Edition)</a></li>
                            <li>• <a href="https://archive.org/details/theologicaldicti0000unse" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('Theological Dictionary of the New Testament (Kittel)', 'https://archive.org/details/theologicaldicti0000unse')} className="text-blue-600 hover:text-blue-800 hover:underline">Theological Dictionary of the New Testament (Kittel)</a></li>
                            <li>• <a href="https://biblehub.com/commentaries/egt/" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick("Expositor's Greek Testament", 'https://biblehub.com/commentaries/egt/')} className="text-blue-600 hover:text-blue-800 hover:underline">Expositor's Greek Testament</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-stone-800 mb-3">Historical Commentaries</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• <a href="https://www.google.com/search?q=John+Chrysostom+Homilies+on+Galatians" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('John Chrysostom - Homilies on Galatians', 'https://www.google.com/search?q=John+Chrysostom+Homilies+on+Galatians')} className="text-blue-600 hover:text-blue-800 hover:underline">John Chrysostom - Homilies on Galatians</a></li>
                            <li>• <a href="https://www.ccel.org/ccel/calvin/calcom41.html" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('John Calvin - Commentary on Galatians', 'https://www.ccel.org/ccel/calvin/calcom41.html')} className="text-blue-600 hover:text-blue-800 hover:underline">John Calvin - Commentary on Galatians</a></li>
                            <li>• <a href="https://www.biblestudytools.com/commentaries/matthew-henry-complete/galatians/6.html" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('Matthew Henry - Commentary on the Whole Bible', 'https://www.biblestudytools.com/commentaries/matthew-henry-complete/galatians/6.html')} className="text-blue-600 hover:text-blue-800 hover:underline">Matthew Henry - Commentary on the Whole Bible</a></li>
                            <li>• <a href="https://www.spurgeon.org/resource-library/sermons/" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('Charles Spurgeon - Sermon Collection', 'https://www.spurgeon.org/resource-library/sermons/')} className="text-blue-600 hover:text-blue-800 hover:underline">Charles Spurgeon - Sermon Collection</a></li>
                            <li>• <a href="https://www.google.com/search?q=Martyn+Lloyd-Jones+Commentary+Galatians" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('Martyn Lloyd-Jones - Commentary on Galatians', 'https://www.google.com/search?q=Martyn+Lloyd-Jones+Commentary+Galatians')} className="text-blue-600 hover:text-blue-800 hover:underline">Martyn Lloyd-Jones - Commentary on Galatians</a></li>
                            <li>• <a href="https://www.ivpress.com/the-message-of-galatians" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('John Stott - The Message of Galatians', 'https://www.ivpress.com/the-message-of-galatians')} className="text-blue-600 hover:text-blue-800 hover:underline">John Stott - The Message of Galatians</a></li>
                            <li>• <a href="https://www.google.com/search?q=F.F.+Bruce+Commentary+on+Galatians+NIGTC" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('F.F. Bruce - Commentary on Galatians', 'https://www.google.com/search?q=F.F.+Bruce+Commentary+on+Galatians+NIGTC')} className="text-blue-600 hover:text-blue-800 hover:underline">F.F. Bruce - Commentary on Galatians</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-stone-800 mb-3">Theological Resources</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• <a href="https://www.crossway.org/books/systematic-theology-tpb/" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('Systematic Theology by Wayne Grudem', 'https://www.crossway.org/books/systematic-theology-tpb/')} className="text-blue-600 hover:text-blue-800 hover:underline">Systematic Theology by Wayne Grudem</a></li>
                            <li>• <a href="https://www.google.com/search?q=New+Bible+Dictionary+IVP" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('The New Bible Dictionary (IVP)', 'https://www.google.com/search?q=New+Bible+Dictionary+IVP')} className="text-blue-600 hover:text-blue-800 hover:underline">The New Bible Dictionary (IVP)</a></li>
                            <li>• <a href="https://www.google.com/search?q=Vine%27s+Expository+Dictionary+of+Biblical+Words" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick("Vine's Expository Dictionary", 'https://www.google.com/search?q=Vine%27s+Expository+Dictionary+of+Biblical+Words')} className="text-blue-600 hover:text-blue-800 hover:underline">Vine's Expository Dictionary</a></li>
                            <li>• <a href="https://www.google.com/search?q=Anchor+Bible+Dictionary+Yale" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('The Anchor Bible Dictionary', 'https://www.google.com/search?q=Anchor+Bible+Dictionary+Yale')} className="text-blue-600 hover:text-blue-800 hover:underline">The Anchor Bible Dictionary</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-stone-800 mb-3">Historical Context</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>• <a href="https://www.zondervan.com/9780310279518/an-introduction-to-the-new-testament/" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('New Testament Introduction by D.A. Carson & Douglas Moo', 'https://www.zondervan.com/9780310279518/an-introduction-to-the-new-testament/')} className="text-blue-600 hover:text-blue-800 hover:underline">New Testament Introduction by D.A. Carson & Douglas Moo</a></li>
                            <li>• <a href="https://www.google.com/search?q=Paul+Apostle+of+the+Heart+Set+Free+F.F.+Bruce" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('Paul: Apostle of the Heart Set Free by F.F. Bruce', 'https://www.google.com/search?q=Paul+Apostle+of+the+Heart+Set+Free+F.F.+Bruce')} className="text-blue-600 hover:text-blue-800 hover:underline">Paul: Apostle of the Heart Set Free by F.F. Bruce</a></li>
                            <li>• <a href="https://www.google.com/search?q=Book+of+Acts+Setting+Hellenistic+History+Colin+Hemer" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('The Book of Acts in the Setting of Hellenistic History by Colin Hemer', 'https://www.google.com/search?q=Book+of+Acts+Setting+Hellenistic+History+Colin+Hemer')} className="text-blue-600 hover:text-blue-800 hover:underline">The Book of Acts in the Setting of Hellenistic History by Colin Hemer</a></li>
                            <li>• <a href="https://www.google.com/search?q=Early+Christian+Doctrines+J.N.D.+Kelly" target="_blank" rel="noopener noreferrer" onClick={() => trackReferenceClick('Early Christian Doctrines by J.N.D. Kelly', 'https://www.google.com/search?q=Early+Christian+Doctrines+J.N.D.+Kelly')} className="text-blue-600 hover:text-blue-800 hover:underline">Early Christian Doctrines by J.N.D. Kelly</a></li>
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
