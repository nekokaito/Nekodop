export default function Contact() {
  return ` <div class="contact-container">
      <section class="form-section">
        <div class="logo">
          <span class="logo-text">Contact</span>
        </div>

        <form>
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input type="text" id="firstName" required />
            </div>
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input type="text" id="lastName" required />
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" required />
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" required></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
      </section>

      <section class="content-section">
<div class="content">
          <div class="illustration">
            <div class="paper-plane-wrapper">
              <div class="plane">
                <div class="trail">
                  <img
                    class="paper-plane paper-plane-img"
                    src="/images/paperfly.png"
                    alt="Paper Plane"
                  />
                </div>
              </div>
            </div>
           
          </div>
        </div>
      </section>
    </div>`;
}
