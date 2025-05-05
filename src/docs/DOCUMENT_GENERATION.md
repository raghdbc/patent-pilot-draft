
# Server-Side Document Generation

This document provides a comprehensive guide on implementing server-side document generation using `python-docxtpl` in a production environment.

## Overview

The current implementation in this project simulates document generation on the client side. In a production environment, you would implement a server-side API endpoint that:

1. Receives the form data from the client
2. Uses templates with placeholders like `{{ applicant_name }}` 
3. Processes these templates with python-docxtpl
4. Returns the generated document to the client

## Implementation Steps

### 1. Create Document Templates

Create Word document templates (.docx) with placeholders using the Jinja2 syntax:

- `{{ applicant_name }}`
- `{{ title_of_invention }}`
- `{{ filing_date }}`
- etc.

Store these templates in a dedicated directory on your server.

### 2. Set Up Python Backend

#### Installation Requirements

Create a `requirements.txt` file with the following dependencies:

```
flask==2.0.1
python-docx-template==0.15.2
flask-cors==3.0.10
gunicorn==20.1.0
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

#### Server Implementation

Create an `app.py` file:

```python
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from docxtpl import DocxTemplate
from io import BytesIO
import os
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define template directory
TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')

@app.route('/api/generate-document', methods=['POST'])
def generate_document():
    try:
        # Get data from request
        data = request.json
        template_name = data.get('templateName')
        form_data = data.get('data')
        
        logger.info(f"Generating document: {template_name}")
        logger.info(f"With data: {json.dumps(form_data, indent=2)}")
        
        # Select template based on template_name
        if template_name == 'form1':
            template_path = os.path.join(TEMPLATE_DIR, 'form1_template.docx')
        elif template_name == 'patent-draft':
            template_path = os.path.join(TEMPLATE_DIR, 'patent_draft_template.docx')
        else:
            return jsonify({'error': f'Invalid template name: {template_name}'}), 400
        
        # Check if template exists
        if not os.path.exists(template_path):
            return jsonify({'error': f'Template not found: {template_path}'}), 404
        
        # Load the template
        doc = DocxTemplate(template_path)
        
        # Render the template with the data
        doc.render(form_data)
        
        # Save to BytesIO object
        output = BytesIO()
        doc.save(output)
        output.seek(0)
        
        # Generate filename
        filename = f"{template_name}-{form_data.get('applicant_name', 'document').replace(' ', '_')}.docx"
        
        # Return the document
        return send_file(
            output,
            as_attachment=True,
            download_name=filename,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    
    except Exception as e:
        logger.error(f"Error generating document: {str(e)}", exc_info=True)
        return jsonify({'error': f'Failed to generate document: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'document-generation-api'})

if __name__ == '__main__':
    # Create template directory if it doesn't exist
    os.makedirs(TEMPLATE_DIR, exist_ok=True)
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
```

### 3. Docker Setup (Optional but Recommended)

Create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create template directory
RUN mkdir -p templates

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

Create a `.dockerignore` file:

```
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.git/
.gitignore
```

### 4. Template Examples

#### Form 1 Template Structure

Your Form 1 template should be a .docx file with placeholders like:

```
THE PATENTS ACT, 1970
(39 OF 1970)

APPLICATION FOR GRANT OF PATENT
[See Section 7, 54 & 135 and Rule 20 (1)]

1. TITLE OF INVENTION: {{ title_of_invention }}

2. APPLICANT DETAILS:
   Name: {{ applicant_name }}
   Address: {{ applicant_address }}
   Nationality: {{ applicant_nationality }}
   Category: {{ applicant_category }}
   
3. INVENTOR DETAILS:
   Name: {{ inventor_name }}
   Address: {{ inventor_address }}
   Nationality: {{ inventor_nationality }}
   
4. APPLICATION DETAILS:
   Type: {{ application_type }}
   Number: {{ application_no }}
   Filing Date: {{ filing_date }}
   Fee Paid: {{ fee_paid }}
   CBR No: {{ cbr_no }}
```

#### Patent Draft Template Structure

```
PATENT SPECIFICATION

TITLE: {{ title_of_invention }}

APPLICANT:
{{ applicant_name }}
{{ applicant_address }}

INVENTORS:
{{ inventor_name }}
{{ inventor_address }}

ABSTRACT:
{{ abstract }}

BACKGROUND:
{{ background }}

DETAILED DESCRIPTION:
{{ description }}

CLAIMS:
{{ claims }}

FIELD OF INVENTION:
{{ invention_field }}

PRIOR ART:
{{ prior_art }}

PROBLEM ADDRESSED:
{{ problem_addressed }}

PROPOSED SOLUTION:
{{ proposed_solution }}

ADVANTAGES:
{{ advantages }}
```

### 5. Update Frontend to Call API

Update the `documentService.ts` file to make actual API calls to your server:

```typescript
import { ApplicantData } from '@/utils/applicantSchema';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function processTemplate(templateName: string, data: ApplicantData): Promise<Blob> {
  try {
    const response = await fetch(`${API_URL}/generate-document`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateName, data })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
}
```

## Deployment Considerations

### Server Deployment Options

1. **Heroku**:
   - Create a `Procfile` with `web: gunicorn app:app`
   - Deploy with Heroku CLI or GitHub integration

2. **AWS Elastic Beanstalk**:
   - Use the Docker configuration
   - Set environment variables in the AWS console

3. **Google Cloud Run**:
   - Build and deploy the Docker container
   - Set memory and CPU allocation as needed

### Security Best Practices

1. **API Authentication**:
   - Implement JWT authentication for API endpoints
   - Use environment variables for secret keys

2. **CORS Configuration**:
   - Restrict CORS to only your frontend domain in production
   - Example: `CORS(app, origins=["https://yourdomain.com"])`

3. **Rate Limiting**:
   - Implement rate limiting to prevent abuse
   - Flask-Limiter is a good option for this purpose

4. **Secure Headers**:
   - Add security headers using Flask-Talisman
   - Implement Content-Security-Policy

5. **Document Storage**:
   - Don't store sensitive documents on the server filesystem
   - Use temporary storage or cloud storage solutions

### Monitoring and Logging

1. **Logging**:
   - Set up comprehensive logging with rotation
   - Consider using a service like Sentry or Datadog

2. **Performance Monitoring**:
   - Monitor response times and error rates
   - Set up alerts for abnormal behavior

3. **Health Checks**:
   - Implement a `/health` endpoint (already included)
   - Configure your cloud provider to use this endpoint

For more information, refer to:
- python-docxtpl documentation: https://docxtpl.readthedocs.io/
- Flask documentation: https://flask.palletsprojects.com/
- Docker documentation: https://docs.docker.com/

## Testing the API

To test your API locally:

1. Start the Flask server:
   ```bash
   python app.py
   ```

2. Send a test request with curl:
   ```bash
   curl -X POST http://localhost:5000/api/generate-document \
     -H "Content-Type: application/json" \
     -d '{"templateName":"form1","data":{"applicant_name":"John Doe","title_of_invention":"Test Invention"}}'
   ```

This should return a Word document with the placeholders replaced by the provided values.
