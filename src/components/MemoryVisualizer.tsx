import React, { useState, useEffect } from 'react';
import { ExecutionStep } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Layers, 
  HardDrive, 
  Cpu, 
  CornerDownRight, 
  RotateCcw
} from 'lucide-react';

interface MemoryVisualizerProps {
  steps: ExecutionStep[];
  onStepChange?: (line: number | undefined) => void;
}

export const MemoryVisualizer: React.FC<MemoryVisualizerProps> = ({
  steps,
  onStepChange
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const step = steps[currentStepIndex] || steps[0];

  useEffect(() => {
    if (step && onStepChange) {
      onStepChange(step.lineNumber);
    }
  }, [currentStepIndex, step, onStepChange]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  if (!steps || steps.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 font-bold bg-white rounded-2xl border-2 border-dashed border-black">
        No execution trace available for this program.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-3 font-sans text-xs select-none">
      {/* Visualizer Step Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-2 sm:p-2.5 rounded-2xl border-2 border-black gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between sm:justify-start space-x-1.5">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentStepIndex(0)}
              disabled={currentStepIndex === 0}
              className="p-1.5 text-black hover:bg-rose-50 rounded-xl bg-white border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] brutal-btn disabled:opacity-30"
              title="Reset to First Step"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="p-1.5 text-black hover:bg-rose-50 rounded-xl bg-white border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] brutal-btn disabled:opacity-30"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#8B0000] text-white border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] brutal-btn hover:bg-[#700000]"
            >
              {isPlaying ? <Pause className="w-3 h-3 stroke-[3]" /> : <Play className="w-3 h-3 fill-white" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStepIndex === steps.length - 1}
              className="p-1.5 text-black hover:bg-rose-50 rounded-xl bg-white border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] brutal-btn disabled:opacity-30"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          <div className="sm:hidden flex items-center space-x-1.5 text-black font-bold text-xs">
            <span className="text-[#8B0000] font-mono">{currentStepIndex + 1}/{steps.length}</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2.5">
          <span className="text-black font-bold text-xs">
            Step <strong className="text-[#8B0000]">{currentStepIndex + 1}</strong> / <strong>{steps.length}</strong>
          </span>
          <div className="w-20 lg:w-24 h-2.5 bg-rose-100 border-2 border-black rounded-full overflow-hidden shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            <div
              className="h-full bg-[#8B0000] transition-all duration-200"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current Execution Line Info */}
      <div className="bg-[#8B0000] border-2 border-black p-2.5 sm:p-3 rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-1 text-white">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <span className="px-1.5 sm:px-2 py-0.5 rounded-lg bg-white text-[#8B0000] font-mono font-bold text-[9px] sm:text-[10px] flex-shrink-0">
            Line {step.lineNumber}
          </span>
          <span className="font-mono text-white font-bold truncate text-[11px] sm:text-xs">{step.codeLine}</span>
        </div>
        <p className="text-rose-100 font-medium text-[11px] sm:text-xs flex items-start sm:items-center space-x-1.5">
          <CornerDownRight className="w-3.5 h-3.5 text-white stroke-[3] flex-shrink-0 mt-0.5 sm:mt-0" />
          <span>{step.explanation}</span>
        </p>
      </div>

      {/* Split Memory Model: Stack vs Heap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 flex-1 overflow-auto min-h-[220px]">
        
        {/* Call Stack Section */}
        <div className="bg-white border-2 border-black rounded-2xl p-3 flex flex-col shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-[#8B0000] text-white font-bold text-xs p-2 rounded-xl border border-black flex items-center space-x-1.5 mb-2.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            <Cpu className="w-4 h-4 text-white" />
            <span>Call Stack (Stack Frames)</span>
          </div>

          <div className="space-y-2 flex-1 overflow-auto">
            {step.callStack && step.callStack.length > 0 ? (
              step.callStack.map((frame, idx) => (
                <div key={idx} className="bg-rose-50/50 p-3 rounded-xl border-2 border-black space-y-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center justify-between text-black font-mono text-xs">
                    <span className="text-[#8B0000] font-bold">{frame.functionName}()</span>
                    <span className="text-slate-500 font-bold text-[11px]">line {frame.line}</span>
                  </div>

                  {/* Variables Table */}
                  <div className="bg-white rounded-lg p-2 border border-black space-y-1">
                    <div className="text-[10px] text-slate-700 uppercase tracking-wider font-black">Local Variables:</div>
                    {Object.keys(frame.variables || {}).length > 0 ? (
                      Object.entries(frame.variables).map(([vName, vVal]) => (
                        <div key={vName} className="flex items-center justify-between font-mono text-[11px]">
                          <span className="text-[#8B0000] font-bold">{vName}</span>
                          <span className="text-black font-bold bg-rose-50 px-2 py-0.5 rounded border border-black">
                            {typeof vVal === 'object' ? JSON.stringify(vVal) : String(vVal)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">No local variables yet</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic text-center py-4 font-bold">Stack frame empty</div>
            )}
          </div>
        </div>

        {/* Heap Memory Section */}
        <div className="bg-white border-2 border-black rounded-2xl p-3 flex flex-col shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-[#6A0000] text-white font-black uppercase text-xs p-2 rounded-xl border border-black flex items-center space-x-1.5 mb-2.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            <HardDrive className="w-4 h-4 text-white" />
            <span>Heap Memory (Objects & Heap)</span>
          </div>

          <div className="space-y-2 flex-1 overflow-auto">
            {step.heapObjects && step.heapObjects.length > 0 ? (
              step.heapObjects.map((obj, idx) => (
                <div key={idx} className="bg-rose-50/50 p-3 rounded-xl border-2 border-black space-y-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-[#49BE25] font-black">{obj.id}</span>
                    <span className="text-white font-bold text-[10px] bg-[#8B0000] px-1.5 py-0.5 rounded border border-black">{obj.type}</span>
                  </div>

                  <div className="bg-white rounded-lg p-2 border border-black space-y-1">
                    <div className="text-[10px] text-slate-700 uppercase tracking-wider font-black">Fields / Elements:</div>
                    {Object.keys(obj.fields || {}).length > 0 ? (
                      Object.entries(obj.fields).map(([fKey, fVal]) => (
                        <div key={fKey} className="flex items-center justify-between font-mono text-[11px]">
                          <span className="text-slate-700 font-bold">{fKey}:</span>
                          <span className="text-black font-bold">
                            {typeof fVal === 'object' ? JSON.stringify(fVal) : String(fVal)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Default state</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic text-center py-6 font-bold">
                No active heap objects allocated at this step.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

