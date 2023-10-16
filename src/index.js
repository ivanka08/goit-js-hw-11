import notiflix from 'notiflix';

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("search-form");
    const gallery = document.querySelector(".gallery");
    const loadMoreButton = document.querySelector(".load-more");
    const apiKey = '40087799-873756a7f0c0976e3054c80be';
    let currentPage = 1;
    let currentQuery = "";

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        gallery.innerHTML = "";
        loadMoreButton.style.display = "none";
        currentQuery = form.searchQuery.value;
        currentPage = 1;
        await searchImages(currentQuery, currentPage);
    });

    loadMoreButton.addEventListener("click", async () => {
        currentPage++;
        await searchImages(currentQuery, currentPage);
    });

    async function searchImages(query, page) {
        try {
            const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.hits.length === 0) {
                notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            } else {
                data.hits.forEach((image) => {
                    const card = createImageCard(image);
                    gallery.appendChild(card);
                });

                if (page * 40 < data.totalHits) {
                    loadMoreButton.style.display = "block";
                } else {
                    loadMoreButton.style.display = "none";
                    notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
                }
            }
        } catch (error) {
            notiflix.Notify.failure("An error occurred while fetching images.");
        }
    }

    function createImageCard(image) {
        const card = document.createElement("div");
        card.className = "photo-card";

        const img = document.createElement("img");
        img.src = image.webformatURL;
        img.alt = image.tags;
        img.loading = "lazy";

        const info = document.createElement("div");
        info.className = "info";

        const likes = document.createElement("p");
        likes.className = "info-item";
        likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

        const views = document.createElement("p");
        views.className = "info-item";
        views.innerHTML = `<b>Views:</b> ${image.views}`;

        const comments = document.createElement("p");
        comments.className = "info-item";
        comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

        const downloads = document.createElement("p");
        downloads.className = "info-item";
        downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

        info.appendChild(likes);
        info.appendChild(views);
        info.appendChild(comments);
        info.appendChild(downloads);

        card.appendChild(img);
        card.appendChild(info);

        return card;
    }
});