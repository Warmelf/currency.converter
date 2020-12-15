let input1 = document.querySelector('.exchange_input');
let buttons1 = document.querySelectorAll('#currency_list_from .currency_item_button');
let buttons2 = document.querySelectorAll('#currency_list_to .currency_item_button');
let exchangeValueFrom = document.querySelector('#exchangeValueFrom');
let exchangeValueTo = document.querySelector('#exchangeValueTo');
let input2 = document.querySelector('#outputValue');
let select1 = document.querySelector('#selectCurFrom');
let select2 = document.querySelector('#selectCurTo');
const invertButton = document.querySelector('.convert_button');
const warning = document.querySelector('.warning');
let popupWindowWrong = document.querySelector('#popupWindowWrong');
let popupBodyWrong = document.querySelector('#popupBodyWrong');
let closePopupWrong = document.querySelector('.popup_close');
let popupWindowLoading = document.querySelector('#popupWindowLoading');
let popupBodyLoading = document.querySelector('#popupBodyLoading');

let value1 = 1;
let value2 = 1;
let currency1 = 'USD';
let currency2 = 'RUB';
let rates = {};

function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
        reject(new Error("timeout"))
        }, ms)
        promise.then(resolve, reject)
    })
};

function modalLoading() {
    timeout(500, fetch(`https://api.ratesapi.io/api/latest?base=${currency1}&symbols=${currency2}`)).then(function(response) {
    }).catch(function(error) {
        popupWindowLoading.classList.add('open');
        popupBodyLoading.classList.add('open');
    });
}

function popupWindowLoadingClose() {
    popupWindowLoading.classList.remove('open');
    popupBodyLoading.classList.remove('open'); 
}

function popupWindowWrongClose() {
    popupWindowWrong.classList.remove('open');
    popupBodyWrong.classList.remove('open'); 
}

function popupWindowWrongAdd() {
    popupWindowWrong.classList.add('open');
    popupBodyWrong.classList.add('open');

    closePopupWrong.addEventListener('click', (e) => {
        e.preventDefault();
        popupWindowWrongClose();
    });
    
    popupBodyWrong.addEventListener('click', (e) => {   
        let idPopup = e.target.getAttribute('id');   
        if (idPopup == 'popupBodyWrong') {
            popupWindowWrongClose();             
        }       
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === "Escape") {
            popupWindowWrongClose();
        }
    });
}

async function getRates() {
    modalLoading();

    rates = {};
    try {const res = await fetch(`https://api.ratesapi.io/api/latest?base=${currency1}&symbols=${currency2}`);
    const data = await res.json();
    popupWindowLoadingClose();
    rates[currency2] = data.rates[currency2];
    rates[currency1] = 1 / data.rates[currency2];
    } catch(er) {
        popupWindowLoadingClose();
        popupWindowWrongAdd();    
    }    
}

function calculateValue1() {
    value1 = (value2 * rates[currency1]).toFixed(3);
}

function calculateValue2() {
    value2 = (value1 * rates[currency2]).toFixed(3);
}

function log() {
    console.log(value1, value2, currency1, currency2, rates);
}

function getBaseValueFrom(str) {
    str.innerHTML = `1 ${currency1} = ${rates[currency2]} ${currency2}`;
};

function getBaseValueTo(str) {
    str.innerHTML = `1 ${currency2} = ${rates[currency1]} ${currency1}`;
};

function render() {
    input1.value = value1;
    input2.value = value2;
    getBaseValueFrom(exchangeValueFrom);
    getBaseValueTo(exchangeValueTo);
}

function currencyIsEqual() {
    if (currency1 === currency2) {
        warning.innerText = 'Выберите разные валюты для конвертации!';
        return true;
    } else {
        warning.innerText = '';
        return false;
    }
}


getRates().then(() => {
    calculateValue2();
    render();

    select1.addEventListener('change', (e) => {
        const value = e.target.value;
        currency1 = value;
        buttons1.forEach((elem) => {
            elem.classList.remove('currency_selected');
        });
        select1.classList.add('currency_selected');
        if (!currencyIsEqual()) {
            getRates().then(() => {
                calculateValue2();
                render();
            });
        }
    });
    
    select2.addEventListener('change', (e) => {
        const value = e.target.value;
        currency2 = value;
        buttons2.forEach((elem) => {
            elem.classList.remove('currency_selected');
        });
        select2.classList.add('currency_selected');
        if (!currencyIsEqual()) {
            getRates().then(() => {
                calculateValue1();
                render();
            });
        }
    });
    
    buttons1.forEach((el) => {
        el.addEventListener('click', (e) => {
            const value = e.target.innerText;
            currency1 = value;
            buttons1.forEach((elem) => {
                elem.classList.remove('currency_selected');
            });
            select1.classList.remove('currency_selected');
            el.classList.add('currency_selected');
            if (!currencyIsEqual()) {
                getRates().then(() => {
                    calculateValue2();
                    render();
                });
            }
        });
    });
    
    buttons2.forEach((el) => {
        el.addEventListener('click', (e) => {
            const value = e.target.innerText;
            currency2 = value;
            buttons2.forEach((elem) => {
                elem.classList.remove('currency_selected');
            });
            select2.classList.remove('currency_selected');
            el.classList.add('currency_selected');
            if (!currencyIsEqual()) {
                getRates().then(() => {
                    calculateValue1();
                    render();
                });
            }
        });
    });
    
    input1.addEventListener('input', (e) => {
        const value = e.target.value;
        value1 = +value;
        calculateValue2();
        render();
    });
    
    input2.addEventListener('input', (e) => {
        const value = e.target.value;
        value2 = +value;
        calculateValue1();
        render();
    });

    invertButton.addEventListener('click', () => {
        let temp = currency2;
        currency2 = currency1;
        currency1 = temp;

        buttons1.forEach(el => {
            el.classList.remove('currency_selected');
            if (el.innerHTML == currency1) {
                el.classList.add('currency_selected');
            }
        });

        buttons2.forEach(el => {
            el.classList.remove('currency_selected');
            if (el.innerHTML == currency2) {
                el.classList.add('currency_selected');
            }
        });

        select1.classList.remove('currency_selected');
        select2.classList.remove('currency_selected');
        [...select1.children].forEach(el => {
            if (el.innerHTML == currency1) {
                el.parentElement.classList.add('currency_selected');
                el.parentElement.value = currency1;
            }
        });
        [...select2.children].forEach(el => {
            if (el.innerHTML == currency2) {
                el.parentElement.classList.add('currency_selected');
                el.parentElement.value = currency2;
            }
        });

        calculateValue2();
        render();
    });
});


const getInformation = async () => {
    const select = document.querySelectorAll('.currency_select');

    const res = await fetch('https://api.ratesapi.io/api/latest');
    const data = await res.json();

    obj = data.rates;
    let keysOfObj = Object.keys(obj);
    let arrOfUsedValue = ['RUB', 'USD', 'EUR', 'GBP'];
    keysOfObj = keysOfObj.filter(item => !arrOfUsedValue.includes(item));
    keysOfObj.forEach(el => {
        select.forEach(elem => {
            option = document.createElement('option');
            option.innerHTML = el;
            elem.appendChild(option);
            option.setAttribute('value', el);
        });                   
    });     
};

getInformation();