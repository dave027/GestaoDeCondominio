# Diretrizes de Design — SaaS Condominial

## Objetivo

Projetar o SaaS inteiro com **mobile-first**, para que moradores, síndicos, administradoras e portaria consigam executar as tarefas principais com facilidade em um celular. A experiência deve ser plenamente responsiva no computador, aproveitando o espaço adicional sem transformar o produto em uma aplicação desktop separada. Use `references/benchmark-research.md` quando precisar relembrar os padrões observados em TownSq, uCondo e Superlógica Área do Condômino.

Não copie marcas, layouts ou identidade visual dos concorrentes. Extraia padrões de interação e adapte-os ao produto, ao contexto do condomínio e às regras de negócio.

## Workflow obrigatório

1. **Definir o contexto.** Identifique papel do usuário, condomínio, unidade, dispositivo, objetivo da tarefa, permissões e consequências de erro. Se houver ambiguidade que mude o produto, faça uma pergunta; caso contrário, assuma a opção mais simples e registre-a.
2. **Mapear a jornada.** Descreva entrada, ação principal, dados necessários, confirmação, resultado, notificações, auditoria e recuperação de erro.
3. **Escolher a arquitetura.** Organize módulos por tarefa e frequência, não por estrutura interna da administradora. Use navegação específica por papel, com um núcleo compartilhado.
4. **Aplicar tokens e componentes.** Reutilize os tokens abaixo. Não crie cor, espaçamento ou padrão de interação isolado sem justificar a exceção.
5. **Desenhar estados completos.** Inclua carregando, vazio, erro, sucesso, sem permissão, indisponível por regra do condomínio, offline quando relevante e conteúdo longo.
6. **Adaptar ao dispositivo.** Comece sempre pela menor largura de tela e evolua progressivamente para tablet e computador. Preserve a mesma arquitetura, linguagem e ações principais em todos os dispositivos; apenas reorganize densidade, colunas e navegação quando houver espaço disponível.
7. **Validar.** Execute o checklist de aceite antes de entregar. Verifique acessibilidade, linguagem, status, permissões, navegação de retorno, foco, feedback e responsividade.
8. **Handoff.** Entregue tokens, componentes, regras responsivas, estados, dados de exemplo, eventos e critérios de aceite para engenharia.

## Direção de produto

Priorize as ações de maior valor e frequência: **pagar ou copiar Pix**, consultar cobrança, ler aviso, reservar uma área, abrir ou acompanhar chamado, votar, consultar documento, registrar encomenda e autorizar acesso. Mostre cada ação no primeiro nível ou em um atalho contextual.

Use módulos configuráveis: financeiro, comunicação, reservas, assembleias, chamados, documentos, portaria, encomendas, manutenção e classificados. A administração pode ativar ou desativar módulos por condomínio. Quando um recurso estiver desativado, explique o motivo e o canal correto para obter ajuda, sem exibir uma ação quebrada.

Mantenha vínculo entre entidades. Uma despesa deve apontar para seu documento; uma votação deve mostrar período, pauta e auditoria; um chamado deve mostrar responsável, prazo, anexos e histórico; uma reserva deve mostrar regras e disponibilidade.

## Perfis e arquitetura de informação

| Perfil | Padrão mobile-first | Navegação prioritária |
|---|---|---|
| Morador | Baixa densidade, feed e atalhos | Início, Financeiro, Reservas, Avisos, Chamados, Documentos, Mais |
| Síndico | Fluxos curtos no celular; visão expandida no computador | Início, Comunicação, Financeiro, Operação, Assembleias, Moradores, Relatórios |
| Administradora | Filtros e tarefas empilhados no celular; multicondomínio expandido no computador | Início, Condomínios, Tarefas, Financeiro, Atendimento, Relatórios, Configurações |
| Portaria | Fluxo rápido, leitura imediata e foco em segurança | Acessos, Encomendas, Autorizações, Ocorrências |

Permita troca explícita de condomínio e unidade quando o usuário tiver mais de um contexto. Nunca misture dados de condomínios sem indicar o contexto ativo.

## Tokens visuais

Use escala base de 4 px, preferencialmente em múltiplos de 8 px para layout. Use superfícies neutras, bordas discretas e elevação contida. A interface deve transmitir organização e segurança, não aparência de banco ou rede social.

```css
:root {
  --color-brand-primary: #1F5E63;
  --color-brand-secondary: #D9A441;
  --color-surface: #FFFFFF;
  --color-surface-subtle: #F5F7F7;
  --color-text: #172326;
  --color-text-muted: #5E6B6D;
  --color-border: #D7E0E1;
  --color-status-success: #237A57;
  --color-status-warning: #9A6500;
  --color-status-danger: #B42318;
  --color-status-info: #1769AA;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --focus-ring: 0 0 0 3px rgba(23,105,170,.35);
}
```

Ajuste a paleta à marca do produto, mas preserve contraste. Verde significa aprovado/pago/adimplente; amarelo significa pendente/em análise/em votação; vermelho significa vencido/negado/risco. Nunca use vermelho para chamar atenção sem explicar o problema.

Use tipografia sem serifa, corpo mínimo de 16 px no mobile, line-height de 1,4 a 1,6 para comunicados e labels objetivos. Use no máximo três níveis de destaque por tela. Formate valores monetários em real brasileiro e datas no padrão local, informando fuso quando necessário.

## Componentes obrigatórios

