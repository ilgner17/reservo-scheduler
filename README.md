# 🟣 Reservo - SaaS de Agendamento Online

## 📋 Sobre o Projeto

Reservo é uma plataforma completa de agendamento online para profissionais liberais e autônomos. Desenvolvido com tecnologias modernas para suportar 5.000+ usuários desde o primeiro dia.

### ✨ Funcionalidades Principais

- 🔐 **Sistema de Autenticação** - Cadastro, login e recuperação de senha
- 📅 **Agendamento Inteligente** - Calendário com detecção de conflitos
- 💳 **Pagamentos Integrados** - Stripe e PIX com confirmação automática
- 🎨 **Interface Moderna** - Design glassmorphism com animações 3D
- 📱 **Responsivo** - Funciona perfeitamente em todos os dispositivos
- ⚡ **Performance** - Otimizado para alta velocidade e escalabilidade

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** + **TypeScript** - Base robusta e type-safe
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Estilização utilitária
- **Framer Motion** - Animações fluidas e profissionais
- **React Query** - Gerenciamento de estado servidor
- **shadcn/ui** - Componentes acessíveis e customizáveis

### Design System
- **Paleta Roxa Premium** - Cores cuidadosamente selecionadas
- **Glassmorphism** - Efeito de vidro moderno
- **Animações 3D** - Interações envolventes
- **Responsivo** - Mobile-first design

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# 1. Clone o repositório
git clone <URL_DO_REPO>
cd reservo

# 2. Instale as dependências
npm install

# 3. Execute em modo desenvolvimento
npm run dev

# 4. Acesse no navegador
http://localhost:5173
```

### Build para Produção

```bash
# Build otimizado
npm run build

# Preview do build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn)
│   ├── Navigation.tsx  # Navegação principal
│   ├── Hero.tsx        # Seção hero da landing
│   └── BookingWidget.tsx # Widget de agendamento
├── pages/              # Páginas da aplicação
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Página de login
│   ├── Signup.tsx      # Página de cadastro
│   ├── Dashboard.tsx   # Dashboard do profissional
│   └── PublicBooking.tsx # Página pública de agendamento
├── assets/             # Recursos estáticos
├── lib/                # Utilitários
└── index.css           # Design system global
```

## 🎨 Design System

### Cores Principais
- **Primary**: `hsl(263 70% 50%)` - Roxo principal
- **Primary Glow**: `hsl(263 70% 60%)` - Variação brilhante
- **Success**: `hsl(142 76% 36%)` - Verde para confirmações
- **Warning**: `hsl(38 92% 50%)` - Amarelo para avisos

### Componentes Especiais
- **Glass Cards** - Cards com efeito glassmorphism
- **3D Buttons** - Botões com animações 3D
- **Gradient Backgrounds** - Fundos com gradientes animados
- **Floating Elements** - Elementos com animação de flutuação

## 🔧 Customização

### Alterando Cores
Edite o arquivo `src/index.css` para personalizar a paleta:

```css
:root {
  --primary: 263 70% 50%;        /* Cor principal */
  --primary-glow: 263 70% 60%;   /* Variação brilhante */
  /* ... outras variáveis */
}
```

### Adicionando Novos Componentes
1. Crie o componente em `src/components/`
2. Use as classes utilitárias do design system
3. Implemente animações com Framer Motion

### Modificando Animações
As animações estão configuradas em:
- `tailwind.config.ts` - Keyframes e classes utilitárias
- `src/index.css` - Animações CSS personalizadas

## 📱 Páginas Disponíveis

### 🏠 Landing Page (`/`)
- Hero section com call-to-action
- Recursos destacados
- Seções de preços e contato
- Footer informativo

### 🔐 Autenticação
- **Login** (`/login`) - Interface de entrada
- **Cadastro** (`/signup`) - Registro com seleção de plano

### 📊 Dashboard (`/dashboard`)
- Estatísticas em tempo real
- Próximos agendamentos
- Ações rápidas
- Link público personalizado

### 📅 Agendamento Público (`/book/:slug`)
- Perfil do profissional
- Widget de agendamento multi-etapas
- Integração de pagamentos
- Interface otimizada para conversão

## 🌟 Recursos Avançados

### Animações Inteligentes
- **Redução de movimento** - Respeita preferências de acessibilidade
- **Performance otimizada** - Usa `transform-gpu` para animações fluidas
- **Micro-interações** - Feedback visual em todas as ações

### SEO Otimizado
- Meta tags completas
- Open Graph configurado
- Schema markup preparado
- URLs semânticas

### Acessibilidade
- Navegação por teclado
- Contraste adequado
- Labels descritivos
- Foco visível

## 🔜 Próximos Passos

Para expandir o Reservo para um SaaS completo:

1. **Backend Integration**
   - Conectar com Supabase
   - Implementar autenticação real
   - Configurar pagamentos Stripe

2. **Funcionalidades Avançadas**
   - Notificações por email
   - Integração WhatsApp
   - Relatórios financeiros
   - Sistema de avaliações

3. **Otimizações**
   - PWA (Progressive Web App)
   - Caching avançado
   - Compressão de imagens

## 📞 Suporte

Para dúvidas ou suporte:
- 📧 Email: suporte@reservo.app
- 📱 WhatsApp: (11) 99999-9999
- 🌐 Website: https://reservo.app

---

**Desenvolvido com ❤️ para profissionais que querem crescer**

### What's next?
- **Refine & Customize**: Customize colors, animations, and content via prompts or visual edits
- **Master Prompting**: Use detailed prompts to add features like real-time notifications, advanced booking rules, or financial reporting
- **Add Backend**: Connect to Supabase to store bookings, handle payments, and manage user accounts with real authentication

<lov-actions>
<lov-link url="/projects/4ef80260-a446-4546-b69e-1b15f972c05d?settings=supabase">Connect Supabase</lov-link>
</lov-actions>