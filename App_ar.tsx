
import React, { useState } from 'react';
import { REPORT_DATA } from './constants';
import Header_ar from './components/Header_ar';
import FormulaModal from './components/FormulaModal';
import { motion } from 'framer-motion';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { CalculatorIcon } from './components/Icons';
import { DealsLedgerAr } from './components/DealsLedger_ar';

const formatCurrency = (value: number) => {
    return `${value.toLocaleString('ar-SA')} ريال`;
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
                    {title && <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${dark ? 'text-white' : 'text-[#1D1D1F]'}`}>{title}</h3>}
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
            <div className="bg-[#1D1D1F]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] text-right" dir="rtl">
                <p className="font-semibold text-xs text-gray-400 mb-1 uppercase tracking-wide font-cairo">{label}</p>
                {payload.map((p: any, i: number) => {
                    const isUnitCount = p.dataKey === 'count';
                    const displayValue = isUnitCount ? `${p.value.toLocaleString('ar-SA')} وحدة` : formatCurrency(p.value);
                    return (
                        <p key={i} className="text-lg font-bold text-white tracking-tight font-cairo" style={{ color: p.color }}>
                            {p.name}: {displayValue}
                        </p>
                    );
                })}
            </div>
        );
    }
    return null;
};

const translateSalesName = (name: string) => {
  const repMap: { [key: string]: string } = {
    "Amal": "أمل",
    "Al-Shihana": "الشيهانة",
    "Raghad": "رغد",
    "Fahmida": "فهميدة",
    "Salsabila": "سلسبيل"
  };
  return repMap[name] || name;
};

const App_ar: React.FC<{ onToggleLanguage: () => void }> = ({ onToggleLanguage }) => {
  const { financials, spendBreakdown, period, sourcePerformance, salesTeam, branchPerformance } = REPORT_DATA;
  const [showFormulas, setShowFormulas] = useState(false);

  const sourceChartData = sourcePerformance.map(item => ({
      name: item.name_ar,
      'إجمالي قيمة العقار': item.total,
      'حصة إيرادات مثوى': item.share
  }));

  const branchData = branchPerformance.map(item => ({
      name: item.name_ar,
      'إيرادات العقار': item.total,
      'حصة مثوى': item.share,
      'count': item.count
  }));

  return (
    <div className="min-h-screen pb-20 sm:pb-32 selection:bg-[#4A2C5A] selection:text-white font-cairo bg-[#F5F5F7]" dir="rtl">
      <Header_ar onToggleLanguage={onToggleLanguage} />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 px-2 sm:px-4 text-right">
            <div className="mb-6 md:mb-0">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-[#1D1D1F] mb-3 sm:mb-4 leading-tight"
                >
                    تقرير نمو <span className="text-gray-300 block sm:inline">مايو / يونيو</span>
                </motion.h1>
                <div className="flex flex-wrap items-center gap-3 justify-end">
                    <p className="text-lg sm:text-2xl text-gray-500 font-medium">{period.ar}</p>
                    <span className="px-3 py-1 bg-[#4A2C5A]/10 text-[#4A2C5A] text-[10px] font-bold uppercase rounded-full tracking-widest border border-[#4A2C5A]/20">
                        فترة التقرير: تحديث ٢٠٢٦
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
                <span>المعادلات</span>
            </motion.button>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
            
            <BentoCard dark className="min-h-[400px] sm:min-h-[450px] justify-center">
                 <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-gradient-to-b from-[#4A2C5A] to-transparent opacity-40 blur-[100px] sm:blur-[120px] -ml-40 -mt-40 pointer-events-none rounded-full"
                 />
                 <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-0 right-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-blue-900/30 blur-[80px] sm:blur-[100px] -mr-40 -mb-40 pointer-events-none rounded-full"
                 />

                 <div className="relative z-10 text-right">
                     <div className="flex items-center gap-3 mb-4 sm:mb-6 justify-end">
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/50">حصة إيرادات مثوى</span>
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400 animate-pulse"></div>
                     </div>
                     <h2 className="text-6xl sm:text-7xl md:text-9xl font-bold tracking-tighter text-white mb-4 sm:mb-6 leading-none">
                        {financials.mathwaaRevenue.toLocaleString('ar-SA')}
                        <span className="text-3xl sm:text-4xl md:text-5xl text-white/30 font-light mr-3 sm:mr-4 align-baseline">ريال</span>
                     </h2>
                     <p className="text-lg sm:text-xl md:text-2xl text-white/60 max-w-2xl leading-relaxed mr-auto">
                        حصيلة الإيرادات المعترف بها من العقود المبرمة خلال هذه الفترة.
                     </p>
                 </div>
                 
                 <div className="mt-8 sm:mt-12 pt-8 sm:pt-10 border-t border-white/10 text-right">
                     <div>
                         <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C084FC] mb-1 font-cairo">القيمة الدائمة لمثوى (LTV)</p>
                         <p className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight font-cairo">{formatCurrency(financials.mathwaaLTV)}</p>
                         <p className="text-xs text-white/50 mt-3 max-w-xl leading-relaxed italic font-cairo font-normal">
                             * القيمة الدائمة لمثوى (LTV) تعني إجمالي الإيرادات المتوقع تحصيلها لشركة مثوى على مدار فترة العقود الموقعة بالكامل.
                         </p>
                     </div>
                 </div>
            </BentoCard>

            <BentoCard className="bg-white border border-gray-100 min-h-fit" title="العائد على الاستثمار التسويقي - إجمالي الإيرادات">
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
                            <span className="text-4xl sm:text-6xl font-bold tracking-tighter text-[#1D1D1F]" dir="ltr">{financials.roi}x</span>
                            <span className="text-xs sm:text-sm font-bold uppercase text-gray-400 mt-2 font-cairo">عائد الاستثمار</span>
                        </div>
                    </div>
                    <div className="text-center lg:text-right max-w-lg">
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 font-medium leading-relaxed mb-6 font-cairo">
                            العائد على الاستثمار.<br/>
                            مقابل كل <span className="text-[#1D1D1F] font-bold">١ ريال</span> يُنفق على الإعلام،
                            تم توليد <span className="text-[#1D1D1F] font-bold">{financials.roi} ريال</span> من قيمة العقار.
                        </p>
                        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 text-right">
                             <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                وصلت حصة مثوى المباشرة من الإعلانات الرقمية المدفوعة إلى {formatCurrency(financials.digitalAdsShare)} مقابل إنفاق إعلاني قدره {formatCurrency(financials.adSpend)} خلال هذه الفترة المحدثة.
                             </p>
                        </div>
                    </div>
                </div>
            </BentoCard>

            <BentoCard className="bg-white border border-gray-100 min-h-fit" title="العائد على الاستثمار التسويقي - حصة مثوى فقط">
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
                            <span className="text-4xl sm:text-6xl font-bold tracking-tighter text-[#1D1D1F]" dir="ltr">{financials.mathwaaRoi}x</span>
                            <span className="text-xs sm:text-sm font-bold uppercase text-gray-400 mt-2 font-cairo">عائد مثوى على الاستثمار</span>
                        </div>
                    </div>
                    <div className="text-center lg:text-right max-w-lg">
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-500 font-medium leading-relaxed mb-6 font-cairo">
                            العائد على الاستثمار (حصة مثوى الصافية).<br/>
                            مقابل كل <span className="text-[#1D1D1F] font-bold">١ ريال</span> يُنفق على الإعلام،
                            تم توليد <span className="text-[#1D1D1F] font-bold">{financials.mathwaaRoi} ريال</span> كحصة إيرادات صافية لشركة مثوى خلال هذه الفترة.
                        </p>
                        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 text-right">
                             <p className="text-xs text-gray-500 leading-relaxed font-medium font-cairo font-normal">
                                تمثل حصة مثوى الصافية الفعلية {formatCurrency(financials.digitalAdsShare)} من المستأجرين المستقطبين من الإعلانات، ومقارنةً بإنفاق إعلاني {formatCurrency(financials.adSpend)}، ينتج عنها عائد مباشر قدره {financials.mathwaaRoi} ضعفاً.
                             </p>
                        </div>
                    </div>
                </div>
            </BentoCard>

            <BentoCard dark title="أداء الفروع" subtitle="إجمالي إيرادات العقار مقابل حصة مثوى" className="min-h-fit">
                <div className="relative z-10 w-full h-[350px] mt-4 sm:mt-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={branchData} margin={{ right: 20, left: 30 }} barSize={18}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 600, fontFamily: 'Cairo' }} width={120} orientation="right" />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: 20, fontFamily: 'Cairo' }} />
                            <Bar name="إجمالي إيرادات العقار" dataKey="إيرادات العقار" fill="#4A2C5A" radius={[8, 0, 0, 8]} />
                            <Bar name="حصة إيرادات مثوى" dataKey="حصة مثوى" fill="#C084FC" radius={[8, 0, 0, 8]} />
                            <Bar name="الوحدات المؤجرة" dataKey="count" fill="#4ADE80" radius={[8, 0, 0, 8]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-gray-500 mt-4 italic font-cairo">* يعكس فرع مثوى ٣٨ تأجير ٦ وحدات خلال فترة التقرير المحدثة.</p>
            </BentoCard>

            <BentoCard dark title="القيمة التجارية المضافة المباشرة" subtitle="أداء فريق المبيعات (حصة مثوى)" className="min-h-fit">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[90px] -mr-20 -mt-20 pointer-events-none rounded-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {salesTeam.map((member, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all group text-right">
                            <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors font-cairo">{translateSalesName(member.name)}</h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">حصة مايو / يونيو</p>
                                    <p className="text-xl font-bold text-white font-cairo">{formatCurrency(member.januaryValue)}</p>
                                </div>
                                <div className="pt-4 border-t border-white/5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">إجمالي الحصة (Lifetime)</p>
                                    <p className="text-2xl font-bold text-white tabular-nums font-cairo">{formatCurrency(member.lifetimeValue)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </BentoCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <BentoCard dark title="توزيع الإنفاق التسويقي" className="min-h-fit">
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
                                <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">إجمالي الإنفاق</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full">
                            {spendBreakdown.map((item, idx) => (
                                <div key={idx} className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
                                    <div className="w-1.5 h-1.5 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }}></div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter truncate font-cairo">{item.name_ar}</p>
                                    <p className="text-xs font-bold text-white font-cairo">{formatCurrency(item.value)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </BentoCard>

                <BentoCard title="أداء قنوات الاستحواذ" subtitle="حسب مسار التحويل" className="min-h-fit text-right">
                    <div className="relative z-10 w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sourceChartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 11, fontFamily: 'Cairo' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 11, fontFamily: 'Cairo' }} orientation="right" />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Bar name="إجمالي قيمة العقار" dataKey="إجمالي قيمة العقار" fill="#4A2C5A" radius={[4, 4, 0, 0]} />
                                <Bar name="حصة إيرادات مثوى" dataKey="حصة إيرادات مثوى" fill="#C084FC" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </BentoCard>
            </div>

            <DealsLedgerAr />
        </div>

        <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 text-center"
        >
            <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] font-cairo">إعداد: عمار محي الدين - تسويق الأداء @ مثوى</p>
        </motion.footer>

        <FormulaModal isOpen={showFormulas} onClose={() => setShowFormulas(false)} lang="ar" />
      </main>
    </div>
  );
};

export default App_ar;
