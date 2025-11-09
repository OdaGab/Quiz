import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// Importa o EmailJS para o envio de e-mails
// Observação: o envio por EmailJS foi substituído por um endpoint de
// backend para evitar problemas de bundling no React Native / Expo.
// Mantemos as constantes para compatibilidade e modo de simulação.

// --- Configurações do EmailJS (Chaves de Exemplo) ---
// !!! ATENÇÃO: SUBSTITUA ESTAS CHAVES PELAS SUAS CHAVES REAIS DO EMAILJS !!!
// Enquanto estas forem as chaves de exemplo, o app ativará o modo de SIMULAÇÃO.
// Prefer values injected into the global object during development so you
// don't commit real keys into source control. Fall back to the example
// values below if globals are not provided.
const SERVICE_ID = (typeof global !== 'undefined' && global.EMAILJS_SERVICE_ID) || 'service_ga1e9r6';
const TEMPLATE_ID = (typeof global !== 'undefined' && global.EMAILJS_TEMPLATE_ID) || 'template_y3hwno9';
// Fallback placeholder for PUBLIC_KEY during development. Use a clearly
// identifiable placeholder so we don't accidentally treat a real key as the
// example/simulation key. Real keys should be injected via `global.EMAILJS_PUBLIC_KEY`.
const PUBLIC_KEY = (typeof global !== 'undefined' && global.EMAILJS_PUBLIC_KEY) || 'EMAILJS_PUBLIC_KEY_EXAMPLE';

// Configuração de backend local (opcional):
// - Para usar o backend local automaticamente, defina global.USE_LOCAL_BACKEND = true
//   (por exemplo, no entrypoint do app: global.USE_LOCAL_BACKEND = true)
// - Ou defina global.BACKEND_URL = 'http://192.168.x.y:3000' para especificar o host
// Observação: para Android emulator use 10.0.2.2 para acessar o localhost da máquina host.
const DEFAULT_BACKEND_PORT = 3000;
const getBackendBase = () => {
  try {
    if (typeof global !== 'undefined' && global.BACKEND_URL) {
      return global.BACKEND_URL.replace(/\/$/, '');
    }
  } catch (e) {}

  // Se o dev quiser forçar o uso do backend local, defina global.USE_LOCAL_BACKEND = true
  const useLocal = typeof global !== 'undefined' && !!global.USE_LOCAL_BACKEND;
  if (!useLocal) return null;

  if (Platform.OS === 'android') {
    // Android emulator (AVD) -> 10.0.2.2
    return `http://10.0.2.2:${DEFAULT_BACKEND_PORT}`;
  }

  // iOS simulator e outros -> localhost
  return `http://localhost:${DEFAULT_BACKEND_PORT}`;
};

