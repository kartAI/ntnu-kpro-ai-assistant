import type { ReactElement } from "react";

export interface ShortcutLink {
    header: string;
    subgroups: {
        arrow: boolean;
        title: string;
        links: {
            label: string;
            url: string;
        }[];
    }[];
    pages?: string[];
    icon?: ReactElement;
}

const shortcuts: ShortcutLink[] = [
    {
        header: 'Skal du bygge?',
        subgroups: [
            {
                title: "Aktuelle KI-assistenter",
                arrow: true,
                links: [
                    { label: 'CADAiD', url: '/for-soknad/cadaid' },
                    { label: 'ArkivGPT', url: '/for-soknad/arkivgpt' },
                    { label: 'Planprat', url: '/for-soknad/planprat' },
                    { label: 'Søknadsinformasjon', url: '/for-soknad/soknadsinfo' },
                    { label: 'DOK-analyse', url: '/for-soknad/dok-analyse' },
                    { label: 'Tiltakskart', url: '/for-soknad/tiltakskart' },
                    { label: '3D-situasjonsmodell', url: '/for-soknad/3d-situasjon' },
                    { label: 'Saken oppsummert', url: '/for-soknad/oppsummering' },
                    
                ],
            },
            {
                title: "Mer informasjon?",
                arrow: false,
                links: [
                    { label: 'Min side', url: '/for-soknad/byggeideer/dashbord'},
                    { label: 'Kontakt kommunen', url: 'https://www.kristiansand.kommune.no/'},
                    { label: 'eByggesøk', url: 'https://www.kristiansand.kommune.no/'},
                    { label: 'Direktoratet for byggekvalitet', url: 'https://www.kristiansand.kommune.no/'},
                ]
            }
        ]
    },
    {
        header: 'Send inn en byggesøknad',
        subgroups: [
            {
                title: "Aktuelle KI-assistenter",
                arrow: true,
                links: [
                    { label: 'CADAiD', url: '/under-soknad/cadaid' },
                    { label: 'ArkivGPT', url: '/under-soknad/arkivgpt' },
                    { label: 'Planprat', url: '/under-soknad/planprat' },
                    { label: 'Søknadsinformasjon', url: '/under-soknad/soknadsinfo' },
                    { label: 'DOK-analyse', url: '/under-soknad/dok-analyse' },
                    { label: 'Tiltakskart', url: '/under-soknad/tiltakskart' },
                    { label: '3D-situasjonsmodell', url: '/under-soknad/3d-situasjon' },
                    { label: 'Saken oppsummert', url: '/under-soknad/oppsummering' },
                ],
            },
            {
                title: "Mer informasjon?",
                arrow: false,
                links: [
                    { label: 'Kundestøtte', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'},
                    { label: 'Kontakt kommunen', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'},
                    { label: 'eByggesøk', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'},
                    { label: 'Direktoratet for byggekvalitet', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'},
                ]
            }
        ]
    },
    {
        header: 'KS-eByggesak',
        subgroups: [
            {
                title: "Mine saker",
                arrow: true,
                links: [
                    { label: 'Se mine saker', url: '/mottak/mine-saker' },
                    { label: 'Saksarkiv', url: '/mottak/arkiv' },
                ],
            }
        ]
    },
    // Add more sections as needed...
];

export default shortcuts;
