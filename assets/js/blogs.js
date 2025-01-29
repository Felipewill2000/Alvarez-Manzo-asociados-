
function agregarTestimonio() {
    let input = document.getElementById("inputTestimonio");
    let testimonios = document.getElementById("testimonios");
    
    if (input.value.trim() !== "") {
        let nuevoTestimonio = document.createElement("p");
        nuevoTestimonio.textContent = input.value;
        testimonios.appendChild(nuevoTestimonio);
        input.value = "";
    }
}
