import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Locale = "en" | "es" | "pt";

export const LOCALE_TAG: Record<Locale, string> = {
  en: "en-US",
  es: "es-ES",
  pt: "pt-BR",
};

export const LANGUAGE_ORDER: Locale[] = ["en", "es", "pt"];

export const LANGUAGE_LABEL: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

// Matches the LOCALE_TAG region (en-US, es-ES, pt-BR), not a claim about where the
// language is spoken — just a recognizable visual marker per option.
export const LANGUAGE_FLAG: Record<Locale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  pt: "🇧🇷",
};

type Entry = Record<Locale, string>;

// UI chrome only — labels, buttons, nav, forms, empty states. Simulated AI replies, seeded chat
// content, and quiz/exam question text are intentionally left in English: that's content the real
// Azure OpenAI backend generates (and can already generate in any language) once wired up, not UI.
const T: Record<string, Entry> = {
  "common.signIn": { en: "Sign in", es: "Iniciar sesión", pt: "Entrar" },
  "common.retake": { en: "Retake", es: "Repetir", pt: "Refazer" },
  "common.close": { en: "Close", es: "Cerrar", pt: "Fechar" },
  "common.copy": { en: "Copy", es: "Copiar", pt: "Copiar" },
  "common.copied": { en: "Copied", es: "Copiado", pt: "Copiado" },
  "common.continue": { en: "Continue", es: "Continuar", pt: "Continuar" },
  "common.openMenu": { en: "Open menu", es: "Abrir menú", pt: "Abrir menu" },
  "common.closeMenu": { en: "Close menu", es: "Cerrar menú", pt: "Fechar menu" },
  "nav.primary": { en: "Primary", es: "Principal", pt: "Principal" },

  "nav.dashboard": { en: "Dashboard", es: "Panel", pt: "Painel" },
  "nav.studyChat": { en: "Study Chat", es: "Chat de estudio", pt: "Chat de estudo" },
  "nav.chat": { en: "Chat", es: "Chat", pt: "Chat" },
  "nav.practiceExams": { en: "Practice Exams", es: "Exámenes de práctica", pt: "Exames de prática" },
  "nav.exams": { en: "Exams", es: "Exámenes", pt: "Exames" },
  "nav.achievements": { en: "Achievements", es: "Logros", pt: "Conquistas" },
  "nav.profile": { en: "Profile", es: "Perfil", pt: "Perfil" },
  "nav.settings": { en: "Settings", es: "Configuración", pt: "Configurações" },

  "sidebar.studying": { en: "Studying", es: "Estudiando", pt: "Estudando" },
  "sidebar.notSignedIn": { en: "Not signed in", es: "No has iniciado sesión", pt: "Não conectado" },
  "sidebar.sessionsNotSaved": {
    en: "Sessions won't be saved",
    es: "Las sesiones no se guardarán",
    pt: "As sessões não serão salvas",
  },
  "sidebar.signedIn": { en: "Signed in", es: "Sesión iniciada", pt: "Conectado" },
  "sidebar.logOut": { en: "Log out", es: "Cerrar sesión", pt: "Sair" },

  "guest.defaultMessage": {
    en: "Sign in or create an account to save study sessions across devices.",
    es: "Inicia sesión o crea una cuenta para guardar tus sesiones de estudio en todos tus dispositivos.",
    pt: "Entre ou crie uma conta para salvar suas sessões de estudo em todos os dispositivos.",
  },
  "guest.dashboardMessage": {
    en: "Sign in or create an account to save your dashboard progress across devices.",
    es: "Inicia sesión o crea una cuenta para guardar el progreso de tu panel en todos tus dispositivos.",
    pt: "Entre ou crie uma conta para salvar o progresso do seu painel em todos os dispositivos.",
  },
  "guest.chatMessage": {
    en: "Sign in or create an account to keep this conversation saved across devices.",
    es: "Inicia sesión o crea una cuenta para mantener esta conversación guardada en todos tus dispositivos.",
    pt: "Entre ou crie uma conta para manter esta conversa salva em todos os dispositivos.",
  },
  "guest.settingsMessage": {
    en: "Sign in to see your real usage history and manage account recovery.",
    es: "Inicia sesión para ver tu historial de uso real y gestionar la recuperación de tu cuenta.",
    pt: "Entre para ver seu histórico de uso real e gerenciar a recuperação da conta.",
  },
  "guest.profileMessage": {
    en: "Sign in to save your certification goal and profile across devices.",
    es: "Inicia sesión para guardar tu objetivo de certificación y perfil en todos tus dispositivos.",
    pt: "Entre para salvar sua meta de certificação e perfil em todos os dispositivos.",
  },

  "profile.title": { en: "Profile", es: "Perfil", pt: "Perfil" },
  "profile.subtitle": {
    en: "Your identity, and the certification goal that shapes the rest of the app.",
    es: "Tu identidad y el objetivo de certificación que da forma al resto de la app.",
    pt: "Sua identidade e a meta de certificação que molda o resto do app.",
  },
  "profile.goalEyebrow": { en: "Certification goal", es: "Objetivo de certificación", pt: "Meta de certificação" },
  "profile.goalTitle": { en: "What are you working toward?", es: "¿Hacia qué estás trabajando?", pt: "O que você está buscando?" },
  "profile.goalCaption": {
    en: "This picks which certification path shows on your dashboard.",
    es: "Esto elige qué ruta de certificación aparece en tu panel.",
    pt: "Isso escolhe qual trilha de certificação aparece no seu painel.",
  },
  "profile.goalNote": {
    en: "You can still practice for any exam in the catalog — this only changes what's featured on your dashboard.",
    es: "Aún puedes practicar para cualquier examen del catálogo — esto solo cambia lo que se destaca en tu panel.",
    pt: "Você ainda pode praticar para qualquer exame do catálogo — isso só muda o que aparece em destaque no seu painel.",
  },
  "profile.track.azure.desc": {
    en: "Cloud infrastructure, administration, and solutions architecture.",
    es: "Infraestructura en la nube, administración y arquitectura de soluciones.",
    pt: "Infraestrutura em nuvem, administração e arquitetura de soluções.",
  },
  "profile.track.ai.desc": {
    en: "Cognitive services, machine learning, and AI engineering.",
    es: "Servicios cognitivos, aprendizaje automático e ingeniería de IA.",
    pt: "Serviços cognitivos, machine learning e engenharia de IA.",
  },
  "profile.track.security.desc": {
    en: "Identity, security operations, and cybersecurity architecture.",
    es: "Identidad, operaciones de seguridad y arquitectura de ciberseguridad.",
    pt: "Identidade, operações de segurança e arquitetura de cibersegurança.",
  },

  "auth.welcomeBack": { en: "Welcome back", es: "Bienvenido de nuevo", pt: "Bem-vindo de volta" },
  "auth.createAccount": { en: "Create your account", es: "Crea tu cuenta", pt: "Crie sua conta" },
  "auth.resetPassword": { en: "Reset your password", es: "Restablece tu contraseña", pt: "Redefina sua senha" },
  "auth.loginIntro": {
    en: "Log in to open your saved sessions on another device.",
    es: "Inicia sesión para abrir tus sesiones guardadas en otro dispositivo.",
    pt: "Entre para abrir suas sessões salvas em outro dispositivo.",
  },
  "auth.username": { en: "Username", es: "Nombre de usuario", pt: "Nome de usuário" },
  "auth.password": { en: "Password", es: "Contraseña", pt: "Senha" },
  "auth.logIn": { en: "Log in", es: "Iniciar sesión", pt: "Entrar" },
  "auth.createAccountInstead": {
    en: "Create an account instead",
    es: "Crear una cuenta en su lugar",
    pt: "Criar uma conta em vez disso",
  },
  "auth.forgotPassword": { en: "Forgot password?", es: "¿Olvidaste tu contraseña?", pt: "Esqueceu a senha?" },
  "auth.signupIntro": {
    en: "Accounts and saved sessions are demo-only here — nothing is sent anywhere.",
    es: "Las cuentas y sesiones guardadas aquí son solo una demostración — no se envía nada a ningún lado.",
    pt: "Contas e sessões salvas aqui são apenas demonstrativas — nada é enviado a lugar nenhum.",
  },
  "auth.alreadyHaveAccount": {
    en: "Already have an account? Log in",
    es: "¿Ya tienes una cuenta? Inicia sesión",
    pt: "Já tem uma conta? Entrar",
  },
  "auth.forgotIntro": {
    en: "Password reset uses your recovery code — there's no email recovery. Enter your username to continue.",
    es: "El restablecimiento de contraseña usa tu código de recuperación — no hay recuperación por correo. Ingresa tu nombre de usuario para continuar.",
    pt: "A redefinição de senha usa seu código de recuperação — não há recuperação por e-mail. Digite seu nome de usuário para continuar.",
  },
  "auth.continueWithRecoveryCode": {
    en: "Continue with recovery code",
    es: "Continuar con código de recuperación",
    pt: "Continuar com código de recuperação",
  },
  "auth.backToLogin": { en: "Back to login", es: "Volver a iniciar sesión", pt: "Voltar ao login" },
  "auth.saveRecoveryCode": {
    en: "Save your recovery code",
    es: "Guarda tu código de recuperación",
    pt: "Salve seu código de recuperação",
  },
  "auth.recoveryCodeWarning": {
    en: "Shown once. Anyone holding this code can reset your password — keep it secret and save it offline. This code will not be shown again.",
    es: "Se muestra una sola vez. Cualquiera que tenga este código puede restablecer tu contraseña — mantenlo en secreto y guárdalo fuera de línea. Este código no se volverá a mostrar.",
    pt: "Exibido apenas uma vez. Qualquer pessoa com este código pode redefinir sua senha — mantenha-o em segredo e salve-o offline. Este código não será mostrado novamente.",
  },
  "auth.copyRecoveryCode": {
    en: "Copy recovery code",
    es: "Copiar código de recuperación",
    pt: "Copiar código de recuperação",
  },
  "auth.savedRecoveryCodeCheckbox": {
    en: "I've saved my recovery code somewhere safe.",
    es: "He guardado mi código de recuperación en un lugar seguro.",
    pt: "Salvei meu código de recuperação em um lugar seguro.",
  },
  "auth.signInDialogLabel": { en: "Sign in", es: "Iniciar sesión", pt: "Entrar" },

  "dashboard.welcomeBack": { en: "Welcome back, {{name}}", es: "Bienvenido de nuevo, {{name}}", pt: "Bem-vindo de volta, {{name}}" },
  "dashboard.welcome": { en: "Welcome", es: "Bienvenido", pt: "Bem-vindo" },
  "dashboard.streakSubtitle": {
    en: "{{count}}-day streak. Keep the momentum going.",
    es: "Racha de {{count}} días. Sigue con el impulso.",
    pt: "Sequência de {{count}} dias. Continue com o ritmo.",
  },
  "dashboard.streakSubtitleZero": {
    en: "Start a study session today to build your streak.",
    es: "Comienza una sesión de estudio hoy para iniciar tu racha.",
    pt: "Comece uma sessão de estudo hoje para iniciar sua sequência.",
  },
  "dashboard.resumeStudying": { en: "Resume studying", es: "Continuar estudiando", pt: "Continuar estudando" },
  "dashboard.lastExamStrip": {
    en: "Last {{code}} practice exam: {{score}}% · {{when}}",
    es: "Último examen de práctica de {{code}}: {{score}}% · {{when}}",
    pt: "Último exame de prática de {{code}}: {{score}}% · {{when}}",
  },
  "dashboard.noExamYet": {
    en: "You haven't taken a {{code}} practice exam yet.",
    es: "Aún no has realizado un examen de práctica de {{code}}.",
    pt: "Você ainda não fez um exame de prática de {{code}}.",
  },
  "dashboard.takePracticeExam": { en: "Take practice exam", es: "Realizar examen de práctica", pt: "Fazer exame de prática" },
  "dashboard.recommendedNext": { en: "Recommended next", es: "Recomendado a continuación", pt: "Recomendado a seguir" },
  "dashboard.viewStudyPlan": { en: "View study plan", es: "Ver plan de estudio", pt: "Ver plano de estudo" },
  "dashboard.today": { en: "today", es: "hoy", pt: "hoje" },
  "dashboard.yesterday": { en: "yesterday", es: "ayer", pt: "ontem" },
  "dashboard.daysAgo": { en: "{{count}} days ago", es: "hace {{count}} días", pt: "há {{count}} dias" },
  "dashboard.action.mockTitle": { en: "Full {{code}} mock exam", es: "Examen simulado completo de {{code}}", pt: "Exame simulado completo de {{code}}" },
  "dashboard.action.mockSubtitle": {
    en: "See where you'd land under real exam conditions.",
    es: "Descubre cómo te iría en condiciones reales de examen.",
    pt: "Veja como você se sairia em condições reais de prova.",
  },
  "dashboard.action.coverageSubtitle": {
    en: "{{answered}} of {{threshold}} questions answered — answer more to build a readiness score.",
    es: "{{answered}} de {{threshold}} preguntas respondidas — responde más para calcular tu preparación.",
    pt: "{{answered}} de {{threshold}} perguntas respondidas — responda mais para calcular seu preparo.",
  },
  "dashboard.action.drillSubtitle": {
    en: "Your weakest domain so far, at {{accuracy}}% accuracy.",
    es: "Tu dominio más débil hasta ahora, con {{accuracy}}% de precisión.",
    pt: "Seu domínio mais fraco até agora, com {{accuracy}}% de precisão.",
  },
  "dashboard.weakSpots.title": { en: "Where to focus", es: "Dónde enfocarte", pt: "Onde focar" },
  "dashboard.weakSpots.subtitle": {
    en: "Domains with the most room to improve, based on your graded answers.",
    es: "Dominios con más margen de mejora, según tus respuestas calificadas.",
    pt: "Domínios com mais espaço para melhorar, com base nas suas respostas avaliadas.",
  },
  "dashboard.weakSpots.empty": {
    en: "Answer a few practice questions to see where you need the most work.",
    es: "Responde algunas preguntas de práctica para ver dónde necesitas más trabajo.",
    pt: "Responda algumas perguntas de prática para ver onde você mais precisa melhorar.",
  },
  "dashboard.weakSpots.drill": { en: "Drill this", es: "Practicar esto", pt: "Praticar isto" },
  "dashboard.weakSpots.accuracy": { en: "{{pct}}% accuracy", es: "{{pct}}% de precisión", pt: "{{pct}}% de precisão" },

  "ring.examReadiness": { en: "Exam Readiness", es: "Preparación para el examen", pt: "Preparação para o exame" },
  "ring.weeklyDelta": { en: "+{{pct}}% this week", es: "+{{pct}}% esta semana", pt: "+{{pct}}% esta semana" },
  "ring.limitedEvidence": { en: "Limited evidence", es: "Evidencia limitada", pt: "Evidência limitada" },
  "ring.readyToSit": { en: "ready to sit", es: "listo para presentar", pt: "pronto para o exame" },
  "ring.preliminaryRead": { en: "preliminary read", es: "lectura preliminar", pt: "leitura preliminar" },
  "ring.readySentence": {
    en: "Predicted score based on your last {{count}} practice sessions.",
    es: "Puntaje previsto según tus últimas {{count}} sesiones de práctica.",
    pt: "Pontuação prevista com base nas suas últimas {{count}} sessões de prática.",
  },
  "ring.buildingSentence": {
    en: "Coverage: {{covered}}/{{total}} domains with {{threshold}}+ answers. Not a pass prediction — small samples can't establish readiness.",
    es: "Cobertura: {{covered}}/{{total}} dominios con {{threshold}}+ respuestas. No es una predicción de aprobación — muestras pequeñas no pueden establecer preparación.",
    pt: "Cobertura: {{covered}}/{{total}} domínios com {{threshold}}+ respostas. Não é uma previsão de aprovação — amostras pequenas não conseguem estabelecer preparo.",
  },

  "streak.momentum": { en: "Momentum", es: "Impulso", pt: "Ritmo" },
  "streak.studyStreak": { en: "Study streak", es: "Racha de estudio", pt: "Sequência de estudo" },
  "streak.dayInARow": { en: "day in a row", es: "día seguido", pt: "dia seguido" },
  "streak.daysInARow": { en: "days in a row", es: "días seguidos", pt: "dias seguidos" },
  "streak.keepItAlive": { en: "Keep it alive — study today.", es: "Mantenla viva — estudia hoy.", pt: "Mantenha viva — estude hoje." },
  "streak.startStreak": {
    en: "Study today to start a new streak.",
    es: "Estudia hoy para comenzar una nueva racha.",
    pt: "Estude hoje para começar uma nova sequência.",
  },
  "streak.bestStreak": { en: "Best streak", es: "Mejor racha", pt: "Melhor sequência" },
  "streak.studyDays": { en: "Study days", es: "Días de estudio", pt: "Dias de estudo" },
  "streak.questionsAnswered": { en: "Questions answered", es: "Preguntas respondidas", pt: "Perguntas respondidas" },

  "heatmap.studyActivity": {
    en: "Study activity · last {{days}} days",
    es: "Actividad de estudio · últimos {{days}} días",
    pt: "Atividade de estudo · últimos {{days}} dias",
  },
  "heatmap.eventsInWindow": {
    en: "events logged",
    es: "eventos registrados",
    pt: "eventos registrados",
  },
  "heatmap.lastWeek": { en: "Last week", es: "Semana pasada", pt: "Semana passada" },
  "heatmap.thisWeek": { en: "This week", es: "Esta semana", pt: "Esta semana" },
  "heatmap.event": { en: "study event", es: "evento de estudio", pt: "evento de estudo" },
  "heatmap.events": { en: "study events", es: "eventos de estudio", pt: "eventos de estudo" },
  "heatmap.accuracyNote": {
    en: "accuracy needs {{threshold}}+ graded answers",
    es: "la precisión necesita {{threshold}}+ respuestas calificadas",
    pt: "a precisão precisa de {{threshold}}+ respostas avaliadas",
  },
  "heatmap.legend.zero": { en: "Zero", es: "Cero", pt: "Zero" },
  "heatmap.legend.low": { en: "Low", es: "Bajo", pt: "Baixo" },
  "heatmap.legend.medium": { en: "Medium", es: "Medio", pt: "Médio" },
  "heatmap.legend.high": { en: "High", es: "Alto", pt: "Alto" },
  "heatmap.legend.peak": { en: "Peak", es: "Máximo", pt: "Pico" },

  "certPath.eyebrow": { en: "Certification path", es: "Ruta de certificación", pt: "Trilha de certificação" },
  "certPath.title": { en: "Your {{track}} journey", es: "Tu trayectoria en {{track}}", pt: "Sua jornada em {{track}}" },
  "certPath.track.azure": { en: "Azure", es: "Azure", pt: "Azure" },
  "certPath.track.ai": { en: "AI", es: "IA", pt: "IA" },
  "certPath.track.security": { en: "Security", es: "Seguridad", pt: "Segurança" },
  "certPath.tier.fundamentals": { en: "Fundamentals", es: "Fundamentos", pt: "Fundamentos" },
  "certPath.tier.associate": { en: "Associate", es: "Asociado", pt: "Associado" },
  "certPath.tier.expert": { en: "Expert", es: "Experto", pt: "Especialista" },
  "certPath.status.completed": { en: "Completed", es: "Completado", pt: "Concluído" },
  "certPath.status.available": { en: "Up next", es: "Sigue", pt: "A seguir" },
  "certPath.status.locked": { en: "Locked", es: "Bloqueado", pt: "Bloqueado" },

  "landing.signIn": { en: "Sign in", es: "Iniciar sesión", pt: "Entrar" },
  "landing.eyebrow": {
    en: "Microsoft certification prep, reimagined",
    es: "La preparación para certificaciones de Microsoft, reinventada",
    pt: "A preparação para certificações da Microsoft, reinventada",
  },
  "landing.headline": {
    en: "Study smarter. Certify faster.",
    es: "Estudia más inteligente. Certifícate más rápido.",
    pt: "Estude com mais inteligência. Certifique-se mais rápido.",
  },
  "landing.subheadline": {
    en: "An AI study partner, adaptive weak-spot drills, and timed mock exams — built to turn scattered studying into a clear path to your next Microsoft certification.",
    es: "Un compañero de estudio con IA, ejercicios adaptativos en tus puntos débiles y exámenes simulados cronometrados, diseñados para convertir el estudio disperso en un camino claro hacia tu próxima certificación de Microsoft.",
    pt: "Um parceiro de estudo com IA, exercícios adaptativos nos seus pontos fracos e exames simulados cronometrados — feitos para transformar o estudo disperso em um caminho claro para sua próxima certificação da Microsoft.",
  },
  "landing.ctaPrimary": { en: "Start studying free", es: "Empieza a estudiar gratis", pt: "Comece a estudar grátis" },
  "landing.ctaSecondary": { en: "Sign in", es: "Iniciar sesión", pt: "Entrar" },
  "landing.trustLine": {
    en: "No credit card, no account required to start.",
    es: "Sin tarjeta de crédito, no se requiere cuenta para empezar.",
    pt: "Sem cartão de crédito, nenhuma conta necessária para começar.",
  },
  "landing.statCerts": { en: "certifications covered", es: "certificaciones cubiertas", pt: "certificações cobertas" },
  "landing.statTracks": { en: "certification tracks", es: "trayectorias de certificación", pt: "trilhas de certificação" },
  "landing.statLanguages": { en: "languages", es: "idiomas", pt: "idiomas" },
  "landing.chatPreviewEyebrow": {
    en: "Study chat, in action",
    es: "Chat de estudio, en acción",
    pt: "Chat de estudo, em ação",
  },
  "landing.chatPreviewUser": {
    en: "Explain the difference between Azure Front Door and Azure Application Gateway.",
    es: "Explica la diferencia entre Azure Front Door y Azure Application Gateway.",
    pt: "Explique a diferença entre Azure Front Door e Azure Application Gateway.",
  },
  "landing.chatPreviewAssistant": {
    en: "Front Door load-balances across regions at the edge; Application Gateway load-balances within a single region and adds a Web Application Firewall...",
    es: "Front Door balancea la carga entre regiones en el borde; Application Gateway balancea la carga dentro de una sola región y añade un Firewall de Aplicaciones Web...",
    pt: "O Front Door balanceia a carga entre regiões na borda; o Application Gateway balanceia a carga dentro de uma única região e adiciona um Firewall de Aplicações Web...",
  },
  "landing.feature.chat.title": { en: "AI study chat", es: "Chat de estudio con IA", pt: "Chat de estudo com IA" },
  "landing.feature.chat.desc": {
    en: "Ask anything about Azure and get a tutor that never runs out of patience.",
    es: "Pregunta lo que quieras sobre Azure y obtén un tutor con paciencia infinita.",
    pt: "Pergunte qualquer coisa sobre o Azure e tenha um tutor com paciência infinita.",
  },
  "landing.feature.weakSpots.title": { en: "Weak-spot drilling", es: "Práctica en puntos débiles", pt: "Prática nos pontos fracos" },
  "landing.feature.weakSpots.desc": {
    en: "We surface exactly the domains dragging down your readiness score.",
    es: "Identificamos exactamente los dominios que bajan tu puntaje de preparación.",
    pt: "Identificamos exatamente os domínios que reduzem sua pontuação de preparo.",
  },
  "landing.feature.streaks.title": { en: "Streaks that motivate", es: "Rachas que motivan", pt: "Sequências que motivam" },
  "landing.feature.streaks.desc": {
    en: "Build momentum with a streak system that feels like progress, not pressure.",
    es: "Genera impulso con un sistema de rachas que se siente como progreso, no presión.",
    pt: "Ganhe impulso com um sistema de sequências que parece progresso, não pressão.",
  },
  "landing.feature.mockExams.title": { en: "Timed mock exams", es: "Exámenes simulados cronometrados", pt: "Exames simulados cronometrados" },
  "landing.feature.mockExams.desc": {
    en: "Simulate real exam conditions before you sit the real thing.",
    es: "Simula condiciones reales de examen antes de presentar el real.",
    pt: "Simule condições reais de prova antes de fazer a prova de verdade.",
  },
  "landing.closingHeadline": {
    en: "Your next certification starts with one question.",
    es: "Tu próxima certificación empieza con una pregunta.",
    pt: "Sua próxima certificação começa com uma pergunta.",
  },
  "landing.closingSubline": {
    en: "Sign in later to save your progress across devices.",
    es: "Inicia sesión más tarde para guardar tu progreso en todos tus dispositivos.",
    pt: "Entre mais tarde para salvar seu progresso em todos os dispositivos.",
  },

  "exams.title": { en: "Practice Exams", es: "Exámenes de práctica", pt: "Exames de prática" },
  "exams.subtitle": {
    en: "Full-length, timed simulations across the full Microsoft certification catalog.",
    es: "Simulaciones completas y cronometradas de todo el catálogo de certificaciones de Microsoft.",
    pt: "Simulações completas e cronometradas de todo o catálogo de certificações da Microsoft.",
  },
  "exams.addExam": { en: "Add exam to list", es: "Añadir examen a la lista", pt: "Adicionar exame à lista" },
  "exams.yourPath": { en: "Your {{track}} path", es: "Tu ruta de {{track}}", pt: "Sua trilha de {{track}}" },
  "exams.otherExams": { en: "Other exams you're practicing", es: "Otros exámenes que practicas", pt: "Outros exames que você está praticando" },
  "exams.otherCategory": { en: "Other", es: "Otros", pt: "Outros" },
  "exams.questions": { en: "questions", es: "preguntas", pt: "perguntas" },
  "exams.min": { en: "min", es: "min", pt: "min" },
  "exams.best": { en: "Best {{score}}%", es: "Mejor {{score}}%", pt: "Melhor {{score}}%" },
  "exams.notAttempted": { en: "Not attempted", es: "No intentado", pt: "Não tentado" },
  "exams.resume": { en: "Resume", es: "Reanudar", pt: "Retomar" },
  "exams.startExam": { en: "Start exam", es: "Comenzar examen", pt: "Iniciar exame" },

  "mockExam.backToPracticeExams": {
    en: "Back to Practice Exams",
    es: "Volver a Exámenes de práctica",
    pt: "Voltar aos Exames de prática",
  },
  "mockExam.mockExamLabel": { en: "Mock Exam", es: "Examen simulado", pt: "Exame simulado" },
  "mockExam.questionsLabel": { en: "Questions", es: "Preguntas", pt: "Perguntas" },
  "mockExam.minutesLabel": { en: "Minutes", es: "Minutos", pt: "Minutos" },
  "mockExam.practiceDisclaimer": {
    en: "Practice only — not an official score. Once started, the timer won't pause.",
    es: "Solo práctica — no es un puntaje oficial. Una vez iniciado, el cronómetro no se detendrá.",
    pt: "Apenas prática — não é uma pontuação oficial. Uma vez iniciado, o cronômetro não pausa.",
  },
  "mockExam.beginExam": { en: "Begin exam", es: "Comenzar examen", pt: "Iniciar exame" },
  "mockExam.questionProgress": {
    en: "Question {{current}} of {{total}}",
    es: "Pregunta {{current}} de {{total}}",
    pt: "Pergunta {{current}} de {{total}}",
  },
  "mockExam.submit": { en: "Submit", es: "Enviar", pt: "Enviar" },
  "mockExam.goToQuestion": { en: "Go to question {{n}}", es: "Ir a la pregunta {{n}}", pt: "Ir para a pergunta {{n}}" },
  "mockExam.previous": { en: "Previous", es: "Anterior", pt: "Anterior" },
  "mockExam.flagged": { en: "Flagged", es: "Marcada", pt: "Marcada" },
  "mockExam.flagForReview": { en: "Flag for review", es: "Marcar para revisar", pt: "Marcar para revisão" },
  "mockExam.flag": { en: "Flag", es: "Marcar", pt: "Marcar" },
  "mockExam.next": { en: "Next", es: "Siguiente", pt: "Próxima" },
  "mockExam.submitExam": { en: "Submit exam", es: "Enviar examen", pt: "Enviar exame" },
  "mockExam.submitExamQuestion": { en: "Submit exam?", es: "¿Enviar examen?", pt: "Enviar exame?" },
  "mockExam.unansweredWarningOne": {
    en: "1 question unanswered. ",
    es: "1 pregunta sin responder. ",
    pt: "1 pergunta sem resposta. ",
  },
  "mockExam.unansweredWarning": {
    en: "{{count}} questions unanswered. ",
    es: "{{count}} preguntas sin responder. ",
    pt: "{{count}} perguntas sem resposta. ",
  },
  "mockExam.cantChangeAnswers": {
    en: "You won't be able to change your answers after submitting.",
    es: "No podrás cambiar tus respuestas después de enviar.",
    pt: "Você não poderá alterar suas respostas depois de enviar.",
  },
  "mockExam.keepGoing": { en: "Keep going", es: "Seguir intentando", pt: "Continuar" },
  "mockExam.resultsLabel": { en: "Mock exam results", es: "Resultados del examen simulado", pt: "Resultados do exame simulado" },
  "mockExam.correctOf": { en: "{{correct}} of {{total}} correct", es: "{{correct}} de {{total}} correctas", pt: "{{correct}} de {{total}} corretas" },
  "mockExam.practiceScoreDisclaimer": {
    en: "Practice score only — not an official exam score.",
    es: "Puntaje de práctica únicamente — no es un puntaje oficial del examen.",
    pt: "Apenas pontuação de prática — não é uma pontuação oficial do exame.",
  },
  "mockExam.byDomain": { en: "By domain", es: "Por dominio", pt: "Por domínio" },
  "mockExam.review": { en: "Review", es: "Revisión", pt: "Revisão" },
  "mockExam.yourAnswer": { en: "Your answer: {{answer}}", es: "Tu respuesta: {{answer}}", pt: "Sua resposta: {{answer}}" },
  "mockExam.notAnswered": { en: "Not answered", es: "Sin responder", pt: "Sem resposta" },
  "mockExam.correctAnswer": { en: "Correct answer: {{answer}}", es: "Respuesta correcta: {{answer}}", pt: "Resposta correta: {{answer}}" },

  "achievements.title": { en: "Achievements", es: "Logros", pt: "Conquistas" },
  "achievements.subtitle": {
    en: "{{earned}} of {{total}} earned. Momentum compounds — keep the streak going.",
    es: "{{earned}} de {{total}} obtenidos. El impulso se acumula — mantén la racha.",
    pt: "{{earned}} de {{total}} conquistadas. O ritmo se acumula — mantenha a sequência.",
  },
  "achievements.streak5.title": { en: "5-Day Streak", es: "Racha de 5 días", pt: "Sequência de 5 dias" },
  "achievements.streak5.desc": { en: "Study 5 days in a row", es: "Estudia 5 días seguidos", pt: "Estude 5 dias seguidos" },
  "achievements.perfect.title": { en: "First Perfect Score", es: "Primer puntaje perfecto", pt: "Primeira pontuação perfeita" },
  "achievements.perfect.desc": { en: "Score 100% on a practice quiz", es: "Obtén 100% en un cuestionario de práctica", pt: "Obtenha 100% em um teste de prática" },
  "achievements.sprinter.title": { en: "Quiz Sprinter", es: "Velocista de cuestionarios", pt: "Velocista de testes" },
  "achievements.sprinter.desc": { en: "Answer 20 questions in one session", es: "Responde 20 preguntas en una sesión", pt: "Responda 20 perguntas em uma sessão" },
  "achievements.domainMaster.title": { en: "Domain Master", es: "Maestro del dominio", pt: "Mestre do domínio" },
  "achievements.domainMaster.desc": { en: "Score {{threshold}}%+ across a full domain", es: "Obtén {{threshold}}%+ en un dominio completo", pt: "Obtenha {{threshold}}%+ em um domínio completo" },
  "achievements.earlyBird.title": { en: "Early Bird", es: "Madrugador", pt: "Madrugador" },
  "achievements.earlyBird.desc": { en: "Study before 7am five times", es: "Estudia antes de las 7am cinco veces", pt: "Estude antes das 7h cinco vezes" },
  "achievements.examReady.title": { en: "Exam Ready", es: "Listo para el examen", pt: "Pronto para o exame" },
  "achievements.examReady.desc": { en: "Reach {{threshold}}% predicted readiness", es: "Alcanza {{threshold}}% de preparación prevista", pt: "Alcance {{threshold}}% de preparo previsto" },
  "achievements.toast.unlocked": { en: "Achievement unlocked", es: "Logro desbloqueado", pt: "Conquista desbloqueada" },

  "settings.title": { en: "Settings", es: "Configuración", pt: "Configurações" },
  "settings.subtitle": {
    en: "Usage, account recovery, and how CertBuddyCR looks and sounds.",
    es: "Uso, recuperación de cuenta, y cómo se ve y suena CertBuddyCR.",
    pt: "Uso, recuperação de conta, e como o CertBuddyCR se parece e soa.",
  },
  "settings.tabUsage": { en: "Usage & Account", es: "Uso y cuenta", pt: "Uso e conta" },
  "settings.tabDisplay": { en: "Display & Language", es: "Pantalla e idioma", pt: "Tela e idioma" },
  "settings.signedInAs": { en: "Signed in as {{name}}", es: "Sesión iniciada como {{name}}", pt: "Conectado como {{name}}" },
  "settings.lifetimeActivity": { en: "Lifetime saved activity", es: "Actividad guardada total", pt: "Atividade salva total" },
  "settings.examsStudied": { en: "Exams studied", es: "Exámenes estudiados", pt: "Exames estudados" },
  "settings.savedChats": { en: "Saved chats", es: "Chats guardados", pt: "Chats salvos" },
  "settings.savedMockSessions": { en: "Saved mock sessions", es: "Sesiones simuladas guardadas", pt: "Sessões simuladas salvas" },
  "settings.questionsAndAnswers": { en: "Questions & mock answers", es: "Preguntas y respuestas simuladas", pt: "Perguntas e respostas simuladas" },
  "settings.modelUsage": { en: "Model usage · last {{days}} days", es: "Uso del modelo · últimos {{days}} días", pt: "Uso do modelo · últimos {{days}} dias" },
  "settings.exportCsv": { en: "Export CSV", es: "Exportar CSV", pt: "Exportar CSV" },
  "settings.tokens": { en: "tokens", es: "tokens", pt: "tokens" },
  "settings.requests": { en: "{{count}} requests", es: "{{count}} solicitudes", pt: "{{count}} solicitações" },
  "settings.usageDisclaimer": {
    en: "Minimal usage metrics only — reported tokens are not exact billing.",
    es: "Solo métricas de uso mínimas — los tokens reportados no son facturación exacta.",
    pt: "Apenas métricas mínimas de uso — os tokens informados não são a cobrança exata.",
  },
  "settings.accountRecovery": { en: "Account recovery", es: "Recuperación de cuenta", pt: "Recuperação de conta" },
  "settings.recoveryExplainer": {
    en: "There's no email recovery. A recovery code is shown once when your account is created or replaced — keep it secret and save it offline.",
    es: "No hay recuperación por correo. Se muestra un código de recuperación una vez cuando se crea o reemplaza tu cuenta — mantenlo en secreto y guárdalo fuera de línea.",
    pt: "Não há recuperação por e-mail. Um código de recuperação é exibido uma vez quando sua conta é criada ou substituída — mantenha-o em segredo e salve-o offline.",
  },
  "settings.replaceRecoveryCode": { en: "Replace recovery code", es: "Reemplazar código de recuperación", pt: "Substituir código de recuperação" },
  "settings.technicalDefinitions": { en: "Technical definitions", es: "Definiciones técnicas", pt: "Definições técnicas" },
  "settings.def.utcDay.term": { en: "UTC day", es: "Día UTC", pt: "Dia UTC" },
  "settings.def.utcDay.def": {
    en: "A calendar day measured in Coordinated Universal Time, not your local timezone.",
    es: "Un día calendario medido en Tiempo Universal Coordinado, no en tu zona horaria local.",
    pt: "Um dia de calendário medido em Tempo Universal Coordenado, não no seu fuso horário local.",
  },
  "settings.def.gradedAnswer.term": { en: "Graded answer", es: "Respuesta calificada", pt: "Resposta avaliada" },
  "settings.def.gradedAnswer.def": {
    en: "A saved reply or mock question that has been machine-checked against an answer key.",
    es: "Una respuesta guardada o pregunta simulada que ha sido verificada automáticamente contra una clave de respuestas.",
    pt: "Uma resposta salva ou pergunta simulada que foi verificada automaticamente com um gabarito.",
  },
  "settings.def.domainCoverage.term": { en: "Domain coverage", es: "Cobertura de dominio", pt: "Cobertura de domínio" },
  "settings.def.domainCoverage.def": {
    en: "The share of an exam's official domains with 5+ graded answers — the minimum evidence for a reliable readiness read.",
    es: "La proporción de dominios oficiales de un examen con 5+ respuestas calificadas — la evidencia mínima para una lectura de preparación confiable.",
    pt: "A proporção de domínios oficiais de um exame com 5+ respostas avaliadas — a evidência mínima para uma leitura confiável de preparo.",
  },
  "settings.language": { en: "Language", es: "Idioma", pt: "Idioma" },
  "settings.languageCaption": {
    en: "Dictation and read aloud follow this language where your browser supports it.",
    es: "El dictado y la lectura en voz alta siguen este idioma donde tu navegador lo admita.",
    pt: "O ditado e a leitura em voz alta seguem este idioma onde o navegador oferece suporte.",
  },
  "settings.readAloud": { en: "Read aloud", es: "Leer en voz alta", pt: "Ler em voz alta" },
  "settings.readAloudCaption": {
    en: "Speak AI answers using your browser's voice service.",
    es: "Reproduce las respuestas de la IA con el servicio de voz de tu navegador.",
    pt: "Reproduz as respostas da IA usando o serviço de voz do navegador.",
  },
  "settings.testVoice": { en: "Test voice", es: "Probar voz", pt: "Testar voz" },
  "settings.textSize": { en: "Text size", es: "Tamaño del texto", pt: "Tamanho do texto" },
  "settings.textSizeCaption": {
    en: "Scales text and spacing across the whole app. Your browser's own zoom works too.",
    es: "Escala el texto y el espaciado en toda la app. El zoom de tu navegador también funciona.",
    pt: "Ajusta o texto e o espaçamento em todo o app. O zoom do seu navegador também funciona.",
  },
  "settings.textSize.sm": { en: "Small", es: "Pequeño", pt: "Pequeno" },
  "settings.textSize.default": { en: "Default", es: "Predeterminado", pt: "Padrão" },
  "settings.textSize.lg": { en: "Large", es: "Grande", pt: "Grande" },
  "settings.textSize.xl": { en: "Extra large", es: "Muy grande", pt: "Extra grande" },
  "settings.theme": { en: "Theme", es: "Tema", pt: "Tema" },
  "settings.themeCaption": {
    en: "Dark theme only, for now — matches the glow-forward visual system across the app.",
    es: "Solo tema oscuro, por ahora — coincide con el sistema visual luminoso de toda la app.",
    pt: "Apenas tema escuro, por enquanto — combina com o sistema visual luminoso do app.",
  },
  "settings.toggleReadAloud": { en: "Toggle read aloud", es: "Alternar lectura en voz alta", pt: "Alternar leitura em voz alta" },
  "settings.testVoiceUtterance": {
    en: "This is a test of read aloud. Your saved answers can be read back to you this way.",
    es: "Esta es una prueba de lectura en voz alta. Tus respuestas guardadas se pueden leer de esta forma.",
    pt: "Este é um teste de leitura em voz alta. Suas respostas salvas podem ser lidas dessa forma.",
  },

  "chat.noConversation": { en: "No conversation selected", es: "Ninguna conversación seleccionada", pt: "Nenhuma conversa selecionada" },
  "chat.openConversationList": { en: "Open conversation list", es: "Abrir lista de conversaciones", pt: "Abrir lista de conversas" },
  "chat.exportPdf": { en: "Export conversation as PDF", es: "Exportar conversación como PDF", pt: "Exportar conversa como PDF" },
  "chat.pdf": { en: "PDF", es: "PDF", pt: "PDF" },
  "chat.liveSession": { en: "Live session", es: "Sesión en vivo", pt: "Sessão ao vivo" },
  "chat.startNewChatPrompt": {
    en: "Start a new chat to begin studying, or pick a saved conversation.",
    es: "Inicia un nuevo chat para comenzar a estudiar, o elige una conversación guardada.",
    pt: "Inicie um novo chat para começar a estudar, ou escolha uma conversa salva.",
  },
  "chat.quickBuildPlan": { en: "Build a study plan", es: "Crear un plan de estudio", pt: "Criar um plano de estudo" },
  "chat.quickQuizMe": { en: "Quiz me", es: "Hazme un cuestionario", pt: "Me faça um teste" },
  "chat.quickCheckReadiness": { en: "Check my readiness", es: "Revisar mi preparación", pt: "Verificar meu preparo" },
  "chat.attachFile": { en: "Attach file", es: "Adjuntar archivo", pt: "Anexar arquivo" },
  "chat.removeAttachment": { en: "Remove attachment", es: "Quitar adjunto", pt: "Remover anexo" },
  "chat.message": { en: "Message", es: "Mensaje", pt: "Mensagem" },
  "chat.placeholderWaiting": { en: "Waiting for a response...", es: "Esperando una respuesta...", pt: "Aguardando uma resposta..." },
  "chat.placeholderAsk": { en: "Ask about any Microsoft exam...", es: "Pregunta sobre cualquier examen de Microsoft...", pt: "Pergunte sobre qualquer exame da Microsoft..." },
  "chat.startVoiceInput": { en: "Start voice input", es: "Iniciar entrada de voz", pt: "Iniciar entrada de voz" },
  "chat.stopVoiceInput": { en: "Stop voice input", es: "Detener entrada de voz", pt: "Parar entrada de voz" },
  "chat.voiceNotSupported": {
    en: "Voice input not supported in this browser",
    es: "La entrada de voz no es compatible con este navegador",
    pt: "Entrada de voz não é compatível com este navegador",
  },
  "chat.sendMessage": { en: "Send message", es: "Enviar mensaje", pt: "Enviar mensagem" },

  "threadList.newChat": { en: "New chat", es: "Nuevo chat", pt: "Novo chat" },
  "threadList.cancelNewChat": { en: "Cancel new chat", es: "Cancelar nuevo chat", pt: "Cancelar novo chat" },
  "threadList.chooseCertification": {
    en: "Choose a certification to study.",
    es: "Elige una certificación para estudiar.",
    pt: "Escolha uma certificação para estudar.",
  },
  "threadList.startChat": { en: "Start chat", es: "Iniciar chat", pt: "Iniciar chat" },
  "threadList.yourConversations": { en: "Your conversations", es: "Tus conversaciones", pt: "Suas conversas" },
  "threadList.noSavedConversations": { en: "No saved conversations yet.", es: "Aún no hay conversaciones guardadas.", pt: "Ainda não há conversas salvas." },
  "threadList.deleteThread": { en: "Delete {{title}}", es: "Eliminar {{title}}", pt: "Excluir {{title}}" },
  "threadList.conversations": { en: "Conversations", es: "Conversaciones", pt: "Conversas" },
  "threadList.closeConversationList": { en: "Close conversation list", es: "Cerrar lista de conversaciones", pt: "Fechar lista de conversas" },

  "promptMenu.button": { en: "Prompt generator", es: "Generador de mensajes", pt: "Gerador de mensagens" },
  "promptMenu.cramPlan.label": { en: "Cram plan", es: "Plan intensivo", pt: "Plano intensivo" },
  "promptMenu.cramPlan.desc": { en: "A focused, high-yield plan for last-minute review.", es: "Un plan enfocado y de alto rendimiento para repasar de último momento.", pt: "Um plano focado e de alto rendimento para revisão de última hora." },
  "promptMenu.sevenDayPlan.label": { en: "7-day plan", es: "Plan de 7 días", pt: "Plano de 7 dias" },
  "promptMenu.sevenDayPlan.desc": { en: "A structured week of study sessions.", es: "Una semana estructurada de sesiones de estudio.", pt: "Uma semana estruturada de sessões de estudo." },
  "promptMenu.practiceQuiz.label": { en: "Practice quiz", es: "Cuestionario de práctica", pt: "Teste de prática" },
  "promptMenu.practiceQuiz.desc": { en: "A short quiz on a topic you choose.", es: "Un cuestionario corto sobre un tema que elijas.", pt: "Um teste curto sobre um tema à sua escolha." },
  "promptMenu.bankPractice.label": { en: "Bank practice", es: "Práctica del banco", pt: "Prática do banco" },
  "promptMenu.bankPractice.desc": { en: "Pull questions from the full practice bank.", es: "Extrae preguntas del banco de práctica completo.", pt: "Extraia perguntas do banco de prática completo." },
  "promptMenu.readinessDiscussion.label": { en: "Readiness discussion", es: "Discusión de preparación", pt: "Discussão de preparo" },
  "promptMenu.readinessDiscussion.desc": { en: "Talk through whether you're ready to sit the exam.", es: "Conversa sobre si estás listo para presentar el examen.", pt: "Converse sobre se você está pronto para fazer o exame." },
  "promptMenu.outlineExplanation.label": { en: "Outline explanation", es: "Explicación del temario", pt: "Explicação do conteúdo programático" },
  "promptMenu.outlineExplanation.desc": { en: "Walk through the official exam outline domain by domain.", es: "Repasa el temario oficial del examen dominio por dominio.", pt: "Percorra o conteúdo programático oficial do exame, domínio por domínio." },

  "examPicker.searchPlaceholder": { en: "Search certifications...", es: "Buscar certificaciones...", pt: "Buscar certificações..." },
  "examPicker.searchAriaLabel": { en: "Search certifications", es: "Buscar certificaciones", pt: "Buscar certificações" },
  "examPicker.noMatches": { en: "No matches.", es: "Sin coincidencias.", pt: "Nenhum resultado." },

  "inlineQuiz.generatedQuiz": { en: "Generated quiz · {{domain}}", es: "Cuestionario generado · {{domain}}", pt: "Teste gerado · {{domain}}" },
  "inlineQuiz.correctAnswerPrefix": { en: "Correct answer: ", es: "Respuesta correcta: ", pt: "Resposta correta: " },
  "inlineQuiz.correctAnswerReview": {
    en: ". Reviewing this concept adds it to tomorrow's spaced-repetition set.",
    es: ". Repasar este concepto lo añade a tu repaso espaciado de mañana.",
    pt: ". Revisar este conceito o adiciona à sua repetição espaçada de amanhã.",
  },

  "shortAnswer.selfCheckDrill": { en: "Self-check drill · {{heading}}", es: "Ejercicio de autoevaluación · {{heading}}", pt: "Exercício de autoavaliação · {{heading}}" },
  "shortAnswer.answerPlaceholder": {
    en: "Type your answer to check your thinking (self-check only, not graded)",
    es: "Escribe tu respuesta para revisar tu razonamiento (solo autoevaluación, no calificado)",
    pt: "Digite sua resposta para revisar seu raciocínio (apenas autoavaliação, não avaliado)",
  },
  "shortAnswer.yourAnswerAria": { en: "Your answer to question {{n}}", es: "Tu respuesta a la pregunta {{n}}", pt: "Sua resposta à pergunta {{n}}" },
  "shortAnswer.revealKeyPoints": { en: "Reveal key points", es: "Mostrar puntos clave", pt: "Mostrar pontos-chave" },
  "shortAnswer.hideKeyPoints": { en: "Hide key points", es: "Ocultar puntos clave", pt: "Ocultar pontos-chave" },
  "shortAnswer.gotIt": { en: "Got it", es: "Lo entendí", pt: "Entendi" },
  "shortAnswer.needReview": { en: "Need review", es: "Necesita repaso", pt: "Precisa revisar" },
  "shortAnswer.flaggedForReviewOne": {
    en: "1 flagged for review — added to tomorrow's plan.",
    es: "1 marcada para repasar — añadida al plan de mañana.",
    pt: "1 marcada para revisão — adicionada ao plano de amanhã.",
  },
  "shortAnswer.flaggedForReview": {
    en: "{{count}} flagged for review — added to tomorrow's plan.",
    es: "{{count}} marcadas para repasar — añadidas al plan de mañana.",
    pt: "{{count}} marcadas para revisão — adicionadas ao plano de amanhã.",
  },
  "shortAnswer.allClear": {
    en: "All clear. This drill won't repeat tomorrow.",
    es: "Todo listo. Este ejercicio no se repetirá mañana.",
    pt: "Tudo certo. Este exercício não se repetirá amanhã.",
  },
};

function get(key: string, locale: Locale): string | undefined {
  return T[key]?.[locale];
}

export function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  let str = get(key, locale) ?? get(key, "en") ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.split(`{{${k}}}`).join(String(v));
    }
  }
  return str;
}

interface I18nContextValue {
  language: Locale;
  setLanguage: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  localeTag: string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorage<Locale>("language", "en");

  useEffect(() => {
    document.documentElement.lang = LOCALE_TAG[language];
  }, [language]);

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key, vars) => translate(language, key, vars),
      localeTag: LOCALE_TAG[language],
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
