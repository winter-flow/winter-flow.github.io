const main = document.querySelector('main');
const hero = document.getElementById('home');
const latestNews = document.getElementById('latest-news');
const content = document.querySelector('.content-shell');
const sections = Object.fromEntries(['publications', 'awards', 'service'].map(id => [id, document.getElementById(id)]));

// The home view shows a short preview; the News view keeps the full list.
const newsPage = document.createElement('section');
newsPage.id = 'news';
newsPage.className = 'archive-page';
newsPage.innerHTML = '<div class="archive-intro"><p class="section-kicker">Updates</p><h1>News</h1><p>Research milestones and announcements.</p></div>';
const allNews = latestNews.querySelector('.news-list').cloneNode(true);
allNews.classList.add('archive-list');
newsPage.append(allNews);
main.append(newsPage);

const homeSelected = document.createElement('div');
homeSelected.className = 'home-selected section-shell';
homeSelected.innerHTML = '<div class="section-heading"><div><p class="section-kicker">Research</p><h2>Selected Publications</h2></div><a class="view-link" href="#publications">All publications (First Author) →</a></div><div class="selected-list"></div><div class="section-heading awards-heading"><div><p class="section-kicker">Recognition</p><h2>Recent Awards</h2></div><a class="view-link" href="#awards">All awards →</a></div><div class="selected-awards"></div>';
hero.after(homeSelected);
const papers = [...sections.publications.querySelectorAll('.publication:not(.description)')];
const selectedPapers = papers
  .filter(paper => /\((TIP|AAAI|ICCV)\)/.test(paper.querySelector('.project-description i')?.textContent || ''))
  .sort((a, b) => {
    const year = paper => Number(paper.querySelector('.project-description i')?.textContent.match(/20\d{2}/)?.[0] || 0);
    return year(b) - year(a);
  });
selectedPapers.forEach(paper => homeSelected.querySelector('.selected-list').append(paper.cloneNode(true)));
const awards = [...sections.awards.querySelectorAll('.award')];
awards.slice(0, 2).forEach(award => homeSelected.querySelector('.selected-awards').append(award.cloneNode(true)));

latestNews.querySelector('.section-heading').insertAdjacentHTML('beforeend', '<a class="view-link" href="#news">All news →</a>');

const pages = { home: [hero, homeSelected], news: [newsPage], publications: [sections.publications], awards: [sections.awards], service: [sections.service] };
const navLinks = [...document.querySelectorAll('.site-nav a')];
function showPage() {
  const id = location.hash.slice(1);
  const page = pages[id] ? id : 'home';
  for (const [name, elements] of Object.entries(pages)) elements.forEach(element => element.hidden = name !== page);
  content.hidden = page === 'home' || page === 'news';
  navLinks.forEach(link => {
    const active = link.getAttribute('href') === `#${page}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  window.scrollTo({ top: 0, behavior: 'auto' });
}
window.addEventListener('hashchange', showPage);
showPage();
