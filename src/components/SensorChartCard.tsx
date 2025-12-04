import { useMqtt } from '../context/MqttContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SensorChartCardProps {
  topic: string;
  color?: string;
}

export default function SensorChartCard({ topic, color = "#8884d8" }: SensorChartCardProps) {
  const { topicData } = useMqtt();
  const data = topicData[topic] || [];
  
  // Extraer el nombre del sensor (última parte del topic)
  const sensorName = topic.split('/').pop() || topic;

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header bg-transparent border-0">
        <h5 className="card-title mb-0 text-capitalize">{sensorName}</h5>
        <small className="text-muted">{topic}</small>
      </div>
      <div className="card-body">
        <div style={{ width: '100%', height: 200 }}>
          {data.length > 0 ? (
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{fontSize: 10}} />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color} 
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              Esperando datos...
            </div>
          )}
        </div>
        {data.length > 0 && (
            <div className="text-center mt-2">
                <span className="h4 font-weight-bold">{data[data.length - 1].value}</span>
            </div>
        )}
      </div>
    </div>
  );
}
