async function logout() {
    const session = JSON.parse(localStorage.getItem("session"));

    if (!session || !session.token) {
        localStorage.removeItem("session");
        window.location.href = "index.html";
        return;
    }

    try {
        await fetch("https://n8n.ideemllc.com/webhook/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: session.token,
            }),
        });
    } catch (error) {
        console.error("Error cerrando sesión:", error);
    }

    localStorage.removeItem("session");
    window.location.href = "index.html";
}

function validarSesion() {
    const session = JSON.parse(localStorage.getItem("session"));

    if (!session || !session.token) {
        localStorage.removeItem("session");
        window.location.href = "index.html";
        return false;
    }

    if (Date.now() > session.exp) {
        localStorage.removeItem("session");
        window.location.href = "index.html";
        return false;
    }

    return true;
}

const WEBHOOK_INVENTARIO = "https://n8n.ideemllc.com/webhook/inventario-listar";

async function cargarInventario() {
    const session = JSON.parse(localStorage.getItem("session"));

    const tbody = document.getElementById("inventarioTableBody");

    tbody.innerHTML = "<tr><td colspan='9'>Cargando...</td></tr>";

    try {
        const res = await fetch(WEBHOOK_INVENTARIO, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: session.token,
            }),
        });

        const data = await res.json();

        tbody.innerHTML = "";

        data.forEach(item => {
            const row = `
        <tr>
          <td>${item.nombre}</td>
          <td>${item.tipo}</td>
          <td>${item.descripcion}</td>
          <td>${item.color}</td>
          <td>${item.unidad}</td>
          <td>${item.cantidad}</td>
          <td>${item.cantidad_unitaria}</td>
          <td>${item.gondola}</td>
          <td>${item.observaciones}</td>
        </tr>
      `;
            tbody.innerHTML += row;
        });

    } catch (error) {
        console.error(error);
        tbody.innerHTML = "<tr><td colspan='9'>Error cargando datos</td></tr>";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const okLocal = validarSesion();
    if (!okLocal) return;

    cargarInventario();
});