const Coach = require('../models/Coach');
const Recommend = require('../models/Recommend');

const { DAYS } = require('../constants');

class MenuService {
  #coaches;

  #categoriesOfDays;

  #recommend;

  constructor() {
    this.#coaches = {};
    this.#categoriesOfDays = [];
    this.#recommend = new Recommend();
  }

  addCoaches(names) {
    names.forEach((name) => (this.#coaches[name] = new Coach(name)));
  }

  addNonEdibleMenus(coachName, menus) {
    this.#coaches[coachName].setNonEdibleMenus(menus);
  }

  recommend() {
    for (let i = 0; i < DAYS.length; i++) {
      const recommendCategory = this.#getRecommendCategory();
      this.#categoriesOfDays.push(recommendCategory);

      this.#recommendMenu(recommendCategory);
    }
  }

  #getRecommendCategory() {
    const randomCategory = this.#recommend.getRandomCategory();
    const sameCategoriesCount = this.#categoriesOfDays?.filter(
      (category) => category === randomCategory
    ).length;
    if (sameCategoriesCount >= 2) {
      return this.#getRecommendCategory();
    }

    return randomCategory;
  }

  #recommendMenu(category) {
    Object.keys(this.#coaches).forEach((coachName) => {
      const { nonEdibleMenu, menus } = this.#coaches[coachName].getCoachLog();
      const menu = this.#getRecommendMenu(category, nonEdibleMenu, menus);

      this.#coaches[coachName].addMenu(menu);
    });
  }

  #getRecommendMenu(category, nonEdibleMenu, menus) {
    const randomMenu = this.#recommend.getRandomMenu(category);
    if (nonEdibleMenu.includes(randomMenu) || menus.includes(randomMenu)) {
      return this.#getRecommendMenu(category, nonEdibleMenu, menus);
    }

    return randomMenu;
  }

  getResult() {
    const coachesName = Object.keys(this.#coaches);
    const recommendMenus = coachesName.map((name) => {
      const { menus } = this.#coaches[name].getCoachLog();

      return menus;
    });

    return {
      categoriesOfDays: this.#categoriesOfDays,
      coachesName,
      menus: recommendMenus,
    };
  }
}

module.exports = MenuService;
