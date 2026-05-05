/**
 * Issue #58 slice A — NAP byte-equality regression contract (FR-05).
 *
 * Asserts that the schema-side tuple
 *     `${streetAddress} ${postalCode}` (+ ` ${telephone}` if present)
 * matches the surface-side tuple extracted from each of:
 *   - Footer.tsx
 *   - LocationPage.tsx (named export `Location`)
 *   - AboutPage.tsx (named export `About`)
 *
 * Both sides are normalized via the §13.5 normalize() function (NFC,
 * collapse whitespace, strip commas, trim) before comparison.
 *
 * FR-05.5 (name advisory) and FR-05.6 (Missouri/MO advisory) emit
 * console.warn but do NOT fail the test. Telephone strand is
 * conditional on schema.telephone being present and non-empty.
 *
 * No new runtime dependencies (NFR-07).
 */

// Note: this file is kept as `.test.ts` (no JSX) — TSX files trigger CRA's
// TypeScript+JSX pipeline. We do `React.createElement` calls directly
// instead of JSX so the file remains plain `.ts`.

import * as React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
    normalize,
    extractNAPFromElement,
    buildNAPTuple,
    NAP,
} from '../utils/extractNAP';

// Mock assets BEFORE any component import (component files import these).
jest.mock('../assets', () => ({
    WebsiteIcon: 'website-icon.png',
    CopyrightIcon: 'copyright-icon.png',
    QuickLinksIcon: 'quicklinks-icon.png',
    VisitIcon: 'visit-icon.png',
    FooterBorder: 'footer-border.png',
    FacebookIcon: 'facebook-icon.png',
    AddressIcon: 'address-icon.png',
    MapMarkerIcon: 'map-marker-icon.png',
    DirectionsIcon: 'directions-icon.png',
    CarIcon: 'car-icon.png',
    TimelineIcon: 'timeline-icon.png',
    ChurchIcon: 'church-icon.png',
    PastorIcon: 'pastor-icon.png',
    ValuesIcon: 'values-icon.png',
    HistoryIcon: 'history-icon.png',
    LeadershipIcon: 'leadership-icon.png',
    HistoryScrollIcon: 'history-scroll-icon.png',
    ExternalLinkIcon: 'external-link-icon.png',
}));

// Mock analytics — components call tracking on mount/handlers; we don't
// want network or telemetry in the test runtime.
jest.mock('../utils/analytics', () => ({
    trackNavClick: jest.fn(),
    trackSocialClick: jest.fn(),
    trackLocationView: jest.fn(),
    trackDirectionsClick: jest.fn(),
    trackCtaClick: jest.fn(),
    trackAboutView: jest.fn(),
}));

// Mock usePageMeta to avoid <title> mutation noise.
jest.mock('../hooks/usePageMeta', () => ({
    usePageMeta: jest.fn(),
}));

// Imports AFTER mocks are registered. Jest requires `jest.mock()` calls to
// run before the modules under test are imported, which is enforced by
// hoisting in babel-plugin-jest-hoist for `jest.mock` only — `import`
// statements that depend on the mocks must come after. ESLint's
// `import/first` doesn't recognize this pattern, so disable per-line.
/* eslint-disable import/first */
import Footer from '../components/layout/Footer/Footer';
import { Location } from '../pages/LocationPage/LocationPage';
import { About } from '../pages/AboutPage/AboutPage';
/* eslint-enable import/first */

const INDEX_HTML_PATH = path.resolve(
    __dirname,
    '..',
    '..',
    'public',
    'index.html'
);

type SchemaNAP = {
    streetAddress: string;
    postalCode: string;
    telephone: string | null;
    name: string;
    addressRegion: string;
};

function readSchemaNAP(): SchemaNAP {
    const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
    const m = html.match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
    );
    if (!m) throw new Error('No JSON-LD script found in index.html');
    const parsed = JSON.parse(m[1]);
    return {
        streetAddress: parsed.address.streetAddress,
        postalCode: parsed.address.postalCode,
        telephone:
            typeof parsed.telephone === 'string' && parsed.telephone.length > 0
                ? parsed.telephone
                : null,
        name: parsed.name,
        addressRegion: parsed.address.addressRegion,
    };
}

function buildSchemaTuple(s: SchemaNAP): string {
    const parts = [s.streetAddress, s.postalCode];
    if (s.telephone) parts.push(s.telephone);
    return parts.join(' ');
}

describe('NAP byte-equality (FR-05)', () => {
    let schema: SchemaNAP;
    let warnSpy: jest.SpyInstance;

    beforeAll(() => {
        schema = readSchemaNAP();
    });

    beforeEach(() => {
        warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    function renderInRouter(node: React.ReactElement) {
        return render(
            React.createElement(MemoryRouter, null, node)
        );
    }

    function assertSurfaceMatchesSchema(
        surfaceName: string,
        nap: NAP,
        rawTextForAdvisories: string
    ) {
        // AC-6: telephone strand is conditional. If schema has no telephone,
        // we drop telephone from BOTH tuples.
        const surfaceForCompare: NAP = {
            street: nap.street,
            postalCode: nap.postalCode,
            telephone: schema.telephone ? nap.telephone : null,
        };
        const surfaceTuple = buildNAPTuple(surfaceForCompare);
        const schemaTuple = buildSchemaTuple(schema);

        const a = normalize(surfaceTuple);
        const b = normalize(schemaTuple);

        if (a !== b) {
            // AC-4: print both normalized strings on mismatch.
            // eslint-disable-next-line no-console
            console.error(
                `[FR-05 mismatch on ${surfaceName}]\n  surface: "${a}"\n  schema:  "${b}"`
            );
        }
        expect(a).toBe(b);

        // FR-05.5 advisory: schema.name not appearing verbatim in surface text.
        if (!rawTextForAdvisories.includes(schema.name)) {
            // eslint-disable-next-line no-console
            console.warn(
                `[FR-05.5 advisory] schema name "${schema.name}" does not appear verbatim in ${surfaceName} rendered text (non-blocking).`
            );
        }

        // FR-05.6 advisory: Missouri / MO drift, both directions.
        const stateMap: Record<string, string> = { Missouri: 'MO', MO: 'Missouri' };
        const expectedAlt = stateMap[schema.addressRegion];
        if (
            expectedAlt &&
            rawTextForAdvisories.includes(expectedAlt) &&
            !rawTextForAdvisories.includes(schema.addressRegion)
        ) {
            // eslint-disable-next-line no-console
            console.warn(
                `[FR-05.6 advisory] ${surfaceName} renders state as "${expectedAlt}" but schema is "${schema.addressRegion}" (non-blocking).`
            );
        }
    }

    const surfaces: Array<[string, React.ComponentType<any>]> = [
        ['Footer', Footer],
        ['LocationPage', Location],
        ['AboutPage', About],
    ];

    test.each(surfaces)('%s renders street + postalCode that byte-match schema', (name, Component) => {
        const { container } = renderInRouter(React.createElement(Component));
        const nap = extractNAPFromElement(container);
        const text = container.textContent ?? '';
        assertSurfaceMatchesSchema(name, nap, text);
    });
});