// --- Dados do Quiz (20 Questões) ---
const quizData = [
{ question: 'Qual é o componente principal (raiz) que o arquivo App.js renderiza para o usuário?', options: ['React.Component', 'QuizFlow', 'index.js', 'Um componente View vazio.'], correctAnswer: 1 },
{ question: 'Qual a sintaxe usada para importar o QuizFlow em App.js?', options: ['import { QuizFlow } from "./src/QuizFlow"', 'import * as QuizFlow from "./src/QuizFlow"', 'import QuizFlow from "./src/QuizFlow"', 'require("QuizFlow")'], correctAnswer: 2 },
{ question: 'Qual propriedade do package.json você deve alterar para incluir o @emailjs/browser?', options: ['scripts', 'main', 'version', 'dependencies'], correctAnswer: 3 },
{ question: 'Qual comando deve ser executado no terminal após alterar o package.json para instalar a nova biblioteca?', options: ['npm start', 'npm install', 'expo install', 'react-native link'], correctAnswer: 1 },
{ question: 'A função generateCode() é usada para:', options: ['Enviar o código por e-mail.', 'Verificar se o código digitado está correto.', 'Criar o número aleatório de 6 dígitos para verificação.', 'Mudar o fluxo do quiz para resultados.'], correctAnswer: 2 },
{ question: 'O que a condição isExampleKey verifica na função handleSendCode?', options: ['Se o e-mail é válido.', 'Se a API do EmailJS está online.', 'Se as chaves de configuração do EmailJS são as chaves de exemplo (ativando a simulação).', 'Se o usuário já fez o quiz antes.'], correctAnswer: 2 },
{ question: 'Se o envio de e-mail estiver em modo de simulação, onde o código de 6 dígitos é exibido?', options: ['Em um alert() na tela.', 'Apenas no estado verificationCode.', 'No console do terminal/navegador.', 'Ele não é gerado.'], correctAnswer: 2 },
{ question: 'No React Native, qual componente é usado para receber texto digitado pelo usuário?', options: ['<View>', '<Text>', '<TextInput>', '<TouchableOpacity>'], correctAnswer: 2 },
{ question: 'O que o Hook useState(\'email_input\') está controlando neste app?', options: ['O e-mail do usuário.', 'O código de verificação.', 'Qual tela ou fase do aplicativo está sendo exibida (o fluxo).', 'A pontuação atual.'], correctAnswer: 2 },
{ question: 'Qual Hook é usado para gerenciar a variável messageTimeoutRef?', options: ['useState', 'useEffect', 'useCallback', 'useRef'], correctAnswer: 3 },
{ question: 'O que a função handleVerifyCode compara para determinar o sucesso da autenticação?', options: ['email vs codeInput', 'verificationCode vs email', 'verificationCode vs codeInput', 'PUBLIC_KEY vs SERVICE_ID'], correctAnswer: 2 },
{ question: 'Quantos argumentos a função emailjs.send() espera (além da chave pública)?', options: ['Um (Template ID)', 'Dois (Service ID e Template ID)', 'Três (Service ID, Template ID e Parâmetros)', 'Quatro (Todas as chaves)'], correctAnswer: 2 },
{ question: 'Qual cor é usada para destacar acertos na tela de resultados?', options: ['Vermelho', 'Azul', 'Verde (#16a34a)', 'Preto'], correctAnswer: 2 },
{ question: 'Qual o nome do componente que estamos usando para substituir o uso de alert() no React Native?', options: ['Modal', 'Alert.alert', 'customMessage (MessageBox)', 'Toast'], correctAnswer: 2 },
{ question: 'Se o usuário acertar a pergunta, qual estado é incrementado?', options: ['currentQuestion', 'score', 'verificationCode', 'feedback'], correctAnswer: 1 },
{ question: 'Qual é o backgroundColor da tela principal (safeArea)?', options: ['#09090b', '#ffffff', '#f4f4f5 (cinza claro)', '#e5e7eb'], correctAnswer: 2 },
{ question: 'Qual o valor do flow que indica a tela final do quiz?', options: ['email_input', 'code_verification', 'quiz', 'results'], correctAnswer: 3 },
{ question: 'A função handleRestart zera quais variáveis de estado?', options: ['Apenas score e currentQuestion.', 'Apenas flow e email.', 'Todas as variáveis relacionadas ao quiz, e-mail e código.', 'Apenas verificationCode.'], correctAnswer: 2 },
{ question: 'O que o cálculo quizData.length - score representa?', options: ['A pontuação total possível.', 'A contagem de perguntas restantes.', 'A quantidade de respostas incorretas (erros).', 'O índice da próxima pergunta.'], correctAnswer: 2 },
{ question: 'O KeyboardAvoidingView é usado para:', options: ['Adicionar um teclado personalizado.', 'Evitar que o teclado virtual esconda campos de input.', 'Apenas para layout em Android.', 'Controlar o estado do teclado.'], correctAnswer: 1 },
];

