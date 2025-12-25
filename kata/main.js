const data = [
  {
    id: 1,
    content: '我是卡斯伯',
  },
  {
    id: 2,
    content: '我是小明',
  },
];

const listEl = document.querySelector('#list');
const inputByAdd = document.querySelector('#inputByAdd');
const btnByAdd = document.querySelector('#btnByAdd');

const init = () => {
  renderList();
};

const addItem = (content) => {
  const lastItem = data[data.length - 1];
  const id = lastItem ? lastItem.id + 1 : 1;
  const newItem = { id, content };
  data.push(newItem);
};

const removeItem = (id) => {
  const index = data.findIndex((item) => item.id === id);
  if (index !== -1) data.splice(index, 1);
};

const renderList = () => {
  const template = data
    .map(
      (item) => `<li>${item.content}<button type="button" data-id="${item.id}">刪除</button></li>`
    )
    .join('');
  listEl.innerHTML = template;
};

btnByAdd.addEventListener('click', () => {
  const content = inputByAdd.value.trim();
  if (!content) return;
  addItem(content);
  renderList();
  inputByAdd.value = '';
});

listEl.addEventListener('click', (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;
  removeItem(id);
  renderList();
});

init();
