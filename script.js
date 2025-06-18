// Seleccionamos los elementos del DOM
var btns = document.querySelectorAll('p[data-timeframe]');
var hrsElements = document.querySelectorAll('.hrs');
var lastWeekElements = document.querySelectorAll('.lastWeek');
// Función para cargar y mostrar los datos
function loadData() {
    fetch('data.json')
        .then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .then(function (data) {
        var currentTimeframe = 'daily';
        // Función para actualizar la UI con los datos
        function update(timeframe) {
            // Primero quitamos la clase 'active' de todos los botones
            btns.forEach(function (btn) {
                btn.classList.remove('active');
            });
            // Luego añadimos 'active' solo al botón clickeado
            var activeBtn = document.querySelector("p[data-timeframe=\"".concat(timeframe, "\"]"));
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
            // Actualizamos los datos en las cards
            data.forEach(function (item, index) {
                if (hrsElements[index] && lastWeekElements[index]) {
                    var timeframeData = item.timeframes[timeframe];
                    hrsElements[index].textContent = "".concat(timeframeData.current, "hrs");
                    lastWeekElements[index].textContent = "Last ".concat(getTimeframeText(timeframe), " - ").concat(timeframeData.previous, "hrs");
                }
            });
        }
        // Función helper para el texto del timeframe
        function getTimeframeText(timeframe) {
            switch (timeframe) {
                case 'daily': return 'Day';
                case 'weekly': return 'Week';
                case 'monthly': return 'Month';
                default: return '';
            }
        }
        // Añadimos event listeners a los botones
        btns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var timeframe = btn.dataset.timeframe;
                if (timeframe) {
                    currentTimeframe = timeframe;
                    update(currentTimeframe);
                }
            });
        });
        // Inicializamos con los datos diarios
        update(currentTimeframe);
    })
        .catch(function (error) {
        console.error('Error al cargar los datos:', error);
    });
}
// Llamamos a la función para cargar los datos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadData);
