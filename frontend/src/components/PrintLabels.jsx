import { useRef } from 'react'
import { Printer, X } from 'lucide-react'

/**
 * Print product labels modal
 */
export default function PrintLabels({ products, onClose }) {
  const printRef = useRef(null)

  const handlePrint = () => {
    const content = printRef.current.innerHTML
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Product Labels</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 10mm; }
            .labels-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 5mm;
            }
            .label {
              border: 1px solid #333;
              border-radius: 4px;
              padding: 8px;
              page-break-inside: avoid;
              height: 25mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .label-name {
              font-weight: bold;
              font-size: 11px;
              line-height: 1.2;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .label-sku {
              font-size: 9px;
              color: #666;
            }
            .label-price {
              font-size: 14px;
              font-weight: bold;
              text-align: right;
            }
            .label-barcode {
              font-family: monospace;
              font-size: 8px;
              text-align: center;
              letter-spacing: 2px;
            }
            @media print {
              body { padding: 5mm; }
              .label { border-color: #000; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Print Product Labels</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
            >
              <Printer size={16} />
              Print Labels
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <p className="text-sm text-gray-500 mb-4">
            {products.length} label(s) will be printed. Layout: 3 labels per row.
          </p>

          {/* Preview */}
          <div ref={printRef}>
            <div className="labels-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '12px' 
            }}>
              {products.map((product) => (
                <div
                  key={product._id}
                  className="label"
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    padding: 12,
                    minHeight: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div className="label-name" style={{ 
                      fontWeight: 600, 
                      fontSize: 13, 
                      marginBottom: 4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {product.name}
                    </div>
                    {product.sku && (
                      <div className="label-sku" style={{ fontSize: 11, color: '#6b7280' }}>
                        SKU: {product.sku}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div className="label-barcode" style={{ 
                      fontFamily: 'monospace', 
                      fontSize: 9,
                      letterSpacing: 1 
                    }}>
                      {product.sku || product._id.slice(-8).toUpperCase()}
                    </div>
                    <div className="label-price" style={{ fontWeight: 700, fontSize: 16 }}>
                      ${parseFloat(product.price).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
