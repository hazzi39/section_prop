import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { CalculationResult } from '../types';

interface ResultsDisplayProps {
  results: CalculationResult;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const formatValue = (value: number) => {
    return isFinite(value) && value !== 0 ? value.toPrecision(3) : '0.000';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p>
            Area (<InlineMath math="A" />): {formatValue(results.A)} mm²
          </p>
          <p>
            Centroid (<InlineMath math="x_c" />): {formatValue(results.xc)} mm
          </p>
          <p>
            Centroid (<InlineMath math="y_c" />): {formatValue(results.yc)} mm
          </p>
          <p>
            Second Moment of Area (<InlineMath math="I_x" />):{' '}
            {formatValue(results.Ix)} mm⁴
          </p>
          <p>
            Second Moment of Area (<InlineMath math="I_y" />):{' '}
            {formatValue(results.Iy)} mm⁴
          </p>
        </div>
        <div className="space-y-2">
          <p>
            Elastic Section Modulus (<InlineMath math="Z_x" />):{' '}
            {formatValue(results.Zx)} mm³
          </p>
          <p>
            Elastic Section Modulus (<InlineMath math="Z_y" />):{' '}
            {formatValue(results.Zy)} mm³
          </p>
          <p>
            Plastic Section Modulus (<InlineMath math="S_x" />):{' '}
            {formatValue(results.Sx)} mm³
          </p>
          <p>
            Plastic Section Modulus (<InlineMath math="S_y" />):{' '}
            {formatValue(results.Sy)} mm³
          </p>
          <p>
            Radius of Gyration (<InlineMath math="r_x" />):{' '}
            {formatValue(results.rx)} mm
          </p>
          <p>
            Radius of Gyration (<InlineMath math="r_y" />):{' '}
            {formatValue(results.ry)} mm
          </p>
        </div>
      </div>
    </div>
  );
};