import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Brain,
  LineChart,
  Users,
  BookOpen,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Heart,
  Zap,
  Network
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import FloatingChat from './chat/FloatingChat';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

export default function LandingPage() {
  const performanceData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Rendimiento Académico',
        data: [75, 82, 88, 85, 90, 95],
        borderColor: 'rgb(14, 165, 233)',
        tension: 0.3,
      },
      {
        label: 'Sentimiento Positivo',
        data: [65, 75, 80, 82, 88, 92],
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.3,
      },
    ],
  };

  const sentimentData = {
    labels: ['Positivo', 'Neutral', 'Negativo'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(249, 115, 22)',
          'rgb(239, 68, 68)',
        ],
      },
    ],
  };

  const engagementData = {
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
    datasets: [
      {
        label: 'Participación en Clase',
        data: [85, 92, 88, 95, 90],
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-sky-500" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Neugrade</span>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-sky-500">Nosotros</a>
              <a href="#features" className="text-gray-600 hover:text-sky-500">Características</a>
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
                  <span className="block">Potencia el aprendizaje con</span>
                  <span className="block text-sky-500">Inteligencia Artificial</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Descubre una nueva forma de aprender con análisis de sentimientos
                  y seguimiento personalizado del rendimiento académico.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600 md:py-4 md:text-lg md:px-10"
                    >
                      Comenzar
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* AI Learning Section */}
      <div className="py-12 bg-gradient-to-b from-white to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Aprendizaje Automatizado en Tiempo Real
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Observa cómo nuestra IA aprende y mejora continuamente
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/ai-analytics"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 md:text-xl"
            >
              <Network className="h-6 w-6 mr-2" />
              Ver Análisis en Vivo
            </Link>
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-sky-500" />
                </div>
                <h3 className="text-lg font-medium">Red Neuronal Activa</h3>
                <p className="mt-2 text-gray-600">
                  Visualiza el procesamiento de datos en tiempo real
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8 text-yellow-500" />
                </div>
                <h3 className="text-lg font-medium">Análisis de Sentimientos</h3>
                <p className="mt-2 text-gray-600">
                  Monitoreo continuo del estado emocional
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium">Métricas en Vivo</h3>
                <p className="mt-2 text-gray-600">
                  Estadísticas y tendencias actualizadas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Características Principales
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Descubre por qué Neugrade es la mejor opción para la educación moderna
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-sky-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Análisis de Sentimientos</h3>
                <p className="mt-2 text-gray-500">
                  Evaluamos el estado emocional de los estudiantes para optimizar su aprendizaje
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Seguimiento en Tiempo Real</h3>
                <p className="mt-2 text-gray-500">
                  Monitoreo constante del progreso académico con métricas detalladas
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Recomendaciones IA</h3>
                <p className="mt-2 text-gray-500">
                  Sugerencias personalizadas basadas en el análisis de datos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Análisis y Estadísticas
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Visualiza el impacto de nuestro sistema en el rendimiento académico
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Rendimiento y Sentimiento</h3>
              <Line data={performanceData} options={{ responsive: true }} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Análisis de Sentimientos</h3>
              <Doughnut data={sentimentData} options={{ responsive: true }} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Participación Semanal</h3>
              <Bar data={engagementData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              ¿Por qué elegirnos?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Innovamos en la educación combinando tecnología y pedagogía
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-sky-500" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">IA Avanzada</h3>
              <p className="mt-2 text-gray-500">
                Algoritmos de última generación para análisis educativo
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Enfoque Personalizado</h3>
              <p className="mt-2 text-gray-500">
                Adaptamos el aprendizaje a cada estudiante
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Contenido de Calidad</h3>
              <p className="mt-2 text-gray-500">
                Material educativo actualizado y relevante
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Soporte Continuo</h3>
              <p className="mt-2 text-gray-500">
                Asistencia y seguimiento permanente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-sky-500" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Neugrade</span>
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
              © 2024 Neugrade. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Add FloatingChat */}
      <FloatingChat />
    </div>
  );
}