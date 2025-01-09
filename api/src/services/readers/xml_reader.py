from fastapi import UploadFile
from src.services.reader import Reader
from lxml import etree


class XmlReader(Reader):

    def read(self, uploadFile: UploadFile) -> str:
        file = uploadFile.file

        tree = etree.parse(file)
        root = tree.getroot()

        # Need to use namespaces, if not, the find() method will not work
        namespaces = root.nsmap

        # Small workaround, default namespace has None as key, set it to ns
        if None in namespaces:
            namespaces["ns"] = namespaces.pop(None)

        res = ""

        property_element = root.find("ns:eiendomByggested/ns:eiendom", namespaces)
        if property_element is not None:
            address_element = property_element.find("ns:adresse", namespaces)
            if address_element is not None:
                res += "Adresse:\n"
                address_line1 = address_element.findtext(
                    "ns:adresselinje1", default="N/A", namespaces=namespaces
                )
                res += "  Adresselinje 1: " + address_line1 + "\n"
                postnr = address_element.findtext(
                    "ns:postnr", default="N/A", namespaces=namespaces
                )
                res += "  Postnummer: " + postnr + "\n"
                poststed = address_element.findtext(
                    "ns:poststed", default="N/A", namespaces=namespaces
                )
                res += "  Poststed: " + poststed + "\n"
                res += "\n"
            else:
                res += "Adresseinformasjon ikke tilgjengelig.\n\n"

            property_identification_element = property_element.find(
                "ns:eiendomsidentifikasjon", namespaces
            )
            if property_identification_element is not None:
                res += "Eiendomsidentifikasjon:\n"
                kommunenummer = property_identification_element.findtext(
                    "ns:kommunenummer", default="N/A", namespaces=namespaces
                )
                res += "  Kommunenummer: " + kommunenummer + "\n"
                kommune = property_element.findtext(
                    "ns:kommunenavn", default="N/A", namespaces=namespaces
                )
                res += "  Kommunenavn: " + kommune + "\n"
                gaardsnummer = property_identification_element.findtext(
                    "ns:gaardsnummer", default="N/A", namespaces=namespaces
                )
                res += "  Gårdsnummer: " + gaardsnummer + "\n"
                bruksnummer = property_identification_element.findtext(
                    "ns:bruksnummer", default="N/A", namespaces=namespaces
                )
                res += "  Bruksnummer: " + bruksnummer + "\n"
                festenummer = property_identification_element.findtext(
                    "ns:festenummer", default="N/A", namespaces=namespaces
                )
                res += "  Festenummer: " + festenummer + "\n"
                seksjonsnummer = property_identification_element.findtext(
                    "ns:seksjonsnummer", default="N/A", namespaces=namespaces
                )
                res += "  Seksjonsnummer: " + seksjonsnummer + "\n"
                res += "\n"
            else:
                res += "Eiendomsidentifikasjon ikke tilgjengelig.\n\n"
        else:
            res += "Eiendomsinformasjon ikke tilgjengelig.\n\n"

        project_description_element = root.find("ns:beskrivelseAvTiltak", namespaces)
        if project_description_element is not None:
            res += "Beskrivelse av tiltak:\n"
            cover_letter_text = project_description_element.findtext(
                "ns:foelgebrev", default="N/A", namespaces=namespaces
            )
            res += "  Beskrivelse: " + cover_letter_text + "\n"
            project_type_element = project_description_element.find(
                "ns:type/ns:type", namespaces
            )
            if project_type_element is not None:
                res += "Prosjekttype:\n"
                project_type_code = project_type_element.findtext(
                    "ns:kodeverdi", default="N/A", namespaces=namespaces
                )
                res += "  Kode: " + project_type_code + "\n"
                project_type_description = project_type_element.findtext(
                    "ns:kodebeskrivelse", default="N/A", namespaces=namespaces
                )
                res += "  Beskrivelse: " + project_type_description + "\n"
            else:
                res += "Prosjekttype ikke tilgjengelig.\n"
            res += "\n"
        else:
            res += "Beskrivelse av tiltak ikke tilgjengelig.\n\n"

        developer_element = root.find("ns:tiltakshaver", namespaces)
        if developer_element is not None:
            res += "Tiltakshaver:\n"
            developer_party_role_element = developer_element.find(
                "ns:partstype", namespaces
            )
            if developer_party_role_element is not None:
                party_role_code = developer_party_role_element.findtext(
                    "ns:kodeverdi", default="N/A", namespaces=namespaces
                )
                party_role_description = developer_party_role_element.findtext(
                    "ns:kodebeskrivelse", default="N/A", namespaces=namespaces
                )
                res += "  Partstype: " + party_role_description + "\n"
            else:
                party_role_code = "N/A"
                res += "Partstype ikke tilgjengelig.\n"

            if party_role_code != "Privatperson":
                res += "Organisasjon:\n"
                developer_organization_number = developer_element.findtext(
                    "ns:organisasjonsnummer", default="N/A", namespaces=namespaces
                )
                res += "  Organisasjonsnummer: " + developer_organization_number + "\n"
                contact_person_element = developer_element.find(
                    "ns:kontaktperson", namespaces
                )
                if contact_person_element is not None:
                    res += "  Kontaktperson:\n"
                    contact_name = contact_person_element.findtext(
                        "ns:navn", default="N/A", namespaces=namespaces
                    )
                    res += "    Navn: " + contact_name + "\n"
                    contact_phone = contact_person_element.findtext(
                        "ns:telefonnummer", default="N/A", namespaces=namespaces
                    )
                    res += "    Telefonnummer: " + contact_phone + "\n"
                    contact_email = contact_person_element.findtext(
                        "ns:epost", default="N/A", namespaces=namespaces
                    )
                    res += "    Epost: " + contact_email + "\n"
                else:
                    res += "  Kontaktperson ikke tilgjengelig.\n"
            else:
                res += "Privatperson:\n"
                developer_name = developer_element.findtext(
                    "ns:navn", default="N/A", namespaces=namespaces
                )
                res += "  Navn: " + developer_name + "\n"
                developer_phone = developer_element.findtext(
                    "ns:telefonnummer", default="N/A", namespaces=namespaces
                )
                res += "  Telefonnummer: " + developer_phone + "\n"
                developer_email = developer_element.findtext(
                    "ns:epost", default="N/A", namespaces=namespaces
                )
                res += "  Epost: " + developer_email + "\n"
            res += "\n"
        else:
            res += "Tiltakshaver ikke tilgjengelig.\n\n"

        dispensation_elements = root.findall("ns:dispensasjon", namespaces)
        if dispensation_elements:
            res += "Dispensasjoner:\n"
            for i, dispensation_element in enumerate(dispensation_elements):
                res += f"Dispensasjon {i+1}:\n"
                dispensation_type_element = dispensation_element.find(
                    "ns:type", namespaces
                )
                if dispensation_type_element is not None:
                    dispensation_type_code = dispensation_type_element.findtext(
                        "ns:kodeverdi", default="N/A", namespaces=namespaces
                    )
                    dispensation_type_description = dispensation_type_element.findtext(
                        "ns:kodebeskrivelse", default="N/A", namespaces=namespaces
                    )
                    res += "  Dispensasjonstype:\n"
                    res += "    Kode: " + dispensation_type_code + "\n"
                    res += "    Beskrivelse: " + dispensation_type_description + "\n"
                else:
                    res += "  Dispensasjonstype ikke tilgjengelig.\n"
                dispensation_reason = dispensation_element.findtext(
                    "ns:begrunnelse", default="N/A", namespaces=namespaces
                )
                res += "  Begrunnelse: " + dispensation_reason + "\n"
                dispensation_description = dispensation_element.findtext(
                    "ns:beskrivelse", default="N/A", namespaces=namespaces
                )
                res += "  Beskrivelse: " + dispensation_description + "\n"
                res += "\n"
        else:
            res += "Ingen dispensasjoner funnet.\n\n"

        notification_element = root.find("ns:varsling", namespaces)
        if notification_element is not None:
            res += "Info om varslinger:\n"
            number_of_notes_text = notification_element.findtext(
                "ns:antallMerknader", default="0", namespaces=namespaces
            )
            try:
                number_of_notes = int(number_of_notes_text)
            except ValueError:
                number_of_notes = 0
            res += "  Antall merknader: " + str(number_of_notes) + "\n"
            exempt_from_notification_text = notification_element.findtext(
                "ns:fritattFraNabovarsling", default="false", namespaces=namespaces
            )
            res += (
                "  Fritatt fra nabovarsling: "
                + ("Ja" if exempt_from_notification_text.lower() == "true" else "Nei")
                + "\n"
            )
            if number_of_notes > 0:
                evaluation_of_notes = notification_element.findtext(
                    "ns:vurderingAvMerknader",
                    default="Ingen vurdering",
                    namespaces=namespaces,
                )
                res += "  Vurdering av merknader: " + evaluation_of_notes + "\n"
            res += "\n"
        else:
            res += "Varslingsinformasjon ikke tilgjengelig.\n\n"

        boundary_conditions_element = root.find("ns:rammebetingelser", namespaces)
        if boundary_conditions_element is not None:
            res += "Rammebetingelser:\n"
            adkomst_element = boundary_conditions_element.find("ns:adkomst", namespaces)
            if adkomst_element is not None:
                res += "  Adkomst:\n"
                new_access_text = adkomst_element.findtext(
                    "ns:nyeEndretAdkomst", default="false", namespaces=namespaces
                )
                res += (
                    "    Nye/Endret adkomst: "
                    + ("Ja" if new_access_text.lower() == "true" else "Nei")
                    + "\n"
                )
                vegrett_element = adkomst_element.find(
                    "ns:vegrett/ns:vegrett", namespaces
                )
                if vegrett_element is not None:
                    access_type_element = vegrett_element.find("ns:vegtype", namespaces)
                    if access_type_element is not None:
                        access_type_code = access_type_element.findtext(
                            "ns:kodeverdi", default="N/A", namespaces=namespaces
                        )
                        access_type_description = access_type_element.findtext(
                            "ns:kodebeskrivelse", default="N/A", namespaces=namespaces
                        )
                        res += "    Vegrett:\n"
                        res += "      Kode: " + access_type_code + "\n"
                        res += "      Beskrivelse: " + access_type_description + "\n"
                    else:
                        res += "    Vegtype ikke tilgjengelig.\n"
                    permission_granted_text = vegrett_element.findtext(
                        "ns:erTillatelseGitt", default="false", namespaces=namespaces
                    )
                    res += (
                        "    Er tillatelse gitt: "
                        + ("Ja" if permission_granted_text.lower() == "true" else "Nei")
                        + "\n"
                    )
                else:
                    res += "    Vegrett ikke tilgjengelig.\n"
                res += "\n"
            else:
                res += "  Adkomst ikke tilgjengelig.\n\n"

            plan_element = boundary_conditions_element.find("ns:plan", namespaces)
            if plan_element is not None:
                res += "  Plan:\n"
                current_plan_element = plan_element.find("ns:gjeldendePlan", namespaces)
                if current_plan_element is not None:
                    res += "    Gjeldende plan:\n"
                    plan_type_element = current_plan_element.find(
                        "ns:plantype", namespaces
                    )
                    if plan_type_element is not None:
                        plan_type_code = plan_type_element.findtext(
                            "ns:kodeverdi", default="N/A", namespaces=namespaces
                        )
                        plan_type_description = plan_type_element.findtext(
                            "ns:kodebeskrivelse", default="N/A", namespaces=namespaces
                        )
                        res += "      Plantype:\n"
                        res += "        Kode: " + plan_type_code + "\n"
                        res += "        Beskrivelse: " + plan_type_description + "\n"
                    else:
                        res += "      Plantype ikke tilgjengelig.\n"
                    plan_name = current_plan_element.findtext(
                        "ns:navn", default="N/A", namespaces=namespaces
                    )
                    res += "      Navn: " + plan_name + "\n"
                    res += "\n"
                else:
                    res += "    Gjeldende plan ikke tilgjengelig.\n"
            else:
                res += "  Plan ikke tilgjengelig.\n\n"

            sewage_element = boundary_conditions_element.find("ns:avloep", namespaces)
            if sewage_element is not None:
                res += "  Avløp:\n"
                connection_type_element = sewage_element.find(
                    "ns:tilknytningstype", namespaces
                )
                if connection_type_element is not None:
                    connection_type_code = connection_type_element.findtext(
                        "ns:kodeverdi", default="N/A", namespaces=namespaces
                    )
                    connection_type_description = connection_type_element.findtext(
                        "ns:kodebeskrivelse", default="N/A", namespaces=namespaces
                    )
                    res += "    Tilknytningstype:\n"
                    res += "      Kode: " + connection_type_code + "\n"
                    res += "      Beskrivelse: " + connection_type_description + "\n"
                else:
                    res += "    Tilknytningstype ikke tilgjengelig.\n"
                res += "\n"
            else:
                res += "  Avløp ikke tilgjengelig.\n\n"

            build_ground_element = boundary_conditions_element.find(
                "ns:kravTilByggegrunn", namespaces
            )
            if build_ground_element is not None:
                res += "  Krav til byggegrunn:\n"
                flood_area_text = build_ground_element.findtext(
                    "ns:flomutsattOmraade", default="false", namespaces=namespaces
                )
                res += (
                    "    Flomutsatt område: "
                    + ("Ja" if flood_area_text.lower() == "true" else "Nei")
                    + "\n"
                )
                landslide_area_text = build_ground_element.findtext(
                    "ns:skredutsattOmraade", default="false", namespaces=namespaces
                )
                res += (
                    "    Skredutsatt område: "
                    + ("Ja" if landslide_area_text.lower() == "true" else "Nei")
                    + "\n"
                )
                environmental_conditions_text = build_ground_element.findtext(
                    "ns:miljoeforhold", default="false", namespaces=namespaces
                )
                res += (
                    "    Miljøforhold: "
                    + (
                        "Ja"
                        if environmental_conditions_text.lower() == "true"
                        else "Nei"
                    )
                    + "\n"
                )
                res += "\n"
            else:
                res += "  Krav til byggegrunn ikke tilgjengelig.\n\n"

            placement_element = boundary_conditions_element.find(
                "ns:plassering", namespaces
            )
            if placement_element is not None:
                res += "  Plassering:\n"
                conflict_power_line_text = placement_element.findtext(
                    "ns:konfliktHoeyspentkraftlinje",
                    default="false",
                    namespaces=namespaces,
                )
                res += (
                    "    Konflikt høyspentkraftlinje: "
                    + ("Ja" if conflict_power_line_text.lower() == "true" else "Nei")
                    + "\n"
                )
                min_distance_boundary = placement_element.findtext(
                    "ns:minsteAvstandNabogrense", default="N/A", namespaces=namespaces
                )
                res += "    Minste avstand nabogrense: " + min_distance_boundary + "\n"
                min_distance_building = placement_element.findtext(
                    "ns:minsteAvstandTilAnnenBygning",
                    default="N/A",
                    namespaces=namespaces,
                )
                res += (
                    "    Minste avstand til annen bygning: "
                    + min_distance_building
                    + "\n"
                )
                confirmed_within_building_limit_text = placement_element.findtext(
                    "ns:bekreftetInnenforByggegrense",
                    default="false",
                    namespaces=namespaces,
                )
                res += (
                    "    Bekreftet innenfor byggegrense: "
                    + (
                        "Ja"
                        if confirmed_within_building_limit_text.lower() == "true"
                        else "Nei"
                    )
                    + "\n"
                )
                res += "\n"
            else:
                res += "  Plassering ikke tilgjengelig.\n\n"
        else:
            res += "Rammebetingelser ikke tilgjengelig.\n"

        return res