- **App shell:** contexto ativo, navegação, busca, notificações e perfil.
- **Resumo financeiro:** valor, vencimento, status textual, ação de pagar/copiar código e acesso ao documento.
- **Aviso:** escopo, data, autor, fixado, anexos, confirmação de leitura e estado lido/não lido.
- **Reserva:** calendário ou lista, disponibilidade, regras, participantes, confirmação e cancelamento.
- **Assembleia:** pauta, período, quórum, status, documentos, voto, confirmação e recibo/auditoria.
- **Chamado:** categoria, descrição, anexo, prioridade, responsável, SLA, status e histórico.
- **Tabela administrativa:** filtros, ordenação, busca, colunas configuráveis, paginação, exportação, seleção e estados de carregamento.
- **Status badge:** texto mais ícone; estados Pago, A vencer, Vencido, Processando, Disponível, Reservado, Em andamento, Resolvido e Arquivado.
- **Modal/drawer:** use para confirmação curta ou detalhes contextuais; prefira página para tarefas longas.
- **Empty state:** explique por que está vazio e ofereça a próxima ação; nunca use apenas “Sem dados”.
- **Skeleton:** preserve a geometria do conteúdo e não simule números ou status.

Todo componente interativo deve especificar padrão, hover, foco, pressionado, desabilitado, erro, carregando e sucesso. Ações irreversíveis ou com impacto financeiro exigem confirmação clara e resumo do que acontecerá.

## Responsividade mobile-first

Projete primeiro para uma largura mínima aproximada de 320 px. Não presuma hover, múltiplas janelas, teclado ou conexão rápida. Toda tarefa essencial deve ser concluída com uma mão, poucos passos e sem depender de arrastar elementos pequenos.

- **Até 640 px:** uma coluna, conteúdo em fluxo vertical, navegação inferior ou menu compacto, alvos de toque de no mínimo 44 × 44 px, botões primários com largura confortável e ações importantes fixas quando apropriado.
- **641–1024 px:** mantenha a lógica mobile, amplie margens e use duas colunas apenas quando reduzir a carga cognitiva; coloque filtros em gaveta e sinalize rolagem horizontal.
- **1025 px ou mais:** expanda cards em painéis, use sidebar ou navegação lateral, aumente a densidade das tabelas e organize conteúdo lado a lado, sem remover a possibilidade de uso por toque.

O desktop é uma **expansão responsiva do mobile**, não uma interface paralela. Não crie recursos essenciais exclusivamente para computador. Não esconda a ação principal apenas em menu. Em tabelas, use cards ou listas resumidas no celular e mantenha a coluna de identificação visível quando houver rolagem. Em formulários, empilhe campos no mobile e agrupe-os em colunas somente quando a leitura continuar clara no computador.

## Acessibilidade e confiança

Atenda WCAG 2.1 AA. Garanta contraste mínimo de 4,5:1 para texto normal e 3:1 para texto grande. Preserve foco visível e ordem lógica de teclado. Use labels persistentes, mensagens associadas aos campos, headings sem saltos, texto alternativo e suporte a zoom.

Não dependa de cor, posição ou ícone isolado para comunicar status. Leia valores críticos em texto. Antes de votar, pagar, cancelar reserva ou autorizar acesso, mostre o objeto, o prazo, a consequência e a confirmação do resultado.

## UX writing

Use português do Brasil, voz ativa e instruções acionáveis. Padronize **Unidade**, **Taxa condominial**, **Aviso**, **Assembleia**, **Reserva**, **Chamado** e **Administradora**. Evite alternar entre apartamento, imóvel e casa quando o conceito do sistema for unidade.

Mensagens devem responder o que aconteceu, por que aconteceu e o que fazer agora. Exemplo ruim: “Erro na assembleia”. Exemplo bom: “Seu voto não foi registrado porque a assembleia encerrou às 18h. Consulte a ata para acompanhar o resultado.”

Para dinheiro, use “Pagar taxa”, “Copiar Pix” ou “Baixar boleto”; evite “Efetuar operação”. Para ações de risco, use verbos específicos: “Cancelar reserva”, “Excluir aviso” e “Encerrar votação”.

## Critérios de aceite

Considere a tela pronta somente quando:

- o papel, condomínio e unidade ativos estiverem claros;
- a ação principal puder ser encontrada sem interpretação;
- permissões e módulos desativados estiverem refletidos na interface;
- todos os estados relevantes tiverem conteúdo e ação de recuperação;
- status tiver texto, não apenas cor;
- operações financeiras, votos, reservas e acessos tiverem confirmação e recibo/histórico;
- a interface funcionar nos breakpoints oficiais e suportar teclado;
- contraste, foco, alvos de toque e labels atenderem WCAG 2.1 AA;
- textos usarem o glossário condominial e mensagens acionáveis;
- tabelas, anexos e documentos tiverem comportamento de carregamento, erro e conteúdo longo;
- o handoff registrar tokens, componentes, eventos, regras de negócio e critérios testáveis.

## Formato de entrega da IA

Ao criar uma tela ou fluxo, entregue nesta ordem: **objetivo e papel**, **jornada principal**, **arquitetura da tela**, **componentes e tokens usados**, **estados**, **responsividade**, **acessibilidade**, **microcopy**, **regras de permissão**, **eventos e dados**, e **critérios de aceite**. Inclua dados realistas de exemplo sem usar dados pessoais reais.

Antes de finalizar, faça uma revisão explícita contra os critérios de aceite. Se uma decisão depender de política do condomínio, marque-a como configurável e não a fixe como regra universal.
