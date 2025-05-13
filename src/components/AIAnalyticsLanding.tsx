import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  LineChart,
  BarChart2,
  PieChart,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Activity,
  Zap,
  Database,
  Users
} from 'lucide-react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import FloatingChat from './chat/FloatingChat';

const studentSurveyQuestions = [
  { id: 1, question: "¿Las clases virtuales son efectivas para tu aprendizaje?", yes: 280, no: 70 },
  { id: 2, question: "¿Te sientes motivado durante las clases?", yes: 295, no: 55 },
  { id: 3, question: "¿Los materiales de estudio son claros y útiles?", yes: 310, no: 40 },
  { id: 4, question: "¿Tienes un espacio adecuado para estudiar en casa?", yes: 275, no: 75 },
  { id: 5, question: "¿Puedes mantener la concentración durante las clases?", yes: 260, no: 90 },
  { id: 6, question: "¿El horario de clases se ajusta a tus necesidades?", yes: 290, no: 60 },
  { id: 7, question: "¿Recibes retroalimentación útil de tus profesores?", yes: 315, no: 35 },
  { id: 8, question: "¿Las evaluaciones reflejan tu nivel de conocimiento?", yes: 270, no: 80 },
  { id: 9, question: "¿Te sientes parte de una comunidad de aprendizaje?", yes: 285, no: 65 },
  { id: 10, question: "¿Recomendarías este sistema de aprendizaje?", yes: 305, no: 45 }
];

