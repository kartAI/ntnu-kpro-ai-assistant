from src.types import PropertyIdentifiers
from src.services.agent import find_property_identifiers


def test_all_variables_present():
    strings = [
        "This is a test string with gnr: 123 and bnr: 456.",
        "Another string with snr: 789.",
    ]
    expected_output = PropertyIdentifiers(gnr=123, bnr=456, snr=789)
    assert find_property_identifiers(strings) == expected_output


def test_no_variables_present():
    strings = [
        "This is a test string without variables.",
        "Another string without any relevant data.",
    ]
    expected_output = PropertyIdentifiers()
    assert find_property_identifiers(strings) == expected_output


def test_some_variables_present():
    strings = ["This string has gnr: 321.", "This one has bnr: 654."]
    expected_output = PropertyIdentifiers(gnr=321, bnr=654)
    assert find_property_identifiers(strings) == expected_output


def test_variables_in_different_formats():
    strings = ["Gnr=111, Bnr=222, Snr=333.", "Variables: gnr is 444 and snr is 555."]
    expected_output = PropertyIdentifiers(gnr=444, bnr=222, snr=555)
    assert find_property_identifiers(strings) == expected_output


def test_duplicate_variables():
    strings = ["gnr: 101, bnr: 202", "gnr: 303, snr: 404"]
    expected_output = PropertyIdentifiers(gnr=303, bnr=202, snr=404)
    assert find_property_identifiers(strings) == expected_output


def test_read_entire_file():
    strings = [
        "Adresse:\n  Adresselinje 1: Adresseveien 123\n  Postnummer: 9999\n  Poststed: KommuneNavn\n\nEiendomsidentifikasjon:\n  Kommunenummer: 9999\n  Kommunenavn: KommuneNavn\n  Gårdsnummer: 99\n  Bruksnummer: 9\n  Festenummer: 0\n  Seksjonsnummer: 0\n\nBeskrivelse av tiltak:\n  Beskrivelse: Bruksendring fra bod til bad/vaskerom\nProsjekttype:\n  Kode: bruksendringhoveddel\n  Beskrivelse: Bruksendring fra tilleggsdel til hoveddel\n\nTiltakshaver:\n  Partstype: Privatperson\nPrivatperson:\n  Navn: PRIVATPERSON PERSONESEN\n  Telefonnummer: 99999999\n  Epost: TestEpost@norkartepost.no\n\nDispensasjoner:\nDispensasjon 1:\n  Dispensasjonstype ikke tilgjengelig.\n  Begrunnelse: N/A\n  Beskrivelse: N/A\n\nInfo om varslinger:\n  Antall merknader: 1\n  Fritatt fra nabovarsling: Nei\n  Vurdering av merknader: Ombygning går ut på bruksendring fra bod til bad/vaskerom. da dette krever andre vinduer ifb med krav til oppholdsrom vil det bli en fasadeendring med større vinduer bak huset og endret oppsett av vinduer foran huset ved inngang, samt fjerning av dør inn til bod.\n\nRammebetingelser:\n  Adkomst:\n    Nye/Endret adkomst: Nei\n    Vegrett:\n      Kode: \n      Beskrivelse: \n    Er tillatelse gitt: Nei\n\n  Plan:\n    Gjeldende plan:\n      Plantype:\n        Kode: RP\n        Beskrivelse: Reguleringsplan\n      Navn: uksodden, planid: 11\n\n  Avløp:\n    Tilknytningstype:\n      Kode: \n      Beskrivelse: \n\n  Krav til byggegrunn:\n    Flomutsatt område: Nei\n    Skredutsatt område: Nei\n    Miljøforhold: Nei\n\n  Plassering:\n    Konflikt høyspentkraftlinje: Nei\n    Minste avstand nabogrense: 5\n    Minste avstand til annen bygning: 4.5\n    Bekreftet innenfor byggegrense: Nei\n\n"
    ]
    expected_output = PropertyIdentifiers(bnr=9, gnr=99, snr=0)
    assert find_property_identifiers(strings) == expected_output
