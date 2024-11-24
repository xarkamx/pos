import { Button } from '@mui/material';
import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { Money } from '../../../components/Formats/FormatNumbers';

export const PrintableCatalog = React.forwardRef(({ products, css }, ref) => (
  <div style={css} className='catalog1' ref={ref}>
    <style>
      {`
       @page  
{ 
    size: auto;   /* auto is the initial value */ 

    /* this affects the margin in the printer settings */ 
    margin: 5mm 10mm;  
} 
        .contact{
          text-align: center;
          margin: 0 auto;
          display: flex;
          justify-content: space-around;
          p{
            margin: 0.5rem;
          }
        }
        .catalog1 {
        h2 {
          text-align: center;
        }
        p {
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          padding: 1rem;
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
          font-size: 11px;
        }
        .flexTitle {
          display: flex;
          align-items: left;
          justify-content: left;
        }
        .flexTitle img {
          width: .8in;
          height: .8in;
          transform: translateY(0.5in) translateX(0.5in);
        }
        .flexTitle h1 {
          margin: .8in .8in;
          font-size: .2in;
        }
        margin: 1rem;
        img::before {
    content: '';
    position: relative;
    top: 0;
    left: 1rem;
    bottom: 0;
    right: 0;
    line-height: 200px;
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
    <div className='contact'>
      <p><b>Contáctanos en</b>: 33-36383996</p>
      <p><b>Correo:</b> hojalateriagutierrez@gmail.com</p>

    </div>
    <p><b>Direccion:</b> Opalo 715 colonia San Marcos, Guadalajara, Jalisco</p>

    <table>
      <thead>
        <tr>
          <td>Producto</td>
          <td>Descripcion</td>
          <td>Precio</td>
        </tr>
      </thead>
      {products.map((product) => (
        <tbody key={`tbody-${product.id}`}>
          <tr>
            <td>{product.name}</td>
            <td>{product.shortDescription}</td>
            <td><Money number={product.unitPrice} /></td>
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