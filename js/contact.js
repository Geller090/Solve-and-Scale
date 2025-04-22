document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const loadingSpinner = document.getElementById('loading');
    const submitButton = document.getElementById('submitButton');
    const hiddenIframe = document.getElementById('hidden-iframe');
    
    if (contactForm && hiddenIframe) {
        // Handle form submission
        contactForm.addEventListener('submit', function(e) {
            // Show loading spinner, hide submit button
            loadingSpinner.style.display = 'block';
            submitButton.disabled = true;
            
            // Clear previous status messages
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        });
        
        // Handle iframe load event (form response)
        hiddenIframe.addEventListener('load', function() {
            // Success message
            formStatus.textContent = 'Thank you! Your message has been sent successfully.';
            formStatus.classList.add('success');
            
            // Reset the form
            contactForm.reset();
            
            // Hide loading spinner, re-enable submit button
            loadingSpinner.style.display = 'none';
            submitButton.disabled = false;
        });
    }
});