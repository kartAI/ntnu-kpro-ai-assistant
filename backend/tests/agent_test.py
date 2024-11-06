from src.types import PropertyIdentifiers
from src.services.agent import find_property_identifiers


def test_all_variables_present():
    strings = [
        "This is a test string with gnr: 123 and bnr: 456.",
        "Another string with snr: 789."
    ]
    expected_output = PropertyIdentifiers(gnr=123, bnr=456, snr=789)
    assert find_property_identifiers(strings) == expected_output

def test_no_variables_present():
    strings = [
        "This is a test string without variables.",
        "Another string without any relevant data."
    ]
    expected_output = PropertyIdentifiers()
    assert find_property_identifiers(strings) == expected_output

def test_some_variables_present():
    strings = [
        "This string has gnr: 321.",
        "This one has bnr: 654."
    ]
    expected_output = PropertyIdentifiers(gnr=321, bnr=654)
    assert find_property_identifiers(strings) == expected_output

def test_variables_in_different_formats():
    strings = [
        "Gnr=111, Bnr=222, Snr=333.",
        "Variables: gnr is 444 and snr is 555."
    ]
    expected_output = PropertyIdentifiers(gnr=444, bnr=222, snr=555)
    assert find_property_identifiers(strings) == expected_output

def test_duplicate_variables():
    strings = [
        "gnr: 101, bnr: 202",
        "gnr: 303, snr: 404"
    ]
    expected_output = PropertyIdentifiers(gnr=303, bnr=202, snr=404)
    assert find_property_identifiers(strings) == expected_output

def test_invalid_variable_values():
    strings = [
        "gnr: abc, bnr: 123",
        "snr: xyz"
    ]
    expected_output = PropertyIdentifiers(bnr=123)
    assert find_property_identifiers(strings) == expected_output
