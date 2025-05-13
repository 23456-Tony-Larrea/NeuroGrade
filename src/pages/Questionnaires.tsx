import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { TabView, TabPanel } from 'primereact/tabview';
import { Chart } from 'primereact/chart';
import { Plus, Save, Trash2, Edit2, Copy, BarChart2, FileSpreadsheet } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { exportQuestionnaireToExcel } from '../utils/exportUtils';

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  responses?: number;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple' | 'single' | 'text';
  options: Option[];
  points: number;
  explanation?: string;
  totalResponses?: number;
  correctResponses?: number;
}

interface Questionnaire {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  totalParticipants?: number;
  averageScore?: number;
  completionRate?: number;
}

const questionTypes = [
  { label: 'Opción Múltiple', value: 'multiple' },
  { label: 'Opción Única', value: 'single' },
  { label: 'Respuesta Texto', value: 'text' }
];

const mockQuestionnaires: Questionnaire[] = [
  {
    id: '1',
    title: 'Evaluación de Matemáticas',
    description: 'Examen parcial de álgebra',
    totalParticipants: 45,
    averageScore: 85,
    completionRate: 92,
    questions: [
      {
        id: '1',
        text: '¿Cuál es el resultado de 2x + 5 = 13?',
        type: 'single',
        points: 2,
        totalResponses: 45,
        correctResponses: 38,
        options: [
          { id: '1', text: 'x = 4', isCorrect: true, responses: 38 },
          { id: '2', text: 'x = 3', isCorrect: false, responses: 5 },
          { id: '3', text: 'x = 5', isCorrect: false, responses: 2 }
        ]
      },
      {
        id: '2',
        text: 'Seleccione las propiedades de los números reales',
        type: 'multiple',
        points: 3,
        totalResponses: 45,
        correctResponses: 32,
        options: [
          { id: '1', text: 'Conmutativa', isCorrect: true, responses: 40 },
          { id: '2', text: 'Asociativa', isCorrect: true, responses: 35 },
          { id: '3', text: 'Distributiva', isCorrect: true, responses: 30 }
        ]
      }
    ]
  }
];

