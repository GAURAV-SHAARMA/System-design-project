import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const colors = ['#10b981', '#38bdf8', '#f59e0b', '#f97316', '#8b5cf6'];

export function MiniBarChart({ data, dataKey = 'value' }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="label" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar dataKey={dataKey} radius={[12, 12, 0, 0]} fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MiniPieChart({ data }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={55} outerRadius={92} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry.label} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
