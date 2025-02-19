export default function Explore() {
  return `
    <div class="container">
        <div class="form-section">
            <h2>Get in touch.</h2>
            <form id="contactForm">
                <div class="form-group">
                    <label for="firstName">First Name:</label>
                    <input type="text" id="firstName" name="firstName" required>
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name:</label>
                    <input type="text" id="lastName" name="lastName" required>
                </div>
                <div class="form-group">
                    <label for="email">Email Address:</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="message">Message:</label>
                    <textarea id="message" name="message" rows="4" required></textarea>
                </div>
                <button type="submit" class="submit-btn">Submit</button>
            </form>
        </div>
        <div class="illustration-section">
            <img src="/images/paperfly.png" alt="Paper Airplane">
            <img src="/images/white-f.jpg" alt="Cute Cats" width="20px">
        </div>
    </div>`;
}
