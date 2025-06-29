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
        backgroundColor: [
          '#4fd1c5', // teal
          '#38b2ac', // darker teal
          '#4299e1', // blue cyan
        ],
        hoverBackgroundColor: [
          '#81e6d9',
          '#63b3ed',
          '#90cdf4',
        ],
        borderColor: '#ffffff', // white border for separation
        borderWidth: 2,
      },
    ],
  };
  

  const chartOptions = {
    plugins: {
      tooltip: {
        backgroundColor: '#4fd1c5', // teal background
        titleColor: '#ffffff',      // white title text
        bodyColor: '#e0f2f1',       // light cyan body text
        borderColor: '#38b2ac',     // darker teal border
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false,       // hide little colored squares in tooltip (optional)
        padding: 10,
        // You can also customize tooltip font, etc.
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    // keep your other options like cutout, animation, etc.
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
    <div className="min-h-screen bg-gradient-to-br from-[#e0fdfc] via-[#c0ebff] to-[#a1dbff] p-2 sm:p-4 lg:p-6 overflow-y-auto">
      <div className="bg-white/90 backdrop-blur-sm w-full max-w-7xl mx-auto rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
  
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#4fd1c5] via-[#81e6d9] to-[#90cdf4] p-4 sm:p-6 lg:p-8">
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-[#1e3a8a] drop-shadow-sm leading-tight">
                {label}
              </h1>
              <p className="text-[#285e61] font-semibold text-sm sm:text-base">100g (3.5 oz)</p>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center sm:justify-start">
                <div className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-2">
                  <span className="text-[#285e61] font-semibold text-sm sm:text-base">Nutritional Analysis</span>
                </div>
                <div className="bg-white/30 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-2">
                  <span className="text-[#285e61] font-semibold text-sm sm:text-base">Per Serving</span>
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
              <div className="bg-gradient-to-br from-white to-[#e0fdfc]/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-cyan-100/30">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1e3a8a] mb-4 sm:mb-6 lg:mb-8 text-center">
                  Macronutrient Distribution
                </h2>
  
                <div className="relative">
                  <div className="w-full h-64 sm:h-72 lg:h-80 relative">
                    <Doughnut data={data} options={chartOptions} />
                    
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#285e61]">{calories}</div>
                        <div className="text-sm sm:text-base lg:text-lg font-semibold text-[#285e61]/80">Total Calories</div>
                        <div className="text-xs sm:text-sm text-[#285e61]/60 mt-1">kcal</div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                  {[
                    { label: "Fat", value: fat },
                    { label: "Carbs", value: carbohydrates },
                    { label: "Protein", value: protein }
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center p-2 sm:p-3 bg-[#e0fdfc]/60 rounded-lg sm:rounded-xl border border-cyan-100/30">
                      <div className="text-base sm:text-lg font-bold text-[#285e61]">{value}g</div>
                      <div className="text-xs text-[#285e61]/70 uppercase tracking-wide">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
  
            {/* Nutrition Cards Section */}
            <div className="flex flex-col justify-center space-y-4 sm:space-y-6 order-1 xl:order-2">
  
              {/* Total Energy Card */}
              <div className="bg-gradient-to-r from-[#4fd1c5] to-[#90cdf4] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300 hover:shadow-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">Total Energy</h3>
                    <div className="flex items-baseline gap-1 sm:gap-2">
                      <span className="text-3xl sm:text-4xl lg:text-5xl font-black">{calories}</span>
                      <span className="text-base sm:text-lg lg:text-xl font-semibold opacity-80">kcal</span>
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
                    className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-[#f8d7b8]/30
                    ${item.borderColor}`}
                    style={{
                      background: "linear-gradient(to right, #e0fdfc, #c0ebff)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-xl sm:text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="text-base sm:text-lg font-bold text-[#1e3a8a]">{item.label}</h4>
                          <p className="text-xl sm:text-2xl font-black text-[#1e3a8a]">{item.value}</p>
                        </div>
                      </div>
                      <div className="text-right text-[#1e3a8a]">
                        <div className="text-xs sm:text-sm opacity-70">% of calories</div>
                        <div className="text-lg sm:text-xl font-bold">{item.percentage}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-white/50 rounded-full h-1.5 sm:h-2">
                      <div 
                        className="bg-gradient-to-r from-[#4fd1c5] to-[#90cdf4] h-1.5 sm:h-2 rounded-full transition-all duration-500"
                        style={{width: `${Math.min(item.percentage, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
  
              {/* Daily Value Reference */}
              <div className="bg-gradient-to-br from-[#e0fdfc] to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-cyan-100/30 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1 sm:gap-0">
                  <h4 className="font-bold text-[#285e61] text-sm sm:text-base">Daily Value Reference</h4>
                  <span className="text-xs sm:text-sm text-[#285e61]/60">*Based on 2000 cal diet</span>
                </div>
                <div className="space-y-2 text-sm text-[#285e61]/80">
                  <div className="flex justify-between">
                    <span>Total Calories:</span>
                    <span className="font-semibold">{calories !== "N/A" ? Math.round((calories / 2000) * 100) : 0}% DV</span>
                  </div>
                  <div className="w-full bg-cyan-100/30 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-[#4fd1c5] to-[#90cdf4] h-1.5 rounded-full transition-all duration-300"
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