document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('call-form');
  const responseContainer = document.getElementById('response-container');
  const responseText = document.getElementById('response');
  const callButton = document.getElementById('call-button');

  callButton.addEventListener('click', async () => {
      const formData = new FormData(form);

      try {
          const response = await fetch('/call', {
              method: 'POST',
              body: formData,
          });

          if (response.ok) {
              const data = await response.text();
              responseContainer.style.display = 'block';
              responseText.textContent = data;
          } else {
              responseContainer.style.display = 'block';
              responseText.textContent = 'Error: Something went wrong with the POST request.';
          }
      } catch (error) {
          responseContainer.style.display = 'block';
          responseText.textContent = 'Error: ' + error.message;
      }
  });
});
