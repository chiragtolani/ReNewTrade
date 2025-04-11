"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface EnergyData {
  time: string
  production: number
  consumption: number
  surplus: number
}

interface EnergyProductionChartProps {
  data: EnergyData[]
}

export default function EnergyProductionChart({ data }: EnergyProductionChartProps) {
  const [chartHeight, setChartHeight] = useState(300)

  // Adjust chart height based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setChartHeight(200)
      } else if (window.innerWidth < 1024) {
        setChartHeight(250)
      } else {
        setChartHeight(300)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full overflow-hidden"
    >
      <ChartContainer
        config={{
          production: {
            label: "Production",
            color: "hsl(var(--chart-1))",
          },
          consumption: {
            label: "Consumption",
            color: "hsl(var(--chart-2))",
          },
          surplus: {
            label: "Surplus",
            color: "hsl(var(--chart-3))",
          },
        }}
        className={`h-[${chartHeight}px]`}
      >
        <ResponsiveContainer width="100%" height={chartHeight}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) =>
                window.innerWidth < 640 ? (value.split(":")[0] % 4 === 0 ? value : "") : value
              }
            />
            <YAxis tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend
              wrapperStyle={{ fontSize: "10px" }}
              iconSize={8}
              layout={window.innerWidth < 640 ? "horizontal" : "vertical"}
              verticalAlign={window.innerWidth < 640 ? "bottom" : "middle"}
              align={window.innerWidth < 640 ? "center" : "right"}
            />
            <Line
              type="monotone"
              dataKey="production"
              stroke="var(--color-production)"
              strokeWidth={2}
              animationDuration={1500}
              dot={{ r: window.innerWidth < 640 ? 0 : 2 }}
            />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="var(--color-consumption)"
              strokeWidth={2}
              animationDuration={1500}
              animationBegin={300}
              dot={{ r: window.innerWidth < 640 ? 0 : 2 }}
            />
            <Line
              type="monotone"
              dataKey="surplus"
              stroke="var(--color-surplus)"
              strokeWidth={2}
              animationDuration={1500}
              animationBegin={600}
              dot={{ r: window.innerWidth < 640 ? 0 : 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  )
}