export default function Questionnaires() {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>(mockQuestionnaires);
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<Questionnaire>({
    id: Date.now().toString(),
    title: '',
    description: '',
    questions: [],
  });
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: Date.now().toString(),
    text: '',
    type: 'multiple',
    options: [],
    points: 1
  });

  const getQuestionResponsesChart = (question: Question) => {
    const data = {
      labels: question.options.map(opt => opt.text),
      datasets: [
        {
          data: question.options.map(opt => opt.responses),
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)'
          ]
        }
      ]
    };

    const options = {
      plugins: {
        legend: {
          labels: {
            color: darkMode ? '#ffffff' : '#495057'
          }
        }
      }
    };

    return { data, options };
  };

  const getOverallStatisticsChart = (questionnaire: Questionnaire) => {
    const data = {
      labels: ['Respuestas Correctas', 'Respuestas Incorrectas'],
      datasets: [
        {
          data: [
            questionnaire.questions.reduce((sum, q) => sum + (q.correctResponses || 0), 0),
            questionnaire.questions.reduce((sum, q) => sum + ((q.totalResponses || 0) - (q.correctResponses || 0)), 0)
          ],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)']
        }
      ]
    };

    const options = {
      plugins: {
        legend: {
          labels: {
            color: darkMode ? '#ffffff' : '#495057'
          }
        }
      }
    };

    return { data, options };
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [
        ...prev.options,
        { id: Date.now().toString(), text: '', isCorrect: false }
      ]
    }));
  };

  const updateOption = (id: string, text: string, isCorrect: boolean = false) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map(opt =>
        opt.id === id ? { ...opt, text, isCorrect } : opt
      )
    }));
  };

  const removeOption = (id: string) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.filter(opt => opt.id !== id)
    }));
  };

  const saveQuestion = () => {
    if (currentQuestion.text.trim() === '') return;

    setCurrentQuestionnaire(prev => ({
      ...prev,
      questions: [...prev.questions, currentQuestion]
    }));

    setCurrentQuestion({
      id: Date.now().toString(),
      text: '',
      type: 'multiple',
      options: [],
      points: 1
    });

    setShowQuestionForm(false);
  };

  const removeQuestion = (id: string) => {
    setCurrentQuestionnaire(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const saveQuestionnaire = () => {
    if (currentQuestionnaire.title.trim() === '') return;

    setQuestionnaires(prev => [...prev, currentQuestionnaire]);
    setCurrentQuestionnaire({
      id: Date.now().toString(),
      title: '',
      description: '',
      questions: [],
    });
  };

  const duplicateQuestion = (question: Question) => {
    const newQuestion = {
      ...question,
      id: Date.now().toString()
    };
    setCurrentQuestionnaire(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const handleExportStatistics = (questionnaire: Questionnaire) => {
    exportQuestionnaireToExcel(questionnaire);
  };

  return (
    <div className="p-4 space-y-6">
      <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
        <TabPanel header="Crear Cuestionario">
          <div className="space-y-6">
            <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Título del Cuestionario
                  </label>
                  <InputText
                    value={currentQuestionnaire.title}
                    onChange={(e) => setCurrentQuestionnaire(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full"
                    placeholder="Ingrese el título del cuestionario"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Descripción
                  </label>
                  <InputTextarea
                    value={currentQuestionnaire.description}
                    onChange={(e) => setCurrentQuestionnaire(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full"
                    placeholder="Ingrese una descripción para el cuestionario"
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-between items-center">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Preguntas
              </h2>
              <Button
                icon={<Plus className="h-4 w-4" />}
                label="Agregar Pregunta"
                onClick={() => setShowQuestionForm(true)}
              />
            </div>

            {showQuestionForm && (
              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Pregunta
                    </label>
                    <InputTextarea
                      value={currentQuestion.text}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                      rows={2}
                      className="w-full"
                      placeholder="Escriba su pregunta"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Tipo de Pregunta
                      </label>
                      <Dropdown
                        value={currentQuestion.type}
                        options={questionTypes}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, type: e.value }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Puntos
                      </label>
                      <InputText
                        type="number"
                        value={currentQuestion.points}
                        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                        className="w-24"
                      />
                    </div>
                  </div>

                  {currentQuestion.type !== 'text' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          Opciones
                        </label>
                        <Button
                          icon={<Plus className="h-4 w-4" />}
                          label="Agregar Opción"
                          onClick={addOption}
                          size="small"
                        />
                      </div>
                      {currentQuestion.options.map((option, index) => (
                        <div key={option.id} className="flex items-center gap-2">
                          {currentQuestion.type === 'multiple' ? (
                            <Checkbox
                              checked={option.isCorrect}
                              onChange={(e) => updateOption(option.id, option.text, e.checked)}
                            />
                          ) : (
                            <RadioButton
                              checked={option.isCorrect}
                              onChange={(e) => {
                                const newOptions = currentQuestion.options.map(opt => ({
                                  ...opt,
                                  isCorrect: opt.id === option.id
                                }));
                                setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                              }}
                            />
                          )}
                          <InputText
                            value={option.text}
                            onChange={(e) => updateOption(option.id, e.target.value, option.isCorrect)}
                            placeholder={`Opción ${index + 1}`}
                            className="flex-1"
                          />
                          <Button
                            icon={<Trash2 className="h-4 w-4" />}
                            severity="danger"
                            text
                            rounded
                            onClick={() => removeOption(option.id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Explicación (Opcional)
                    </label>
                    <InputTextarea
                      value={currentQuestion.explanation || ''}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                      rows={2}
                      className="w-full"
                      placeholder="Agregue una explicación para la respuesta correcta"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      label="Cancelar"
                      onClick={() => setShowQuestionForm(false)}
                      className="p-button-text"
                    />
                    <Button
                      icon={<Save className="h-4 w-4 mr-2" />}
                      label="Guardar Pregunta"
                      onClick={saveQuestion}
                    />
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentQuestionnaire.questions.map((question, index) => (
                <Card
                  key={question.id}
                  className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                  title={`Pregunta ${index + 1}`}
                >
                  <div className="space-y-2">
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                      {question.text}
                    </p>
                    {question.type !== 'text' && (
                      <div className="pl-4 space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={option.id}
                            className={`flex items-center gap-2 ${
                              option.isCorrect ? (darkMode ? 'text-green-400' : 'text-green-600') : ''
                            }`}
                          >
                            <span>{String.fromCharCode(65 + optIndex)}.</span>
                            <span>{option.text}</span>
                            {option.isCorrect && ' ✓'}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-4">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {question.points} punto{question.points !== 1 ? 's' : ''}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          icon={<Copy className="h-4 w-4" />}
                          rounded
                          text
                          tooltip="Duplicar"
                          onClick={() => duplicateQuestion(question)}
                        />
                        <Button
                          icon={<Edit2 className="h-4 w-4" />}
                          rounded
                          text
                          tooltip="Editar"
                        />
                        <Button
                          icon={<Trash2 className="h-4 w-4" />}
                          severity="danger"
                          rounded
                          text
                          tooltip="Eliminar"
                          onClick={() => removeQuestion(question.id)}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {currentQuestionnaire.questions.length > 0 && (
              <div className="flex justify-end">
                <Button
                  icon={<Save className="h-4 w-4 mr-2" />}
                  label="Guardar Cuestionario"
                  onClick={saveQuestionnaire}
                />
              </div>
            )}
          </div>
        </TabPanel>

        <TabPanel header="Estadísticas" leftIcon={<BarChart2 className="h-4 w-4 mr-2" />}>
          <div className="space-y-6">
            {questionnaires.map(questionnaire => (
              <Card
                key={questionnaire.id}
                title={questionnaire.title}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{questionnaire.title}</h3>
                    <Button
                      icon={<FileSpreadsheet className="h-4 w-4 mr-2" />}
                      label="Exportar Estadísticas"
                      onClick={() => handleExportStatistics(questionnaire)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <h3 className="text-lg font-semibold mb-2">Participantes</h3>
                      <p className="text-2xl font-bold text-blue-500">
                        {questionnaire.totalParticipants}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <h3 className="text-lg font-semibold mb-2">Promedio</h3>
                      <p className="text-2xl font-bold text-green-500">
                        {questionnaire.averageScore}%
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <h3 className="text-lg font-semibold mb-2">Tasa de Finalización</h3>
                      <p className="text-2xl font-bold text-purple-500">
                        {questionnaire.completionRate}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Resultados Generales">
                      <Chart
                        type="pie"
                        data={getOverallStatisticsChart(questionnaire).data}
                        options={getOverallStatisticsChart(questionnaire).options}
                      />
                    </Card>

                    <div className="space-y-4">
                      {questionnaire.questions.map(question => (
                        <Card key={question.id} title={`Pregunta: ${question.text}`}>
                          <div className="mb-4">
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              Respuestas correctas: {question.correctResponses} de {question.totalResponses} ({((question.correctResponses || 0) / (question.totalResponses || 1) * 100).toFixed(1)}%)
                            </p>
                          </div>
                          <Chart
                            type="pie"
                            data={getQuestionResponsesChart(question).data}
                            options={getQuestionResponsesChart(question).options}
                          />
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
}