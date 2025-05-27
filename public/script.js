document.addEventListener('DOMContentLoaded', () => 
{
    const songQueryInput = document.getElementById('songQuery');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    async function fetchSongData() 
    {
        const query = songQueryInput.value.trim();
        if (!query) 
        {
            resultsDiv.innerHTML = '<p class="error-message">Por favor, digite o nome da música.</p>';
            return;
        }

        resultsDiv.innerHTML = '';
        loadingDiv.style.display = 'block';

        try 
        {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            loadingDiv.style.display = 'none';

            if (!response.ok) 
            {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            displayResults(data);

        } catch (error) 
        {
            loadingDiv.style.display = 'none';
            console.error('Falha ao buscar música:', error);
            resultsDiv.innerHTML = `<p class="error-message">Erro ao buscar música: ${error.message}</p>`;
        }
    }

    searchButton.addEventListener('click', fetchSongData);
    songQueryInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') 
        {
            fetchSongData();
        }
    });

    function displayResults(data) 
    {
        resultsDiv.innerHTML = '';

        if (!data || !data.platforms || data.platforms.length === 0) 
        {
            resultsDiv.innerHTML = '<p>Nenhuma plataforma encontrada para esta música.</p>';
            return;
        }

        const songInfoDiv = document.createElement('div');
        songInfoDiv.className = 'song-info';
        
        const thumbnail = document.createElement('img');
        thumbnail.src = data.thumbnailUrl || 'https://via.placeholder.com/80';
        thumbnail.alt = `Capa de ${data.songTitle}`;
        
        const textInfoDiv = document.createElement('div');
        const titleElement = document.createElement('h2');
        titleElement.textContent = data.songTitle;
        const artistElement = document.createElement('p');
        artistElement.textContent = data.artistName;

        textInfoDiv.appendChild(titleElement);
        textInfoDiv.appendChild(artistElement);
        songInfoDiv.appendChild(thumbnail);
        songInfoDiv.appendChild(textInfoDiv);
        resultsDiv.appendChild(songInfoDiv);

        const platformList = document.createElement('ul');
        platformList.className = 'platform-list';

        data.platforms.forEach(platform => 
        {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = platform.url;
            link.textContent = platform.name;
            link.target = '_blank';
            listItem.appendChild(link);
            platformList.appendChild(listItem);
        });
        resultsDiv.appendChild(platformList);

        if (data.songLinkPage) 
        {
            const songLinkPageElement = document.createElement('a');
            songLinkPageElement.href = data.songLinkPage;
            songLinkPageElement.textContent = 'Ver todas as opções no Songlink';
            songLinkPageElement.className = 'songlink-page-link';
            songLinkPageElement.target = '_blank';
            resultsDiv.appendChild(songLinkPageElement);
        }
    }
});