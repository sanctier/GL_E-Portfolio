// Feedback form functionality

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg = document.getElementById('formError');

  if(!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
      name: form.name.value,
      email: form.email.value,
      category: form.category.value,
      rating: form.rating.value,
      message: form.message.value,
      timestamp: new Date().toISOString()
    };

    // Hide any previous messages
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    try {
      // In a real implementation, you would send this to a backend API
      // For now, we'll simulate a successful submission
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Log to console (in production, this would be sent to a server)
      console.log('Feedback submitted:', formData);

      // Show success message
      successMsg.style.display = 'block';
      form.style.display = 'none';

      // Optional: Store in localStorage for demonstration
      const existingFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
      existingFeedback.push(formData);
      localStorage.setItem('feedback', JSON.stringify(existingFeedback));

      // Reset form after 3 seconds and show it again
      setTimeout(() => {
        form.reset();
        successMsg.style.display = 'none';
        form.style.display = 'block';
      }, 5000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      errorMsg.style.display = 'block';
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        errorMsg.style.display = 'none';
      }, 5000);
    }
  });

  // Add form validation feedback
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('invalid', (e) => {
      e.preventDefault();
      input.style.borderColor = '#ef4444';
    });

    input.addEventListener('input', () => {
      input.style.borderColor = '#e5e7eb';
    });
  });
});
