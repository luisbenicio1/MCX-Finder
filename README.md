# MCX-Finder 🎵

MCX-finder é uma aplicação web simples que permite aos usuários pesquisar uma música e descobrir em quais plataformas de streaming ela está disponível.

## Como Funciona

1.  O usuário insere o nome da música (e opcionalmente o artista) na interface.
2.  A aplicação consulta a API do iTunes para identificar a música e obter um link da Apple Music.
3.  Com este link, a aplicação utiliza a API da Odesli (Songlink) para encontrar a música em diversas outras plataformas como Spotify, YouTube Music, Deezer, Tidal, etc.
4.  Os resultados, incluindo links diretos para a música em cada plataforma, são exibidos ao usuário.

## Tecnologias Utilizadas

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js, Express.js
* **APIs Externas:**
    * [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html) (busca a inicial da música)
    * [Odesli API](https://publicapi.dev/songlink-odesli-api) / Songlink API (faz agregação de links de plataformas)
* **Bibliotecas:**
    * ['Axios'](https://axios-http.com/ptbr/docs/intro) (realiza as requisições HTTP no backend)

## Como Executar Localmente

1.  **Clone o repositório:**
    ```bash
    git clone <https://github.com/luisbenicio1/MCX-Finder>
    cd musica-finder
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor backend:**
    ```bash
    npm start
    ```
    O servidor estará rodando em `http://localhost:3000`.

4.  **Abra no navegador:**
    Acesse `http://localhost:3000` no seu navegador para usar a aplicação.

