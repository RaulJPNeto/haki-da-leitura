/**
 * Utilitários de detecção de ambiente e navegadores móveis/in-app
 */

/**
 * Detecta se o usuário está executando a aplicação dentro de um Webview / In-App Browser
 * (ex: WhatsApp, Instagram, Facebook, Telegram, Messenger, Line)
 */
export function isInAppBrowser(): boolean {
  if (typeof window === 'undefined' || !navigator || !navigator.userAgent) {
    return false;
  }

  const ua = navigator.userAgent || navigator.vendor || '';

  // Assinaturas conhecidas de In-App Browsers / WebViews
  const inAppRules = [
    /FBAN/i,              // Facebook App
    /FBAV/i,              // Facebook App
    /Instagram/i,         // Instagram
    /WhatsApp/i,          // WhatsApp
    /Telegram/i,          // Telegram Webview
    /Line\//i,            // Line Messenger
    /Twitter/i,           // Twitter / X
    /Snapchat/i,          // Snapchat
    /MicroMessenger/i,    // WeChat
    /wv/i,                // Android WebView genérico
    /\bVersion\/[0-9.]+\s+Mobile\/[0-9A-Za-z]+\s+Safari\/[0-9.]+/i // Safari view controller
  ];

  // Caso contenha marcador explícito de wv ou nome de app social
  const isSocialApp = inAppRules.some((rule) => rule.test(ua));
  
  // Detecção adicional para Android Webview
  const isAndroidWebView = /Android/.test(ua) && /Version\/[0-9.]+/.test(ua) && !/Chrome\/[0-9.]+ Mobile/.test(ua);

  return isSocialApp || isAndroidWebView;
}

/**
 * Copia a URL atual para a área de transferência do dispositivo
 */
export async function copyCurrentUrl(): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(window.location.href);
      return true;
    }
    // Fallback legado caso Clipboard API não esteja liberada no webview
    const textArea = document.createElement('textarea');
    textArea.value = window.location.href;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (err) {
    console.warn('Falha ao copiar URL:', err);
    return false;
  }
}
