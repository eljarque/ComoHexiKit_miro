import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import data from './data/data.json'; // JSON con URLs absolutas para las imágenes

const { board } = miro;

const App = (): JSX.Element => {
  const [loadingElement, setLoadingElement] = useState<string | null>(null); // Estado para identificar el elemento en proceso
  const urlBase = 'https://como-hexi-kit.netlify.app' 
  // Manejar clic en un elemento
  const handleClick = async (url: string, name: string) => {
    setLoadingElement(name); // Mostrar spinner sobre la imagen seleccionada
    const fixedSize = 150;

    try {
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

      console.log(`Imagen añadida al canvas en (${x}, ${y}) con URL: ${url}`);
    } catch (error) {
      console.error('Error al añadir la imagen al canvas:', error);
    } finally {
      setLoadingElement(null); // Ocultar spinner
    }
  };

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
                onClick={() => handleClick(urlBase+element.url, element.name)}
                style={{ position: 'relative' }}
              >
                {loadingElement === element.name && (
                  <div className="spinner-overlay">
                    <div className="spinner"></div>
                  </div>
                )}
                <img
                  src={element.url}
                  alt={element.name}
                  className="element-image"
                  style={{
                    width: '100px',
                    height: '100px',
                    cursor: 'pointer',
                    opacity: loadingElement === element.name ? 0.5 : 1,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Renderizar la aplicación
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
