<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Cotizador de Autos</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
  <script src="inventario.js"></script>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: #fff;
      max-width: 700px;
      width: 100%;
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    h1 {
      text-align: center;
      color: #1a237e;
    }
    label {
      font-weight: 600;
      display: block;
      margin-top: 15px;
    }
    input {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      margin-top: 5px;
      border: 2px solid #ccc;
      border-radius: 8px;
    }
    button {
      width: 100%;
      padding: 15px;
      margin-top: 20px;
      font-size: 18px;
      font-weight: bold;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      background-color: #1a237e;
      color: white;
    }
    #btnDescargar {
      background-color: #43a047;
      margin-top: 10px;
    }
    .resultado {
      display: none;
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 15px;
      margin-top: 30px;
    }
    table {
      width: 100%;
      margin-top: 15px;
      border-collapse: collapse;
    }
    th, td {
      padding: 10px;
      text-align: center;
      border: 1px solid #ccc;
    }
  </style>
</head>
<body>
<div class="container">
  <h1>Cotizador de Autos</h1>

  <label>Número de inventario</label>
  <input id="inventario" placeholder="Ej: C118">

  <label>Marca</label>
  <input id="marca">

  <label>Modelo</label>
  <input id="modelo">

  <label>Año</label>
  <input id="anio" type="number">

  <label>Precio</label>
  <input id="precio" type="number">

  <label>Enganche (editable)</label>
  <input id="enganche" type="number">

  <button onclick="calcular()">Calcular cotización</button>
  <button id="btnDescargar" style="display:none">Descargar imagen</button>

  <div class="resultado" id="resultado"></div>
</div>

<script>
document.getElementById("inventario").addEventListener("change", () => {
  const codigo = document.getElementById("inventario").value.trim();
  const auto = inventario[codigo];
  if (auto) {
    document.getElementById("marca").value = auto.marca || "";
    document.getElementById("modelo").value = auto.modelo || "";
    document.getElementById("anio").value = auto.año || "";
    document.getElementById("precio").value = auto.precio || "";
    document.getElementById("enganche").value = Math.round(auto.precio * 0.25);
  }
});

function calcular() {
  const marca = document.getElementById("marca").value;
  const modelo = document.getElementById("modelo").value;
  const anio = document.getElementById("anio").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const enganche = parseFloat(document.getElementById("enganche").value);
  const resultado = document.getElementById("resultado");

  if (!marca || !modelo || !anio || isNaN(precio) || isNaN(enganche)) {
    resultado.innerHTML = '<p style="color:red">Por favor llena todos los campos correctamente.</p>';
    resultado.style.display = "block";
    return;
  }

  const monto = precio - enganche;
  const plazos = [12, 24, 36, 48, 60];
  let html = `
    <h3>Resultado de Cotización</h3>
    <p><strong>${marca} ${modelo} (${anio})</strong></p>
    <p>Precio: $${precio.toLocaleString()}</p>
    <p>Enganche: $${enganche.toLocaleString()}</p>
    <p>Monto a financiar: $${monto.toLocaleString()}</p>
    <table>
      <thead><tr><th>Plazo (meses)</th><th>Mensualidad</th></tr></thead>
      <tbody>
  `;

  plazos.forEach(meses => {
    const mensualidad = monto / meses;
    html += `<tr><td>${meses}</td><td>$${mensualidad.toFixed(2)}</td></tr>`;
  });

  html += '</tbody></table>';
  resultado.innerHTML = html;
  resultado.style.display = "block";
  document.getElementById("btnDescargar").style.display = "block";
}

document.getElementById("btnDescargar").addEventListener("click", () => {
  html2canvas(document.getElementById("resultado")).then(canvas => {
    const link = document.createElement('a');
    link.download = 'cotizacion.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});
</script>
</body>
</html>
