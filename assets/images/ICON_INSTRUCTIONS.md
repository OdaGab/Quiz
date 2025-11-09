Instruções para usar a imagem anexada como ícone do app

Resumo
- O projeto já está configurado para usar `./assets/images/icon.png` como ícone principal (veja `app.json`).
- Para usar a imagem que você anexou, copie/renomeie esse arquivo para `assets/images/icon.png` no repositório.

Passo a passo (Windows / PowerShell)
1) Salve a imagem anexada do chat em algum lugar do seu PC, por exemplo: `C:\Users\<seu_usuario>\Downloads\quiz-icon.png`.
2) Abra PowerShell na raiz do projeto (`c:\Users\odaiv\Desktop\Quiz\Quiz`) e rode:

# copia o arquivo para o local correto dentro do projeto
Copy-Item -Path "C:\Users\<seu_usuario>\Downloads\quiz-icon.png" -Destination ".\assets\images\icon.png" -Force

Observação: substitua o caminho de origem pelo caminho real onde você salvou a imagem.

Gerar icones e assets (opcional, com ImageMagick)
- Recomendo manter `assets/images/icon.png` com 1024x1024 ou 512x512 para boa qualidade.
- Se quiser gerar automaticamente variações para Android adaptive icon e favicon, instale ImageMagick (https://imagemagick.org) e rode os comandos abaixo no PowerShell:

# redimensiona para 1024x1024 (sobrescreve icon.png)
magick convert ".\assets\images\icon.png" -resize 1024x1024 ".\assets\images\icon.png"

# cria favicon 192x192 (web)
magick convert ".\assets\images\icon.png" -resize 192x192 ".\assets\images\favicon.png"

# cria foreground/background para Android adaptive icon (exemplo simples)
magick convert ".\assets\images\icon.png" -resize 432x432 ".\assets\images\android-icon-foreground.png"
magick convert -size 1080x1080 canvas:'#E6F4FE' ".\assets\images\android-icon-background.png"

Notas sobre Expo
- `app.json` já aponta para:
  - `icon`: `./assets/images/icon.png`
  - `android.adaptiveIcon.foregroundImage`: `./assets/images/android-icon-foreground.png`
  - `android.adaptiveIcon.backgroundImage`: `./assets/images/android-icon-background.png`
  - `web.favicon`: `./assets/images/favicon.png`
  - `plugins["expo-splash-screen"].image`: `./assets/images/splash-icon.png`

- Se você substituir `assets/images/icon.png` pelo arquivo anexado, o Expo usará automaticamente o novo ícone quando você rebuildar ou rodar o app.

Se preferir que eu coloque o arquivo no repositório para você, faça o upload do arquivo binário (como um arquivo, não apenas uma imagem embutida no chat). Assim eu posso copiá-lo diretamente para `assets/images/icon.png` e gerar as variações necessárias automaticamente.

Se quiser, eu também posso:
- Criar as variações automaticamente e editar `app.json` se for necessário.
- Gerar e commitar os arquivos se você autorizar o upload/binário aqui.

Diga como prefere: eu posso esperar você colar o arquivo no repositório, ou você pode me enviar o arquivo binário para eu gravar automaticamente no caminho correto.