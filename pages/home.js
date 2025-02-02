export default function home() {
   
    return `<main class="hero container">
           <div class="hero-content">
             <h1 class="hero-text">
               Looking for a <span>good</span> time?
             </h1>
             <p>
               Lorem ipsum dolor sit amet consectetur. Enim viverra quis egestas
               usi ullamcorper ut ante.
               <br />
               Eu pretium lemiro ispum dolor amet vivata tarimo ullamcorper ut
             </p>

             <div class="cta-buttons">
               <a href="#" class="adopt-now">
                 adopt now
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
                 </svg>
               </a>
               <a href="#" class="watch-video">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
                   <path d="M8 5v14l11-7z" />
                 </svg>
                 Watch Video
               </a>
             </div>
           </div>

           <div class="hero-images">
             <div class="blob blob-1"></div>
             <div class="blob blob-2"></div>
             <img
               src="/images/white-cat.png"
               alt="Cat illustration"
               class="cat1-image"
             />
             <img
               src="/images/black-cat.png"
               alt="Cat illustration"
               class="cat2-image"
             />
           </div>
         </main>`;
}
