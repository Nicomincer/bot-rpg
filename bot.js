const puppeteer = require('puppeteer');
const senha = require('./info1');
const sequelize = require('sequelize');
const bd = require('./info2.js')
const Sequelize = new sequelize('chatamino', 'root', bd(), {
  host: 'localhost',
  dialect: 'mysql'
});

const tabela = Sequelize.define('chatrpgs', {
  dono_da_ficha: {
      type: sequelize.STRING
  },
  nome_completo: {
      type: sequelize.STRING
  },
  idade: {
      type: sequelize.INTEGER
  },
  sexo: {
      type: sequelize.STRING
  },
  peso: {
      type: sequelize.DECIMAL
  },
  altura: {
      type: sequelize.DECIMAL
  },
  raça: {
      type: sequelize.STRING
  },
  classe: {
      type: sequelize.STRING
  }, 
  local: {
      type: sequelize.STRING
  },
  corporação: {
      type: sequelize.STRING(1000),
      allowNull: true
  },
  creditos: {
      type: sequelize.DECIMAL
  },
  Flux1: {
      type: sequelize.STRING
  },
  Habilidades_fisicas: {
      type: sequelize.STRING(2000)
  },
  armas: {
      type: sequelize.STRING(2000)
  },
  equipamentos: {
      type: sequelize.STRING(2000)
  },
  personalidade: {
      type: sequelize.STRING(2000)
  },
  aparencia: {
      type: sequelize.STRING(2000)
  }
  
});

const tabela2 = Sequelize.define('mercado', {
    item: {
        type: sequelize.STRING(2000)
    },
    valor: {
        type: sequelize.INTEGER
    },
    especificação: {
        type: sequelize.STRING(2000)
    }
});

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://aminoapps.com/');
  await page.click('body > header > div > div > nav > ul > li.nav-item.nav-user.less-margin > a');
  await page.waitForTimeout(3000);
  await page.click('body > div.modal > div.content > div > div > div.login-signup-area > div.sub-area > div > button.auth-btn.signin-email');
  await page.waitForTimeout(1000);
  await page.type('body > div.modal > div.content > div > div > div.input-area.hide.login-email > form > div.show-in-email > input', 'botparaamino2@gmail.com');
  await page.type('body > div.modal > div.content > div > div > div.input-area.hide.login-email > form > input', senha());
  await page.click('body > div.modal > div.content > div > div > div.input-area.hide.login-email > form > div.login-buttons > button');
  await page.waitForTimeout(5000);
  await page.click('#gdpr-cookie-consent > button');
  await page.click('body > section > div.global-chat-community-container > div > div > div.community-badge.list-item > img');
  await page.waitForTimeout(2000);
  const elementHandle = await page.$(
    'iframe[class="chat-window-iframe"]',
  );
  let contador = 0;
  while(contador == 0){ 
    var frame = await elementHandle.contentFrame();
    var optionsResult = await frame.$$eval('body > div > main > div.chat-detail-area > ul > li > div > div > div', (options) => options.map((option) => option.innerText));
    if(optionsResult[optionsResult.length - 2].indexOf('mostrarficha(') != -1 && optionsResult[optionsResult.length - 2].indexOf('!') != -1){
            var inicio = optionsResult[optionsResult.length - 2].indexOf('(');
            var final = optionsResult[optionsResult.length - 2].indexOf(')');
            var nome = optionsResult[optionsResult.length - 2].slice(inicio+1, final);
            var inicio2 = optionsResult[optionsResult.length - 2].indexOf('[');
            var final2 = optionsResult[optionsResult.length - 2].indexOf(']');
            var atributo = optionsResult[optionsResult.length - 2].slice(inicio2+1, final2);
            if(atributo == ''){
                await frame.type('body > div > main > div.chat-detail-area > div > div > div.main-input-wrapper > textarea', 'Você poder ver as especificações da ficha, como: sua personalidade, nome completo, peso, altura, idade, Flux1, equipamentos, armas, Habilidades Físicas, creditos, classe, sexo, corporação e o nome do dono da ficha.');
                await frame.waitForTimeout(500);
                await frame.click('body > div > main > div.chat-detail-area > div > div > div.main-input-wrapper > div > div.send-button.pull-right > span.svg-icon-container.send > svg > path');
            }
            else{
                var resultado = await tabela.findAll({
                    where: {
                        dono_da_ficha: nome
                    }
                });
                console.log(resultado)
                if(resultado == ''){
                    await frame.type('body > div > main > div.chat-detail-area > div > div > div.main-input-wrapper > textarea', 'A especificação não existe ou foi digitado errado.');
                    await frame.waitForTimeout(500);
                    await frame.click('body > div > main > div.chat-detail-area > div > div > div.main-input-wrapper > div > div.send-button.pull-right > span.svg-icon-container.send > svg > path');
                }else{
                    var valor = resultado[0].dataValues[atributo]
                    console.log(valor)
                    if(valor == undefined){
                        await frame.type('body > div > main > div.chat-detail-area > div > div > div.main-input-wrapper > textarea', 'A especificação não existe ou foi digitado errado.');
                        await frame.waitForTimeout(500);
                        await frame.click('body > div > main > div.chat-detail-area > div > div > div.main-input-wrapper > div > div.send-button.pull-right > span.svg-icon-container.send > svg > path');
                    }else{
                        await frame.type('body > div > main > div.chat-detail-area > div > div > div.main-input-wrapper > textarea', `${valor}`);
                        await frame.waitForTimeout(500);
                        await frame.click('body > div > main > div.chat-detail-area > div > div > div.main-input-wrapper > div > div.send-button.pull-right > span.svg-icon-container.send > svg > path');
                    }
                }         
            }
    }else if(optionsResult[optionsResult.length - 2] == 'mostrarloja!'){
        let results = await tabela2.findAll();
        var value = ''
        var choice = ''
        var dinheiro = 0
        for(let c = 0; c < Object.keys(results).length - 1; c++){
            choice = results[c].dataValues.item
            dinheiro = results[c].dataValues.valor
            value += ' '+`│${c+1}│`+choice+`│valor = ${dinheiro}`
        }
        await frame.type('body > div > main > div.chat-detail-area > div > div > div.main-input-wrapper > textarea', `${value}`);
        await frame.waitForTimeout(500);
        await frame.click('body > div > main > div.chat-detail-area > div > div > div.main-input-wrapper > div > div.send-button.pull-right > span.svg-icon-container.send > svg > path');

    }else if(optionsResult[optionsResult.length - 2] == 'ajuda!'){
        await frame.type('body > div > main > div.chat-detail-area > div > div > div.main-input-wrapper > textarea', 'Os comandos são: mostrarficha(dono_da_ficha)[atributo], mostrarloja! e ajuda!');
        await frame.waitForTimeout(500);
        await frame.click('body > div > main > div.chat-detail-area > div > div > div.main-input-wrapper > div > div.send-button.pull-right > span.svg-icon-container.send > svg > path');
    } else{
        continue
    }
}
  
  //await browser.close();
})();