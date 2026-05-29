(function() {
  // Find the script tag to get the appId
  const scriptTag = document.getElementById('gg-lead-form-script');
  if (!scriptTag) {
    console.error('GG Lead Form: Script tag with id="gg-lead-form-script" not found.');
    return;
  }

  const appId = scriptTag.getAttribute('data-app-id');
  if (!appId) {
    console.error('GG Lead Form: data-app-id attribute is missing.');
    return;
  }

  // Find the container to inject the form
  const container = document.getElementById('gg-lead-container');
  if (!container) {
    console.error('GG Lead Form: Container div with id="gg-lead-container" not found.');
    return;
  }

  // Define host URL (can be customized if serving from somewhere else)
  const hostUrl = scriptTag.src ? new URL(scriptTag.src).origin : 'https://goinggenius.com.np';

  // Inject CSS
  const style = document.createElement('style');
  style.innerHTML = `
    .gg-form-wrapper {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 400px;
      margin: 0 auto;
      background: #ffffff;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid #eaeaea;
    }
    .gg-form-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 16px;
      color: #111827;
    }
    .gg-form-group {
      margin-bottom: 16px;
    }
    .gg-form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 6px;
      color: #374151;
    }
    .gg-form-input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.95rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .gg-form-input:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }
    .gg-form-button {
      width: 100%;
      padding: 12px;
      background: #f59e0b;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .gg-form-button:hover {
      background: #d97706;
    }
    .gg-form-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .gg-form-message {
      margin-top: 16px;
      padding: 12px;
      border-radius: 6px;
      font-size: 0.875rem;
      display: none;
    }
    .gg-form-success {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .gg-form-error {
      background: #fef2f2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
    .gg-form-watermark {
      text-align: center;
      margin-top: 12px;
      font-size: 0.75rem;
      color: #9ca3af;
    }
    .gg-form-watermark a {
      color: #6b7280;
      text-decoration: none;
    }
    .gg-form-watermark a:hover {
      text-decoration: underline;
    }
  `;
  document.head.appendChild(style);

  // Inject Form HTML
  container.innerHTML = `
    <div class="gg-form-wrapper">
      <h3 class="gg-form-title">Contact Us</h3>
      <form id="gg-lead-submission-form">
        <div class="gg-form-group">
          <label class="gg-form-label" for="gg-name">Name</label>
          <input type="text" id="gg-name" class="gg-form-input" placeholder="John Doe" required />
        </div>
        <div class="gg-form-group">
          <label class="gg-form-label" for="gg-email">Email</label>
          <input type="email" id="gg-email" class="gg-form-input" placeholder="john@example.com" required />
        </div>
        <div class="gg-form-group">
          <label class="gg-form-label" for="gg-phone">Phone (Optional)</label>
          <input type="tel" id="gg-phone" class="gg-form-input" placeholder="+1 234 567 8900" />
        </div>
        <button type="submit" id="gg-submit-btn" class="gg-form-button">Submit</button>
        <div id="gg-message-box" class="gg-form-message"></div>
      </form>
      <div class="gg-form-watermark">
        Powered by <a href="${hostUrl}" target="_blank">Going Genius CRM</a>
      </div>
    </div>
  `;

  // Handle Form Submission
  const form = document.getElementById('gg-lead-submission-form');
  const btn = document.getElementById('gg-submit-btn');
  const msgBox = document.getElementById('gg-message-box');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('gg-name').value;
    const email = document.getElementById('gg-email').value;
    const phone = document.getElementById('gg-phone').value;

    btn.disabled = true;
    btn.textContent = 'Submitting...';
    msgBox.style.display = 'none';

    try {
      const response = await fetch(\`\${hostUrl}/api/v1/leads\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId,
          name,
          email,
          phone,
          source: 'Website Embed'
        })
      });

      const data = await response.json();

      if (response.ok) {
        form.reset();
        msgBox.className = 'gg-form-message gg-form-success';
        msgBox.textContent = 'Thanks! Your submission has been received.';
        msgBox.style.display = 'block';
      } else {
        throw new Error(data.error || 'Something went wrong.');
      }
    } catch (err) {
      msgBox.className = 'gg-form-message gg-form-error';
      msgBox.textContent = err.message;
      msgBox.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Submit';
    }
  });

})();
