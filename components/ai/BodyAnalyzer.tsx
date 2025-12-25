import React, { useState } from 'react';
import { BodyPose } from '../../types';

interface BodyAnalysis {
  height: string;
  bodyType: 'slim' | 'regular' | 'athletic' | 'plus-size';
  recommendedSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  confidence: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
  };
}

interface BodyAnalyzerProps {
  onAnalysisComplete?: (analysis: BodyAnalysis) => void;
  className?: string;
}

export const BodyAnalyzer: React.FC<BodyAnalyzerProps> = ({
  onAnalysisComplete,
  className = ''
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<BodyAnalysis | null>(null);
  const [inputHeight, setInputHeight] = useState('');
  const [inputWeight, setInputWeight] = useState('');

  const performAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const height = parseFloat(inputHeight) || 170;
      const weight = parseFloat(inputWeight) || 70;
      
      // Simple BMI-based analysis
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      
      let bodyType: BodyAnalysis['bodyType'] = 'regular';
      let recommendedSize: BodyAnalysis['recommendedSize'] = 'M';
      
      if (bmi < 18.5) {
        bodyType = 'slim';
        recommendedSize = 'S';
      } else if (bmi < 25) {
        bodyType = 'regular';
        recommendedSize = 'M';
      } else if (bmi < 30) {
        bodyType = 'athletic';
        recommendedSize = 'L';
      } else {
        bodyType = 'plus-size';
        recommendedSize = 'XL';
      }

      const result: BodyAnalysis = {
        height: `${height} cm`,
        bodyType,
        recommendedSize,
        confidence: 0.85 + Math.random() * 0.1,
        measurements: {
          chest: Math.round(80 + (bmi - 20) * 3),
          waist: Math.round(70 + (bmi - 20) * 4),
          hips: Math.round(90 + (bmi - 20) * 3)
        }
      };

      setAnalysis(result);
      onAnalysisComplete?.(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getBodyTypeColor = (type: BodyAnalysis['bodyType']) => {
    switch (type) {
      case 'slim': return '#3B82F6';
      case 'regular': return '#00DC82';
      case 'athletic': return '#F59E0B';
      case 'plus-size': return '#EC4899';
      default: return '#6B7280';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Input Form */}
      <div className="space-y-4 p-6 rounded-2xl bg-black/40 border border-white/5">
        <h3 className="text-xs font-black text-[#00DC82] uppercase tracking-[0.3em]">
          Body Metrics
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Height (cm)
            </label>
            <input
              type="number"
              value={inputHeight}
              onChange={(e) => setInputHeight(e.target.value)}
              placeholder="170"
              className="w-full bg-black/40 border border-[#1a1e43] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00DC82]/50"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Weight (kg)
            </label>
            <input
              type="number"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              placeholder="70"
              className="w-full bg-black/40 border border-[#1a1e43] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00DC82]/50"
            />
          </div>
        </div>

        <button
          onClick={performAnalysis}
          disabled={isAnalyzing || !inputHeight || !inputWeight}
          className="w-full py-3 rounded-xl bg-[#00DC82] text-black font-bold text-sm hover:bg-[#00DC82]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Body Type'}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4 animate-modal-fade">
          {/* Body Type Card */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">
                Analysis Result
              </h3>
              <div className="px-3 py-1 rounded-full bg-[#00DC82]/20 text-[#00DC82] text-[10px] font-bold">
                {Math.round(analysis.confidence * 100)}% Confidence
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Body Type
                </div>
                <div 
                  className="text-2xl font-black uppercase"
                  style={{ color: getBodyTypeColor(analysis.bodyType) }}
                >
                  {analysis.bodyType}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                  Recommended Size
                </div>
                <div className="text-2xl font-black text-[#00DC82]">
                  {analysis.recommendedSize}
                </div>
              </div>
            </div>
          </div>

          {/* Measurements */}
          {analysis.measurements && (
            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">
                Estimated Measurements
              </h4>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl bg-black/40">
                  <div className="text-xs text-slate-500 mb-1">Chest</div>
                  <div className="text-lg font-bold text-white">{analysis.measurements.chest} cm</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-black/40">
                  <div className="text-xs text-slate-500 mb-1">Waist</div>
                  <div className="text-lg font-bold text-white">{analysis.measurements.waist} cm</div>
                </div>
                <div className="text-center p-3 rounded-xl bg-black/40">
                  <div className="text-xs text-slate-500 mb-1">Hips</div>
                  <div className="text-lg font-bold text-white">{analysis.measurements.hips} cm</div>
                </div>
              </div>
            </div>
          )}

          {/* Size Guide */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#00DC82]/10 to-transparent border border-[#00DC82]/20 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <h4 className="text-xs font-black text-[#00DC82] uppercase tracking-widest">
                Recommendation
              </h4>
            </div>
            <p className="text-sm text-slate-300">
              Based on your measurements, we recommend size <strong className="text-[#00DC82]">{analysis.recommendedSize}</strong> for most items. 
              However, sizing may vary by brand. Check individual product measurements for best fit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
