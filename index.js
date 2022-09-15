require("dotenv").config();
const puppeteer = require("puppeteer");

TOKEN = process.env.TOKEN;
WALLET = process.env.WALLET;

main();

async function main() {
  //   let busca = readlineSync.question("Insira o termo de busca: ");
  const browser = await puppeteer.launch({
    ignoreDefaultArgs: ["--enable-automation"],
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://blaze.com/pt/games/double");
  await page.setViewport({ width: 800, height: 800 });

  // Forçar token de acesso no local storage
  await page.evaluate(
    (TOKEN, WALLET) => {
      localStorage.setItem("ACCESS_TOKEN", TOKEN);
      localStorage.setItem("selected_wallet_v2", WALLET);
      location.reload();
    },
    TOKEN,
    WALLET
  );

  // montando a aposta
  await montaAposta(1, "0,10", "0,10", page);

  //   await browser.close();
}

/*
 *
 *   MONTANDO A APOSTA 1º Branco - 2º Cor
 *
 */

async function montaAposta(ordem, valor, valorBranco, page) {
  switch (ordem) {
    case 1: // Branco e vermelho
      await apostaBranco(valorBranco, page);
      await apostaVermelho(valor, page);
      console.log(
        `Aposta Realizada: R$ ${valorBranco} Branco | R$ ${valor} Vermelho`
      );
      break;
    case 2: // Branco e preto
      await apostaBranco(valorBranco, page);
      await apostaPreto(valor, page);
      console.log(
        `Aposta Realizada: R$ ${valorBranco} Branco | R$ ${valor} Preto`
      );
      break;

    default:
      break;
  }
}

// Aposta Branco
async function apostaBranco(valorBranco, page) {
  // Inserir valor de aposta
  await page.waitForSelector('input[type="number"]', { visible: true });
  await page.type('input[type="number"]', valorBranco);

  // Clicar no branco
  await page.waitForSelector('[class="white "]', {
    visible: true,
    timeout: 1000,
  });
  await page.click('[class="white "]');

  // Clicar para apostar
  await page
    .waitForSelector('[class="place-bet"] button:not([disabled])', {
      visible: true,
      timeout: 20000,
    })
    .then(async () => {
      await page.click('[class="place-bet"] button');
    });
}

// Aposta vermelho
async function apostaVermelho(valor, page) {
  // Inserir valor de aposta
  await page.waitForSelector('input[type="number"]', { visible: true });
  await page.type('input[type="number"]', valor);

  // Clicar no vermelho
  await page.waitForSelector(
    '[class = "input-wrapper select"] [class="red "]',
    {
      visible: true,
      timeout: 1000,
    }
  );
  await page.click('[class = "input-wrapper select"] [class="red "]');

  // Clicar para apostar
  await page
    .waitForSelector('[class="place-bet"] button:not([disabled])', {
      visible: true,
      timeout: 20000,
    })
    .then(async () => {
      await page.click('[class="place-bet"] button');
    });
}

// Aposta Preto
async function apostaPreto(valor, page) {
  // Inserir valor de aposta
  await page.waitForSelector('input[type="number"]', { visible: true });
  await page.type('input[type="number"]', valor);

  // Clicar no preto
  await page.waitForSelector(
    '[class = "input-wrapper select"] [class="black "]',
    {
      visible: true,
      timeout: 1000,
    }
  );
  await page.click('[class = "input-wrapper select"] [class="black "]');

  // Clicar para apostar
  await page
    .waitForSelector('[class="place-bet"] button:not([disabled])', {
      visible: true,
      timeout: 20000,
    })
    .then(async () => {
      await page.click('[class="place-bet"] button');
    });
}
