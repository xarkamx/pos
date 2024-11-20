import { Button } from '@mui/material';
import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

export const PrintableCatalog = React.forwardRef(({ products, css }, ref) => (
  <div style={css} className='catalog1' ref={ref}>
    <style>
      {`
        .catalog1 {
          margin: 1in auto;
          padding: 1in;
        h1 {
          text-align: center;
        }
        h2 {
          text-align: center;
        }
        p {
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
        }
        img{
          margin: 0 auto;
        }
        .flexTitle {
          display: inline;
          align-items: left;
          justify-content: left;
        }
        .flexTitle img {
          width: 1in;
          height: 1in;
          transform: translateY(0.3in);
        }
        .flexTitle h1 {
          margin: 1in;
          font-size: .3in;
        }

        img::before {
    content: '';
    position: relative;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    line-height: 200px;
    background-image: url('https://surtidoraferreteramexicana.com/wp-content/uploads/2023/11/logoFilled.png');
    background-size: contain;
    color: currentColor;
    text-align: center;
    border-radius: 2px;
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
          }
        `}
    </style>
    <div className='flexTitle'>
      <img src='https://surtidoraferreteramexicana.com/wp-content/uploads/2023/11/logoFilled.png' alt='logo' />
      <h1>Surtidora Ferretera Mexicana</h1>
    </div>
    <h2>Catálogo de productos</h2>
    <p>Conoce nuestro catálogo de productos</p>
    <table>
      <thead>
        <tr>
          <td>Imagen</td>
          <td>Producto</td>
          <td>Precio</td>
          <td>Existencia</td>
        </tr>
      </thead>
      {products.map((product) => (
        <tbody key={`tbody-${product.id}`}>
          <tr>
            <td><img src={product.image} style={{
              width: '50px',
              height: '50px'
            }} alt={product.name}
            /></td>
            <td>{product.name}</td>
            <td>{product.unitPrice}</td>
            <td>{product.inStock}</td>
          </tr>
        </tbody>
      ))}
    </table>
  </div>
)
)

export function PrintCatalog ({ products }) {
  const componentRef = useRef();
  return (<div style={{
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '0.5rem',
    marginTop: '0.5rem',
  }}>
    <ReactToPrint
      trigger={() => <Button
        color='primary'
        startIcon={<LocalPrintshopIcon />}
      >Imprimir</Button>}
      content={() => componentRef.current}
    />
    <div style={{
      display: 'none',
    }}>
      <PrintableCatalog ref={componentRef} products={products} />
    </div>
  </div >
  )
}