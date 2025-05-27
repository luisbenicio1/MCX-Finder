const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/search', async (req, res) => 
{
    const query = req.query.q;

    if (!query) 
    {
        return res.status(400).json({ error: 'O parâmetro de busca "q" é obrigatório.' });
    }

    try 
    {
        const itunesApiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`;
        console.log(`Buscando no iTunes: ${itunesApiUrl}`);
        const itunesResponse = await axios.get(itunesApiUrl);

        if (itunesResponse.data.resultCount === 0 || !itunesResponse.data.results[0].trackViewUrl) 
        {
            return res.status(404).json({ error: 'Música não encontrada no iTunes.' });
        }

        const appleMusicUrl = itunesResponse.data.results[0].trackViewUrl;
        const songTitle = itunesResponse.data.results[0].trackName;
        const artistName = itunesResponse.data.results[0].artistName;
        const thumbnailUrl = itunesResponse.data.results[0].artworkUrl100;

        console.log(`Link da Apple Music encontrado: ${appleMusicUrl}`);

        const odesliApiUrl = `https://api.song.link/v1-alpha.1/links?url=${encodeURIComponent(appleMusicUrl)}&userCountry=BR&songIfSingle=true`;
        console.log(`Buscando no Odesli: ${odesliApiUrl}`);
        const odesliResponse = await axios.get(odesliApiUrl);

        const platforms = odesliResponse.data.linksByPlatform;
        const pageUrl = odesliResponse.data.pageUrl; 

        const result = 
        {
            songTitle: songTitle,
            artistName: artistName,
            thumbnailUrl: thumbnailUrl,
            songLinkPage: pageUrl,
            platforms: []
        };

        for (const platformKey in platforms) 
            {
            if (Object.hasOwnProperty.call(platforms, platformKey)) 
            {
                const platformData = platforms[platformKey];
                result.platforms.push(
                {
                    name: platformKey.charAt(0).toUpperCase() + platformKey.slice(1).replace(/([A-Z])/g, ' $1').trim(),
                    url: platformData.url,
                    nativeAppUriMobile: platformData.nativeAppUriMobile,
                    nativeAppUriDesktop: platformData.nativeAppUriDesktop
                });
            }
        }
        
        if (!result.platforms.some(p => p.name.toLowerCase().includes('apple'))) 
        {
            result.platforms.unshift(
            {
                name: 'Apple Music',
                url: appleMusicUrl
            });
        }


        res.json(result);

    } catch (error) 
    {
        console.error('Erro no servidor:', error.message);
        if (error.response) 
        {
            console.error('Data do erro:', error.response.data);
            console.error('Status do erro:', error.response.status);
        }
        res.status(500).json({ error: 'Erro ao buscar informações da música.' });
    }
});

app.get('/', (req, res) => 
{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => 
{
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});