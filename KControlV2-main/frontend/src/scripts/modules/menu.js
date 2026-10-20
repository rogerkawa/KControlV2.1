

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

const profileButton = document.querySelector("#profileButton");
const profileMenu = document.querySelector("#profileMenu");


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



/* Menu de opções */
profileButton.addEventListener("click", (event) => {
    event.stopPropagation();

    const aberto = profileMenu.classList.toggle("active");

    profileButton.setAttribute("aria-expanded", aberto);
});
/* Fechar quando clicar fora */
document.addEventListener("click", (event) => {
    if (!profileMenu.contains(event.target) &&
        !profileButton.contains(event.target)) {

        profileMenu.classList.remove("active");

        profileButton.setAttribute("aria-expanded", "false");
    }
});

  mobileToggle.addEventListener("click", openMobile);
  overlay.addEventListener("click", closeMobile);
}
