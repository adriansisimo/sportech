const form = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });
      if (response.ok) {
        formMessage.textContent = "¡Gracias! Tu mensaje fue enviado correctamente.";
        formMessage.style.display = "block";
        form.reset();
      } else {
        formMessage.textContent = "Hubo un error, intenta de nuevo.";
        formMessage.style.display = "block";
      }
    } catch (error) {
      formMessage.textContent = "Hubo un error de conexión.";
      formMessage.style.display = "block";
    }
  });