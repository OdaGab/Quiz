Como usar o logo enviado para gerar os ícones do app

Resumo
- Coloque o arquivo de logo (PNG preferível) em `assets/images/icon-source.png`.
- Rode o script npm que gera as variantes necessárias para o app.

Passos (Windows / PowerShell)
1) Salve o arquivo que você recebeu do chat em algum lugar do seu PC.
2) Copie para o projeto (exemplo):

Copy-Item -Path "C:\Users\<seu_usuario>\Downloads\quiz-logo.png" -Destination ".\assets\images\icon-source.png" -Force

3) Instale a dependência `sharp` como dev dependency (necessária para o script):

npm install -D sharp

4) Rode o gerador de ícones:

npm run generate-icons

5) Resultado esperado (arquivos gerados em `assets/images/`):
- icon.png (1024x1024)
- android-icon-foreground.png (432x432)
- android-icon-background.png (1080x1080)
- favicon.png (192x192)
- splash-icon.png (200x200)

6) Para testar no Expo (limpando cache):

npx expo start -c

Notas
- Se você preferir que eu copie o arquivo diretamente no repositório, faça o upload do binário do logo no chat. Depois disso eu posso gerar localmente as variações e commitar os arquivos gerados.
- A cor de fundo do ícone adaptativo Android é `#E6F4FE` (conforme `app.json`). Se preferir outra cor informe.


