import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)


@pytest.fixture
def get_test_file():
    def _get_test_file(filename):
        return open(f"tests/files/{filename}", "rb")
    return _get_test_file


@pytest.mark.parametrize(
    "filename,mime_type,status_code",
    [
        ("unstructured.pdf", "application/pdf", 200),
        ("structured.pdf", "application/pdf", 200),
        ("application.xml", "application/xml", 200),
        ("invalid.txt", "application/txt", 400),
        ("error_trigger.pdf", "application/pdf", 200),
        ("structured.pdf", "application/pdf", 200),
        ("unstructured.pdf", "application/pdf", 200),
        ("empty.pdf", "application/pdf", 400),
        ("large.pdf", "application/pdf", 200),
        ("corrupted.pdf", "application/pdf", 400),
    ]
)
def test_summarize_various_inputs(filename: str, mime_type: str, status_code: int, get_test_file) -> None:
    """
    Test summarization with various valid input files.
    """
    with get_test_file(filename) as file:
        response = client.post(
            "/summarize",
            files={"file": (filename, file, mime_type)},
        )
    assert response.status_code == status_code
    data = response.json()
    if status_code == 200:
        assert "summary" in data
    else:
        assert "detail" in data


def test_integration_with_additional_modules(get_test_file):
    """
    Test summarization including additional modules like CAD-AiD and ArkivGPT.
    """
    with get_test_file("structured.pdf") as file:
        response = client.post(
            "/summarize?include_modules=true",
            files={"file": ("structured.pdf", file, "application/pdf")},
        )
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "cad_aid_summary" in data
    assert "arkivgpt_summary" in data


def test_missing_file():
    """
    Test handling when no file is provided in the request.
    """
    response = client.post("/summarize")
    assert response.status_code == 400


def test_multiple_files(get_test_file):
    """
    Test handling when multiple files are provided in the request.
    """
    with get_test_file("structured.pdf") as file1, get_test_file("application.xml") as file2:
        response = client.post(
            "/summarize",
            files={
                "file": [("structured.pdf", file1, "application/pdf"), ("application.xml", file2, "application/xml")]
            },
        )
    assert response.status_code == 400


def test_unsupported_media_type(get_test_file):
    """
    Test handling when an unsupported media type is sent.
    """
    with get_test_file("structured.pdf") as file:
        response = client.post(
            "/summarize",
            headers={"Content-Type": "image/jpeg"},
            data=file.read(),
        )
    assert response.status_code == 415  # Unsupported Media Type
