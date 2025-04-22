document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const loadingSpinner = document.getElementById('loading');
    const submitButton = document.getElementById('submitButton');
    
    // Google Apps Script URL - REPLACE THIS with your deployed Google Apps Script Web App URL
    const scriptURL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading spinner, hide submit button
            loadingSpinner.style.display = 'block';
            submitButton.disabled = true;
            
            // Clear previous status messages
            formStatus.textContent = '';
            formStatus.className = 'form-status';
            
            // Collect form data
            const formData = new FormData(contactForm);
            
            // Add timestamp
            formData.append('timestamp', new Date().toISOString());
            
            // Send form data to Google Sheet
            fetch(scriptURL, { method: 'POST', body: formData })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Success message
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    formStatus.classList.add('success');
                    
                    // Reset the form
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    
                    // Error message
                    formStatus.textContent = 'Sorry, there was a problem submitting your form. Please try again or contact us directly.';
                    formStatus.classList.add('error');
                })
                .finally(() => {
                    // Hide loading spinner, re-enable submit button
                    loadingSpinner.style.display = 'none';
                    submitButton.disabled = false;
                });
        });
    }
});