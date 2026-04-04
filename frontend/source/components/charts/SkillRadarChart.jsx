import React from 'react';
import {
  Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

/**
 * SkillRadarChart Component
 * Renders a specialized radar chart for student skill visualization.
 * 
 * @param {Array} data - Array of skill objects { skill: string, current: number, required: number }
 * @param {Boolean} isDarkMode - Theme toggle for chart colors
 */
export const SkillRadarChart = ({ data, isDarkMode }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid 
            stroke={isDarkMode ? '#374151' : '#E2E8F0'} 
            gridType="polygon" 
          />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ 
              fill: isDarkMode ? '#9CA3AF' : '#64748B', 
              fontSize: 10,
              fontFamily: 'Sora',
              fontWeight: 600
            }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          
          {/* Required Level (Background) */}
          <Radar
            name="Required"
            dataKey="required"
            stroke="transparent"
            fill={isDarkMode ? '#1F2937' : '#F1F5F9'}
            fillOpacity={0.6}
            isAnimationActive={false}
          />

          {/* Current Level (Primary Highlight) */}
          <Radar
            name="Current"
            dataKey="current"
            stroke="#F4A100"
            strokeWidth={3}
            fill="#F4A100"
            fillOpacity={0.15}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

