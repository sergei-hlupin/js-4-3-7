class View {
  constructor() {
    this.app = document.querySelector(".app");
    this.input = this.createElement("input", "input");
    this.repositoriesList = this.createElement("ul", "repositories-list");
    this.repositoriesResult = this.createElement("ul", "repositories-result");

    this.app.append(this.input);
    this.app.append(this.repositoriesList);
    this.app.append(this.repositoriesResult);
  }
  createElement(tagElement, classElement) {
    const element = document.createElement(tagElement);
    element.classList.add(classElement);
    return element;
  }
  createRepositories(repositoriesData) {
    const element = this.createElement("li", "repositories-item");
    element.addEventListener("click", () => {
      const repository = this.createElement("li", "repository");
      repository.insertAdjacentHTML(
        "afterbegin",
        `<p>Name: ${repositoriesData.name}</p><p>Owner: ${repositoriesData.owner.login}</p><p>Stars: ${repositoriesData.stargazers_count}</p>`
      );
      const btn = this.createElement("button", "button");
      btn.addEventListener("click", () => {
        repository.remove();
      });
      repository.append(btn);
      this.repositoriesResult.append(repository);
      this.input.value = "";
      while (this.repositoriesList.firstChild) {
        this.repositoriesList.removeChild(this.repositoriesList.firstChild);
      }
    });
    element.insertAdjacentHTML("afterbegin", `${repositoriesData.name}`);
    this.repositoriesList.append(element);
  }
}

class Search {
  constructor(view) {
    this.view = view;
    this.view.input.addEventListener("keyup", this.debounce(this.searchRepositories.bind(this)), 500);
  }
  async searchRepositories() {
    const value = this.view.input.value;
    if (value.trim()) {
      return await fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
        .then((res) => {
          if (res.ok) {
            this.clearRepositories();
            res.json().then((res) => {
              res.items.forEach((element) => {
                this.view.createRepositories(element);
              });
            });
          }
        })
        .catch((err) => console.log(err));
    } else {
      this.clearRepositories();
    }
  }
  clearRepositories() {
    while (this.view.repositoriesList.firstChild) {
      this.view.repositoriesList.removeChild(this.view.repositoriesList.firstChild);
    }
  }
  debounce(fn, debounceTime) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, debounceTime);
    };
  }
}

new Search(new View());
