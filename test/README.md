# Quizinho - Test Suite

Este projeto implementa uma suíte completa de testes para garantir a qualidade e funcionamento correto da aplicação Quizinho.

## 🧪 Tipos de Testes

### Testes Unitários (Vitest)
- **Localização**: `test/lib/`, `test/components/`, `test/types/`
- **Framework**: Vitest + Testing Library
- **Cobertura**: Funções utilitárias, type guards, componentes UI

### Testes E2E (Playwright)
- **Localização**: `test/e2e/`
- **Framework**: Playwright
- **Cobertura**: Fluxos completos de usuário, interações reais

## 📋 Scripts Disponíveis

```bash
# Testes Unitários
bun run test              # Modo watch (desenvolvimento)
bun run test:run          # Executar uma vez
bun run test:ui           # Interface visual
bun run test:coverage     # Com relatório de cobertura

# Testes E2E
bun run test:e2e          # Executar testes e2e
bun run test:e2e:ui       # Interface visual do Playwright
bun run test:e2e:headed   # Executar com navegador visível

# Todos os Testes
bun run test:all          # Executar unitários + e2e
```

## 🎯 Cobertura de Testes

### A/B Testing (`test/lib/ab-testing.test.ts`)
- ✅ Distribuição de variantes
- ✅ Consistência por usuário
- ✅ Tracking de conversões
- ✅ Estatísticas e métricas
- ✅ Reset de dados

### Analytics (`test/lib/analytics.test.ts`)
- ✅ Tracking de eventos básicos
- ✅ Dados de sessão e usuário
- ✅ Eventos específicos de quiz
- ✅ Interações de UI
- ✅ Tracking de erros
- ✅ Funil de conversão

### Type Guards (`test/types/quiz.test.ts`)
- ✅ Validação de perguntas
- ✅ Validação de planos
- ✅ Validação de erros de API
- ✅ Casos extremos e edge cases

### Componentes UI (`test/components/`)
- ✅ Badge component
- ✅ Variantes e props
- ✅ Classes CSS aplicadas
- ✅ Comportamento correto

### Fluxo E2E (`test/e2e/quiz-creation.spec.ts`)
- ✅ Carregamento da homepage
- ✅ Navegação por CTA
- ✅ Seleção de planos
- ✅ Criação de perguntas
- ✅ Validação de formulários
- ✅ Design responsivo
- ✅ Dark mode toggle
- ✅ Estados de loading

## 🔧 Configuração

### Vitest (`vitest.config.ts`)
- Ambiente: jsdom
- Setup: `test/setup.ts`
- Aliases: `@/*` → `src/*`
- Excluções: e2e, node_modules, .next

### Playwright (`playwright.config.ts`)
- Navegadores: Chrome, Firefox, Safari
- Mobile: Chrome (Pixel 5), Safari (iPhone 12)
- Base URL: http://localhost:3000
- Auto-start do servidor de desenvolvimento

### Setup (`test/setup.ts`)
- Mocks do Next.js (useRouter, useSearchParams)
- Mocks de APIs web (localStorage, matchMedia)
- Mocks de observadores (Intersection, Resize)
- Supressão de warnings em testes

## 🎨 Padrões de Teste

### Estrutura dos Testes
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  })

  it('should do something specific', () => {
    // Arrange - Preparar dados
    // Act - Executar ação
    // Assert - Verificar resultado
  })
})
```

### Mocking
```typescript
// Mock de função
const mockFn = vi.fn()

// Mock de módulo
vi.mock('module-name', () => ({
  default: vi.fn()
}))

// Mock de localStorage
localStorageMock.getItem.mockReturnValue('value')
```

### Assertions
```typescript
// Vitest
expect(result).toBe(expected)
expect(result).toEqual(expected)
expect(array).toContain(item)

// Testing Library
expect(element).toBeInTheDocument()
expect(element).toHaveClass('className')
expect(element).toBeVisible()

// Playwright
await expect(page.locator('selector')).toBeVisible()
await expect(page).toHaveURL(/pattern/)
```

## 📊 Relatórios

### Cobertura de Código
- HTML: `coverage/index.html`
- JSON: `coverage/coverage-final.json`
- Texto: Exibido no terminal

### Playwright Reports
- HTML: `playwright-report/index.html`
- Screenshots: Capturados em falhas
- Traces: Para debugging

## 🚀 CI/CD Integration

Para integração com CI/CD, use:

```yaml
# GitHub Actions exemplo
- name: Run Unit Tests
  run: bun run test:run

- name: Run E2E Tests
  run: bun run test:e2e

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage-final.json
```

## 🔍 Debugging

### Testes Unitários
```bash
# Debug específico
bun run test --reporter=verbose specific.test.ts

# Watch mode com UI
bun run test:ui
```

### Testes E2E
```bash
# Com navegador visível
bun run test:e2e:headed

# Debug mode
bun run test:e2e --debug

# UI mode
bun run test:e2e:ui
```

## 📝 Adicionando Novos Testes

### Teste Unitário
1. Criar arquivo em `test/[categoria]/nome.test.ts`
2. Importar dependências necessárias
3. Escrever testes seguindo padrão AAA
4. Usar mocks quando necessário

### Teste E2E
1. Criar arquivo em `test/e2e/feature.spec.ts`
2. Usar Page Object pattern se necessário
3. Focar em fluxos de usuário reais
4. Testar em diferentes viewports

## 🎯 Métricas de Qualidade

### Objetivos de Cobertura
- **Linhas**: > 80%
- **Funções**: > 90%
- **Branches**: > 75%
- **Statements**: > 85%

### Tempo de Execução
- **Unitários**: < 10s
- **E2E**: < 2min
- **Total**: < 3min

## 🔗 Links Úteis

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Jest Matchers](https://jestjs.io/docs/expect)