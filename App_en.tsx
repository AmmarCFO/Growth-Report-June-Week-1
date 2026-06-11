
import React, { useState } from 'react';
import { REPORT_DATA } from './constants';
import Header from './components/Header';
import FormulaModal from './components/FormulaModal';
import { motion } from 'framer-motion';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { CalculatorIcon } from './components/Icons';
import { DealsLedger } from './components/DealsLedger';

const formatCurrency = (value: number) => {
    return `SAR ${value.toLocaleString('en-US')}`;
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.99 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } 
    }
};

const BentoCard: React.FC<{ 
    children: React.ReactNode; 
    className?: string; 
    title?: string;
    subtitle?: string;
    rightAction?: React.ReactNode;
    dark?: boolean;
}> = ({ children, className = "", title, subtitle, rightAction, dark = false }) => (
    <motion.div 
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10px" }}
        className={`
            relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col group
            ${dark ? 'bg-[#1D1D1F] text-white shadow-2xl border border-white/10' : 'bg-white text-[#1D1D1F] shadow-2xl shadow-gray-200/50 border border-white/60'}
            ${className}
        `}
    >
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none
            ${dark ? 'bg-gradient-to-tr from-white/5 to-transparent' : 'bg-gradient-to-tr from-blue-50/50 to-transparent'}`} 
        />

        {(title || rightAction) && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 z-10 gap-4 sm:gap-0">
                <div>
                    {title && <h3 className={`text-2xl sm:text-3xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-[#1D1D1F]'}`}>{title}</h3>}
                    {subtitle && <p className={`text-sm sm:text-base font-medium ${dark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{subtitle}</p>}
                </div>
                {rightAction}
            </div>
        )}
        <div className="relative z-10 flex-1">{children}</div>
    </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#1D1D1F]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                <p className="font-semibold text-xs text-gray-400 mb-1 uppercase tracking-wide">{label}</p>
                {payload.map((p: any, i: number) => {
                    const isUnitCount = p.dataKey === 'count';
                    const displayValue = isUnitCount ? `${p.value} Units` : formatCurrency(p.value);
                    return (
                        <p key={i} className="text-lg font-bold text-white tracking-tight" style={{ color: p.color }}>
                            {p.name}: {displayValue}
                        </p>
                    );
                })}
            </div>
        );
    }
    return null;
};

const App_en: React.FC<{ onToggleLanguage: () => void }> = ({ onToggleLanguage }) => {
  const { financials, spendBreakdown, period, sourcePerformance, salesTeam, branchPerformance } = REPORT_DATA;
  const [showFormulas, setShowFormulas] = useState(false);

  const sourceChartData = sourcePerformance.map(item => ({
      name: item.name_en,
      'Total Property Value': item.total,
      'Mathwaa Revenue Share': item.share
  }));

  const branchData = branchPerformance.map(item => ({
      name: item.name_en,
      'Property Revenue': item.total,
      'Mathwaa Share': item.share,
      'count': item.count
  }));

  return (
    <div className="min-h-screen pb-20 sm:pb-32 selection:bg-[#4A2C5A] selection:text-white bg-[#F5F5F7]">
      <Header onToggleLanguage={onToggleLanguage} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 px-2 sm:px-4">
            <div className="mb-6 md:mb-0">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-5xl sm:text-6xl md:text-8xl font-semibold tracking-tighter text-[#1D1D1F] mb-3 sm:mb-4"
                >
                    May/June <span className="text-gray-300 block sm:inline">Growth</span>
                </motion.h1>
                <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg sm:text-2xl text-gray-500 font-medium">{period.en}</p>
                    <span className="px-3 py-1 bg-[#4A2C5A]/10 text-[#4A2C5A] text-[10px] font-bold uppercase rounded-full tracking-widest border border-[#4A2C5A]/20">
                        Reporting Period: 2026 Updated
                    </span>
                </div>
            </div>
            <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: 0.2 }}
                onClick={() => setShowFormulas(true)}
                className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white rounded-full shadow-sm text-sm font-semibold text-[#1D1D1F] hover:bg-gray-50 transition-all border border-gray-200"
            >
                <CalculatorIcon className="w-5 h-5 text-gray-400" />
                <span>Formulas</span>
            </motion.button>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
            
            <BentoCard dark className="min-h-[400px] sm:min-h-[450px] justify-center">
                 <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-0 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-gradient-to-b from-[#4A2C5A] to-transparent opacity-40 blur-[100px] sm:blur-[120px] -mr-40 -mt-40 pointer-events-none rounded-full"
                 />
                 <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-blue-900/30 blur-[80px] sm:blur-[100px] -ml-40 -mb-40 pointer-events-none rounded-full"
                 />

                 <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-4 sm:mb-6">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/50">Mathwaa Share Revenue</span>
                     </div>
                     <h2 className="text-6xl sm:text-7xl md:text-9xl font-semibold tracking-tighter text-white mb-4 sm:mb-6 leading-none">
                        {financials.mathwaaRevenue.toLocaleString('en-US')}
                        <span className="text-3xl sm:text-4xl md:text-5xl text-white/30 font-light ml-3 sm:ml-4 align-baseline">SAR</span>
                     </h2>
                     <p className="text-lg sm:text-xl md:text-2xl text-white/60 max-w-2xl leading-relaxed">
                        Recognized revenue from active rentals.
                     </p>
                 </div>
                 
                 <div className="mt-8 sm:mt-12 pt-8 sm:pt-10 border-t border-white/10">
                     <div>
                         <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C084FC] mb-1">Mathwaa Contracted LTV</p>
                         <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">{formatCurrency(financials.mathwaaLTV)}</p>
                         <p className="text-xs text-white/50 mt-3 max-w-xl leading-relaxed italic">
                             * LTV (Lifetime Value) represents the projected total revenue Mathwaa will receive over the full duration of these signed leases.
                         </p>
                     </div>
                 </div>
            </BentoCard>

            <BentoCard className="bg-white border border-gray-100 min-h-fit" title="Marketing Return on Investment - Total Revenue">
                <div className="flex flex-col lg:flex-row items-center justify-around h-full py-4 sm:py-6 gap-6 sm:gap-10">
                    <div className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="46%" stroke="#F5F5F7" strokeWidth="12%" fill="none" />
                            <motion.circle 
                                cx="50%" cy="50%" r="46%" 
                                stroke="#34C759" strokeWidth="12%" fill="none" 
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 1.0, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl sm:text-6xl font-bold tracking-tighter text-[#1D1D1F]">{financials.roi}x</span>
                            <span className="text-xs sm:text-sm font-bold uppercase text-gray-400 mt-2">Media ROI</span>
                        </div>
                    </div>
                    <div className="text-center lg:text-left max-w-lg">
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 font-medium leading-relaxed mb-6">
                            Return on Investment.<br/>
                            For every <span className="text-[#1D1D1F] font-bold">1 SAR</span> spent on media, 
                            <span className="text-[#1D1D1F] font-bold"> {financials.roi} SAR</span> was generated in property revenue during this updated reporting period.
                        </p>
                        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 text-left">
                             <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                <span className="font-bold text-[#1D1D1F] uppercase tracking-wide mr-2 block sm:inline mb-1 sm:mb-0">Note on Share</span>
                                Mathwaa's direct share from ad-acquired tenants reached {formatCurrency(financials.digitalAdsShare)} against {formatCurrency(financials.adSpend)} media spend.
                             </p>
                        </div>
                    </div>
                </div>
            </BentoCard>

            <BentoCard className="bg-white border border-gray-100 min-h-fit" title="Marketing Return on Investment - Mathwaa Share Only">
                <div className="flex flex-col lg:flex-row items-center justify-around h-full py-4 sm:py-6 gap-6 sm:gap-10">
                    <div className="relative w-48 h-48 sm:w-60 sm:h-60 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="46%" stroke="#F5F5F7" strokeWidth="12%" fill="none" />
                            <motion.circle 
                                cx="50%" cy="50%" r="46%" 
                                stroke="#A855F7" strokeWidth="12%" fill="none" 
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 1.0, ease: "easeOut" }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl sm:text-6xl font-bold tracking-tighter text-[#1D1D1F]">7.21x</span>
                            <span className="text-xs sm:text-sm font-bold uppercase text-gray-400 mt-2">Mathwaa ROI</span>
                        </div>
                    </div>
                    <div className="text-center lg:text-left max-w-lg">
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 font-medium leading-relaxed mb-6">
                            Return on Investment (Mathwaa Net Share).<br/>
                            For every <span className="text-[#1D1D1F] font-bold">1 SAR</span> spent on media, 
                            <span className="text-[#1D1D1F] font-bold"> 7.21 SAR</span> in net revenue share was generated for Mathwaa during this updated reporting period.
                        </p>
                        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 text-left">
                             <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                <span className="font-bold text-[#1D1D1F] uppercase tracking-wide mr-2 block sm:inline mb-1 sm:mb-0">Note on Share</span>
                                Mathwaa's actual net share is {formatCurrency(financials.digitalAdsShare)} from ad-acquired tenants, compared to {formatCurrency(financials.adSpend)} media spend, resulting in a direct net ROI of 7.21×.
                             </p>
                        </div>
                    </div>
                </div>
            </BentoCard>

            <BentoCard dark title="Branch Performance" subtitle="Total Property Revenue vs Mathwaa Share" className="min-h-fit">
                <div className="relative z-10 w-full h-[350px] mt-4 sm:mt-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={branchData} margin={{ left: 20, right: 30 }} barSize={18}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600 }} width={120} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: 20 }} />
                            <Bar name="Total Property Revenue" dataKey="Property Revenue" fill="#4A2C5A" radius={[0, 4, 4, 0]} />
                            <Bar name="Mathwaa Revenue Share" dataKey="Mathwaa Share" fill="#C084FC" radius={[0, 4, 4, 0]} />
                            <Bar name="Units Rented" dataKey="count" fill="#4ADE80" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-gray-500 mt-4 italic">* Mathwa 38 reflects 6 units rented during the updated reporting period.</p>
            </BentoCard>

            <BentoCard dark title="Direct Commercial Value Addition" subtitle="Sales Team Performance (Mathwaa Share)" className="min-h-fit">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[90px] -ml-20 -mt-20 pointer-events-none rounded-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {salesTeam.map((member, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all group">
                            <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">{member.name}</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">May/June Share</p>
                                    <p className="text-xl font-bold text-white">{formatCurrency(member.januaryValue)}</p>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Lifetime Share</p>
                                    <p className="text-2xl font-bold text-white tabular-nums">{formatCurrency(member.lifetimeValue)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </BentoCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <BentoCard dark title="Marketing Spend Allocation" className="min-h-fit">
                    <div className="relative z-10 flex flex-col items-center h-full pb-4">
                        <div className="relative w-full h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={spendBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="#1D1D1F"
                                        strokeWidth={4}
                                    >
                                        {spendBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                                <span className="text-lg font-bold text-white tracking-tight">{formatCurrency(financials.marketingSpend)}</span>
                                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Total Ad Spend</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full">
                            {spendBreakdown.map((item, idx) => (
                                <div key={idx} className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
                                    <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }}></div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter truncate">{item.name_en}</p>
                                    <p className="text-xs font-bold text-white">{formatCurrency(item.value)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </BentoCard>

                <BentoCard title="Acquisition Performance" subtitle="By Conversion Path" className="min-h-fit">
                    <div className="relative z-10 w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sourceChartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 10 }} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Bar name="Total Property Revenue" dataKey="Total Property Value" fill="#4A2C5A" radius={[4, 4, 0, 0]} />
                                <Bar name="Mathwaa Revenue Share" dataKey="Mathwaa Revenue Share" fill="#C084FC" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </BentoCard>
            </div>

            <DealsLedger />
        </div>

        <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 text-center"
        >
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em]">Prepared by Ammar Mohiyadeen - Performance Marketing @ Mathwaa</p>
        </motion.footer>

        <FormulaModal isOpen={showFormulas} onClose={() => setShowFormulas(false)} lang="en" />
      </main>
    </div>
  );
};

export default App_en;
