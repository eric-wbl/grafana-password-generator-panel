import { PanelCtrl } from 'grafana/app/plugins/sdk';
import _ from 'lodash';

export class PsdGenerator extends PanelCtrl {
  static templateUrl = 'module.html';

  panelDefaults = {
    settings: {
      fontSize: '40px',
      fontWeight: 'normal',
    },

    rules: {
      upperCase: true,
      lowerCase: true,
      number: true,
      len: 16,
    },
  };

  password = '';

  /** @ngInject */
  constructor($scope: any, $injector: any) {
    super($scope, $injector);
    _.defaultsDeep(this.panel, this.panelDefaults);
    //在编辑面板时可用于添加选项卡
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
    this.events.on('refresh', this.updatePsd.bind(this));
    this.events.on('render', this.updatePsd.bind(this));

    //this.events.on('panel-initialized', this.render.bind(this));
    //this.events.on('component-did-mount', this.render.bind(this));
    this.updatePsd();
  }

  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/eric-passwordgenerator-panel/option.html', 2);
  }

  getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  }
  getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
  }

  updatePsd() {
    const upper = this.panel.rules.upperCase;
    const lower = this.panel.rules.lowerCase;
    const isNumber = this.panel.rules.number;
    const len = this.panel.rules.len;

    let generatedPassword = '';
    this.password = '';
    const typesArr = [{ upper }, { lower }, { isNumber }].filter(item => Object.values(item)[0]);
    if (!upper && !lower && !isNumber) {
      this.password = '请定制规则';
      return;
    }
    let result = '';
    for (let i = 0; i < len; i++) {
      typesArr.forEach(type => {
        const funcName = Object.keys(type)[0];
        if (funcName === 'lower') {
          result = this.getRandomLower();
        } else if (funcName === 'upper') {
          result = this.getRandomUpper();
        } else {
          result = this.getRandomNumber();
        }
        generatedPassword += result;
      });
    }
    this.password = generatedPassword.slice(0, len);
  }
}
