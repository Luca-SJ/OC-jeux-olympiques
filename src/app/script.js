const barCanvas = document.getElementById("barCanvas");
const barChart = new Chart(barCanvas, {
    type: "bar",
    data: {
        labels: ["France", "Italie", "Espagne"],
        datasets: [{
            data: [180,120,40]
        }]
    }
})