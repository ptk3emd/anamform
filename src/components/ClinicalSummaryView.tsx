import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Copy, Download, FileText, Pencil, Printer } from 'lucide-react';
import type { Questionnaire } from '../types/fhir';
import { buildClinicalSections, generateClinicalSummary } from '../utils/clinicalSummary';
import '../styles/clinical-record.css';

interface ClinicalSummaryViewProps {
  answers: Record<string, unknown>;
  questionnaire: Questionnaire;
  onBackToForm: () => void;
  onEditItem: (linkId: string) => void;
  onLoadSample?: () => void;
}

export const ClinicalSummaryView: React.FC<ClinicalSummaryViewProps> = ({ answers, questionnaire, onBackToForm, onEditItem, onLoadSample }) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  const [includeEmpty, setIncludeEmpty] = useState(false);
  const [viewMode, setViewMode] = useState<'document' | 'text'>('document');
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);
  const generatedAt = useMemo(() => new Date(), [answers, questionnaire]);
  const sections = useMemo(() => buildClinicalSections(answers, questionnaire), [answers, questionnaire]);
  const total = sections.reduce((sum, section) => sum + section.entries.length, 0);
  const count = sections.reduce((sum, section) => sum + section.answered, 0);
  const visibleSections = sections.filter(section => includeEmpty || section.answered > 0);
  const summaryText = useMemo(() => generateClinicalSummary(answers, questionnaire, { includeEmpty, generatedAt }), [answers, questionnaire, includeEmpty, generatedAt]);
  const allEntries = sections.flatMap(section => section.entries);
  const valueFor = (path: string) => allEntries.find(entry => entry.id === `anamnese/${path}`)?.value;
  const patientName = valueFor('identificacao/nome_completo');
  const vitals = [
    ['Pressão arterial', 'exame_fisico/pressao_arterial'],
    ['Frequência cardíaca', 'exame_fisico/fc_medida', 'exame_fisico/fc_pulso'],
    ['Frequência respiratória', 'exame_fisico/fr_medida', 'exame_fisico/fr_ritmo_respiratorio'],
    ['Temperatura', 'exame_fisico/temperatura'],
    ['Saturação de O₂', 'exame_fisico/spo2'],
  ].map(([label, ...paths]) => ({ label, entry: paths.map(path => allEntries.find(e => e.id === `anamnese/${path}` && e.answered)).find(Boolean) })).filter(vital => vital.entry);
  const allergy = allEntries.find(entry => entry.id === 'anamnese/antecedentes/alergias' && entry.answered);

  const handleCopy = async () => {
    setCopyError('');
    setCopied(false);
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError('Não foi possível copiar. Use “Baixar texto” ou selecione o conteúdo na aba Texto para PEP.');
    }
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(new Blob([summaryText], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `prontuario-${generatedAt.toISOString().slice(0, 10)}.txt`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="clinical-workspace">
      <div className="clinical-toolbar no-print">
        <button type="button" className="clinical-back" onClick={onBackToForm}><ArrowLeft aria-hidden="true" size={16} />Voltar à coleta</button>
        <div className="clinical-actions">
          <button type="button" onClick={handleDownload}><Download aria-hidden="true" size={16} />Baixar texto</button>
          <button type="button" onClick={() => window.print()}><Printer aria-hidden="true" size={16} />Imprimir / PDF</button>
          <button type="button" className="clinical-action-primary" onClick={handleCopy}>{copied ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}{copied ? 'Copiado' : 'Copiar prontuário'}</button>
        </div>
      </div>
      <div className="sr-only" role="status">{copied ? 'Prontuário copiado.' : ''}</div>
      {copyError && <p className="clinical-notice no-print" role="alert">{copyError}</p>}

      <div className="clinical-layout">
        <aside className="clinical-outline no-print" aria-label="Seções do prontuário">
          <h2>Neste prontuário</h2>
          <p>{count} de {total} itens registrados</p>
          <nav>
            {visibleSections.map(section => <a key={section.id} href={`#${section.id}`} onClick={() => setViewMode('document')}><span>{section.title}</span><span className="clinical-outline-count">{section.answered}</span></a>)}
          </nav>
          {!count && <p>As seções aparecem à medida que você registra informações.</p>}
          <p className="clinical-outline-note">Todos os campos são opcionais. O prontuário pode ser gerado a qualquer momento.</p>
        </aside>

        <div className="clinical-main">
          <div className="clinical-display-options no-print">
            <div className="clinical-view-switch" aria-label="Visualização do prontuário">
              <button type="button" aria-pressed={viewMode === 'document'} onClick={() => setViewMode('document')}>Leitura</button>
              <button type="button" aria-pressed={viewMode === 'text'} onClick={() => setViewMode('text')}>Texto para PEP</button>
            </div>
            <label><input type="checkbox" checked={includeEmpty} onChange={event => setIncludeEmpty(event.target.checked)} />Mostrar não preenchidos</label>
          </div>

          <article className={`clinical-document ${viewMode === 'text' ? 'clinical-document--text' : ''}`} aria-label="Prontuário clínico">
            <div className="clinical-document-heading">
              <div className="clinical-document-title"><FileText aria-hidden="true" size={22} /><h1>Prontuário clínico</h1></div>
              <p className="clinical-document-subtitle">Anamnese, exame físico e plano de cuidado</p>
              <div className="clinical-document-stamp"><span>{count} {count === 1 ? 'item registrado' : 'itens registrados'}</span><time dateTime={generatedAt.toISOString()}>Gerado em {generatedAt.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</time></div>
            </div>

            <div className="clinical-reading-content">
              <div className="clinical-patient">
                <h2>{patientName && patientName !== 'Não informado' ? patientName : 'Identificação não informada'}</h2>
                <dl>
                  <div><dt>Nascimento</dt><dd>{valueFor('identificacao/data_nascimento') || 'Não informado'}</dd></div>
                  {valueFor('identificacao/sexo_biologico') && <div><dt>Sexo informado</dt><dd>{valueFor('identificacao/sexo_biologico')}</dd></div>}
                  {valueFor('identificacao/profissao') && <div><dt>Ocupação</dt><dd>{valueFor('identificacao/profissao')}</dd></div>}
                </dl>
              </div>
              <p className="clinical-record-note">Somente informações registradas. Um campo em branco não significa ausência de sintoma ou exame normal.</p>

              {allergy && <div className="clinical-allergy"><h3>Alergias · relato registrado</h3><p>{allergy.value}</p></div>}
              {vitals.length > 0 && <dl className="clinical-vitals">{vitals.map(({ label, entry }) => <div key={label}><dt>{label}</dt><dd>{entry!.value}</dd></div>)}</dl>}

              {!count && <div className="clinical-empty">
                <h2>Seu registro começa na coleta.</h2>
                <p>Preencha os itens pertinentes ao atendimento. As respostas serão organizadas aqui, sem completar informações por suposição.</p>
                <div className="clinical-actions no-print"><button type="button" className="clinical-action-primary" onClick={onBackToForm}>Iniciar coleta</button>{onLoadSample && <button type="button" onClick={onLoadSample}>Ver caso demonstrativo</button>}</div>
              </div>}

              {visibleSections.map(section => <section className="clinical-section" id={section.id} key={section.id}>
                <div className="clinical-section-heading"><h2>{section.title}</h2><button type="button" className="clinical-edit no-print" onClick={() => onEditItem(section.entries[0].id)} aria-label={`Editar ${section.title}`}><Pencil aria-hidden="true" size={14} /><span>Editar seção</span></button></div>
                <dl className="clinical-entries">{section.entries.filter(entry => includeEmpty || entry.answered).map(entry => <div className={`clinical-entry ${entry.parentId ? 'clinical-entry--detail' : ''} ${!entry.answered ? 'clinical-entry--empty' : ''}`} key={entry.id}>
                  <dt><button type="button" className="clinical-entry-link" onClick={() => onEditItem(entry.id)} title="Editar esta resposta">{entry.label}</button></dt>
                  <dd>{entry.value}</dd>
                </div>)}</dl>
              </section>)}
              <footer className="clinical-document-footer">Documento gerado a partir das respostas registradas. Revise o conteúdo antes de incorporar ao prontuário.</footer>
            </div>
            {viewMode === 'text' && <pre className="clinical-plain-text no-print" tabIndex={0} aria-label="Texto do prontuário para copiar">{summaryText}</pre>}
          </article>
        </div>
      </div>
    </div>
  );
};