// --- Componente Principal do App ---
export default function QuizFlow() {
// --- Estados de Fluxo e Autenticação ---
const [flow, setFlow] = useState('email_input'); // 'email_input', 'code_verification', 'quiz', 'results'
const [email, setEmail] = useState('');
const [verificationCode, setVerificationCode] = useState('');
const [codeInput, setCodeInput] = useState('');
const [isLoading, setIsLoading] = useState(false);

// Indica se estamos usando as chaves de exemplo (modo SIMULAÇÃO).
// The placeholder value 'EMAILJS_PUBLIC_KEY_EXAMPLE' is used to trigger
// simulation only when no real key is provided. This prevents accidentally
// treating a real public key as the example key.
const isExampleKey = PUBLIC_KEY === 'EMAILJS_PUBLIC_KEY_EXAMPLE';

// --- Estados do Quiz ---
const [currentQuestion, setCurrentQuestion] = useState(0);
const [score, setScore] = useState(0);
const [selectedOption, setSelectedOption] = useState(null);
const [feedback, setFeedback] = useState('');

// --- Estado de Mensagens Customizadas (Substitui o alert()) ---
const [customMessage, setCustomMessage] = useState({ visible: false, text: '', type: 'info' });
const messageTimeoutRef = useRef(null);

const showCustomMessage = (text, type = 'info') => {
// Limpa o timeout anterior para evitar sobreposição
if (messageTimeoutRef.current) {
clearTimeout(messageTimeoutRef.current);
}

setCustomMessage({ visible: true, text, type });

// Define um novo timeout para esconder a mensagem após 3 segundos
messageTimeoutRef.current = setTimeout(() => {
  setCustomMessage({ visible: false, text: '', type: 'info' });
}, 3000);


};

// --- Funções de Autenticação ---

const generateCode = () => {
// Gera um código de 6 dígitos
return Math.floor(100000 + Math.random() * 900000).toString();
};

const handleSendCode = async () => {
  if (!email || isLoading) return;

  // Validação de formato de e-mail simples (pré-check rápido)
  const simpleEmailRegex = /\S+@\S+\.\S+/;
  if (!simpleEmailRegex.test(email)) {
    showCustomMessage('Por favor, insira um e-mail válido.', 'error');
    return;
  }

  setIsLoading(true);
  const code = generateCode();
  setVerificationCode(code); // Armazena o código gerado

  try {
    // Verifica se as chaves são as chaves de exemplo (para fins de simulação)
    // Se for a chave de exemplo, não tentamos enviar nada — apenas mostramos
    // o código gerado na tela (modo simulação). Isso evita erros externos
    // como "The service ID not found" enquanto você testa localmente.
    if (isExampleKey) {
      console.log('--- SIMULAÇÃO: código de verificação gerado:', code, '---');
      // Mostra uma mensagem breve e navega para a tela de verificação
      showCustomMessage(`(Simulação) Código: ${code}`, 'info');
      setIsLoading(false);
      setFlow('code_verification');
      return;
    }

    // First: if a local backend is configured (useful for development or to
    // delegate sending to a secure server), use it. The backend endpoint is
    // expected to be POST { email, code } -> { success: true } or error.
    const backendBase = getBackendBase();
    if (backendBase) {
      try {
        console.debug('Sending verification code to backend:', `${backendBase}/send-code`);
        const backendResp = await fetch(`${backendBase}/send-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code }),
        });

        const backendJson = await backendResp.json().catch(() => null);
        if (!backendResp.ok) {
          console.error('Backend send-code error:', { status: backendResp.status, body: backendJson });
          const detail = (backendJson && backendJson.error) || backendResp.statusText || `Status ${backendResp.status}`;
          showCustomMessage(`Falha ao enviar via backend: ${detail}`, 'error');
          throw new Error(detail);
        }

        // Backend replied OK (may be simulation or real send)
        console.log('Backend send-code response:', backendJson);
        setIsLoading(false);
        showCustomMessage(`Código enviado com sucesso para ${email}!`, 'success');
        setFlow('code_verification');
        return;
      } catch (err) {
        // If backend fails, fallthrough to try direct EmailJS REST (useful
        // when backend isn't running but you still want to attempt EmailJS).
        console.warn('Backend send failed, will attempt EmailJS REST as fallback.', err);
      }
    }

    // Envia o código usando a API REST do EmailJS para evitar depender do
    // pacote `@emailjs/browser` no React Native / Expo.
    // Veja: https://www.emailjs.com/docs/rest-api/send/
    const emailjsEndpoint = 'https://api.emailjs.com/api/v1.0/email/send';

    const bodyPayload = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      // Include aliases to maximize compatibility with different templates
      template_params: {
        to_destinatario: email,
        // aliases commonly used by templates / examples
        to_email: email,
        email: email,
        codigo: code,
        message: `Seu código de verificação do Quiz é: ${code}.`,
      },
    };

    // Log the exact recipient value for debugging the 'To Email' issue
    try {
      console.debug('EmailJS template_params (debug):', bodyPayload.template_params);
      console.debug('EmailJS to_destinatario value:', bodyPayload.template_params.to_destinatario);
    } catch (e) {
      console.warn('Failed to debug template_params', e);
    }

    // Enhanced validation: simple but effective email regex
    const recipient = (bodyPayload.template_params.to_destinatario || bodyPayload.template_params.to_email || bodyPayload.template_params.email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!recipient || !emailRegex.test(recipient)) {
      console.error('Invalid recipient detected:', recipient);
      showCustomMessage('E-mail destinatário inválido. Verifique o campo e tente novamente.', 'error');
      setIsLoading(false);
      return;
    }

    // Overwrite template params with validated recipient (avoid sending empty)
    bodyPayload.template_params.to_destinatario = recipient;
    bodyPayload.template_params.to_email = recipient;
    bodyPayload.template_params.email = recipient;

    // Helpful debug log so you can inspect the payload in Metro/console when debugging
    console.debug('EmailJS request body:', bodyPayload);
  console.debug('EmailJS endpoint:', emailjsEndpoint);

    try {
      const resp = await fetch(emailjsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const text = await resp.text().catch(() => null);
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch (e) {
        json = null;
      }

      // Always log full response info for debugging
      console.debug('EmailJS full response:', { status: resp.status, body: json || text });

      if (!resp.ok) {
        // Mostra detalhes do erro retornado pela EmailJS para depuração
        console.error('EmailJS response error:', { status: resp.status, body: json || text });
        const detail = (json && (json.error || json.message)) || text || `Status ${resp.status}`;
        showCustomMessage(`Falha ao enviar via EmailJS: ${detail}`, 'error');
        throw new Error(detail);
      }

      console.log('EmailJS response (OK):', json || text);
      showCustomMessage(`Código enviado com sucesso para ${email}!`, 'success');
      setFlow('code_verification');
    } catch (emailError) {
      console.error('Erro ao chamar EmailJS REST:', emailError);
      // Re-throw so outer catch handles UI messaging (already sets isLoading=false)
      throw emailError;
    }
  } catch (error) {
    console.error('Falha ao enviar e-mail:', error);
    showCustomMessage('Falha ao enviar o código. Verifique se o backend está rodando.', 'error');
  } finally {
    setIsLoading(false);
  }
};

const handleVerifyCode = () => {
if (codeInput === verificationCode) {
showCustomMessage('Verificação bem-sucedida! Iniciando o Quiz.', 'success');
setFlow('quiz');
} else {
showCustomMessage('Código incorreto. Tente novamente.', 'error');
}
};

// --- Funções do Quiz ---

const question = quizData[currentQuestion];
const handleOptionPress = (optionIndex) => {
  if (feedback) return;

  setSelectedOption(optionIndex);
  const isCorrect = optionIndex === question.correctAnswer;

  if (isCorrect) {
    setFeedback('Correto!');
    setScore(score + 1);
  } else {
    setFeedback('Incorreto!');
  }
};

const handleNextPress = () => {
setFeedback('');
setSelectedOption(null);

if (currentQuestion + 1 < quizData.length) {
  setCurrentQuestion(currentQuestion + 1);
} else {
  setFlow('results'); 
}


};

// Limpa timeouts pendentes no unmount para evitar leaks/warnings
useEffect(() => {
  return () => {
    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
  };
}, []);
const handleRestart = () => {
setCurrentQuestion(0);
setScore(0);
setSelectedOption(null);
setFeedback('');
setCodeInput('');
setVerificationCode('');
setEmail('');
setFlow('email_input');
};

// --- Componentes de Renderização de Fluxo ---

const renderEmailInput = () => (
<View style={styles.card}>
<Text style={styles.flowTitle}>Bem-vindo ao Quiz!</Text>
<Text style={styles.flowSubtitle}>
Para começar, insira seu e-mail para receber o código de acesso.
</Text>
<TextInput
style={styles.input}
placeholder="Seu E-mail"
placeholderTextColor="#a1a1aa"
keyboardType="email-address"
value={email}
onChangeText={setEmail}
autoCapitalize="none"
/>
<TouchableOpacity
onPress={handleSendCode}
style={[styles.button, styles.nextButton]}
disabled={isLoading}>
<Text style={styles.buttonText}>
{isLoading ? 'Enviando...' : 'Enviar Código'}
</Text>
</TouchableOpacity>
</View>
);

const renderCodeVerification = () => (
<View style={styles.card}>
<Text style={styles.flowTitle}>Verificação de Código</Text>
<Text style={styles.flowSubtitle}>
Um código de 6 dígitos foi enviado (ou simulado) para {email}. Insira-o abaixo.
</Text>
{isExampleKey && verificationCode ? (
  <Text style={{ textAlign: 'center', marginBottom: 12, color: '#374151' }}>
    (Simulação) Código: {verificationCode}
  </Text>
) : null}
<TextInput
style={styles.input}
placeholder="Código de Verificação"
placeholderTextColor="#a1a1aa"
keyboardType="numeric"
maxLength={6}
value={codeInput}
onChangeText={setCodeInput}
/>
<TouchableOpacity
onPress={handleVerifyCode}
style={[styles.button, styles.nextButton]}
disabled={codeInput.length !== 6}>
<Text style={styles.buttonText}>Confirmar</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => setFlow('email_input')} style={styles.textButton}>
<Text style={styles.textButtonText}>Tentar outro e-mail</Text>
</TouchableOpacity>
</View>
);

const renderQuiz = () => (
<View style={styles.card}>
<Text style={styles.questionCounter}>
Pergunta {currentQuestion + 1} de {quizData.length}
</Text>
<Text style={styles.questionText}>{question.question}</Text>

  <View style={styles.optionsContainer}>
    {question.options.map((option, index) => {
      const isSelected = selectedOption === index;
      const isCorrect = question.correctAnswer === index;

      let optionBgColor = '#f9fafb';
      if (isSelected) {
        optionBgColor = isCorrect ? '#dcfce7' : '#fee2e2';
      }
      if (feedback && isCorrect) {
        optionBgColor = '#dcfce7';
      }

      let optionBorderColor = '#e5e7eb';
      if (isSelected) {
        optionBorderColor = isCorrect ? '#22c55e' : '#ef4444';
      }
      if (feedback && isCorrect) {
        optionBorderColor = '#22c55e';
      }

      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            {
              backgroundColor: optionBgColor,
              borderColor: optionBorderColor,
            },
          ]}
          onPress={() => handleOptionPress(index)}
          disabled={!!feedback}>
          <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
            {option}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>

  {feedback ? (
    <View style={styles.feedbackContainer}>
      <Text
        style={[
          styles.feedbackText,
          feedback === 'Correto!'
            ? styles.feedbackCorrect
            : styles.feedbackIncorrect,
        ]}>
        {feedback}
      </Text>
      <TouchableOpacity
        onPress={handleNextPress}
        style={[styles.button, styles.nextButton]}
        activeOpacity={0.8}
        >
        <Text style={styles.buttonText}>
          {currentQuestion + 1 === quizData.length
            ? 'Ver Resultados'
            : 'Próxima Pergunta'}
        </Text>
      </TouchableOpacity>
    </View>
  ) : null}
</View>


);

const renderResults = () => {
const incorrectCount = quizData.length - score;

return (
  <View style={styles.card}>
    <Text style={styles.resultsTitle}>Quiz Finalizado!</Text>
    <Text style={styles.resultsSubtitle}>
      Obrigado por participar, {email}!
    </Text>
    
    <View style={styles.scoreDetailContainer}>
      {/* Acertos */}
      <View style={styles.scoreItem}>
        <Text style={[styles.scoreDetailText, styles.scoreCorrect]}>{score}</Text>
        <Text style={styles.scoreItemLabel}>Acertos</Text>
      </View>

      {/* Erros */}
      <View style={styles.scoreItem}>
        <Text style={[styles.scoreDetailText, styles.scoreIncorrect]}>{incorrectCount}</Text>
        <Text style={styles.scoreItemLabel}>Erros</Text>
      </View>
    </View>

    <Text style={styles.totalSummary}>
       Sua pontuação final é: {score} de {quizData.length}
    </Text>


    <TouchableOpacity
      onPress={handleRestart}
      style={[styles.button, styles.restartButton]}
      activeOpacity={0.8}>
      <Text style={styles.buttonText}>Reiniciar / Novo Quiz</Text>
    </TouchableOpacity>
  </View>
);


};

const renderContent = () => {
switch (flow) {
case 'email_input':
return renderEmailInput();
case 'code_verification':
return renderCodeVerification();
case 'quiz':
return renderQuiz();
case 'results':
return renderResults();
default:
return renderEmailInput();
}
};

return (
<SafeAreaView style={styles.safeArea}>
<StatusBar barStyle="dark-content" backgroundColor="#f4f4f5" />
<KeyboardAvoidingView
style={styles.keyboardAvoidingView}
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
<ScrollView contentContainerStyle={styles.scrollViewContainer}>
<View style={styles.container}>{renderContent()}</View>
</ScrollView>
</KeyboardAvoidingView>

  {/* Componente de Mensagem Customizada (Custom Alert) */}
  {customMessage.visible && (
    <View
      style={[
        styles.messageBox,
        customMessage.type === 'error' ? styles.messageBoxError : styles.messageBoxSuccess,
      ]}>
      <Text style={styles.messageText}>{customMessage.text}</Text>
    </View>
  )}
</SafeAreaView>


);
}

// --- Estilos ---
const styles = StyleSheet.create({
safeArea: { flex: 1, backgroundColor: '#f4f4f5' },
keyboardAvoidingView: { flex: 1 },
scrollViewContainer: { flexGrow: 1, justifyContent: 'center', padding: 16 },
container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
card: {
backgroundColor: '#ffffff',
borderRadius: 12,
padding: 24,
width: '100%',
maxWidth: 500,
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.1,
shadowRadius: 10,
elevation: 5,
},
// --- Estilos de Fluxo (Login/Verify) ---
flowTitle: {
fontSize: 24,
fontWeight: '700',
color: '#18181b',
textAlign: 'center',
marginBottom: 8,
},
flowSubtitle: {
fontSize: 16,
color: '#52525b',
textAlign: 'center',
marginBottom: 24,
},
input: {
height: 50,
borderColor: '#d4d4d8',
borderWidth: 1,
borderRadius: 8,
paddingHorizontal: 16,
marginBottom: 16,
fontSize: 16,
backgroundColor: '#ffffff',
color: '#18181b',
},
textButton: {
marginTop: 10,
padding: 10,
},
textButtonText: {
color: '#2563eb',
textAlign: 'center',
fontSize: 14,
fontWeight: '600',
},
// --- Estilos do Quiz ---
questionCounter: { fontSize: 16, color: '#52525b', marginBottom: 8, textAlign: 'center' },
questionText: { fontSize: 20, fontWeight: '600', color: '#18181b', marginBottom: 24, textAlign: 'center', lineHeight: 28 },
optionsContainer: { marginBottom: 16 },
optionButton: { borderWidth: 2, borderRadius: 8, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 12 },
optionText: { fontSize: 16, color: '#3f3f46', fontWeight: '500' },
optionTextSelected: { fontWeight: '700' },
feedbackContainer: { marginTop: 16, alignItems: 'center' },
feedbackText: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
feedbackCorrect: { color: '#16a34a' },
feedbackIncorrect: { color: '#dc2626' },
button: { borderRadius: 8, paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center', width: '100%' },
nextButton: { backgroundColor: '#09090b' },
buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
// --- Estilos dos Resultados ---
resultsTitle: { fontSize: 24, fontWeight: 'bold', color: '#18181b', textAlign: 'center', marginBottom: 8 },
resultsSubtitle: { fontSize: 16, color: '#52525b', textAlign: 'center', marginBottom: 24 },
scoreDetailContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
scoreItem: { alignItems: 'center' },
scoreItemLabel: { fontSize: 16, color: '#71717a', fontWeight: '500', marginTop: 4 },
scoreDetailText: { fontSize: 48, fontWeight: '900' },
scoreCorrect: { color: '#16a34a' },
scoreIncorrect: { color: '#dc2626' },
totalSummary: { fontSize: 18, color: '#3f3f46', textAlign: 'center', marginBottom: 32, fontWeight: '600' },
restartButton: { backgroundColor: '#2563eb' },
// --- Estilos do Custom Alert (Substituindo alert()) ---
messageBox: {
position: 'absolute',
bottom: 30,
alignSelf: 'center',
padding: 15,
borderRadius: 8,
marginHorizontal: 20,
zIndex: 10,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.25,
shadowRadius: 3.84,
elevation: 5,
},
messageBoxSuccess: { backgroundColor: '#22c55e' },
messageBoxError: { backgroundColor: '#ef4444' },
messageText: {
color: '#ffffff',
fontWeight: '600',
textAlign: 'center',
fontSize: 15,
},
});

export { styles as quizStyles };

