import { useState, useEffect } from 'react';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Checkbox } from './components/ui/checkbox';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { Thermometer, Clock, Wheat, History, Trash2 } from 'lucide-react';


interface HistoricoItem {
  dataHora: string;
  temperatura: number;
  horas: number;
  fermento: number;
  deuCerto?: boolean;
}

export default function App() {
  const [temperatura, setTemperatura] = useState<string>('');
  const [horas, setHoras] = useState<string>('');
  const [fermentoGramas, setFermentoGramas] = useState<number | null>(null);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  // Carregar histórico do localStorage ao iniciar
  useEffect(() => {
    const historicoSalvo = localStorage.getItem('historico_fermentacao');
    if (historicoSalvo) {
      setHistorico(JSON.parse(historicoSalvo));
    }
  }, []);

  useEffect(() => {
    if (temperatura && horas) {
      calcularFermento(parseFloat(temperatura), parseFloat(horas));
    } else {
      setFermentoGramas(null);
    }
  }, [temperatura, horas]);

  const calcularFermento = (temp: number, tempo: number) => {
    // Fórmula original do código Java: fermento = 16800 / (horas * temperatura)
    const constante = 10560;
    const resultado = constante / (tempo * temp);
    setFermentoGramas(Math.round(resultado * 100) / 100);
  };

  const salvarResultado = () => {
    if (!temperatura || !horas || fermentoGramas === null) return;

    const agora = new Date();
    const dataHoraFormatada = agora.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const novoItem: HistoricoItem = {
      dataHora: dataHoraFormatada,
      temperatura: parseFloat(temperatura),
      horas: parseFloat(horas),
      fermento: fermentoGramas,
      deuCerto: false
    };

    const novoHistorico = [novoItem, ...historico];
    setHistorico(novoHistorico);
    localStorage.setItem('historico_fermentacao', JSON.stringify(novoHistorico));
    
    setMostrarHistorico(true);
  };

  const toggleDeuCerto = (index: number) => {
    const novoHistorico = [...historico];
    novoHistorico[index].deuCerto = !novoHistorico[index].deuCerto;
    setHistorico(novoHistorico);
    localStorage.setItem('historico_fermentacao', JSON.stringify(novoHistorico));
  };

  const limparHistorico = () => {
    setHistorico([]);
    localStorage.removeItem('historico_fermentacao');
  };

  const getTemperaturaStatus = (temp: number) => {
    if (temp < 20) return { text: 'Frio', color: 'bg-blue-100 text-blue-800' };
    if (temp <= 26) return { text: 'Ideal', color: 'bg-green-100 text-green-800' };
    if (temp <= 30) return { text: 'Morno', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Quente', color: 'bg-orange-100 text-orange-800' };
  };

  const getTempoStatus = (tempo: number) => {
    if (tempo < 2) return { text: 'Rápido', color: 'bg-red-100 text-red-800' };
    if (tempo <= 4) return { text: 'Normal', color: 'bg-green-100 text-green-800' };
    if (tempo <= 8) return { text: 'Lento', color: 'bg-blue-100 text-blue-800' };
    return { text: 'Muito Lento', color: 'bg-purple-100 text-purple-800' };
  };

  const tempStatus = temperatura ? getTemperaturaStatus(parseFloat(temperatura)) : null;
  const tempoStatus = horas ? getTempoStatus(parseFloat(horas)) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-2">
            
          </div>
          <p className="text-center text-green-100">
            Descubra a quantidade ideal de fermento para seus pães
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calculadora */}
          <Card className="p-6 bg-white/90 backdrop-blur shadow-xl border-green-200">
            <div className="flex items-center gap-2 mb-6">
              <Wheat className="w-6 h-6 text-green-700" />
              <h2>Dados da Fermentação</h2>
            </div>

            <div className="space-y-6">
              {/* Temperatura */}
              <div className="space-y-2">
                <Label htmlFor="temperatura" className="flex items-center gap-2 text-green-900">
                  <Thermometer className="w-4 h-4" />
                  Temperatura Ambiente (°C)
                </Label>
                <Input
                  id="temperatura"
                  type="number"
                  placeholder="Ex: 24"
                  value={temperatura}
                  onChange={(e) => setTemperatura(e.target.value)}
                  className="border-green-300 focus:border-green-600"
                />
                {tempStatus && (
                  <Badge className={tempStatus.color}>
                    {tempStatus.text}
                  </Badge>
                )}
              </div>

              {/* Horas */}
              <div className="space-y-2">
                <Label htmlFor="horas" className="flex items-center gap-2 text-green-900">
                  <Clock className="w-4 h-4" />
                  Tempo de Fermentação (horas)
                </Label>
                <Input
                  id="horas"
                  type="number"
                  placeholder="Ex: 4"
                  value={horas}
                  onChange={(e) => setHoras(e.target.value)}
                  className="border-green-300 focus:border-green-600"
                />
                {tempoStatus && (
                  <Badge className={tempoStatus.color}>
                    {tempoStatus.text}
                  </Badge>
                )}
              </div>
            </div>

            {/* Resultado */}
            {fermentoGramas !== null && (
              <div className="mt-8 space-y-4">
                <div className="p-6 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg border-2 border-orange-400">
                  <p className="text-center text-orange-900 mb-2">
                    Fermento Biológico Necessário
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-center">
                      <div className="text-orange-900">
                        {fermentoGramas.toFixed(2)} g
                      </div>
                      <p className="text-sm text-orange-800 mt-1">
                        Para 25kg de farinha
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={salvarResultado}
                  className="w-full bg-green-700 hover:bg-green-800"
                >
                  Salvar no Histórico
                </Button>
              </div>
            )}
          </Card>

          {}
          <div className="space-y-6">

            <Card className="p-6 bg-white/90 backdrop-blur shadow-xl border-green-200">
              <h3 className="text-green-900 mb-4">💡 Dicas Importantes</h3>
              <ul className="space-y-3 text-sm text-green-800">
                <li className="flex gap-2">
                  <span className="text-orange-500">•</span>
                  <span>
                    A temperatura ideal para fermentação é entre 24-26°C
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500">•</span>
                  <span>
                    Em ambientes mais frios, use mais fermento ou deixe fermentar por mais tempo
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500">•</span>
                  <span>
                    Fermentações longas (8-12h) desenvolvem mais sabor
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-500">•</span>
                  <span>
                    Este cálculo é para fermento biológico fresco
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>


        <Card className="mt-6 p-6 bg-white/90 backdrop-blur shadow-xl border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 text-green-700" />
              <h2>Histórico de Cálculos</h2>
            </div>
            {historico.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMostrarHistorico(!mostrarHistorico)}
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  {mostrarHistorico ? 'Ocultar' : 'Mostrar'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={limparHistorico}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {historico.length === 0 ? (
            <p className="text-center text-green-700 py-8">
              Nenhum cálculo salvo ainda. Faça um cálculo e salve no histórico!
            </p>
          ) : mostrarHistorico ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {historico.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-start gap-3"
                >
                  <div className="flex-1">
                    <div className="text-sm">
                      <p className="text-green-900">
                        <span className="text-green-700">📅</span> {item.dataHora}
                      </p>
                      <p className="text-green-800 mt-1">
                        Temperatura: {item.temperatura.toFixed(1)}°C | 
                        Tempo: {item.horas.toFixed(1)} h | 
                        Fermento: <span className="text-orange-600">{item.fermento.toFixed(2)} g</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Checkbox
                      id={`deu-certo-${index}`}
                      checked={item.deuCerto || false}
                      onCheckedChange={() => toggleDeuCerto(index)}
                      className="border-green-600 data-[state=checked]:bg-green-600"
                    />
                    <Label 
                      htmlFor={`deu-certo-${index}`}
                      className="text-sm text-green-800 cursor-pointer whitespace-nowrap"
                    >
                      Deu certo
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-green-700 py-4">
              {historico.length} cálculo(s) salvos. Clique em "Mostrar" para visualizar.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}