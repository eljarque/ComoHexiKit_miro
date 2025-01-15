import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import data from './data/data.json'; // Asegúrate de que este archivo contiene los datos con las URLs correctas

const { board } = miro;

const App = (): JSX.Element => {
  // Manejar clic en un elemento
  const handleClick = async (url: string) => {
    const fixedSize = 150;

    // Obtener la posición central del viewport
    const viewport = await board.viewport.get();
    const x = viewport.x + viewport.width / 2;
    const y = viewport.y + viewport.height / 2;

    // Crear la imagen en el canvas
    await board.createImage({
      x,
      y,
      url,
      width: fixedSize,
    });

    console.log(`Imagen añadida al canvas en (${x}, ${y})`);
  };

  // Configurar datos para arrastrar
  const handleDragStart = (e: React.DragEvent, url: string) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ url })
    );
    console.log(`Drag iniciado para ${url}`);
  };

  // Manejar soltura de elementos en el canvas
  useEffect(() => {
    const handleDrop = async (event: any) => {
      console.log('Evento de Drop:', event);

      const dropData = event.data.items[0]?.data;
      if (!dropData) {
        console.error('No se encontraron datos en el evento de drop');
        return;
      }

      const { url } = JSON.parse(dropData);

      if (!url) {
        console.error('No se encontró URL en los datos del evento');
        return;
      }

      const { x, y } = event;

      // Crear la imagen en el canvas
      await board.createImage({
        x,
        y,
        url,
        width: 150,
      });

      console.log(`Elemento añadido al canvas en (${x}, ${y})`);
    };

    // Registrar el evento de drop
    board.ui.on('drop', handleDrop);

    // Limpiar al desmontar el componente
    return () => {
      board.ui.off('drop', handleDrop);
    };
  }, []);

  return (
    <div className="tt_main_container">
      <h4 className="sub-title">Categories:</h4>
      {data.map((category) => (
        <div key={category.category}>
          <h5 className="category-title">{category.category}</h5>
          <div className="category-elements">
            {category.elements.map((element) => (
              <div
                key={element.name}
                className="element"
                onClick={() => handleClick(element.url)}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, element.url)}
              >
                <img
                  src={element.url}
                  alt={element.name}
                  className="element-image"
                  style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
