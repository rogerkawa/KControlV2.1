import app from "../api/api.js";

export default function navbar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const logo = document.querySelector(".logo-mark");
  const toggleBtn = document.getElementById("toggleBtn");
  const mobileToggle = document.getElementById("mobileToggle");
  const navItems = document.querySelectorAll(".nav-item");
  const topbarTitle = document.getElementById("topbarTitle");
  const pageHeading = document.getElementById("pageHeading");
  const user = document.getElementById('user-name')
  const role = document.getElementById('user-role')

/*   async function verifyUser() {
        const token = localStorage.getItem('token')

    // Não possui token
    if (!token) {
        window.location.href = '../index.html'
        return
    }
    try {

        const result = await app.findUserAuthenticator()

        const user =  await result.user

        user.innerText = user.email
        role.innerText = user.role

    } catch (error) {

        console.error(error)
        console.error("ERRO NO DASHBOARD:", error)

        // Token inválido ou expirado
        localStorage.removeItem('token')
        window.location.href = 'login.html'
    }
  }
  verifyUser() */


  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    logo.classList.toggle("desativado");
  });

  function closeMobile() {
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("show");
  }

  function openMobile() {
    sidebar.classList.add("mobile-open");
    overlay.classList.add("show");
  }

  navItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();

      navItems.forEach((link) => link.classList.remove("active"));
      item.classList.add("active");

      const page = item.dataset.page;

      topbarTitle.textContent = page;

      if (pageHeading) {
        pageHeading.textContent = page;
      }

      closeMobile();
    });
  });

  mobileToggle.addEventListener("click", openMobile);
  overlay.addEventListener("click", closeMobile);
}
