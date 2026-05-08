import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { ReportCard } from "../types/exams.types";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
};

export const SummaryCards = ({ report }: { report: ReportCard }) => {
  const percentageData = [{ value: report.percentage, fill: "#4f46e5" }];
  const attendanceData = [{ value: report.attendance, fill: "#10b981" }];

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* CARD 1 – Percentage with Radial */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-indigo-500"
      >
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Overall Percentage
        </p>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="65%" outerRadius="100%"
                startAngle={90} endAngle={90 - (360 * report.percentage / 100)}
                data={percentageData}
              >
                <RadialBar background={{ fill: "#EEF2FF" }} dataKey="value" cornerRadius={4} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-indigo-600">
              {report.percentage}%
            </h2>
            <span className="flex items-center text-xs font-medium text-green-600">
              <TrendingUp className="mr-0.5 h-3 w-3" strokeWidth={3} />
              +2.1%
            </span>
          </div>
        </div>
      </motion.div>

      {/* CARD 2 – Rank */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-indigo-500"
      >
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Current Rank
        </p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-bold text-gray-900">
            {String(report.rank).padStart(2, "0")}
          </h2>
          <span className="text-sm text-gray-500">out of 42</span>
        </div>
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((42 - report.rank + 1) / 42) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          />
        </div>
      </motion.div>

      {/* CARD 3 – Attendance with Radial */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-indigo-500"
      >
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Attendance
        </p>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%" cy="50%"
                innerRadius="65%" outerRadius="100%"
                startAngle={90} endAngle={90 - (360 * report.attendance / 100)}
                data={attendanceData}
              >
                <RadialBar background={{ fill: "#ECFDF5" }} dataKey="value" cornerRadius={4} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {report.attendance}%
            </h2>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
              Excellent
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};