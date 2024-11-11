import type { ReactElement } from "react";

export interface ShortcutLink {
    header: string;
    subgroups: {
        arrow: boolean;
        title: string;
        links: {
            label: string;
            url: string;
            text?: string;
        }[];
    }[];
    pages?: string[];
    icon?: ReactElement;
}

const shortcuts: ShortcutLink[] = [
    {
        header: 'Før du skal søke',
        subgroups: [
            {
                title: "Aktuelle KI-assistenter",
                arrow: true,
                links: [
                    { label: 'CADAiD', url: '/for-soknad/cadaid', text: "Verifiser plantegningene dine" },
                    { label: 'ArkivGPT', url: '/for-soknad/arkivgpt', text: "Snakk med byggesaksarkivet" },
                    { label: 'Planchat', url: '/for-soknad/planprat', text: "Få oversikt over hva du har lov å gjøre med denne chatbotten" },
                    { label: 'Tiltakskart', url: '/for-soknad/tiltakskart', text: "Se tiltakene rundt deg"},
                    { label: '3D-situasjonsmodell', url: '/for-soknad/3d-situasjon', text: "Se ditt tiltak i 3D kart" },
                    { label: 'Min byggeidé', url: '/for-soknad/byggeideer/dashbord', text: "Organiser informasjonen rundt din byggesøknad" },
                ],
            },
            {
                title: "Mer informasjon?",
                arrow: false,
                links: [
                    { label: 'Kundestøtte', url: '/ekstern/kundestøtte'},
                    { label: 'Kontakt kommunen', url: '/ekstern/kontakt'},
                    { label: 'eByggesøk', url: '/ekstern/eByggesøk'},
                    { label: 'Direktoratet for byggekvalitet', url: '/ekstern/Direktoratet for byggekvalitet'},
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
                    { label: 'CADAiD', url: '/under-soknad/cadaid', text: "Verifiser plantegningene dine" },
                    { label: 'ArkivGPT', url: '/under-soknad/arkivgpt', text: "Snakk med byggesaksarkivet" },
                    { label: 'Planchat', url: '/under-soknad/planprat', text: "Få oversikt over hva du har lov å gjøre med denne chatbotten"},
                    { label: 'Søknadsinformasjon', url: '/for-soknad/soknadsinfo', text: "Se detaljert analyse av, og informasjon rundt, din byggesøknad" },
                    { label: 'Tiltakskart', url: '/under-soknad/tiltakskart', text: "Se tiltakene rundt deg" },
                    { label: '3D-situasjonsmodell', url: '/under-soknad/3d-situasjon', text: "Se ditt tiltak i 3D kart" },
                    { label: 'Min byggeidé', url: '/under-soknad/byggeideer/dashbord', text: "Organiser informasjonen rundt din byggesøknad" },
                ],
            },
            {
                title: "Mer informasjon?",
                arrow: false,
                links: [
                    { label: 'Kundestøtte', url: '/ekstern/kundestøtte'},
                    { label: 'Kontakt kommunen', url: '/ekstern/kontakt'},
                    { label: 'eByggesøk', url: '/ekstern/eByggesøk'},
                    { label: 'Direktoratet for byggekvalitet', url: '/ekstern/Direktoratet for byggekvalitet'},
                ]
            }
        ]
    },
    {
        header: 'eByggesak',
        subgroups: [
            {
                title: "Mine saker",
                arrow: true,
                links: [
                    { label: 'Se mine saker', url: '/mottak/mine-saker', text: 'Se sakene du skal "behandle"' },
                    { label: 'Saksarkiv', url: 'https://www.kristiansand.kommune.no/navigasjon/bolig-kart-og-eiendom/plan-og-bygg/byggesak/byggesaksarkiv/', text: "Se saksarkivet til Kristiandsand kommune" },
                ],
            }
        ]
    },
    // Add more sections as needed...
];

export default shortcuts;
