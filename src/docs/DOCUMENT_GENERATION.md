
# Server-Side Document Generation

This document outlines how to implement proper server-side document generation using `python-docxtpl` in a production environment.

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

### 2. Set Up Python Backend

```python
from flask import Flask, request, send_file
from docxtpl import DocxTemplate
from io import BytesIO
import json

app = Flask(__name__)

@app.route('/api/generate-document', methods=['POST'])
def generate_document():
    # Get data from request
    data = request.json
    template_name = data.get('templateName')
    form_data = data.get('data')
    
    # Select template based on template_name
    if template_name == 'form1':
        template_path = 'templates/form1_template.docx'
    elif template_name == 'patent-draft':
        template_path = 'templates/patent_draft_template.docx'
    else:
        return {'error': 'Invalid template name'}, 400
    
    # Load the template
    doc = DocxTemplate(template_path)
    
    # Render the template with the data
    doc.render(form_data)
    
    # Save to BytesIO object
    output = BytesIO()
    doc.save(output)
    output.seek(0)
    
    # Generate filename
    filename = f"{template_name}-{form_data.get('applicant_name', 'document')}.docx"
    
    # Return the document
    return send_file(
        output,
        as_attachment=True,
        download_name=filename,
        mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )

if __name__ == '__main__':
    app.run(debug=True)
```

### 3. Update Frontend to Call API

Update the `documentService.ts` file to make actual API calls to your server:

```typescript
export async function processTemplate(templateName: string, data: ApplicantData): Promise<Blob> {
  try {
    const response = await fetch('/api/generate-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateName, data })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
}
```

## Template Examples

### Form 1 Template

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
```

### Patent Draft Template

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
```

## Deployment Considerations

1. Ensure your server has proper security measures to protect sensitive patent information
2. Implement proper error handling and logging
3. Consider adding authentication and rate limiting to your API endpoints
4. Set up monitoring to track document generation performance

For more information, refer to the python-docxtpl documentation: https://docxtpl.readthedocs.io/
