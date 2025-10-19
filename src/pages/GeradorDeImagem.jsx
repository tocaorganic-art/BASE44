import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Download, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function GeradorDeImagemPage() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const examplePrompts = [
    "Uma praia paradisíaca em Trancoso ao pôr do sol, com coqueiros e águas cristalinas",
    "Um chef preparando pratos gourmet em uma cozinha moderna e elegante",
    "Um jardim tropical bem cuidado com flores coloridas e plantas exóticas",
    "Interior de uma villa luxuosa em Trancoso com decoração contemporânea"
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Por favor, descreva a imagem que deseja gerar.');
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: prompt
      });

      if (result.url) {
        setGeneratedImage(result.url);
        toast.success('Imagem gerada com sucesso!', {
          description: 'Sua criação está pronta.',
          icon: <Sparkles className="w-4 h-4" />
        });
      } else {
        throw new Error('URL da imagem não foi retornada');
      }
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast.error('Não foi possível gerar a imagem', {
        description: error.message || 'Tente novamente ou reformule sua descrição.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `trancoso-ai-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download iniciado!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Powered by AI
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Gerador de Imagens IA</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Crie imagens incríveis para seus serviços, portfólio ou redes sociais usando inteligência artificial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle>Descreva sua Imagem</CardTitle>
              <CardDescription>
                Seja detalhado! Quanto mais informação, melhor o resultado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Uma foto profissional de um eletricista trabalhando em Trancoso, com ferramentas modernas, iluminação natural..."
                rows={6}
                className="resize-none"
              />

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Gerar Imagem
                  </>
                )}
              </Button>

              {/* Example Prompts */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-slate-700 mb-3">Exemplos de prompts:</p>
                <div className="space-y-2">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(example)}
                      className="w-full text-left text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>Sua imagem gerada aparecerá aqui</CardDescription>
            </CardHeader>
            <CardContent>
              {!generatedImage && !isGenerating && (
                <div className="aspect-square bg-slate-100 rounded-lg flex flex-col items-center justify-center text-slate-400">
                  <ImageIcon className="w-16 h-16 mb-4" />
                  <p className="text-sm">Aguardando geração...</p>
                </div>
              )}

              {isGenerating && (
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex flex-col items-center justify-center">
                  <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-4" />
                  <p className="text-sm text-purple-700 font-medium">Criando sua imagem...</p>
                  <p className="text-xs text-purple-600 mt-2">Isso pode levar de 5 a 10 segundos</p>
                </div>
              )}

              {generatedImage && !isGenerating && (
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={generatedImage}
                      alt="Imagem gerada por IA"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Imagem
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 border-none shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-3">💡 Dicas para melhores resultados:</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Seja específico sobre estilo, iluminação e composição</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Mencione cores, ambientação e elementos desejados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Use adjetivos descritivos (moderno, elegante, aconchegante, profissional)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Evite prompts muito longos ou contraditórios</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}