import React, { useState, useCallback } from 'react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { InputField } from './components/InputField';
import { SectionSelector } from './components/SectionSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SectionType, CalculationResult, SavedResult } from './types';
import { Save, Download } from 'lucide-react';

function App() {
  const [sectionType, setSectionType] = useState<SectionType>('solidCircle');
  const [params, setParams] = useState<Record<string, string>>({});
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);

  const getEquations = (type: SectionType): string[] => {
    switch (type) {
      case 'solidCircle':
        return [
          'A = \\pi r^2',
          'Z_x = Z_y = \\pi r^3/4',
          'S_x = S_y = 4r^3/3'
        ];
      case 'circularHollowSection':
        return [
          'A = \\pi(r_o^2 - r_i^2)',
          'Z_x = Z_y = \\pi(r_o^4 - r_i^4)/(4r_o)',
          'S_x = S_y = 4(r_o^3 - r_i^3)/3'
        ];
      case 'solidSquare':
        return [
          'A = a^2',
          'Z_x = Z_y = a^3/6',
          'S_x = S_y = a^3/4'
        ];
      case 'squareHollow':
        return [
          'A = a_o^2 - a_i^2',
          'Z_x = Z_y = (a_o^4 - a_i^4)/(6a_o)',
          'S_x = S_y = (a_o^3 - a_i^3)/4'
        ];
      case 'solidRectangle':
        return [
          'A = bh',
          'Z_x = bh^2/6',
          'Z_y = b^2h/6',
          'S_x = bh^2/4',
          'S_y = b^2h/4'
        ];
      case 'rectangleHollow':
        return [
          'A = b_oh_o - b_ih_i',
          'Z_x = (b_oh_o^3 - b_ih_i^3)/(6h_o)',
          'Z_y = (b_o^3h_o - b_i^3h_i)/(6b_o)',
          'S_x = (b_oh_o^2 - b_ih_i^2)/4',
          'S_y = (b_o^2h_o - b_i^2h_i)/4'
        ];
      case 'iSection':
        return [
          'A = 2t_fb_f + t_wd_1',
          'Z_x = (b_fD^3 - b_fd_1^3 + t_wd_1^3)/(6D)',
          'Z_y = (2t_fb_f^3 + d_1t_w^3)/(6b_f)',
          'S_x = b_ft_f(D-t_f) + t_wd_1^2/4',
          'S_y = t_fb_f^2/2 + d_1t_w^2/4'
        ];
      default:
        return [];
    }
  };

  const getInputFields = (type: SectionType) => {
    switch (type) {
      case 'solidCircle':
        return [
          { symbol: 'r', label: 'Radius', tooltip: 'Radius of the circle' },
        ];
      case 'circularHollow':
        return [
          { symbol: 'r_o', label: 'Outer Radius', tooltip: 'Outer radius of the hollow section' },
          { symbol: 'r_i', label: 'Inner Radius', tooltip: 'Inner radius of the hollow section' },
        ];
      case 'solidSquare':
        return [
          { symbol: 'a', label: 'Width', tooltip: 'Width of the square section' },
        ];
      case 'squareHollow':
        return [
          { symbol: 'a_o', label: 'Outer Width', tooltip: 'Outer width of the hollow section' },
          { symbol: 'a_i', label: 'Inner Width', tooltip: 'Inner width of the hollow section' },
        ];
      case 'solidRectangle':
        return [
          { symbol: 'b', label: 'Width', tooltip: 'Width of the rectangle' },
          { symbol: 'h', label: 'Height', tooltip: 'Height of the rectangle' },
        ];
      case 'rectangleHollow':
        return [
          { symbol: 'b_o', label: 'Outer Width', tooltip: 'Outer width of the hollow section' },
          { symbol: 'h_o', label: 'Outer Height', tooltip: 'Outer height of the hollow section' },
          { symbol: 'b_i', label: 'Inner Width', tooltip: 'Inner width of the hollow section' },
          { symbol: 'h_i', label: 'Inner Height', tooltip: 'Inner height of the hollow section' },
        ];
      case 'iSection':
        return [
          { symbol: 'b_f', label: 'Flange Width', tooltip: 'Width of the flange' },
          { symbol: 't_f', label: 'Flange Thickness', tooltip: 'Thickness of the flange' },
          { symbol: 't_w', label: 'Web Thickness', tooltip: 'Thickness of the web' },
          { symbol: 'D', label: 'Overall Depth', tooltip: 'Overall depth of the section' },
          { symbol: 'd_1', label: 'Clear Distance', tooltip: 'Clear distance between flanges' },
        ];
      default:
        return [];
    }
  };

  const calculateResults = useCallback((): CalculationResult => {
    const p = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, parseFloat(value) || 0])
    );

    const defaultResult: CalculationResult = {
      A: 0,
      xc: 0,
      yc: 0,
      Ix: 0,
      Iy: 0,
      Zx: 0,
      Zy: 0,
      Sx: 0,
      Sy: 0,
      rx: 0,
      ry: 0,
    };

    // Check if any required parameters are missing or zero
    const requiredParams = getInputFields(sectionType).map(field => field.symbol);
    if (requiredParams.some(param => !p[param])) {
      return defaultResult;
    }

    switch (sectionType) {
      case 'solidCircle': {
        const r = p.r;
        const A = Math.PI * r * r;
        const I = (Math.PI * Math.pow(r, 4)) / 4;
        const Z = (Math.PI * Math.pow(r, 3)) / 4;
        const S = (4 * Math.pow(r, 3)) / 3;
        return {
          A,
          xc: r,
          yc: r,
          Ix: I,
          Iy: I,
          Zx: Z,
          Zy: Z,
          Sx: S,
          Sy: S,
          rx: r / 2,
          ry: r / 2,
        };
      }
      case 'circularHollow': {
        const ro = p.r_o;
        const ri = p.r_i;
        if (ri >= ro) return defaultResult;
        
        const A = Math.PI * (ro * ro - ri * ri);
        const I = (Math.PI * (Math.pow(ro, 4) - Math.pow(ri, 4))) / 4;
        const Z = I / ro;
        const S = (4 * (Math.pow(ro, 3) - Math.pow(ri, 3))) / 3;
        const r = 0.5 * Math.sqrt(ro * ro + ri * ri);
        return {
          A,
          xc: ro,
          yc: ro,
          Ix: I,
          Iy: I,
          Zx: Z,
          Zy: Z,
          Sx: S,
          Sy: S,
          rx: r,
          ry: r,
        };
      }
      case 'solidSquare': {
        const a = p.a;
        const A = a * a;
        const I = Math.pow(a, 4) / 12;
        const Z = Math.pow(a, 3) / 6;
        const S = Math.pow(a, 3) / 4;
        const r = a / (2 * Math.sqrt(3));
        return {
          A,
          xc: a / 2,
          yc: a / 2,
          Ix: I,
          Iy: I,
          Zx: Z,
          Zy: Z,
          Sx: S,
          Sy: S,
          rx: r,
          ry: r,
        };
      }
      case 'squareHollow': {
        const ao = p.a_o;
        const ai = p.a_i;
        if (ai >= ao) return defaultResult;

        const A = ao * ao - ai * ai;
        const I = (Math.pow(ao, 4) - Math.pow(ai, 4)) / 12;
        const Z = I / (ao / 2);
        const S = (Math.pow(ao, 3) - Math.pow(ai, 3)) / 4;
        const r = Math.sqrt(I / A);
        return {
          A,
          xc: ao / 2,
          yc: ao / 2,
          Ix: I,
          Iy: I,
          Zx: Z,
          Zy: Z,
          Sx: S,
          Sy: S,
          rx: r,
          ry: r,
        };
      }
      case 'solidRectangle': {
        const b = p.b;
        const h = p.h;
        const A = b * h;
        const Ix = (b * Math.pow(h, 3)) / 12;
        const Iy = (Math.pow(b, 3) * h) / 12;
        const Zx = (b * Math.pow(h, 2)) / 6;
        const Zy = (Math.pow(b, 2) * h) / 6;
        const Sx = (b * Math.pow(h, 2)) / 4;
        const Sy = (Math.pow(b, 2) * h) / 4;
        return {
          A,
          xc: b / 2,
          yc: h / 2,
          Ix,
          Iy,
          Zx,
          Zy,
          Sx,
          Sy,
          rx: h / (2 * Math.sqrt(3)),
          ry: b / (2 * Math.sqrt(3)),
        };
      }
      case 'rectangleHollow': {
        const bo = p.b_o;
        const ho = p.h_o;
        const bi = p.b_i;
        const hi = p.h_i;
        if (bi >= bo || hi >= ho) return defaultResult;

        const A = bo * ho - bi * hi;
        const Ix = (bo * Math.pow(ho, 3) - bi * Math.pow(hi, 3)) / 12;
        const Iy = (Math.pow(bo, 3) * ho - Math.pow(bi, 3) * hi) / 12;
        const Zx = Ix / (ho / 2);
        const Zy = Iy / (bo / 2);
        const Sx = (bo * Math.pow(ho, 2) - bi * Math.pow(hi, 2)) / 4;
        const Sy = (Math.pow(bo, 2) * ho - Math.pow(bi, 2) * hi) / 4;
        return {
          A,
          xc: bo / 2,
          yc: ho / 2,
          Ix,
          Iy,
          Zx,
          Zy,
          Sx,
          Sy,
          rx: Math.sqrt(Ix / A),
          ry: Math.sqrt(Iy / A),
        };
      }
      case 'iSection': {
        const bf = p.b_f;
        const tf = p.t_f;
        const tw = p.t_w;
        const D = p.D;
        const d1 = p.d_1;
        
        const A = 2 * tf * bf + tw * d1;
        const Ix = (bf * Math.pow(D, 3) - bf * Math.pow(d1, 3) + tw * Math.pow(d1, 3)) / 12;
        const Iy = (2 * tf * Math.pow(bf, 3) + d1 * Math.pow(tw, 3)) / 12;
        const Zx = Ix / (D / 2);
        const Zy = Iy / (bf / 2);
        const Sx = bf * tf * (D - tf) + tw * Math.pow(d1, 2) / 4;
        const Sy = tf * Math.pow(bf, 2) / 2 + d1 * Math.pow(tw, 2) / 4;
        return {
          A,
          xc: bf / 2,
          yc: D / 2,
          Ix,
          Iy,
          Zx,
          Zy,
          Sx,
          Sy,
          rx: Math.sqrt(Ix / A),
          ry: Math.sqrt(Iy / A),
        };
      }
      default:
        return defaultResult;
    }
  }, [params, sectionType]);

  const formatValue = (value: number) => {
    return isFinite(value) && value !== 0 ? value.toPrecision(3) : '0.000';
  };

  const handleSave = () => {
    const results = calculateResults();
    const savedResult: SavedResult = {
      ...results,
      id: Date.now().toString(),
      sectionType,
      timestamp: new Date().toISOString(),
      parameters: Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, parseFloat(value) || 0])
      ),
    };
    setSavedResults((prev) => [...prev, savedResult]);
  };

  const handleExportCSV = () => {
    if (savedResults.length === 0) return;

    const headers = [
      'Section Type',
      'Timestamp',
      'Parameters',
      'Area (mm²)',
      'Centroid x (mm)',
      'Centroid y (mm)',
      'Ix (mm⁴)',
      'Iy (mm⁴)',
      'Zx (mm³)',
      'Zy (mm³)',
      'Sx (mm³)',
      'Sy (mm³)',
      'rx (mm)',
      'ry (mm)',
    ];

    const csvContent = savedResults.map(result => {
      const parameters = Object.entries(result.parameters)
        .map(([key, value]) => `${key}=${formatValue(value)}`)
        .join('; ');

      return [
        result.sectionType,
        new Date(result.timestamp).toLocaleString(),
        parameters,
        formatValue(result.A),
        formatValue(result.xc),
        formatValue(result.yc),
        formatValue(result.Ix),
        formatValue(result.Iy),
        formatValue(result.Zx),
        formatValue(result.Zy),
        formatValue(result.Sx),
        formatValue(result.Sy),
        formatValue(result.rx),
        formatValue(result.ry),
      ].join(',');
    });

    const csv = [headers.join(','), ...csvContent].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `section-properties-${new Date().toISOString()}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Section Properties Calculator</h1>
          
          <SectionSelector value={sectionType} onChange={setSectionType} />
          
          <div className="mb-6 space-y-2">
            {getEquations(sectionType).map((equation, index) => (
              <BlockMath key={index} math={equation} />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {getInputFields(sectionType).map((field) => (
              <InputField
                key={field.symbol}
                symbol={field.symbol}
                label={field.label}
                tooltip={field.tooltip}
                value={params[field.symbol] || ''}
                onChange={(value) =>
                  setParams((prev) => ({ ...prev, [field.symbol]: value }))
                }
              />
            ))}
          </div>

          <ResultsDisplay results={calculateResults()} />

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Results
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={savedResults.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {savedResults.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Saved Results</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Section Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parameters
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Area (mm²)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ix (mm⁴)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Iy (mm⁴)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zx (mm³)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zy (mm³)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedResults.map((result) => (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {result.sectionType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Object.entries(result.parameters)
                          .map(([key, value]) => `${key}: ${formatValue(value)}`)
                          .join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatValue(result.A)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatValue(result.Ix)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatValue(result.Iy)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatValue(result.Zx)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatValue(result.Zy)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;