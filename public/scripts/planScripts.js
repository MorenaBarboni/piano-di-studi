//Svuota il form e disabilita i campi al cambio dei permessi utente
function resetForm() {
  var typeField = document.getElementById("usertype");

  document.getElementById("name").value = "";
  document.getElementById("city").value = "";
  document.getElementById("street").value = "";
  document.getElementById("postalCode").value = "";
  document.getElementById("tel").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("mat").value = "";
  document.getElementById("degree").value = "";

   if (typeField.value === "admin") {
    document.getElementById("mat").disabled = true;
    document.getElementById("degree").disabled = true;
  } else if (typeField.value === "docente") {
    document.getElementById("mat").disabled = true;
  } else {
    document.getElementById("degree").disabled = false;
    document.getElementById("mat").disabled = false;
  }
}
