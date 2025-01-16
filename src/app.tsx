import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import data from './data/data.json';

const { board } = miro;

const App = (): JSX.Element => {
  const [loadingElement, setLoadingElement] = useState<string | null>(null);
  const urlBase = 'https://como-hexi-kit.netlify.app';

  const handleClick = async (url: string, category: string) => {
    setLoadingElement(url);

    try {
      const fixedSize = category === 'Makers' || category === 'Roles' ? 80 : 150;

      const viewport = await board.viewport.get();
      const x = viewport.x + viewport.width / 2;
      const y = viewport.y + viewport.height / 2;

      await board.createImage({
        x,
        y,
        url,
        width: fixedSize,
      });

      console.log(`Imagen añadida al canvas en (${x}, ${y})`);
    } catch (error) {
      console.error('Error al añadir la imagen al canvas:', error);
    } finally {
      setLoadingElement(null);
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
                onClick={() => handleClick(urlBase + element.url, category.category)}
                style={{
                  width: category.category === 'Makers' || category.category === 'Roles' ? '75px' : '100px',
                  height: category.category === 'Makers' || category.category === 'Roles' ? '75px' : '100px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={urlBase + element.url}
                  alt={element.name}
                  className="element-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                    opacity: loadingElement === urlBase + element.url ? 0.5 : 1,
                  }}
                />
                {loadingElement === urlBase + element.url && (
                  <div className="spinner"></div>
                )}
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
