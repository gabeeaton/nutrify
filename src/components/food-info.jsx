import React, { useContext } from "react";
import "./index.css"
import { ApiContext } from "./food";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import { Protein, Carbs, Fat, Calories } from "./food";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export function Foodinfo() {
  const info = useContext(ApiContext);

  const image_url = info ? info.image : "";
  const label = info ? info.label : "No food information available";
  const calories = info && info.nutrients ? info.nutrients.ENERC_KCAL.toFixed(0) : "N/A";
  const protein = info && info.nutrients ? info.nutrients.PROCNT.toFixed(0) : "N/A";
  const carbohydrates = info && info.nutrients ? info.nutrients.CHOCDF.toFixed(0) : "N/A";
  const fat = info && info.nutrients ? info.nutrients.FAT.toFixed(0) : "N/A";

  const data = {
    labels: ['Fat', 'Carbs', 'Protein'],
    datasets: [
      {
        data: [fat, carbohydrates, protein],
        backgroundColor: ['#f7b38d', '#f8d7b8', '#fdf0e6'],
        hoverBackgroundColor: ['#f4a373', '#f5c99b', '#fbe9d0'],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { 
        enabled: true,
        backgroundColor: 'rgba(247, 179, 141, 0.95)',
        titleColor: '#4a4a4a',
        bodyColor: '#4a4a4a',
        borderColor: '#f7b38d',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}g`;
          }
        }
      },
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          },
          color: '#6b5b73'
        }
      },
      datalabels: { 
        display: true,
        color: '#4a4a4a',
        font: {
          size: 14,
          weight: 'bold'
        },
        formatter: (value) => `${value}g`
      }
    },
    cutout: '65%',
    elements: {
      arc: {
        borderWidth: 2
      }
    }
  };

  const nutritionCards = [
    { 
      label: 'Carbs', 
      value: `${carbohydrates}g`, 
      bgColor: 'bg-[#fdf0e6]',
      textColor: 'text-[#8b4513]',
      borderColor: 'border-[#f8d7b8]',
      icon: <Carbs/>,
      percentage: carbohydrates !== "N/A" ? Math.round((carbohydrates * 4 / calories) * 100) : 0
    },
    { 
      label: 'Fat', 
      value: `${fat}g`, 
      bgColor: 'bg-[#f7b38d]',
      textColor: 'text-white',
      borderColor: 'border-[#f4a373]',
      icon: <Fat/>,
      percentage: fat !== "N/A" ? Math.round((fat * 9 / calories) * 100) : 0
    },
    { 
      label: 'Protein', 
      value: `${protein}g`, 
      bgColor: 'bg-[#f8d7b8]',
      textColor: 'text-[#8b4513]',
      borderColor: 'border-[#f5c99b]',
      icon: <Protein/>,
      percentage: protein !== "N/A" ? Math.round((protein * 4 / calories) * 100) : 0
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf0e6] via-[#f8d7b8] to-[#f7b38d] p-2 sm:p-4 lg:p-6 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-7xl mx-auto rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#f7b38d] via-[#f8d7b8] to-[#fdf0e6] p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
            {image_url && (
              <div className="relative group flex-shrink-0">
                <img 
                  src={image_url} 
                  alt={label} 
                  className="rounded-xl sm:rounded-2xl h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 object-cover shadow-xl ring-2 sm:ring-4 ring-white/40 group-hover:scale-105 transition-all duration-300" 
                />
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-[#8b4513] drop-shadow-sm leading-tight">
                {label}
              </h1>
              <p className="text-[#8b4513] font-semibold text-sm sm:text-base">100g (3.5 oz)</p>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center sm:justify-start">
                <div className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-2">
                  <span className="text-[#8b4513] font-semibold text-sm sm:text-base">Nutritional Analysis</span>
                </div>
                <div className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-2">
                  <span className="text-[#8b4513] font-semibold text-sm sm:text-base">Per Serving</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            
            {/* Chart Section */}
            <div className="flex flex-col order-2 xl:order-1">
              <div className="bg-gradient-to-br from-white to-[#fdf0e6]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-[#f8d7b8]/30">
                <h2 className="text-xl sm:text-2xl font-bold text-[#8b4513] mb-4 sm:mb-6 lg:mb-8 text-center">
                  Macronutrient Distribution
                </h2>
                
                <div className="relative">
                  <div className="w-full h-64 sm:h-72 lg:h-80 relative">
                    <Doughnut data={data} options={chartOptions} />
                    
                    {/* Center content */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#8b4513]">{calories}</div>
                        <div className="text-sm sm:text-base lg:text-lg font-semibold text-[#8b4513]/80">Total Calories</div>
                        <div className="text-xs sm:text-sm text-[#8b4513]/60 mt-1">kcal</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  <div className="text-center p-2 sm:p-3 bg-[#fdf0e6]/50 rounded-lg sm:rounded-xl border border-[#f8d7b8]/30">
                    <div className="text-base sm:text-lg font-bold text-[#8b4513]">{fat}g</div>
                    <div className="text-xs text-[#8b4513]/70 uppercase tracking-wide">Fat</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-[#fdf0e6]/50 rounded-lg sm:rounded-xl border border-[#f8d7b8]/30">
                    <div className="text-base sm:text-lg font-bold text-[#8b4513]">{carbohydrates}g</div>
                    <div className="text-xs text-[#8b4513]/70 uppercase tracking-wide">Carbs</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-[#fdf0e6]/50 rounded-lg sm:rounded-xl border border-[#f8d7b8]/30">
                    <div className="text-base sm:text-lg font-bold text-[#8b4513]">{protein}g</div>
                    <div className="text-xs text-[#8b4513]/70 uppercase tracking-wide">Protein</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Cards Section */}
            <div className="flex flex-col justify-center space-y-4 sm:space-y-6 order-1 xl:order-2">
              
              {/* Featured Calories Card */}
              <div className="bg-gradient-to-r from-[#f7b38d] to-[#f8d7b8] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300 hover:shadow-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 text-[#8b4513]">Total Energy</h3>
                    <div className="flex items-baseline gap-1 sm:gap-2">
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#8b4513]">{calories}</span>
                      <span className="text-base sm:text-lg lg:text-xl font-semibold text-[#8b4513]/80">kcal</span>
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-6xl opacity-30"><Calories/></div>
                </div>
              </div>

              {/* Macronutrient Cards */}
              <div className="space-y-3 sm:space-y-4">
                {nutritionCards.map((item, idx) => (
                  <div
                    key={idx}
                    className={`${item.bgColor} rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-2 ${item.borderColor}`}
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl">{item.icon}</span>
                        <div>
                          <h4 className={`text-base sm:text-lg font-bold ${item.textColor}`}>{item.label}</h4>
                          <p className={`text-xl sm:text-2xl font-black ${item.textColor}`}>{item.value}</p>
                        </div>
                      </div>
                      <div className={`text-right ${item.textColor}`}>
                        <div className="text-xs sm:text-sm opacity-70">% of calories</div>
                        <div className="text-lg sm:text-xl font-bold">{item.percentage}%</div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full bg-white/50 rounded-full h-1.5 sm:h-2">
                      <div 
                        className="bg-gradient-to-r from-[#f7b38d] to-[#f8d7b8] h-1.5 sm:h-2 rounded-full transition-all duration-500"
                        style={{width: `${Math.min(item.percentage, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Daily Value Info */}
              <div className="bg-gradient-to-br from-[#fdf0e6] to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-[#f8d7b8]/30 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1 sm:gap-0">
                  <h4 className="font-bold text-[#8b4513] text-sm sm:text-base">Daily Value Reference</h4>
                  <span className="text-xs sm:text-sm text-[#8b4513]/60">*Based on 2000 cal diet</span>
                </div>
                <div className="space-y-2 text-sm text-[#8b4513]/80">
                  <div className="flex justify-between">
                    <span>Total Calories:</span>
                    <span className="font-semibold">{calories !== "N/A" ? Math.round((calories / 2000) * 100) : 0}% DV</span>
                  </div>
                  <div className="w-full bg-[#f8d7b8]/30 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-[#f7b38d] to-[#f8d7b8] h-1.5 rounded-full transition-all duration-300"
                      style={{width: `${Math.min(calories !== "N/A" ? (calories / 2000) * 100 : 0, 100)}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Foodinfo;