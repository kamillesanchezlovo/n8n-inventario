const WEBHOOK_LOGIN = "https://n8n.ideemllc.com/webhook/login-inventario";

const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const codigo = document.getElementById("codigo").value.trim();

    if (!codigo) {
      alert("Ingresa un codigo.");
      return;
    }

    try {
      const res = await fetch(WEBHOOK_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigo }),
      });

      if (!res.ok) {
        alert("No se pudo validar el codigo. Intenta de nuevo.");
        return;
      }

      const data = await res.json();
      console.log("LOGIN_RESPONSE:", data);

      const isSuccess = data.success ?? data.valid ?? data.ok ?? false;
      const isActive = data.active ?? true;

      console.log("LOGIN_SUCCESS:", isSuccess);
      console.log("LOGIN_ACTIVE:", isActive);

      if (!isSuccess) {
        alert("Codigo invalido");
        return;
      }

      if (!isActive) {
        alert("Usuario inactivo.");
        return;
      }

      const session = {
        token: data.token,
        usuario: data.usuario,
        exp: Date.now() + 60 * 60 * 1000,
      };

      localStorage.setItem("session", JSON.stringify(session));

      const savedSession = JSON.parse(localStorage.getItem("session"));
      const sessionSuccess = Boolean(savedSession && savedSession.token);
      console.log("SESSION_SUCCESS:", sessionSuccess, savedSession);

      window.location.href = "inventario.html";
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error de conexion con el servidor.");
    }
  });
}