export default function AIAnalyticsLanding() {
  const [sentimentData, setSentimentData] = useState({
    labels: ['Positivo', 'Neutral', 'Negativo'],
    datasets: [{
      data: [65, 25, 10],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ]
    }]
  });

  const [learningProgressData, setLearningProgressData] = useState({
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Precisión del Modelo',
      data: [75, 82, 88, 92, 95, 97],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.4,
      fill: false
    }]
  });

  const [heatmapData, setHeatmapData] = useState({
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
    datasets: [{
      label: 'Actividad de Aprendizaje',
      data: [
        [65, 75, 85, 95, 90],
        [70, 80, 85, 90, 85],
        [75, 85, 90, 85, 80],
        [80, 90, 85, 80, 75],
        [85, 95, 90, 85, 80]
      ],
      backgroundColor: (context: any) => {
        const value = context.dataset.data[context.dataIndex];
        const alpha = value / 100;
        return `rgba(75, 192, 192, ${alpha})`;
      }
    }]
  });

  const [neuralNetworkData, setNeuralNetworkData] = useState({
    labels: ['Capa 1', 'Capa 2', 'Capa 3', 'Salida'],
    datasets: [{
      label: 'Neuronas Activas',
      data: [128, 64, 32, 16],
      backgroundColor: 'rgba(54, 162, 235, 0.6)'
    }]
  });

  const [attendanceRiskData, setAttendanceRiskData] = useState({
    labels: ['0-2 Faltas', '3-4 Faltas', '5+ Faltas'],
    datasets: [{
      data: [70, 20, 10],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ]
    }]
  });

  const [performanceCorrelationData, setPerformanceCorrelationData] = useState({
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Rendimiento Académico',
        data: [85, 82, 78, 75, 70, 65],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4
      },
      {
        label: 'Asistencia',
        data: [95, 90, 85, 80, 75, 70],
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.4
      }
    ]
  });

  const [sentimentTrendData, setSentimentTrendData] = useState({
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sentimiento Positivo',
        data: [65, 70, 75, 80, 85, 90],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4
      },
      {
        label: 'Sentimiento Negativo',
        data: [35, 30, 25, 20, 15, 10],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.4
      }
    ]
  });

  const [performanceMetricsData, setPerformanceMetricsData] = useState({
    labels: ['Precisión', 'Recall', 'F1-Score', 'Accuracy'],
    datasets: [{
      label: 'Métricas de Rendimiento',
      data: [92, 88, 90, 94],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ]
    }]
  });

  const [trainingData, setTrainingData] = useState({
    labels: ['Época 1', 'Época 2', 'Época 3', 'Época 4', 'Época 5'],
    datasets: [
      {
        label: 'Error de Entrenamiento',
        data: [0.5, 0.4, 0.3, 0.25, 0.2],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.4
      },
      {
        label: 'Error de Validación',
        data: [0.55, 0.45, 0.35, 0.3, 0.25],
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.4
      }
    ]
  });

  const [studentFeedbackData, setStudentFeedbackData] = useState({
    labels: studentSurveyQuestions.map(q => `Pregunta ${q.id}`),
    datasets: [
      {
        label: 'Sí',
        data: studentSurveyQuestions.map(q => q.yes),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        stack: 'Stack 0',
      },
      {
        label: 'No',
        data: studentSurveyQuestions.map(q => q.no),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        stack: 'Stack 0',
      }
    ]
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update sentiment data
      setSentimentData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: prev.datasets[0].data.map(d => 
            Math.min(100, Math.max(0, d + (Math.random() * 10 - 5)))
          )
        }]
      }));

      // Update learning progress
      setLearningProgressData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: prev.datasets[0].data.map(d =>
            Math.min(100, Math.max(0, d + (Math.random() * 2 - 1)))
          )
        }]
      }));

      // Update attendance risk data
      setAttendanceRiskData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: prev.datasets[0].data.map(d =>
            Math.max(0, d + (Math.random() * 10 - 5))
          )
        }]
      }));

      // Update performance correlation
      setPerformanceCorrelationData(prev => ({
        ...prev,
        datasets: prev.datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.map(d =>
            Math.min(100, Math.max(0, d + (Math.random() * 4 - 2)))
          )
        }))
      }));

      // Update training data
      setTrainingData(prev => ({
        ...prev,
        datasets: prev.datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.map(d =>
            Math.max(0.1, d + (Math.random() * 0.1 - 0.05))
          )
        }))
      }));

      // Update neural network activity
      setNeuralNetworkData(prev => ({
        ...prev,
        datasets: [{
          ...prev.datasets[0],
          data: prev.datasets[0].data.map(d =>
            Math.max(1, d + (Math.random() * 10 - 5))
          )
        }]
      }));

      // Update student feedback data
      setStudentFeedbackData(prev => ({
        ...prev,
        datasets: prev.datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.map(d =>
            Math.max(0, Math.min(350, d + (Math.random() * 10 - 5)))
          )
        }))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-sky-500" />
              <span className="ml-2 text-2xl font-bold text-gray-900">NeuroEdu AI</span>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-sky-500">Características</a>
              <a href="#analytics" className="text-gray-600 hover:text-sky-500">Analíticas</a>
              <Link to="/login" className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600">
                Ingresar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Análisis en Tiempo Real con</span>
                  <span className="block text-sky-500">Inteligencia Artificial</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Descubre cómo la IA está transformando la educación con análisis de sentimientos
                  y seguimiento personalizado del aprendizaje en tiempo real.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600 md:py-4 md:text-lg md:px-10"
                    >
                      Ver Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Análisis Avanzado con IA
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Monitoreo en tiempo real del proceso de aprendizaje
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-sky-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Red Neuronal Adaptativa</h3>
                <p className="mt-2 text-gray-500">
                  Modelo de IA que se adapta continuamente al comportamiento del estudiante
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Análisis en Tiempo Real</h3>
                <p className="mt-2 text-gray-500">
                  Monitoreo continuo del progreso y sentimientos del estudiante
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Database className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Big Data Educativo</h3>
                <p className="mt-2 text-gray-500">
                  Procesamiento de grandes volúmenes de datos para insights precisos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Training Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Entrenamiento del Modelo en Tiempo Real
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Observe cómo nuestro modelo de IA aprende y mejora continuamente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card title="Progreso del Entrenamiento" className="shadow-lg">
              <Chart type="line" data={trainingData} />
            </Card>

            <Card title="Actividad de la Red Neuronal" className="shadow-lg">
              <Chart type="bar" data={neuralNetworkData} />
            </Card>
          </div>

          <div className="mt-8 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl font-bold text-sky-500">98.5%</div>
                <div className="text-gray-600 mt-2">Precisión del Modelo</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl font-bold text-green-500">50ms</div>
                <div className="text-gray-600 mt-2">Tiempo de Respuesta</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl font-bold text-purple-500">1M+</div>
                <div className="text-gray-600 mt-2">Datos Procesados</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div id="analytics" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Métricas en Tiempo Real
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Visualización del procesamiento de la red neuronal y análisis de sentimientos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card title="Análisis de Sentimientos" className="shadow-lg">
              <Chart type="pie" data={sentimentData} />
            </Card>

            <Card title="Progreso de Aprendizaje" className="shadow-lg">
              <Chart type="line" data={learningProgressData} />
            </Card>

            <Card title="Riesgo por Inasistencias" className="shadow-lg">
              <Chart type="doughnut" data={attendanceRiskData} />
            </Card>

            <Card title="Correlación Asistencia-Rendimiento" className="shadow-lg">
              <Chart type="line" data={performanceCorrelationData} />
            </Card>

            <Card title="Tendencia de Sentimientos" className="shadow-lg">
              <Chart type="line" data={sentimentTrendData} />
            </Card>

            <Card title="Métricas de Rendimiento" className="shadow-lg">
              <Chart type="radar" data={performanceMetricsData} />
            </Card>
          </div>
        </div>
      </div>

      {/* Student Feedback Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Retroalimentación de Estudiantes
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Análisis de las respuestas de 350 estudiantes sobre su experiencia de aprendizaje
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <Card title="Respuestas por Pregunta" className="shadow-lg">
              <Chart type="bar" data={studentFeedbackData} />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentSurveyQuestions.map((q, index) => (
                <Card key={q.id} className="shadow-lg">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">{q.question}</h3>
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Sí: {q.yes} ({((q.yes / (q.yes + q.no)) * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>No: {q.no} ({((q.no / (q.yes + q.no)) * 100).toFixed(1)}%)</span>
                        </div>
                      </div>
                      <Chart
                        type="doughnut"
                        data={{
                          labels: ['Sí', 'No'],
                          datasets: [{
                            data: [q.yes, q.no],
                            backgroundColor: [
                              'rgba(75, 192, 192, 0.6)',
                              'rgba(255, 99, 132, 0.6)'
                            ]
                          }]
                        }}
                        style={{ width: '100px', height: '100px' }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-sky-100 rounded-md p-3">
                    <Brain className="h-6 w-6 text-sky-500" />
                  </div>
                  <div className="ml-5">
                    <div className="text-xl font-semibold text-gray-900">98%</div>
                    <div className="text-sm text-gray-500">Precisión del Modelo</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <Zap className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="ml-5">
                    <div className="text-xl font-semibold text-gray-900">50ms</div>
                    <div className="text-sm text-gray-500">Tiempo de Respuesta</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <MessageSquare className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="ml-5">
                    <div className="text-xl font-semibold text-gray-900">1M+</div>
                    <div className="text-sm text-gray-500">Interacciones Analizadas</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                    <TrendingUp className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="ml-5">
                    <div className="text-xl font-semibold text-gray-900">95%</div>
                    <div className="text-sm text-gray-500">Mejora en Rendimiento</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-sky-500" />
              <span className="ml-2 text-2xl font-bold text-gray-900">NeuroEdu AI</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Términos
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Contacto
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-center text-gray-400">
              © 2024 NeuroEdu AI. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      <FloatingChat />
    </div>
  );
}