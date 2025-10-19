import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function Base44CommandValidator() {
  const [input, setInput] = useState('');
  const [validation, setValidation] = useState(null);

  const validateCommand = () => {
    try {
      const command = JSON.parse(input);
      const issues = [];
      const warnings = [];

      // Required fields
      if (!command.command_id) issues.push('Campo "command_id" obrigatório');
      if (!command.version) issues.push('Campo "version" obrigatório');
      if (!command.objective) issues.push('Campo "objective" obrigatório');
      if (!command.operations || !Array.isArray(command.operations)) {
        issues.push('Campo "operations" obrigatório (array)');
      }

      // Check command_id format
      if (command.command_id && !command.command_id.match(/^BASE44_[A-Z_]+_V\d+$/)) {
        warnings.push('command_id deve seguir formato: BASE44_Nome_V1');
      }

      // Check operations structure
      if (command.operations && Array.isArray(command.operations)) {
        command.operations.forEach((op, idx) => {
          if (!op.id) issues.push(\`Operação #\${idx + 1} sem campo "id"\`);
          if (!op.actions || !Array.isArray(op.actions)) {
            issues.push(\`Operação #\${idx + 1} sem campo "actions" (array)\`);
          }
        });
      }

      // Check validation
      if (!command.validation) {
        warnings.push('Campo "validation" recomendado');
      }

      // Check reporting
      if (!command.reporting) {
        warnings.push('Campo "reporting" recomendado');
      }

      setValidation({
        valid: issues.length === 0,
        issues,
        warnings,
        command,
      });
    } catch (error) {
      setValidation({
        valid: false,
        issues: ['JSON inválido: ' + error.message],
        warnings: [],
        command: null,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Validador de Comandos Base44</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Cole aqui o JSON do comando..."
          className="font-mono text-xs h-64"
        />
        
        <Button onClick={validateCommand} className="w-full">
          Validar Comando
        </Button>

        {validation && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              validation.valid 
                ? 'bg-green-50 border-2 border-green-200' 
                : 'bg-red-50 border-2 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {validation.valid ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`font-semibold ${
                  validation.valid ? 'text-green-900' : 'text-red-900'
                }`}>
                  {validation.valid ? 'Comando válido!' : 'Comando inválido'}
                </span>
              </div>

              {validation.issues.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-red-900 mb-2">Erros:</p>
                  <ul className="space-y-1">
                    {validation.issues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.warnings.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-semibold text-yellow-900 mb-2">Avisos:</p>
                  <ul className="space-y-1">
                    {validation.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-yellow-800 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validation.valid && validation.command && (
                <div className="mt-4 p-3 bg-white rounded border border-green-300">
                  <p className="text-xs text-green-800 font-semibold mb-2">Resumo:</p>
                  <div className="text-xs text-green-700 space-y-1">
                    <p><strong>ID:</strong> {validation.command.command_id}</p>
                    <p><strong>Versão:</strong> {validation.command.version}</p>
                    <p><strong>Operações:</strong> {validation.command.operations?.length || 0}</p>
                    <p><strong>Ambiente:</strong> {validation.command.environment || 'não especificado'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}