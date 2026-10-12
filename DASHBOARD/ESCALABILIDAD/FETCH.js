const datosVenta = {
  id_empleado: 1,
  total: 85,
  metodo_pago: "efectivo",
  productos: [
    { nombre: "COCA600", cantidad: 2, precio: 25 },
    { nombre: "FRAPEOREO", cantidad: 1, precio: 35 }
  ]
};

fetch("GUARDAR_VENTAS.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(datosVenta)
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    alert("✅ Venta guardada correctamente");
  } else {
    console.error("❌ Error en venta:", data.message);
  }
});
