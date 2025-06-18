// Seleccionamos los elementos del DOM
const btns: NodeListOf<HTMLParagraphElement> = document.querySelectorAll('p[data-timeframe]');
const hrsElements: NodeListOf<HTMLElement> = document.querySelectorAll('.hrs');
const lastWeekElements: NodeListOf<HTMLElement> = document.querySelectorAll('.lastWeek');

// Definimos tipos TypeScript para nuestros datos
interface TimeframeData {
    current: number;
    previous: number;
}

interface Activity {
    title: string;
    timeframes: {
        daily: TimeframeData;
        weekly: TimeframeData;
        monthly: TimeframeData;
    };
}

// Función para cargar y mostrar los datos
function loadData(): void {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data: Activity[]) => {
            let currentTimeframe: keyof Activity['timeframes'] = 'daily';

            // Función para actualizar la UI con los datos
            function update(timeframe: keyof Activity['timeframes']): void {
                // Primero quitamos la clase 'active' de todos los botones
                btns.forEach(btn => {
                    btn.classList.remove('active');
                });

                // Luego añadimos 'active' solo al botón clickeado
                const activeBtn = document.querySelector(`p[data-timeframe="${timeframe}"]`);
                if (activeBtn) {
                    activeBtn.classList.add('active');
                }

                // Actualizamos los datos en las cards
                data.forEach((item, index) => {
                    if (hrsElements[index] && lastWeekElements[index]) {
                        const timeframeData = item.timeframes[timeframe];
                        hrsElements[index].textContent = `${timeframeData.current}hrs`;
                        lastWeekElements[index].textContent = `Last ${getTimeframeText(timeframe)} - ${timeframeData.previous}hrs`;
                    }
                });
            }

            // Función helper para el texto del timeframe
            function getTimeframeText(timeframe: string): string {
                switch(timeframe) {
                    case 'daily': return 'Day';
                    case 'weekly': return 'Week';
                    case 'monthly': return 'Month';
                    default: return '';
                }
            }

            // Añadimos event listeners a los botones
            btns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const timeframe = btn.dataset.timeframe as keyof Activity['timeframes'] | undefined;
                    if (timeframe) {
                        currentTimeframe = timeframe;
                        update(currentTimeframe);
                    }
                });
            });

            // Inicializamos con los datos diarios
            update(currentTimeframe);
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
}

// Llamamos a la función para cargar los datos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadData);