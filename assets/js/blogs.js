function mostrarModal() {
    // Obtener los valores de los campos
    const nombre = document.getElementById("inputNombre").value.trim();
    const testimonio = document.getElementById("inputTestimonio").value.trim();
  
    // Validar que los campos no estén vacíos
    if (!nombre || !testimonio) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    // Mostrar el modal con los datos
    const modal = document.getElementById("modal");
    const modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = `<strong>Nombre:</strong> ${nombre}<br><strong>Testimonio:</strong> ${testimonio}`;
    modal.style.display = "flex";
  }
  
  function cerrarModal() {
    // Cerrar el modal
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  }
  
  function declinarTestimonio() {
    // Cerrar el modal sin agregar el testimonio
    cerrarModal();
  }
  
  function agregarTestimonio() {
    // Obtener los valores de los campos
    const nombre = document.getElementById("inputNombre").value.trim();
    const testimonio = document.getElementById("inputTestimonio").value.trim();
  
    // Crear un nuevo contenedor para el testimonio
    const contenedorTestimonio = document.createElement("div");
    contenedorTestimonio.classList.add("testimonio");
  
    // Obtener la fecha actual
    const fecha = new Date();
    const fechaFormateada = fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  
    // Agregar contenido al contenedor
    contenedorTestimonio.innerHTML = `
      <h3>${nombre}</h3>
      <small>${fechaFormateada}</small>
      <p>${testimonio}</p>
    `;
  
    // Agregar el nuevo testimonio al contenedor principal (al inicio)
    const testimonios = document.getElementById("testimonios");
    testimonios.prepend(contenedorTestimonio);
  
    // Limpiar los campos de entrada
    document.getElementById("inputNombre").value = "";
    document.getElementById("inputTestimonio").value = "";
  
    // Cerrar el modal
    cerrarModal();
  }