import os
import xml.etree.ElementTree as ET
import base64
import mysql.connector
from datetime import datetime
from dotenv import load_dotenv

def read_file_content(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
        # print("Raw file content:")  # Debugging line
        # print(repr(content))  # Use repr to see whitespace and special characters
        return content

def extract_info_from_xml(main_form_path):
    # Read and print file content for debugging
    main_form_content = read_file_content(main_form_path)

    # Remove the "MainForm:" label and the "SubForm:" label, and strip leading/trailing whitespace
    main_form_content = "\n".join(main_form_content.splitlines()[1:]).strip()
    subform_content = ""

    # Split content into main form and sub form based on "SubForm:" label
    if "SubForm:" in main_form_content:
        main_form_content, subform_content = main_form_content.split("SubForm:", 1)
        main_form_content = main_form_content.strip()  # Strip any extra whitespace
        subform_content = subform_content.strip()  # Strip any extra whitespace

    # Define the namespace
    namespace = {"ns": "http://skjema.kxml.no/dibk/tiltakutenansvarsrett/3.0"}

    # Parse the MainForm XML
    try:
        main_tree = ET.ElementTree(ET.fromstring(main_form_content))
        main_root = main_tree.getroot()

        # Extract the address for the application
        address = main_root.find('.//ns:adresse/ns:adresselinje1', namespace)
        if address is not None:
            address_text = address.text
        else:
            address_text = "Address not found"

        # Extract the municipality (kommune)
        municipality = main_root.find('.//ns:kommunenavn', namespace)
        if municipality is not None:
            municipality_text = municipality.text
        else:
            municipality_text = "Municipality not found"

        # Fake submission date for demonstration
        submission_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        application_id = save_application_to_prisma(address_text, municipality_text, submission_date)
        save_document_to_prisma(main_form_path, application_id)
        
        print("For Application")
        print(f"Submission date: {submission_date}")
        print(f"Address for the application: {address_text}")
        print(f"Municipality (kommune): {municipality_text}")

    except ET.ParseError as e:
        print(f"Error parsing MainForm in {main_form_path}: {e}")

def process_all_xml_files(folder_path):
    # Iterate through all XML files in the specified folder
    for file_name in os.listdir(folder_path):
        if file_name.endswith('.xml'):
            file_path = os.path.join(folder_path, file_name)
            print()
            print(f"Processing file: {file_path}")
            extract_info_from_xml(file_path)
            
def get_database_connection():
    # Extract database connection parameters from DATABASE_URL
    load_dotenv(dotenv_path='.env')
    db_url = os.getenv("DATABASE_URL")
    if db_url:
        # Parse the URL
        import re
        match = re.match(r"mysql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)", db_url)
        if match:
            user, password, host, port, database = match.groups()
            # Create a database connection
            connection = mysql.connector.connect(
                user=user,
                password=password,
                host=host,
                port=port,
                database=database
            )
            return connection
    return None

def save_application_to_prisma(address, municipality, submission_date):
    connection = get_database_connection()
    if connection:
        try:
            cursor = connection.cursor()

            # SQL Insert statement
            sql = """
            INSERT INTO Application (address, municipality, submissionDate, status)
            VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (address, municipality, submission_date, "NEW"))

            # Commit the transaction
            connection.commit()

            # Get the generated application ID
            application_id = cursor.lastrowid
            
            print("Data saved successfully.")
            print("Generated application ID:", application_id)

            return application_id  # Return the application ID
            
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            connection.close()
    else:
        print("Failed to connect to the database.")
    
    return None

def save_document_to_prisma(path, applicationID):
    connection = get_database_connection()
    if connection:
        # Read the document file and encode it in base64
        try:
            with open(path, 'rb') as file:
                document_content = file.read()
                # Encode the content to base64
                encoded_document = base64.b64encode(document_content).decode('utf-8')  # Convert to string

        except FileNotFoundError:
            print(f"File not found: {path}")
            return
        except Exception as e:
            print(f"An error occurred while reading the file: {e}")
            return

        # Prepare the data for the SQL insert
        sql = """
        INSERT INTO Document (type, document, applicationID)
        VALUES (%s, %s, %s)
        """
        
        try:
            cursor = connection.cursor()
            cursor.execute(sql, ("XML", encoded_document, applicationID))

            # Commit the transaction
            connection.commit()

            print("Document data saved successfully.")
        except mysql.connector.Error as err:
            print(f"Error: {err}")
        finally:
            cursor.close()
            connection.close()
    else:
        print("Failed to connect to the database.")

def __main__():
    # File paths (adjust the paths as necessary)
    folder_path = 'src/app/data/byggesak_xml'
    process_all_xml_files(folder_path)
    
if __name__ == "__main__":
    __main__()